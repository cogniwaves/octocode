-- Performance tuning for OctoCode PostgreSQL development environment
-- These settings are optimized for development, not production

-- Memory settings for development
ALTER SYSTEM SET shared_buffers = '256MB';
ALTER SYSTEM SET effective_cache_size = '1GB';
ALTER SYSTEM SET work_mem = '16MB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';

-- Connection settings
ALTER SYSTEM SET max_connections = '200';

-- Logging settings for development
ALTER SYSTEM SET log_statement = 'mod';
ALTER SYSTEM SET log_min_duration_statement = '1000';
ALTER SYSTEM SET log_line_prefix = '%t [%p]: [%l-1] user=%u,db=%d,app=%a,client=%h ';

-- Checkpoint settings
ALTER SYSTEM SET checkpoint_completion_target = '0.9';
ALTER SYSTEM SET wal_buffers = '16MB';

-- Auto vacuum settings
ALTER SYSTEM SET autovacuum = 'on';
ALTER SYSTEM SET autovacuum_max_workers = '3';

-- Reload configuration
SELECT pg_reload_conf();

-- Log tuning completion
SELECT 'PostgreSQL performance tuning applied for development' AS status;