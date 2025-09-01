#!/bin/bash
# Development setup script for OctoCode Docker environment

set -e

echo "🚀 Setting up OctoCode development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    print_error "docker-compose is not installed. Please install it and try again."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p ./docker/volumes/postgres
mkdir -p ./docker/volumes/redis

# Copy environment file if it doesn't exist
if [ ! -f .env ]; then
    print_status "Creating .env file from .env.docker..."
    cp .env.docker .env
    print_warning "Please update the .env file with your actual API keys and secrets."
fi

# Switch to PostgreSQL schema for Docker development
if [ -f prisma/schema.postgresql.prisma ]; then
    print_status "Switching to PostgreSQL schema for Docker development..."
    cp prisma/schema.prisma prisma/schema.sqlite.backup
    cp prisma/schema.postgresql.prisma prisma/schema.prisma
    print_status "Backed up SQLite schema to prisma/schema.sqlite.backup"
fi

# Build and start services
print_status "Building Docker images..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml build

print_status "Starting development services..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up -d

# Wait for database to be ready
print_status "Waiting for database to be ready..."
sleep 10

# Check service health
print_status "Checking service health..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml ps

echo ""
print_status "✅ Development environment setup complete!"
echo ""
echo "🌐 Application: http://localhost:3000"
echo "🗄️  Database:   postgresql://octodev:octodev_password@localhost:5432/octocode_dev"
echo "📊 Redis:      redis://localhost:6379"
echo ""
echo "📝 Useful commands:"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml logs -f    # View logs"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml exec oc_app bash    # Access app container"
echo "   docker-compose -f docker-compose.yml -f docker-compose.dev.yml down      # Stop services"
echo ""