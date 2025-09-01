#!/bin/bash
# OctoCode Production Backup Script
# Performs automated backups of PostgreSQL database with optional S3 upload

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
BACKUP_RETENTION_DAYS="${BACKUP_RETENTION_DAYS:-30}"
S3_BUCKET="${S3_BUCKET:-}"
BACKUP_SCHEDULE="${BACKUP_SCHEDULE:-0 2 * * *}"
NOTIFICATION_WEBHOOK="${NOTIFICATION_WEBHOOK:-}"

# Derived variables
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILENAME="octocode_backup_${TIMESTAMP}.sql"
BACKUP_PATH="${BACKUP_DIR}/${BACKUP_FILENAME}"
COMPRESSED_BACKUP_PATH="${BACKUP_PATH}.gz"
LOG_FILE="${BACKUP_DIR}/backup.log"

# Ensure backup directory exists
mkdir -p "$BACKUP_DIR"

# Logging function
log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${BLUE}[$timestamp]${NC} $message" | tee -a "$LOG_FILE"
}

error_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${RED}[$timestamp] ERROR:${NC} $message" | tee -a "$LOG_FILE"
}

success_log() {
    local message="$1"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${GREEN}[$timestamp] SUCCESS:${NC} $message" | tee -a "$LOG_FILE"
}

# Function to send notifications
send_notification() {
    local status="$1"
    local message="$2"
    
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        local payload="{\"text\":\"🗄️ OctoCode Backup $status: $message\"}"
        curl -X POST -H 'Content-type: application/json' --data "$payload" "$NOTIFICATION_WEBHOOK" || true
    fi
}

# Function to check database connectivity
check_database_connection() {
    log "Checking database connection..."
    
    if ! pg_isready -h "$POSTGRES_HOST" -U "$POSTGRES_USER" -d "$POSTGRES_DB" -t 10; then
        error_log "Cannot connect to database $POSTGRES_DB on $POSTGRES_HOST"
        send_notification "FAILED" "Cannot connect to database"
        exit 1
    fi
    
    success_log "Database connection verified"
}

# Function to create database backup
create_backup() {
    log "Starting database backup..."
    log "Database: $POSTGRES_DB on $POSTGRES_HOST"
    log "Backup file: $BACKUP_PATH"
    
    # Create the backup with verbose output and custom format for better compression
    if pg_dump \
        -h "$POSTGRES_HOST" \
        -U "$POSTGRES_USER" \
        -d "$POSTGRES_DB" \
        --verbose \
        --clean \
        --if-exists \
        --create \
        --format=custom \
        --no-privileges \
        --no-owner \
        --file="$BACKUP_PATH.custom"; then
        
        success_log "Database backup created successfully"
        
        # Also create a plain SQL backup for easier inspection
        pg_dump \
            -h "$POSTGRES_HOST" \
            -U "$POSTGRES_USER" \
            -d "$POSTGRES_DB" \
            --clean \
            --if-exists \
            --create \
            --no-privileges \
            --no-owner > "$BACKUP_PATH"
        
        success_log "Plain SQL backup created successfully"
    else
        error_log "Database backup failed"
        send_notification "FAILED" "Database backup failed"
        exit 1
    fi
}

# Function to compress backup
compress_backup() {
    log "Compressing backup files..."
    
    # Compress the plain SQL backup
    if gzip -9 "$BACKUP_PATH"; then
        success_log "SQL backup compressed successfully"
    else
        error_log "Failed to compress SQL backup"
    fi
    
    # The custom format backup is already compressed
    local backup_size=$(du -h "$BACKUP_PATH.custom" | cut -f1)
    log "Custom backup size: $backup_size"
    
    if [ -f "$COMPRESSED_BACKUP_PATH" ]; then
        local compressed_size=$(du -h "$COMPRESSED_BACKUP_PATH" | cut -f1)
        log "Compressed SQL backup size: $compressed_size"
    fi
}

# Function to upload backup to S3
upload_to_s3() {
    if [ -z "$S3_BUCKET" ]; then
        log "S3 upload not configured (S3_BUCKET not set)"
        return 0
    fi
    
    log "Uploading backup to S3 bucket: $S3_BUCKET"
    
    # Check if AWS CLI is available
    if ! command -v aws &> /dev/null; then
        error_log "AWS CLI not found. Installing..."
        apk add --no-cache aws-cli || {
            error_log "Failed to install AWS CLI"
            return 1
        }
    fi
    
    # Upload compressed SQL backup
    if [ -f "$COMPRESSED_BACKUP_PATH" ]; then
        if aws s3 cp "$COMPRESSED_BACKUP_PATH" "s3://$S3_BUCKET/backups/postgresql/" \
            --storage-class STANDARD_IA \
            --metadata "backup-date=$TIMESTAMP,database=$POSTGRES_DB"; then
            success_log "Compressed SQL backup uploaded to S3"
        else
            error_log "Failed to upload compressed SQL backup to S3"
        fi
    fi
    
    # Upload custom format backup
    if [ -f "$BACKUP_PATH.custom" ]; then
        if aws s3 cp "$BACKUP_PATH.custom" "s3://$S3_BUCKET/backups/postgresql/" \
            --storage-class STANDARD_IA \
            --metadata "backup-date=$TIMESTAMP,database=$POSTGRES_DB,format=custom"; then
            success_log "Custom format backup uploaded to S3"
        else
            error_log "Failed to upload custom format backup to S3"
        fi
    fi
}

# Function to verify backup integrity
verify_backup() {
    log "Verifying backup integrity..."
    
    # Verify custom format backup
    if [ -f "$BACKUP_PATH.custom" ]; then
        if pg_restore --list "$BACKUP_PATH.custom" > /dev/null 2>&1; then
            success_log "Custom format backup integrity verified"
        else
            error_log "Custom format backup appears to be corrupted"
            send_notification "FAILED" "Backup integrity check failed"
            exit 1
        fi
    fi
    
    # Verify compressed SQL backup
    if [ -f "$COMPRESSED_BACKUP_PATH" ]; then
        if gzip -t "$COMPRESSED_BACKUP_PATH"; then
            success_log "Compressed SQL backup integrity verified"
        else
            error_log "Compressed SQL backup appears to be corrupted"
            send_notification "FAILED" "Backup integrity check failed"
            exit 1
        fi
    fi
}

# Function to clean old backups
cleanup_old_backups() {
    log "Cleaning up backups older than $BACKUP_RETENTION_DAYS days..."
    
    # Local cleanup
    local deleted_count=0
    while IFS= read -r -d '' file; do
        rm "$file"
        ((deleted_count++))
        log "Deleted old backup: $(basename "$file")"
    done < <(find "$BACKUP_DIR" -name "octocode_backup_*.sql*" -type f -mtime +$BACKUP_RETENTION_DAYS -print0)
    
    if [ $deleted_count -gt 0 ]; then
        success_log "Deleted $deleted_count old local backup(s)"
    else
        log "No old local backups to delete"
    fi
    
    # S3 cleanup (if configured)
    if [ -n "$S3_BUCKET" ] && command -v aws &> /dev/null; then
        log "Cleaning up old S3 backups..."
        
        local cutoff_date=$(date -d "$BACKUP_RETENTION_DAYS days ago" +%Y-%m-%d)
        
        # This would require more complex AWS CLI commands to implement properly
        # For now, we'll just log that S3 cleanup should be implemented
        log "S3 cleanup requires lifecycle policies or separate script"
        log "Consider setting up S3 lifecycle rules for automatic cleanup"
    fi
}

# Function to generate backup report
generate_report() {
    local backup_duration=$(($(date +%s) - start_time))
    local backup_size_custom=""
    local backup_size_compressed=""
    
    if [ -f "$BACKUP_PATH.custom" ]; then
        backup_size_custom=$(du -h "$BACKUP_PATH.custom" | cut -f1)
    fi
    
    if [ -f "$COMPRESSED_BACKUP_PATH" ]; then
        backup_size_compressed=$(du -h "$COMPRESSED_BACKUP_PATH" | cut -f1)
    fi
    
    local report_file="${BACKUP_DIR}/backup_report_${TIMESTAMP}.txt"
    
    cat > "$report_file" << EOF
OctoCode Database Backup Report
================================

Backup Date: $(date)
Duration: ${backup_duration}s
Database: $POSTGRES_DB on $POSTGRES_HOST

Files Created:
- Custom Format: $BACKUP_PATH.custom (${backup_size_custom})
- Compressed SQL: $COMPRESSED_BACKUP_PATH (${backup_size_compressed})

S3 Upload: $([ -n "$S3_BUCKET" ] && echo "Yes (s3://$S3_BUCKET)" || echo "No")
Retention: $BACKUP_RETENTION_DAYS days

Status: SUCCESS
EOF
    
    log "Backup report generated: $report_file"
}

# Function to setup cron job
setup_cron() {
    log "Setting up backup cron job: $BACKUP_SCHEDULE"
    
    # Create cron job entry
    echo "$BACKUP_SCHEDULE /scripts/backup.sh >> $LOG_FILE 2>&1" | crontab -
    
    # Start cron daemon
    crond -f -d 8 &
    
    success_log "Cron job setup completed"
}

# Main backup function
main_backup() {
    local start_time=$(date +%s)
    
    log "🗄️ Starting OctoCode database backup"
    log "======================================"
    
    # Run backup steps
    check_database_connection
    create_backup
    compress_backup
    verify_backup
    upload_to_s3
    cleanup_old_backups
    generate_report
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    success_log "✅ Backup completed successfully in ${duration}s"
    send_notification "SUCCESS" "Backup completed in ${duration}s"
}

# Error handling
trap 'error_log "Backup script interrupted"; send_notification "FAILED" "Backup script interrupted"; exit 1' INT TERM

# Main execution
case "${1:-backup}" in
    "backup")
        main_backup
        ;;
    "setup-cron")
        setup_cron
        ;;
    "test-connection")
        check_database_connection
        ;;
    "cleanup")
        cleanup_old_backups
        ;;
    "help")
        echo "Usage: $0 [backup|setup-cron|test-connection|cleanup|help]"
        echo ""
        echo "Commands:"
        echo "  backup         - Perform database backup (default)"
        echo "  setup-cron     - Setup cron job for scheduled backups"
        echo "  test-connection - Test database connection"
        echo "  cleanup        - Clean up old backups"
        echo "  help           - Show this help message"
        echo ""
        echo "Environment variables:"
        echo "  POSTGRES_HOST              - Database host (default: oc_database)"
        echo "  POSTGRES_DB                - Database name (default: octocode)"
        echo "  POSTGRES_USER              - Database user (default: octocode)"
        echo "  BACKUP_DIR                 - Backup directory (default: /backup)"
        echo "  BACKUP_RETENTION_DAYS      - Days to keep backups (default: 30)"
        echo "  S3_BUCKET                  - S3 bucket for remote backup"
        echo "  BACKUP_SCHEDULE            - Cron schedule (default: 0 2 * * *)"
        echo "  NOTIFICATION_WEBHOOK       - Webhook URL for notifications"
        ;;
    *)
        error_log "Unknown command: $1"
        exit 1
        ;;
esac