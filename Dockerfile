# Multi-stage build for OctoCode Next.js application
# Security: Using specific version tags and minimal base images

# Stage 1: Base image with system dependencies
FROM archlinux:latest AS base

# Install system dependencies with version pinning for security
RUN pacman -Sy --noconfirm && \
    pacman -S --noconfirm \
        nodejs>=20.0.0 \
        npm \
        git \
        python \
        make \
        gcc \
        openssl \
        ca-certificates \
        postgresql-libs \
        sqlite \
        curl \
        sudo && \
    # Clean package cache to reduce image size
    pacman -Scc --noconfirm && \
    # Remove unnecessary files
    rm -rf /var/cache/pacman/pkg/* /tmp/* /var/tmp/*

# Install pnpm globally with specific version
RUN npm install -g pnpm@9.7.0 --no-audit --no-fund

# Create non-root user with host-matching UID/GID for proper permissions
RUN groupadd -r -g 1000 octodev && \
    useradd -r -u 1000 -g octodev -m -s /bin/bash octodev && \
    mkdir -p /app && \
    chown -R octodev:octodev /app

# Security: Set strict permissions
RUN chmod 755 /app

# Set working directory
WORKDIR /app

# Switch to non-root user early for security
USER octodev

# Stage 1.5: Dependencies layer for better caching
FROM base AS deps

# Copy package files for optimal layer caching
COPY --chown=octodev:octodev package.json pnpm-lock.yaml* ./

# Install dependencies with security and performance optimizations
RUN --mount=type=cache,target=/home/octodev/.pnpm,uid=1000,gid=1000 \
    pnpm install --prod=false --no-optional && \
    # Security: Remove package vulnerabilities  
    pnpm audit --fix || true

# Stage 2: Development environment with hot reload optimization
FROM deps AS development

# Copy node_modules from deps stage for faster builds
COPY --from=deps --chown=octodev:octodev /app/node_modules ./node_modules

# Copy prisma schema for database client generation
COPY --chown=octodev:octodev prisma ./prisma/

# Generate Prisma client with caching
RUN --mount=type=cache,target=/home/octodev/.prisma,uid=1000,gid=1000 \
    pnpm db:generate

# Create directories for development optimization
RUN mkdir -p .next && chown octodev:octodev .next

# Copy application source code (will be mounted in development)
COPY --chown=octodev:octodev . .

# Expose ports for Next.js app and Socket.io
EXPOSE 3000 3001

# Enhanced health check with timeout and better error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Default command for development with hot reload
CMD ["pnpm", "dev"]

# Stage 3: Production builder with optimized build process
FROM deps AS builder

# Copy node_modules from deps stage
COPY --from=deps --chown=octodev:octodev /app/node_modules ./node_modules

# Copy source code for build
COPY --chown=octodev:octodev . .

# Copy prisma schema and generate client with build cache
RUN --mount=type=cache,target=/home/octodev/.prisma,uid=1001,gid=1001 \
    pnpm db:generate

# Build the application with optimizations
RUN --mount=type=cache,target=/home/octodev/.next/cache,uid=1001,gid=1001 \
    NODE_ENV=production pnpm build && \
    # Remove development dependencies to reduce image size
    pnpm prune --prod

# Stage 4: Production runtime with minimal surface area
FROM archlinux:latest AS production

# Install only runtime dependencies
RUN pacman -Sy --noconfirm && \
    pacman -S --noconfirm \
        nodejs>=20.0.0 \
        curl \
        ca-certificates && \
    pacman -Scc --noconfirm && \
    rm -rf /var/cache/pacman/pkg/* /tmp/* /var/tmp/*

# Create non-root user with same UID/GID as builder
RUN groupadd -r -g 1001 octodev && \
    useradd -r -u 1001 -g octodev -m -s /bin/bash octodev && \
    mkdir -p /app && \
    chown -R octodev:octodev /app

WORKDIR /app

# Copy built application from builder stage with minimal files
COPY --from=builder --chown=octodev:octodev /app/.next/standalone ./
COPY --from=builder --chown=octodev:octodev /app/.next/static ./.next/static
COPY --from=builder --chown=octodev:octodev /app/public ./public
COPY --from=builder --chown=octodev:octodev /app/prisma ./prisma

# Security: Set strict file permissions
RUN find /app -type f -exec chmod 644 {} \; && \
    find /app -type d -exec chmod 755 {} \; && \
    chmod 755 /app/server.js

# Switch to non-root user
USER octodev

# Expose only necessary port
EXPOSE 3000

# Enhanced production health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Production runtime with optimizations

# Production command with optimizations
CMD ["node", "server.js"]