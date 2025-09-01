# Multi-stage build for OctoCode Next.js application
# Stage 1: Base image with system dependencies
FROM archlinux:latest AS base

# Install system dependencies and Node.js
RUN pacman -Sy --noconfirm && \
    pacman -S --noconfirm \
        nodejs \
        npm \
        git \
        python \
        make \
        gcc \
        openssl \
        ca-certificates \
        postgresql-libs \
        sqlite && \
    pacman -Scc --noconfirm

# Install pnpm globally
RUN npm install -g pnpm@9.7.0

# Create non-root user for security
RUN useradd -m -s /bin/bash octodev && \
    mkdir -p /app && \
    chown -R octodev:octodev /app

# Set working directory
WORKDIR /app

# Switch to non-root user
USER octodev

# Stage 2: Development environment
FROM base AS development

# Copy package files for dependency installation
COPY --chown=octodev:octodev package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy prisma schema for database client generation
COPY --chown=octodev:octodev prisma ./prisma/

# Generate Prisma client
RUN pnpm db:generate

# Copy application source code
COPY --chown=octodev:octodev . .

# Expose ports for Next.js app and Socket.io
EXPOSE 3000 3001

# Health check for the application
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Default command for development with hot reload
CMD ["pnpm", "dev"]

# Stage 3: Production build (for future use)
FROM base AS builder

# Copy package files
COPY --chown=octodev:octodev package.json pnpm-lock.yaml* ./

# Install dependencies including devDependencies for build
RUN pnpm install --frozen-lockfile

# Copy source code
COPY --chown=octodev:octodev . .

# Copy prisma schema and generate client
COPY --chown=octodev:octodev prisma ./prisma/
RUN pnpm db:generate

# Build the application
RUN pnpm build

# Stage 4: Production runtime
FROM base AS production

# Copy built application from builder stage
COPY --from=builder --chown=octodev:octodev /app/.next ./.next
COPY --from=builder --chown=octodev:octodev /app/node_modules ./node_modules
COPY --from=builder --chown=octodev:octodev /app/package.json ./package.json
COPY --from=builder --chown=octodev:octodev /app/next.config.js ./next.config.js
COPY --from=builder --chown=octodev:octodev /app/public ./public
COPY --from=builder --chown=octodev:octodev /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Production command
CMD ["pnpm", "start"]