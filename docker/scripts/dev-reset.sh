#!/bin/bash
# Development reset script for OctoCode Docker environment

set -e

echo "🔄 Resetting OctoCode development environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Confirm reset action
read -p "⚠️  This will remove all containers, volumes, and data. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_status "Reset cancelled."
    exit 0
fi

# Stop and remove containers
print_status "Stopping containers..."
docker-compose -f docker-compose.yml -f docker-compose.dev.yml down -v --remove-orphans

# Remove Docker volumes
print_status "Removing Docker volumes..."
docker volume rm oc_postgres_data oc_redis_data oc_prisma_cache 2>/dev/null || true

# Remove local volume directories
print_status "Removing local volume directories..."
rm -rf ./docker/volumes/postgres
rm -rf ./docker/volumes/redis

# Clean up Docker system
print_status "Cleaning up Docker system..."
docker system prune -f

# Remove generated Prisma client
print_status "Cleaning Prisma client..."
rm -rf node_modules/.prisma
rm -rf prisma/migrations

print_status "✅ Development environment reset complete!"
print_warning "Run './docker/scripts/dev-setup.sh' to set up the environment again."