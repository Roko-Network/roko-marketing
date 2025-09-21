#!/bin/bash

# ROKO Marketing - Server Deployment Script
# This script is executed on the server to handle deployment tasks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_DIR="${APP_DIR:-/var/www/roko-marketing}"
NGINX_CONFIG="/etc/nginx/sites-available/roko-marketing"
SERVICE_NAME="roko-marketing"
BUILD_MEMORY="4096"

# Logging
log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as correct user
check_user() {
    if [ "$EUID" -eq 0 ]; then
        log_error "This script should not be run as root"
        exit 1
    fi
}

# Setup application directory
setup_directory() {
    log_info "Setting up application directory..."

    if [ ! -d "$APP_DIR" ]; then
        sudo mkdir -p "$APP_DIR"
        sudo chown -R $USER:$USER "$APP_DIR"
    fi

    cd "$APP_DIR"
}

# Update code from repository
update_code() {
    log_info "Updating code from repository..."

    if [ ! -d ".git" ]; then
        log_info "Cloning repository..."
        git clone https://github.com/Roko-Network/roko-marketing.git .
    else
        log_info "Fetching latest changes..."
        git fetch origin
        git reset --hard origin/master
    fi
}

# Install dependencies
install_deps() {
    log_info "Installing Node.js dependencies..."

    # Clean install for production
    rm -rf node_modules package-lock.json
    npm ci --prefer-offline
}

# Build application
build_app() {
    log_info "Building application..."

    # Set memory limit for build
    export NODE_OPTIONS="--max-old-space-size=$BUILD_MEMORY"

    # Run production build
    npm run build

    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
        exit 1
    fi

    log_info "Build completed successfully"
}

# Setup nginx configuration
setup_nginx() {
    log_info "Setting up nginx configuration..."

    # Create nginx config if it doesn't exist
    if [ ! -f "$NGINX_CONFIG" ]; then
        log_info "Creating nginx configuration..."

        sudo tee "$NGINX_CONFIG" > /dev/null <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name roko.network www.roko.network;

    # Redirect to HTTPS
    return 301 https://\$server_name\$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name roko.network www.roko.network;

    # SSL configuration (update paths as needed)
    ssl_certificate /etc/ssl/certs/roko.network.crt;
    ssl_certificate_key /etc/ssl/private/roko.network.key;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

    # Root directory
    root $APP_DIR/dist;
    index index.html;

    # Gzip
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files \$uri \$uri/ /index.html;
    }

    # Security: Deny access to hidden files
    location ~ /\. {
        deny all;
    }
}
EOF

        # Enable the site
        sudo ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/
    fi

    # Test nginx configuration
    sudo nginx -t

    # Reload nginx
    sudo systemctl reload nginx

    log_info "Nginx configuration updated"
}

# Create systemd service for monitoring
setup_service() {
    log_info "Setting up systemd service..."

    if [ ! -f "/etc/systemd/system/${SERVICE_NAME}.service" ]; then
        sudo tee "/etc/systemd/system/${SERVICE_NAME}.service" > /dev/null <<EOF
[Unit]
Description=ROKO Marketing Site
After=network.target

[Service]
Type=simple
User=$USER
WorkingDirectory=$APP_DIR
ExecStart=/usr/bin/npm run preview
Restart=on-failure
RestartSec=10
StandardOutput=append:/var/log/${SERVICE_NAME}.log
StandardError=append:/var/log/${SERVICE_NAME}.error.log

[Install]
WantedBy=multi-user.target
EOF

        sudo systemctl daemon-reload
        sudo systemctl enable "${SERVICE_NAME}.service"
    fi
}

# Backup current deployment
backup_deployment() {
    log_info "Backing up current deployment..."

    if [ -d "dist" ]; then
        BACKUP_DIR="/var/backups/roko-marketing"
        sudo mkdir -p "$BACKUP_DIR"

        BACKUP_FILE="$BACKUP_DIR/backup-$(date +'%Y%m%d-%H%M%S').tar.gz"
        sudo tar -czf "$BACKUP_FILE" dist/

        log_info "Backup created: $BACKUP_FILE"

        # Keep only last 3 backups
        ls -t "$BACKUP_DIR"/backup-*.tar.gz | tail -n +4 | xargs -r sudo rm
    fi
}

# Health check
health_check() {
    log_info "Running health check..."

    sleep 3

    response=$(curl -s -o /dev/null -w "%{http_code}" http://localhost || echo "000")

    if [ "$response" = "200" ] || [ "$response" = "304" ]; then
        log_info "Health check passed (HTTP $response)"
        return 0
    else
        log_error "Health check failed (HTTP $response)"
        return 1
    fi
}

# Rollback to previous version
rollback() {
    log_warn "Initiating rollback..."

    BACKUP_DIR="/var/backups/roko-marketing"
    PREV_BACKUP=$(ls -t "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | head -n 1)

    if [ -z "$PREV_BACKUP" ]; then
        log_error "No backup available for rollback"
        exit 1
    fi

    log_info "Rolling back to: $PREV_BACKUP"
    sudo tar -xzf "$PREV_BACKUP" -C "$APP_DIR/"

    sudo nginx -t && sudo systemctl reload nginx

    log_info "Rollback completed"
}

# Main deployment flow
main() {
    log_info "Starting deployment process..."

    check_user
    setup_directory

    # Backup before deployment
    backup_deployment

    # Deploy new version
    update_code
    install_deps
    build_app
    setup_nginx
    setup_service

    # Verify deployment
    if health_check; then
        log_info "Deployment completed successfully!"
    else
        log_error "Deployment failed, initiating rollback..."
        rollback
        exit 1
    fi
}

# Handle script arguments
case "${1:-deploy}" in
    deploy)
        main
        ;;
    rollback)
        check_user
        setup_directory
        rollback
        ;;
    health)
        health_check
        ;;
    backup)
        check_user
        setup_directory
        backup_deployment
        ;;
    *)
        echo "Usage: $0 {deploy|rollback|health|backup}"
        exit 1
        ;;
esac