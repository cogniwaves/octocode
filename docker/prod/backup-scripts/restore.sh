#!/bin/bash
# OctoCode Production Database Restore Script
# Restores PostgreSQL database from backup files (local or S3)

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration from environment variables
POSTGRES_HOST="${POSTGRES_HOST:-oc_database}"
POSTGRES_DB="${POSTGRES_DB:-octocode}"
POSTGRES_USER="${POSTGRES_USER:-octocode}"
BACKUP_DIR="${BACKUP_DIR:-/backup}"
S3_BUCKET="${S3_BUCKET:-}"
NOTIFICATION_WEBHOOK="${NOTIFICATION_WEBHOOK:-}"

# Command line arguments
BACKUP_FILE="${1:-}"
RESTORE_TYPE="${2:-auto}"  # auto, custom, sql
FORCE_RESTORE="${3:-false}"

# Logging function
log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp]${NC} $message"
}

error_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR:${NC} $message"
}

success_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message"
}

warning_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${YELLOW}[$timestamp] WARNING:${NC} $message"
}

# Function to send notifications
send_notification() {
    local status="$1"
    local message="$2"
    
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        local payload="{\"text\":\"🔄 OctoCode Restore $status: $message\"}"
        curl -X POST -H 'Content-type: application/json' --data "$payload" "$NOTIFICATION_WEBHOOK" || true
    fi
}

# Function to show usage
show_usage() {
    cat << 'EOF'
OctoCode Database Restore Script

Usage: ./restore.sh [BACKUP_FILE] [RESTORE_TYPE] [FORCE]

Parameters:
  BACKUP_FILE    - Path to backup file or S3 key (required)
  RESTORE_TYPE   - auto, custom, sql (default: auto)
  FORCE          - true/false (default: false) - Skip confirmation

Examples:
  # Restore from local file (auto-detect format)
  ./restore.sh /backup/octocode_backup_20240101_120000.sql.gz

  # Restore from custom format backup
  ./restore.sh /backup/octocode_backup_20240101_120000.sql.custom custom

  # Restore from S3 (download first)
  ./restore.sh s3://bucket/backups/octocode_backup_20240101_120000.sql.gz

  # Force restore without confirmation
  ./restore.sh /backup/backup.sql.gz auto true

Environment Variables:
  POSTGRES_HOST              - Database host (default: oc_database)
  POSTGRES_DB                - Database name (default: octocode)
  POSTGRES_USER              - Database user (default: octocode)
  BACKUP_DIR                 - Backup directory (default: /backup)
  S3_BUCKET                  - S3 bucket for remote backups
  NOTIFICATION_WEBHOOK       - Webhook URL for notifications

EOF
}

# Function to check database connectivity
check_database_connection() {
    log "Checking database connection..."
    
    if ! pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -t 10; then
        error_log "Cannot connect to database server on $POSTGRES_HOST"
        exit 1
    fi
    
    success_log "Database connection verified"
}

# Function to list available backups
list_backups() {
    log "Available local backups:"
    find "$BACKUP_DIR" -name "octocode_backup_*.sql*" -type f -printf "%T@ %p\n" 2>/dev/null | \
        sort -nr | \
        head -10 | \
        while read timestamp filepath; do
            local filedate=$(date -d "@$timestamp" '+%Y-%m-%d %H:%M:%S')
            local filesize=$(du -h "$filepath" | cut -f1)
            echo "  $filedate - $(basename "$filepath") ($filesize)"
        done
    
    # List S3 backups if configured
    if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
        log "Available S3 backups (latest 10):"
        aws s3 ls "s3://$S3_BUCKET/backups/postgresql/" --recursive | \
            grep "octocode_backup_" | \
            tail -10 | \
            while read date time size filepath; do
                echo "  $date $time - $(basename "$filepath") ($size bytes)"
            done
    fi
}

# Function to download backup from S3
download_from_s3() {
    local s3_path="$1"
    local local_path="$BACKUP_DIR/$(basename "$s3_path")"
    
    log "Downloading backup from S3: $s3_path"
    
    if ! command -v aws &> /dev/null; then
        error_log "AWS CLI not found. Installing..."
        apk add --no-cache aws-cli || {
            error_log "Failed to install AWS CLI"
            exit 1
        }
    fi
    
    if aws s3 cp "$s3_path" "$local_path"; then
        success_log "Backup downloaded to: $local_path"
        echo "$local_path"
    else
        error_log "Failed to download backup from S3"
        exit 1
    fi
}

# Function to detect backup format
detect_backup_format() {
    local file="$1"
    
    if [[ "$file" == *.custom ]]; then
        echo "custom"
    elif [[ "$file" == *.sql.gz ]]; then
        echo "sql_compressed"
    elif [[ "$file" == *.sql ]]; then
        echo "sql"
    else
        # Try to detect by content
        if file "$file" | grep -q "PostgreSQL custom database dump"; then
            echo "custom"
        elif file "$file" | grep -q "gzip compressed"; then
            echo "sql_compressed"
        else
            echo "sql"
        fi
    fi
}

# Function to validate backup file
validate_backup() {
    local file="$1"
    local format="$2"
    
    log "Validating backup file: $(basename "$file")"
    
    if [ ! -f "$file" ]; then
        error_log "Backup file not found: $file"
        exit 1
    fi
    
    case "$format" in
        "custom")
            if pg_restore --list "$file" > /dev/null 2>&1; then
                success_log "Custom format backup validated"
                # Show backup info
                log "Backup information:"
                pg_restore --list "$file" | head -20 | while read line; do
                    log "  $line"
                done
            else
                error_log "Invalid custom format backup"
                exit 1
            fi
            ;;
        "sql_compressed")
            if gzip -t "$file"; then
                success_log "Compressed SQL backup validated"
                local uncompressed_size=$(gzip -l "$file" | tail -1 | awk '{print $2}')
                log "Uncompressed size: $(numfmt --to=iec --suffix=B $uncompressed_size)"
            else
                error_log "Invalid compressed SQL backup"
                exit 1
            fi
            ;;
        "sql")
            if head -1 "$file" | grep -q "^--"; then
                success_log "SQL backup validated"
            else
                warning_log "SQL backup format uncertain, proceeding anyway"
            fi
            ;;
    esac
}

# Function to create pre-restore backup
create_pre_restore_backup() {
    if [ "$FORCE_RESTORE" != "true" ]; then
        log "Creating pre-restore backup..."
        
        local pre_backup_file="$BACKUP_DIR/pre_restore_backup_$(date +%Y%m%d_%H%M%S).sql"
        
        if pg_dump -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" > "$pre_backup_file" 2>/dev/null; then
            success_log "Pre-restore backup created: $(basename "$pre_backup_file")"
            gzip "$pre_backup_file"
            success_log "Pre-restore backup compressed"
        else
            warning_log "Failed to create pre-restore backup (database may not exist)"
        fi
    fi
}

# Function to confirm restore operation
confirm_restore() {
    if [ "$FORCE_RESTORE" == "true" ]; then
        return 0
    fi
    
    echo ""
    warning_log "⚠️  DATABASE RESTORE OPERATION ⚠️"
    warning_log "This will COMPLETELY REPLACE the current database!"
    warning_log "Database: $POSTGRES_DB on $POSTGRES_HOST"
    warning_log "Backup file: $(basename "$BACKUP_FILE")"
    echo ""
    
    read -p "Are you sure you want to continue? Type 'YES' to confirm: " confirm
    
    if [ "$confirm" != "YES" ]; then
        log "Restore operation cancelled by user"
        exit 0
    fi
    
    success_log "Restore confirmed by user"
}

# Function to drop existing database
drop_existing_database() {
    log "Dropping existing database if it exists..."
    
    # Terminate active connections
    psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -c "
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '$POSTGRES_DB'
          AND pid <> pg_backend_pid();
    " 2>/dev/null || true
    
    # Drop database
    psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -c "DROP DATABASE IF EXISTS $POSTGRES_DB;" || {
        warning_log "Could not drop database (may not exist)"
    }
    
    log "Database dropped successfully"
}

# Function to restore from custom format
restore_custom_format() {
    local file="$1"
    
    log "Restoring from custom format backup..."
    
    # Create database first
    psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -c "CREATE DATABASE $POSTGRES_DB;" || {
        error_log "Failed to create database"
        exit 1
    }
    
    # Restore using pg_restore
    if pg_restore \
        -h "$POSTGRES_HOST" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --verbose \
        --clean \
        --if-exists \
        --no-privileges \
        --no-owner \
        --jobs=4 \
        "$file"; then
        
        success_log "Database restored from custom format backup"
    else
        error_log "Failed to restore from custom format backup"
        exit 1
    fi
}

# Function to restore from SQL format
restore_sql_format() {
    local file="$1"
    local is_compressed="$2"
    
    log "Restoring from SQL backup..."
    
    if [ "$is_compressed" == "true" ]; then
        log "Decompressing and restoring SQL backup..."
        if gunzip -c "$file" | psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres"; then
            success_log "Database restored from compressed SQL backup"
        else
            error_log "Failed to restore from compressed SQL backup"
            exit 1
        fi
    else
        log "Restoring SQL backup..."
        if psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "postgres" -f "$file"; then
            success_log "Database restored from SQL backup"
        else
            error_log "Failed to restore from SQL backup"
            exit 1
        fi
    fi
}

# Function to verify restore
verify_restore() {
    log "Verifying database restore..."
    
    # Check if database exists and is accessible
    if ! psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT version();" > /dev/null 2>&1; then
        error_log "Restored database is not accessible"
        exit 1
    fi
    
    # Get basic statistics
    local table_count=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public';" | tr -d ' ')
    local row_count=$(psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t -c "SELECT sum(n_tup_ins + n_tup_upd) FROM pg_stat_user_tables;" | tr -d ' ')
    
    log "Restore verification:"
    log "  Tables: ${table_count:-0}"
    log "  Total rows: ${row_count:-0}"
    
    success_log "Database restore verified successfully"
}

# Function to update statistics
update_statistics() {
    log "Updating database statistics..."
    
    psql -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "ANALYZE;" || {
        warning_log "Failed to update statistics"
    }
    
    success_log "Database statistics updated"
}

# Main restore function
main_restore() {
    local start_time=$(date +%s)
    
    log "🔄 Starting OctoCode database restore"
    log "===================================="
    
    # Process backup file path
    local backup_path="$BACKUP_FILE"
    if [[ "$BACKUP_FILE" == s3://* ]]; then
        backup_path=$(download_from_s3 "$BACKUP_FILE")
    elif [[ "$BACKUP_FILE" != /* ]]; then
        # Relative path, make it absolute
        backup_path="$BACKUP_DIR/$BACKUP_FILE"
    fi
    
    # Detect format if auto
    local format="$RESTORE_TYPE"
    if [ "$format" == "auto" ]; then
        format=$(detect_backup_format "$backup_path")
        log "Auto-detected format: $format"
    fi
    
    # Validate backup
    validate_backup "$backup_path" "$format"
    
    # Confirm restore
    confirm_restore
    
    # Check database connection
    check_database_connection
    
    # Create pre-restore backup
    create_pre_restore_backup
    
    # Drop existing database
    drop_existing_database
    
    # Restore based on format
    case "$format" in
        "custom")
            restore_custom_format "$backup_path"
            ;;
        "sql_compressed")
            restore_sql_format "$backup_path" true
            ;;
        "sql")
            restore_sql_format "$backup_path" false
            ;;
        *)
            error_log "Unknown backup format: $format"
            exit 1
            ;;
    esac
    
    # Verify restore
    verify_restore
    
    # Update statistics
    update_statistics
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    success_log "✅ Database restore completed successfully in ${duration}s"
    send_notification "SUCCESS" "Database restore completed in ${duration}s"
}

# Error handling
trap 'error_log "Restore script interrupted"; send_notification "FAILED" "Restore script interrupted"; exit 1' INT TERM

# Main execution
case "${1:-help}" in
    "help"|"--help"|"-h"|"")
        show_usage
        ;;
    "list")
        list_backups
        ;;
    *)
        if [ -z "$BACKUP_FILE" ]; then
            error_log "No backup file specified"
            show_usage
            exit 1
        fi
        main_restore
        ;;
esac