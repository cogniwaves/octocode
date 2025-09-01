-- Database initialization script for OctoCode PostgreSQL
-- This script runs when the PostgreSQL container starts for the first time

-- Create database if it doesn't exist (handled by POSTGRES_DB env var)
-- Additional database configuration

-- Create extensions that might be useful for the application
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Set default timezone
SET timezone = 'UTC';

-- Create additional schemas if needed for multi-tenancy (future)
-- CREATE SCHEMA IF NOT EXISTS tenant_data;

-- Grant necessary permissions to the application user
GRANT ALL PRIVILEGES ON DATABASE octocode_dev TO octodev;
GRANT ALL PRIVILEGES ON SCHEMA public TO octodev;

-- Log initialization
SELECT 'OctoCode database initialized successfully' AS status;