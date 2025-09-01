# OctoCode Docker Container Architecture

## Overview

This guide provides comprehensive documentation for the OctoCode container architecture, covering development, production, security, and operational aspects.

## Architecture Summary

- **Multi-stage Dockerfile** with optimized builds for development and production
- **Separate environments** with development and production docker-compose configurations
- **Comprehensive security** scanning and monitoring
- **Automated backup** and disaster recovery procedures
- **Development workflow** automation with Makefile
- **Production-grade** monitoring and observability

## Quick Start

### Development Environment

```bash
# Quick start (recommended for first time)
make quick-start

# Or step by step
make dev-build      # Build development images
make dev           # Start development environment
make migrate       # Run database migrations
make seed          # Seed with development data
```

Access points:
- **Application**: http://localhost:3000
- **Database Admin**: http://localhost:5050 (pgAdmin)
- **Email Testing**: http://localhost:8025 (MailHog)
- **Redis**: localhost:6379

### Production Environment

```bash
# Production deployment
make prod-build    # Build production images
make prod         # Start production environment
```

Access points:
- **Application**: https://localhost
- **Monitoring**: http://localhost:9090 (Prometheus)

## File Structure

```
octocode/
├── Dockerfile                              # Multi-stage production-ready Dockerfile
├── docker-compose.yml                      # Default (development) configuration
├── docker-compose.dev.yml                  # Development environment
├── docker-compose.prod.yml                 # Production environment
├── Makefile                                # Development workflow automation
├── DOCKER_GUIDE.md                         # This documentation
└── docker/
    ├── dev/                                # Development configurations
    │   ├── redis.conf                      # Redis development config
    │   ├── postgresql.conf                 # PostgreSQL development config
    │   └── pgadmin-servers.json            # pgAdmin server configuration
    ├── prod/                               # Production configurations
    │   ├── nginx.conf                      # Load balancer configuration
    │   ├── postgresql.conf                 # PostgreSQL production config
    │   ├── redis.conf                      # Redis production config
    │   ├── prometheus.yml                  # Monitoring configuration
    │   ├── alert_rules.yml                 # Alerting rules
    │   └── backup-scripts/                 # Backup and restore scripts
    │       ├── backup.sh                   # Automated backup script
    │       └── restore.sh                  # Database restore script
    ├── security/                           # Security configurations
    │   ├── scan.sh                         # Security scanning script
    │   ├── docker-compose.security.yml     # Security monitoring stack
    │   ├── falco.yaml                      # Runtime security monitoring
    │   └── .trivyignore                    # Security scan ignore rules
    └── scripts/                            # Utility scripts
```

## Container Images and Services

### Core Application Stack

#### `oc_app` - Next.js Application
- **Base Image**: Arch Linux (customizable)
- **Stages**: Development and Production
- **Features**: Hot reload, TypeScript, Prisma integration
- **Security**: Non-root user, minimal attack surface
- **Ports**: 3000 (HTTP), 3001 (Socket.IO), 9229 (Debug)

#### `oc_database` - PostgreSQL Database
- **Image**: PostgreSQL 16 Alpine
- **Features**: Optimized for development/production
- **Security**: User isolation, encrypted connections
- **Backup**: Automated with retention policies
- **Port**: 5432

#### `oc_redis` - Redis Cache
- **Image**: Redis 7 Alpine  
- **Features**: Persistence, clustering support
- **Security**: Password protected, network isolation
- **Port**: 6379

### Production-Only Services

#### `oc_nginx` - Load Balancer
- **Image**: NGINX Alpine
- **Features**: SSL termination, static serving, compression
- **Security**: Rate limiting, security headers
- **Ports**: 80 (HTTP), 443 (HTTPS)

#### `oc_worker` - Background Jobs
- **Features**: Scaled instances, job processing
- **Configuration**: Separate from web instances

#### `oc_backup` - Database Backup
- **Features**: Scheduled backups, S3 upload, retention
- **Schedule**: Daily at 2 AM (configurable)

#### `oc_observability` - Monitoring
- **Stack**: Prometheus, Grafana, Alerting
- **Features**: Metrics collection, alerting, dashboards

### Development-Only Services

#### `oc_pgadmin` - Database Administration
- **Access**: http://localhost:5050
- **Credentials**: admin@octocode.dev / admin

#### `oc_mailhog` - Email Testing
- **Access**: http://localhost:8025
- **Purpose**: Capture outbound emails during development

### Security Services

#### `trivy-scanner` - Vulnerability Scanning
- **Purpose**: Container and code security scanning
- **Schedule**: On-demand and CI/CD integration

#### `falco` - Runtime Security
- **Purpose**: Runtime threat detection
- **Features**: Anomaly detection, compliance monitoring

## Docker Configurations Explained

### Multi-Stage Dockerfile

The Dockerfile uses multiple stages for optimization:

1. **Base Stage**: System dependencies and user setup
2. **Dependencies Stage**: Package installation with caching
3. **Development Stage**: Hot reload and debugging features
4. **Builder Stage**: Production build process
5. **Production Stage**: Minimal runtime environment

Key security features:
- Non-root user (UID 1001)
- Specific version pinning
- Multi-stage reduction
- Security scanning integration

### Environment Separation

#### Development (docker-compose.dev.yml)
- **Focus**: Developer experience and debugging
- **Features**: Hot reload, debugging ports, admin tools
- **Volumes**: Source code mounting, cache optimization
- **Resources**: Generous limits for development comfort

#### Production (docker-compose.prod.yml)
- **Focus**: Performance, security, scalability
- **Features**: Load balancing, monitoring, backup
- **Security**: Secrets management, read-only containers
- **Scaling**: Multiple replicas, resource constraints

## Security Implementation

### Container Security

- **Vulnerability Scanning**: Trivy integration with CI/CD
- **Runtime Monitoring**: Falco security monitoring
- **Access Control**: Non-root users, capability dropping
- **Network Segmentation**: Isolated internal networks
- **Secrets Management**: Docker secrets, no embedded secrets

### Security Scanning

Run comprehensive security scans:

```bash
# Full security scan
make security

# Start security monitoring
make security-start

# Scan specific components
make security-scan-dockerfile
make security-scan-secrets
```

### Security Configurations

- **Dockerfile scanning**: Misconfigurations and best practices
- **Image vulnerability scanning**: Known CVEs and security issues  
- **Secret detection**: Prevent credential leaks
- **Runtime monitoring**: Anomaly detection and threat response

## Backup and Disaster Recovery

### Automated Backup Features

- **Scheduled backups**: Daily at 2 AM (configurable)
- **Multiple formats**: Custom and SQL formats
- **Compression**: Automatic compression for storage efficiency
- **S3 integration**: Optional cloud backup storage
- **Retention policies**: Configurable cleanup of old backups
- **Integrity verification**: Backup validation and testing
- **Notifications**: Webhook integration for alerts

### Backup Operations

```bash
# Manual backup
make backup

# Restore from backup
make restore BACKUP=backup-file.sql.gz

# List available backups
docker-compose -f docker-compose.prod.yml exec oc_backup ./scripts/backup.sh list
```

### Disaster Recovery

The restore script provides comprehensive recovery options:
- **Pre-restore backup**: Automatic safety backup
- **Format auto-detection**: Handles multiple backup formats
- **Verification**: Post-restore integrity checks
- **Statistics update**: Database optimization after restore

## Monitoring and Observability

### Metrics Collection

- **Application metrics**: Custom Next.js/Node.js metrics
- **Database metrics**: PostgreSQL performance statistics
- **Cache metrics**: Redis operation statistics
- **System metrics**: CPU, memory, disk, network
- **Container metrics**: Docker container statistics

### Alert Rules

Comprehensive alerting for:
- **Application health**: Downtime, errors, performance
- **Infrastructure health**: Resource usage, connectivity
- **Agent-specific alerts**: Task processing, API limits
- **Security alerts**: Intrusion detection, compliance

### Monitoring Access

```bash
# View application logs
make logs-app

# View all service logs  
make logs

# Check container status
make status

# Access monitoring dashboard
# Navigate to http://localhost:9090 (Prometheus)
```

## Development Workflow

### Common Commands

```bash
# Environment Management
make dev              # Start development
make dev-stop         # Stop development  
make dev-restart      # Restart development
make dev-logs         # View development logs

# Database Operations
make migrate          # Run migrations
make migrate-reset    # Reset and migrate
make seed             # Seed development data

# Code Quality
make lint             # Run linting
make test             # Run tests
make typecheck        # TypeScript checking

# Security Operations
make security         # Run security scans
make security-start   # Start security monitoring

# Backup Operations
make backup           # Create backup
make restore BACKUP=file  # Restore from backup
```

### Container Access

```bash
# Application shell
make dev-shell

# Database shell
make dev-db-shell

# Redis shell  
make dev-redis-shell

# Execute custom commands
docker-compose -f docker-compose.dev.yml exec oc_app [command]
```

## Production Deployment

### Pre-deployment Checklist

1. **Environment Configuration**
   ```bash
   make check-env        # Verify environment variables
   make ci-security      # Run security scans
   make ci-build         # Build and test
   ```

2. **Production Preparation**
   - Configure secrets in `./secrets/` directory
   - Set up SSL certificates in `./docker/prod/ssl/`
   - Configure monitoring endpoints
   - Set up backup destinations (S3, etc.)

3. **Deployment**
   ```bash
   make prod-build       # Build production images
   make prod            # Deploy production stack
   ```

### Scaling Operations

```bash
# Scale application instances
make prod-scale REPLICAS=3

# View production logs
make prod-logs

# Monitor production status
make status
```

## Environment Variables

### Core Configuration

```bash
# Application
NODE_ENV=development|production
DATABASE_URL=postgresql://user:pass@host:port/db
NEXTAUTH_URL=https://your-domain.com
NEXTAUTH_SECRET=your-secret-key

# Database
POSTGRES_HOST=oc_database
POSTGRES_DB=octocode
POSTGRES_USER=octocode
POSTGRES_PASSWORD=secure-password

# Redis
REDIS_URL=redis://localhost:6379

# AI Integration
ANTHROPIC_API_KEY=your-api-key

# Production Specific
POSTGRES_MAX_CONNECTIONS=200
BACKUP_S3_BUCKET=your-backup-bucket
NOTIFICATION_WEBHOOK=your-slack-webhook
```

### Security Configuration

```bash
# Secrets (production)
POSTGRES_PASSWORD_FILE=/run/secrets/postgres_password
NEXTAUTH_SECRET_FILE=/run/secrets/nextauth_secret
ANTHROPIC_API_KEY_FILE=/run/secrets/anthropic_api_key

# Backup Configuration
BACKUP_SCHEDULE=0 2 * * *
BACKUP_RETENTION_DAYS=30
AWS_ACCESS_KEY_ID_FILE=/run/secrets/aws_access_key
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   ```bash
   # Check port usage
   sudo netstat -tlnp | grep :3000
   
   # Stop conflicting services
   make dev-stop
   ```

2. **Database Connection Issues**
   ```bash
   # Check database status
   make status
   
   # View database logs
   make logs-db
   
   # Test connection
   make dev-db-shell
   ```

3. **Volume Permission Issues**
   ```bash
   # Fix volume permissions
   docker-compose -f docker-compose.dev.yml exec oc_app chown -R octodev:octodev /app
   ```

4. **Build Issues**
   ```bash
   # Clean build cache
   make clean-dev
   
   # Rebuild from scratch
   make dev-build
   ```

### Performance Debugging

1. **Application Performance**
   ```bash
   # Enable debugging
   docker-compose -f docker-compose.dev.yml exec oc_app npm run dev:debug
   ```

2. **Database Performance**
   ```bash
   # View slow queries
   make dev-db-shell
   # Then: SELECT * FROM pg_stat_statements ORDER BY mean_time DESC LIMIT 10;
   ```

3. **Container Resource Usage**
   ```bash
   # Monitor container stats
   docker stats
   
   # View detailed container info
   docker inspect oc_app_dev
   ```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: OctoCode CI/CD

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Run Security Scan
        run: make ci-security

  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build and Test
        run: make ci-build

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: [security, build]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Production
        run: make ci-deploy
```

## Best Practices

### Development

- Use `make quick-start` for initial setup
- Regularly run `make security` to check for vulnerabilities
- Keep dependencies updated with `pnpm update`
- Use database migrations instead of direct schema changes
- Test backup/restore procedures regularly

### Production

- Use secrets management for all sensitive data
- Monitor application and infrastructure metrics
- Set up automated backup verification
- Implement proper log aggregation
- Use blue-green deployments for zero-downtime updates

### Security

- Scan images before deployment
- Keep base images updated
- Monitor runtime security events
- Implement proper network segmentation  
- Regularly audit container configurations

## Support

For additional support:

1. **Check logs**: `make logs` for comprehensive logging
2. **Verify configuration**: `make check-env` for environment validation
3. **Security scan**: `make security` for security analysis
4. **Container status**: `make status` for service health

The container architecture is designed for development velocity while maintaining production-grade security, performance, and reliability.