#!/bin/bash
# Deployment script for roko-marketing static serving with Caddy
# Builds and serves the production build through Caddy

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}"
DEPLOY_BASE_DIR="/home/roctinam/production-deploy"
DEPLOY_DIR="${DEPLOY_BASE_DIR}/roko-marketing"
LOG_FILE="${SCRIPT_DIR}/deploy.log"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "${LOG_FILE}"
}

log "🚀 Starting roko-marketing deployment..."

# Check if we're in the correct directory
if [[ ! -f "${PROJECT_ROOT}/package.json" ]]; then
    log "❌ Error: package.json not found. Are you in the correct directory?"
    exit 1
fi

# Check if we should skip the build process
if [[ "${SKIP_BUILD:-0}" == "1" ]]; then
    log "⏭️  Skipping build process (SKIP_BUILD=1)"
else
    # Install missing dependencies if needed
    log "📦 Checking dependencies..."
    if ! npm list babel-plugin-transform-remove-console >/dev/null 2>&1; then
        log "⚠️  Installing missing babel plugin..."
        npm install --save-dev babel-plugin-transform-remove-console || {
            log "❌ Failed to install babel-plugin-transform-remove-console"
            exit 1
        }
    fi

    # Build the project (skip type-check for deployment)
    log "📦 Building project without type checking..."
    
    # Increase memory limit for the build process
    export NODE_OPTIONS="--max-old-space-size=4096"
    
    if ! npx vite build --mode production; then
        log "❌ Build failed. Trying alternative build method..."
        
        # Try building without PWA plugin which might be causing issues
        if ! VITE_DISABLE_PWA=1 npx vite build --mode production; then
            log "❌ All build methods failed. Check build configuration."
            log "💡 Try running 'npm run lint:fix' to fix TypeScript issues first."
            log "💡 Use SKIP_BUILD=1 ./deploy-static.sh to skip build and use existing dist/"
            log "💡 Or manually build with: NODE_OPTIONS='--max-old-space-size=4096' npx vite build"
            exit 1
        fi
    fi
fi

# Check if dist directory was created
if [[ ! -d "${PROJECT_ROOT}/dist" ]]; then
    log "❌ Build failed: dist directory not found at ${PROJECT_ROOT}/dist"
    exit 1
fi

log "✅ Build completed successfully"

# Ensure deployment base directory exists
log "📁 Ensuring deployment directory structure..."
mkdir -p "${DEPLOY_BASE_DIR}" || {
    log "❌ Failed to create deployment base directory: ${DEPLOY_BASE_DIR}"
    exit 1
}

# Ensure deployment directory exists
mkdir -p "${DEPLOY_DIR}" || {
    log "❌ Failed to create deployment directory: ${DEPLOY_DIR}"
    exit 1
}

# Clear contents of deployment directory (but not the directory itself)
log "🧹 Clearing old deployment files..."
if [[ -d "${DEPLOY_DIR}" ]] && [[ "$(ls -A "${DEPLOY_DIR}" 2>/dev/null)" ]]; then
    find "${DEPLOY_DIR}" -mindepth 1 -delete 2>/dev/null || {
        log "⚠️  Warning: Could not clear some old files in ${DEPLOY_DIR}"
    }
fi

# Copy new files to production
log "📋 Copying new files to production..."
if ! cp -r "${PROJECT_ROOT}/dist/"* "${DEPLOY_DIR}/"; then
    log "❌ Failed to copy files to deployment directory"
    exit 1
fi

# Create necessary directories for Caddy
log "📁 Creating Caddy directories..."
cd "${PROJECT_ROOT}" || exit 1
mkdir -p caddy_data caddy_config logs || {
    log "❌ Failed to create Caddy directories"
    exit 1
}

# Set proper permissions
log "🔐 Setting permissions..."
find "${DEPLOY_DIR}" -type f -exec chmod 644 {} \; 2>/dev/null || {
    log "⚠️  Warning: Could not set all file permissions"
}
find "${DEPLOY_DIR}" -type d -exec chmod 755 {} \; 2>/dev/null || {
    log "⚠️  Warning: Could not set all directory permissions"
}
chmod 755 caddy_data caddy_config logs 2>/dev/null || {
    log "⚠️  Warning: Could not set Caddy directory permissions"
}

# Note about Docker - it's optional now
log "ℹ️  Docker container management is optional. Use START_DOCKER=1 to enable."

# Check if user wants to start Docker container
if [[ "${START_DOCKER:-0}" == "1" ]]; then
    log "🐋 Docker container management enabled (START_DOCKER=1)"
    
    # Check if Docker is available
    if ! command -v docker >/dev/null 2>&1; then
        log "❌ Docker is not installed or not in PATH"
        exit 1
    fi

    if ! command -v docker-compose >/dev/null 2>&1; then
        log "❌ Docker Compose is not installed or not in PATH"
        exit 1
    fi
    
    # Check Docker permissions
    if ! docker info >/dev/null 2>&1; then
        log "⚠️  Docker permission issue detected"
        log "💡 You may need to:"
        log "   1. Add your user to the docker group: sudo usermod -aG docker \$USER"
        log "   2. Restart your session or run: newgrp docker"
        log "   3. Or run the script with sudo (not recommended)"
        
        # Try with sudo as fallback
        if command -v sudo >/dev/null 2>&1; then
            log "🔄 Attempting to use sudo for Docker commands..."
            DOCKER_CMD="sudo docker"
            DOCKER_COMPOSE_CMD="sudo docker-compose"
        else
            log "❌ Cannot access Docker and sudo is not available"
            exit 1
        fi
    else
        DOCKER_CMD="docker"
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
    
    # Check if docker-compose.caddy.yml exists
    if [[ ! -f "${PROJECT_ROOT}/docker-compose.caddy.yml" ]]; then
        log "❌ docker-compose.caddy.yml not found in ${PROJECT_ROOT}"
        exit 1
    fi
    
    # Stop existing container if running
    log "🛑 Stopping existing container if running..."
    ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" down 2>/dev/null || {
        log "ℹ️  No existing container to stop"
    }
    
    # Start Caddy server
    log "🐋 Starting Caddy server..."
    if ! ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" up -d; then
        log "❌ Failed to start Caddy server"
        log "📋 Checking Docker logs..."
        ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" logs || true
        exit 1
    fi
    
    # Wait for health check
    log "⏳ Waiting for server to be healthy..."
    sleep 10
    
    # Check if server is running
    if ${DOCKER_CMD} ps --format "table {{.Names}}" | grep -q roko-marketing-server; then
        # Test if the server is actually responding
        log "🔍 Testing server response..."
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:82/ | grep -q "200\|404"; then
            log "✅ Deployment complete!"
            log "🌐 Server running at: http://localhost:82"
            log "📁 Files deployed to: ${DEPLOY_DIR}"
            log ""
            log "📋 Useful commands:"
            log "   View logs: docker-compose -f docker-compose.caddy.yml logs -f"
            log "   Stop server: docker-compose -f docker-compose.caddy.yml down"
            log "   Restart server: docker-compose -f docker-compose.caddy.yml restart"
            log "   Check status: ${DOCKER_CMD} ps | grep roko-marketing-server"
            log ""
            log "💡 Note: The server is using port 82 to avoid conflicts with other services"
            log "📊 Deployment log saved to: ${LOG_FILE}"
        else
            log "⚠️  Container is running but server is not responding"
            log "📋 Check server logs: ${DOCKER_COMPOSE_CMD} -f docker-compose.caddy.yml logs"
            exit 1
        fi
    else
        log "❌ Server failed to start. Check logs with:"
        log "   ${DOCKER_COMPOSE_CMD} -f docker-compose.caddy.yml logs"
        log "📊 Deployment log saved to: ${LOG_FILE}"
        exit 1
    fi
else
    log "✅ Deployment complete!"
    log "📁 Files deployed to: ${DEPLOY_DIR}"
    log ""
    log "🐋 Docker container NOT started (default behavior)"
    log "💡 To start the Docker container, either:"
    log "   1. Run: START_DOCKER=1 ./deploy-static.sh"
    log "   2. Manually start: docker-compose -f docker-compose.caddy.yml up -d"
    log "      or with sudo: sudo docker-compose -f docker-compose.caddy.yml up -d"
    log ""
    log "📊 Deployment log saved to: ${LOG_FILE}"
fi