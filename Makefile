# OctoCode Container Management Makefile
# Provides convenient commands for development and production workflows

.PHONY: help dev prod build clean security logs backup restore test lint format migrate seed

# Default target
.DEFAULT_GOAL := help

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
BLUE := \033[0;34m
PURPLE := \033[0;35m
CYAN := \033[0;36m
NC := \033[0m # No Color

# Project configuration
PROJECT_NAME := octocode
IMAGE_NAME := oc_app
DOCKER_COMPOSE_DEV := docker-compose.dev.yml
DOCKER_COMPOSE_PROD := docker-compose.prod.yml
DOCKER_COMPOSE_SECURITY := docker/security/docker-compose.security.yml

## Help
help: ## Show this help message
	@echo "$(BLUE)OctoCode Container Management$(NC)"
	@echo "$(BLUE)=============================$(NC)"
	@echo ""
	@echo "$(GREEN)Development Commands:$(NC)"
	@awk 'BEGIN {FS = ":.*##"; category="Development"} /^[a-zA-Z_-]+:.*?##/ { if ($$2 ~ /^[[:space:]]*Development:/) {category="Development"; sub(/^[[:space:]]*Development:[[:space:]]*/, "", $$2)} else if ($$2 ~ /^[[:space:]]*Production:/) {category="Production"; sub(/^[[:space:]]*Production:[[:space:]]*/, "", $$2); print "\n$(YELLOW)" category " Commands:$(NC)"} printf "  $(CYAN)%-15s$(NC) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

## Development Commands

dev: ## Development: Start development environment
	@echo "$(GREEN)🚀 Starting OctoCode development environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) up --build -d
	@echo "$(GREEN)✅ Development environment started$(NC)"
	@echo "$(YELLOW)📝 Application: http://localhost:3002$(NC)"
	@echo "$(YELLOW)📝 Database: localhost:5435$(NC)"
	@echo "$(YELLOW)📝 Redis: localhost:6380$(NC)"

dev-build: ## Development: Build development images
	@echo "$(GREEN)🔨 Building development images...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) build --no-cache
	@echo "$(GREEN)✅ Development images built$(NC)"

dev-logs: ## Development: Show development logs
	@echo "$(GREEN)📋 Showing development logs...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) logs -f

dev-shell: ## Development: Open shell in app container
	@echo "$(GREEN)🐚 Opening shell in development container...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app bash

dev-db-shell: ## Development: Open database shell
	@echo "$(GREEN)🗄️  Opening database shell...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_database psql -U octodev -d octocode_dev

dev-redis-shell: ## Development: Open Redis shell
	@echo "$(GREEN)🔴 Opening Redis shell...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_redis redis-cli

dev-stop: ## Development: Stop development environment
	@echo "$(YELLOW)⏹️  Stopping development environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) down
	@echo "$(GREEN)✅ Development environment stopped$(NC)"

dev-restart: dev-stop dev ## Development: Restart development environment

## Production Commands

prod: ## Production: Start production environment
	@echo "$(GREEN)🚀 Starting OctoCode production environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) up --build -d
	@echo "$(GREEN)✅ Production environment started$(NC)"
	@echo "$(YELLOW)📝 Application: https://localhost$(NC)"
	@echo "$(YELLOW)📝 Monitoring: http://localhost:9090$(NC)"

prod-build: ## Production: Build production images
	@echo "$(GREEN)🔨 Building production images...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) build --no-cache
	@echo "$(GREEN)✅ Production images built$(NC)"

prod-logs: ## Production: Show production logs
	@echo "$(GREEN)📋 Showing production logs...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) logs -f

prod-scale: ## Production: Scale application instances (usage: make prod-scale REPLICAS=3)
	@echo "$(GREEN)📈 Scaling application to $(REPLICAS) instances...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) up -d --scale oc_app=$(REPLICAS)
	@echo "$(GREEN)✅ Application scaled to $(REPLICAS) instances$(NC)"

prod-stop: ## Production: Stop production environment
	@echo "$(YELLOW)⏹️  Stopping production environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) down
	@echo "$(GREEN)✅ Production environment stopped$(NC)"

## Utility Commands

build: ## Build all images for current environment
	@echo "$(GREEN)🔨 Building all images...$(NC)"
	@if [ -f ".env" ] && grep -q "NODE_ENV=production" .env; then \
		docker compose -f $(DOCKER_COMPOSE_PROD) build; \
	else \
		docker compose -f $(DOCKER_COMPOSE_DEV) build; \
	fi
	@echo "$(GREEN)✅ All images built$(NC)"

clean: ## Clean up containers, images, and volumes
	@echo "$(YELLOW)🧹 Cleaning up Docker resources...$(NC)"
	@echo "$(RED)⚠️  This will remove all containers, images, and volumes$(NC)"
	@read -p "Are you sure? [y/N]: " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker compose -f $(DOCKER_COMPOSE_DEV) down -v --rmi all
	@docker compose -f $(DOCKER_COMPOSE_PROD) down -v --rmi all
	@docker system prune -af --volumes
	@echo "$(GREEN)✅ Cleanup completed$(NC)"

clean-dev: ## Clean development environment only
	@echo "$(YELLOW)🧹 Cleaning development environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) down -v --rmi all
	@echo "$(GREEN)✅ Development environment cleaned$(NC)"

clean-prod: ## Clean production environment only
	@echo "$(YELLOW)🧹 Cleaning production environment...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) down -v --rmi all
	@echo "$(GREEN)✅ Production environment cleaned$(NC)"

## Security Commands

security: ## Run comprehensive security scan
	@echo "$(GREEN)🔒 Running security scan...$(NC)"
	@./docker/security/scan.sh $(IMAGE_NAME)

security-start: ## Start security monitoring stack
	@echo "$(GREEN)🔒 Starting security monitoring...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_SECURITY) up -d
	@echo "$(GREEN)✅ Security monitoring started$(NC)"
	@echo "$(YELLOW)📝 Security Dashboard: http://localhost:3001$(NC)"
	@echo "$(YELLOW)📝 Trivy Scanner: docker exec -it oc_trivy_scanner trivy$(NC)"

security-stop: ## Stop security monitoring stack
	@echo "$(YELLOW)⏹️  Stopping security monitoring...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_SECURITY) down
	@echo "$(GREEN)✅ Security monitoring stopped$(NC)"

security-scan-dockerfile: ## Scan Dockerfile for security issues
	@echo "$(GREEN)🔍 Scanning Dockerfile...$(NC)"
	@docker run --rm -v $(PWD):/workspace aquasec/trivy config /workspace/Dockerfile

security-scan-secrets: ## Scan for exposed secrets
	@echo "$(GREEN)🕵️  Scanning for secrets...$(NC)"
	@docker run --rm -v $(PWD):/workspace aquasec/trivy fs --scanners secret /workspace

## Database Commands

migrate: ## Run database migrations
	@echo "$(GREEN)🗄️  Running database migrations...$(NC)"
	@if docker compose -f $(DOCKER_COMPOSE_DEV) ps | grep -q oc_app_dev; then \
		docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm db:migrate; \
	else \
		docker compose -f $(DOCKER_COMPOSE_PROD) exec oc_app pnpm db:migrate; \
	fi
	@echo "$(GREEN)✅ Database migrations completed$(NC)"

migrate-dev: ## Run database migrations (development)
	@echo "$(GREEN)🗄️  Running development database migrations...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm db:migrate
	@echo "$(GREEN)✅ Development database migrations completed$(NC)"

migrate-reset: ## Reset database and run migrations
	@echo "$(RED)⚠️  This will reset the database and lose all data$(NC)"
	@read -p "Are you sure? [y/N]: " confirm && [ "$$confirm" = "y" ] || exit 1
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm db:reset
	@echo "$(GREEN)✅ Database reset completed$(NC)"

seed: ## Seed database with development data
	@echo "$(GREEN)🌱 Seeding database...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm db:seed
	@echo "$(GREEN)✅ Database seeded$(NC)"

## Backup & Restore Commands

backup: ## Create database backup
	@echo "$(GREEN)💾 Creating database backup...$(NC)"
	@mkdir -p ./backups
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_database pg_dump -U octodev -d octocode_dev > ./backups/backup-$(shell date +%Y%m%d-%H%M%S).sql
	@echo "$(GREEN)✅ Database backup created$(NC)"

restore: ## Restore database from backup (usage: make restore BACKUP=backup-file.sql)
	@echo "$(GREEN)📥 Restoring database from backup...$(NC)"
	@if [ -z "$(BACKUP)" ]; then echo "$(RED)❌ Please specify BACKUP file: make restore BACKUP=backup-file.sql$(NC)"; exit 1; fi
	@if [ ! -f "./backups/$(BACKUP)" ]; then echo "$(RED)❌ Backup file not found: ./backups/$(BACKUP)$(NC)"; exit 1; fi
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec -T oc_database psql -U octodev -d octocode_dev < ./backups/$(BACKUP)
	@echo "$(GREEN)✅ Database restored from backup$(NC)"

## Testing Commands

test: ## Run all tests
	@echo "$(GREEN)🧪 Running tests...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm test
	@echo "$(GREEN)✅ Tests completed$(NC)"

test-unit: ## Run unit tests
	@echo "$(GREEN)🧪 Running unit tests...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm test:unit
	@echo "$(GREEN)✅ Unit tests completed$(NC)"

test-integration: ## Run integration tests
	@echo "$(GREEN)🧪 Running integration tests...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm test:integration
	@echo "$(GREEN)✅ Integration tests completed$(NC)"

test-e2e: ## Run end-to-end tests
	@echo "$(GREEN)🧪 Running end-to-end tests...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm test:e2e
	@echo "$(GREEN)✅ End-to-end tests completed$(NC)"

## Code Quality Commands

lint: ## Run linting
	@echo "$(GREEN)🔍 Running linter...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm lint
	@echo "$(GREEN)✅ Linting completed$(NC)"

lint-fix: ## Run linting with auto-fix
	@echo "$(GREEN)🔧 Running linter with auto-fix...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm lint:fix
	@echo "$(GREEN)✅ Linting with auto-fix completed$(NC)"

format: ## Format code
	@echo "$(GREEN)💅 Formatting code...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm format
	@echo "$(GREEN)✅ Code formatting completed$(NC)"

typecheck: ## Run TypeScript type checking
	@echo "$(GREEN)🔍 Running TypeScript type checking...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) exec oc_app pnpm typecheck
	@echo "$(GREEN)✅ Type checking completed$(NC)"

## Monitoring Commands

logs: ## Show logs for all services
	@echo "$(GREEN)📋 Showing logs...$(NC)"
	@if docker compose -f $(DOCKER_COMPOSE_DEV) ps | grep -q oc_app_dev; then \
		docker compose -f $(DOCKER_COMPOSE_DEV) logs -f; \
	else \
		docker compose -f $(DOCKER_COMPOSE_PROD) logs -f; \
	fi

logs-app: ## Show application logs only
	@echo "$(GREEN)📋 Showing application logs...$(NC)"
	@if docker compose -f $(DOCKER_COMPOSE_DEV) ps | grep -q oc_app_dev; then \
		docker compose -f $(DOCKER_COMPOSE_DEV) logs -f oc_app; \
	else \
		docker compose -f $(DOCKER_COMPOSE_PROD) logs -f oc_app; \
	fi

logs-db: ## Show database logs only
	@echo "$(GREEN)📋 Showing database logs...$(NC)"
	@if docker compose -f $(DOCKER_COMPOSE_DEV) ps | grep -q oc_database_dev; then \
		docker compose -f $(DOCKER_COMPOSE_DEV) logs -f oc_database; \
	else \
		docker compose -f $(DOCKER_COMPOSE_PROD) logs -f oc_database; \
	fi

status: ## Show container status
	@echo "$(GREEN)📊 Container Status$(NC)"
	@echo "$(BLUE)==================$(NC)"
	@echo ""
	@echo "$(YELLOW)Development Environment:$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) ps || echo "Not running"
	@echo ""
	@echo "$(YELLOW)Production Environment:$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_PROD) ps || echo "Not running"
	@echo ""
	@echo "$(YELLOW)Security Monitoring:$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_SECURITY) ps || echo "Not running"

## Quick Setup Commands

quick-start: ## Quick start development environment (build + migrate + seed)
	@echo "$(GREEN)⚡ Quick starting OctoCode...$(NC)"
	@make dev-build
	@make dev
	@sleep 10  # Wait for services to start
	@make migrate
	@make seed
	@echo "$(GREEN)🎉 OctoCode is ready!$(NC)"
	@echo "$(YELLOW)📝 Visit: http://localhost:3000$(NC)"

quick-reset: ## Quick reset (clean + quick-start)
	@echo "$(YELLOW)🔄 Quick resetting OctoCode...$(NC)"
	@make clean-dev
	@make quick-start

## Environment Management

env-example: ## Create .env.example file
	@echo "$(GREEN)📝 Creating .env.example...$(NC)"
	@echo "# OctoCode Environment Configuration" > .env.example
	@echo "" >> .env.example
	@echo "# Environment" >> .env.example
	@echo "NODE_ENV=development" >> .env.example
	@echo "" >> .env.example
	@echo "# Database" >> .env.example
	@echo "DATABASE_URL=postgresql://octodev:octodev_password@localhost:5432/octocode_dev?schema=public" >> .env.example
	@echo "POSTGRES_HOST=oc_database" >> .env.example
	@echo "POSTGRES_PORT=5432" >> .env.example
	@echo "POSTGRES_DB=octocode_dev" >> .env.example
	@echo "POSTGRES_USER=octodev" >> .env.example
	@echo "POSTGRES_PASSWORD=octodev_password" >> .env.example
	@echo "" >> .env.example
	@echo "# Authentication" >> .env.example
	@echo "NEXTAUTH_URL=http://localhost:3000" >> .env.example
	@echo "NEXTAUTH_SECRET=your-nextauth-secret-here" >> .env.example
	@echo "" >> .env.example
	@echo "# Redis" >> .env.example
	@echo "REDIS_URL=redis://localhost:6379" >> .env.example
	@echo "" >> .env.example
	@echo "# AI Integration" >> .env.example
	@echo "ANTHROPIC_API_KEY=your-anthropic-api-key-here" >> .env.example
	@echo "" >> .env.example
	@echo "# Socket.IO" >> .env.example
	@echo "SOCKET_IO_PORT=3001" >> .env.example
	@echo "$(GREEN)✅ .env.example created$(NC)"

check-env: ## Check environment configuration
	@echo "$(GREEN)🔍 Checking environment configuration...$(NC)"
	@if [ ! -f ".env" ]; then \
		echo "$(YELLOW)⚠️  .env file not found. Creating from example...$(NC)"; \
		cp .env.example .env 2>/dev/null || echo "$(RED)❌ .env.example not found. Run 'make env-example' first$(NC)"; \
	else \
		echo "$(GREEN)✅ .env file exists$(NC)"; \
	fi
	@echo "$(YELLOW)📝 Current environment: $$(grep NODE_ENV .env 2>/dev/null || echo 'NODE_ENV not set')$(NC)"

## CI/CD Commands

ci-build: ## CI: Build and test
	@echo "$(GREEN)🏗️  CI: Building and testing...$(NC)"
	@docker compose -f $(DOCKER_COMPOSE_DEV) build
	@docker compose -f $(DOCKER_COMPOSE_DEV) run --rm oc_app pnpm test
	@echo "$(GREEN)✅ CI: Build and test completed$(NC)"

ci-security: ## CI: Run security scans
	@echo "$(GREEN)🔒 CI: Running security scans...$(NC)"
	@./docker/security/scan.sh $(IMAGE_NAME)
	@echo "$(GREEN)✅ CI: Security scans completed$(NC)"

ci-deploy: ## CI: Deploy to production
	@echo "$(GREEN)🚀 CI: Deploying to production...$(NC)"
	@make prod-build
	@make prod
	@echo "$(GREEN)✅ CI: Deployment completed$(NC)"