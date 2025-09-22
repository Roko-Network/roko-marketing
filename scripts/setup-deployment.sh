#!/bin/bash

# ROKO Marketing - One-Time Deployment System Setup
# Run this ONCE with sudo to configure permissions for sudo-free operation

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
DEPLOY_USER="${SUDO_USER:-$USER}"
DEPLOY_GROUP="${SUDO_USER:-$USER}"
SERVICE_NAME="roko-deploy-watcher"

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_header() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Check if running with sudo
check_sudo() {
    if [ "$EUID" -ne 0 ]; then
        log_error "This setup script must be run with sudo"
        echo "Usage: sudo ./scripts/setup-deployment.sh"
        exit 1
    fi

    if [ -z "$SUDO_USER" ]; then
        log_warn "Could not detect original user, using current user"
    else
        log_info "Setting up for user: $SUDO_USER"
    fi
}

# Create required directories
create_directories() {
    log_header "Creating Required Directories"

    # State and config directory
    log_info "Creating /var/lib/roko-marketing..."
    mkdir -p /var/lib/roko-marketing
    chown -R "$DEPLOY_USER:$DEPLOY_GROUP" /var/lib/roko-marketing
    chmod 755 /var/lib/roko-marketing

    # Backup directory
    log_info "Creating /var/backups/roko-marketing..."
    mkdir -p /var/backups/roko-marketing
    chown -R "$DEPLOY_USER:$DEPLOY_GROUP" /var/backups/roko-marketing
    chmod 755 /var/backups/roko-marketing

    # Systemd override directory
    log_info "Creating systemd override directory..."
    mkdir -p "/etc/systemd/system/${SERVICE_NAME}.service.d"
    chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "/etc/systemd/system/${SERVICE_NAME}.service.d"
    chmod 755 "/etc/systemd/system/${SERVICE_NAME}.service.d"

    # Lock file will be in /var/lib/roko-marketing (already created above)
    # No need for /var/run permissions anymore
    log_info "Lock file will be created in /var/lib/roko-marketing/"

    # Application directories (if not exist)
    log_info "Ensuring application directories exist..."
    sudo -u "$DEPLOY_USER" mkdir -p "/home/$DEPLOY_USER/roko-marketing"
    sudo -u "$DEPLOY_USER" mkdir -p "/home/$DEPLOY_USER/production-deploy/roko-marketing"

    log_info "✅ Directories created with proper permissions"
}

# Initialize configuration files
initialize_configs() {
    log_header "Initializing Configuration Files"

    # Deploy config
    if [ ! -f "/var/lib/roko-marketing/deploy-config" ]; then
        log_info "Creating deploy-config..."
        cat > /var/lib/roko-marketing/deploy-config <<EOF
# ROKO Marketing Deployment Configuration
# Generated: $(date)
DEPLOY_BRANCH="master"
EOF
        chown "$DEPLOY_USER:$DEPLOY_GROUP" /var/lib/roko-marketing/deploy-config
        chmod 644 /var/lib/roko-marketing/deploy-config
    else
        log_info "deploy-config already exists, skipping"
    fi

    # Last deployed SHA
    if [ ! -f "/var/lib/roko-marketing/last-deployed-sha" ]; then
        log_info "Creating last-deployed-sha..."
        echo "none" > /var/lib/roko-marketing/last-deployed-sha
        chown "$DEPLOY_USER:$DEPLOY_GROUP" /var/lib/roko-marketing/last-deployed-sha
        chmod 644 /var/lib/roko-marketing/last-deployed-sha
    fi

    # Last deployed branch
    if [ ! -f "/var/lib/roko-marketing/last-deployed-branch" ]; then
        log_info "Creating last-deployed-branch..."
        echo "master" > /var/lib/roko-marketing/last-deployed-branch
        chown "$DEPLOY_USER:$DEPLOY_GROUP" /var/lib/roko-marketing/last-deployed-branch
        chmod 644 /var/lib/roko-marketing/last-deployed-branch
    fi

    log_info "✅ Configuration files initialized"
}

# Setup sudoers for service management
setup_sudoers() {
    log_header "Configuring Sudo Permissions"

    local SUDOERS_FILE="/etc/sudoers.d/roko-deploy"

    log_info "Creating sudoers configuration..."
    cat > "$SUDOERS_FILE" <<EOF
# ROKO Marketing Deployment - Service Management
# Allows $DEPLOY_USER to manage deployment service without password

# Service management commands
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl start $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl stop $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl status $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl reset-failed $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl daemon-reload
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/systemctl is-active $SERVICE_NAME
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/journalctl -u $SERVICE_NAME *
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/journalctl -xeu $SERVICE_NAME *

# File operations for deployment
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tee /var/lib/roko-marketing/deploy-config
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tee /var/lib/roko-marketing/last-deployed-sha
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tee /etc/systemd/system/${SERVICE_NAME}.service.d/branch.conf
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/sed -i * /etc/systemd/system/${SERVICE_NAME}.service

# Directory operations
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/mkdir -p /var/lib/roko-marketing
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/mkdir -p /var/backups/roko-marketing
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/mkdir -p /etc/systemd/system/${SERVICE_NAME}.service.d
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/chown -R $DEPLOY_USER\:$DEPLOY_GROUP /var/lib/roko-marketing
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/chown -R $DEPLOY_USER\:$DEPLOY_GROUP /var/backups/roko-marketing
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/rm -f /var/backups/roko-marketing/*

# Backup operations
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tar -czf /var/backups/roko-marketing/* *
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tar -xzf /var/backups/roko-marketing/* *
$DEPLOY_USER ALL=(ALL) NOPASSWD: /usr/bin/tar *
EOF

    # Validate sudoers file
    if visudo -c -f "$SUDOERS_FILE"; then
        chmod 440 "$SUDOERS_FILE"
        log_info "✅ Sudoers configuration validated and installed"
    else
        log_error "Sudoers configuration validation failed!"
        rm -f "$SUDOERS_FILE"
        exit 1
    fi
}

# Install systemd service
install_service() {
    log_header "Installing Systemd Service"

    local SERVICE_FILE="/etc/systemd/system/${SERVICE_NAME}.service"
    local SCRIPT_PATH="/home/$DEPLOY_USER/roko-marketing/scripts/deploy-watcher.sh"

    if [ -f "$SERVICE_FILE" ]; then
        log_info "Service already exists, skipping installation"
        return
    fi

    log_info "Creating systemd service..."
    cat > "$SERVICE_FILE" <<EOF
[Unit]
Description=ROKO Marketing Deployment Watcher
Documentation=https://github.com/Roko-Network/roko-marketing
After=network.target

[Service]
Type=simple
User=$DEPLOY_USER
Group=$DEPLOY_GROUP
WorkingDirectory=/home/$DEPLOY_USER/roko-marketing

# Script to execute
ExecStart=$SCRIPT_PATH watch

# Environment variables
Environment="NODE_ENV=production"
Environment="APP_DIR=/home/$DEPLOY_USER/roko-marketing"
Environment="DEPLOY_DIR=/home/$DEPLOY_USER/production-deploy/roko-marketing"
Environment="DEPLOY_BRANCH=master"
Environment="CHECK_INTERVAL=600"
Environment="LOG_FILE=/home/$DEPLOY_USER/roko-marketing/deploy.log"

# Restart policy
Restart=always
RestartSec=30
StartLimitInterval=400
StartLimitBurst=3

# Logging
StandardOutput=journal
StandardError=journal
SyslogIdentifier=roko-deploy

# Resource limits
MemoryLimit=2G
CPUQuota=50%

# Security hardening
# NoNewPrivileges=true removed - prevents sudo from working
PrivateTmp=true
ProtectSystem=strict
ProtectHome=false
ReadWritePaths=/home/$DEPLOY_USER/roko-marketing /home/$DEPLOY_USER/production-deploy /var/lib/roko-marketing /var/backups/roko-marketing

[Install]
WantedBy=multi-user.target
EOF

    # Reload systemd
    systemctl daemon-reload

    # Enable service
    systemctl enable "$SERVICE_NAME"

    log_info "✅ Systemd service installed and enabled"
}

# Verify Docker and Caddy
verify_dependencies() {
    log_header "Verifying Dependencies"

    # Check Docker
    if command -v docker &> /dev/null; then
        log_info "✅ Docker is installed"

        # Check if user is in docker group
        if groups "$DEPLOY_USER" | grep -q docker; then
            log_info "✅ User $DEPLOY_USER is in docker group"
        else
            log_warn "Adding $DEPLOY_USER to docker group..."
            usermod -aG docker "$DEPLOY_USER"
            log_warn "⚠️  User must log out and back in for docker group to take effect"
        fi
    else
        log_error "❌ Docker is not installed"
        echo "Please install Docker first:"
        echo "  sudo apt-get update && sudo apt-get install -y docker.io docker-compose"
        exit 1
    fi

    # Check Node.js
    if command -v node &> /dev/null; then
        local NODE_VERSION=$(node -v)
        log_info "✅ Node.js is installed: $NODE_VERSION"
    else
        log_error "❌ Node.js is not installed"
        echo "Please install Node.js first:"
        echo "  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -"
        echo "  sudo apt-get install -y nodejs"
        exit 1
    fi

    # Check Git
    if command -v git &> /dev/null; then
        log_info "✅ Git is installed"
    else
        log_error "❌ Git is not installed"
        echo "Please install Git first:"
        echo "  sudo apt-get install -y git"
        exit 1
    fi
}

# Final setup steps
final_setup() {
    log_header "Final Setup"

    # Check if Caddy is running
    if docker ps | grep -q roko-marketing-server; then
        log_info "✅ Caddy container is running"
    else
        log_warn "Caddy container not running. Start it with:"
        echo "  cd /home/$DEPLOY_USER/roko-marketing"
        echo "  docker-compose -f docker-compose.caddy.yml up -d"
    fi

    # Set script permissions
    if [ -f "/home/$DEPLOY_USER/roko-marketing/scripts/deploy-watcher.sh" ]; then
        chmod +x "/home/$DEPLOY_USER/roko-marketing/scripts/deploy-watcher.sh"
        chmod +x "/home/$DEPLOY_USER/roko-marketing/scripts/deploy-branch.sh"
        chown -R "$DEPLOY_USER:$DEPLOY_GROUP" "/home/$DEPLOY_USER/roko-marketing/scripts"
        log_info "✅ Script permissions set"
    fi

    log_header "Setup Complete!"

    echo ""
    echo "✅ Deployment system is configured for sudo-free operation!"
    echo ""
    echo "The following commands can now be run WITHOUT sudo by $DEPLOY_USER:"
    echo ""
    echo "  📁 Branch Management:"
    echo "     ./scripts/deploy-branch.sh status      # Check current branch"
    echo "     ./scripts/deploy-branch.sh list        # List available branches"
    echo "     ./scripts/deploy-branch.sh switch dev  # Switch to dev branch"
    echo "     ./scripts/deploy-branch.sh recovery    # Emergency recovery"
    echo ""
    echo "  🔄 Service Control:"
    echo "     systemctl status roko-deploy-watcher   # Check service status"
    echo "     sudo systemctl restart roko-deploy-watcher  # Restart (passwordless)"
    echo ""
    echo "  🚀 Manual Deployment:"
    echo "     ./scripts/deploy-watcher.sh check      # Deploy now"
    echo "     ./scripts/deploy-watcher.sh status     # Check deployment"
    echo ""
    echo "  📝 View Logs:"
    echo "     journalctl -u roko-deploy-watcher -f   # Live logs"
    echo "     tail -f ~/roko-marketing/deploy.log    # Deploy logs"
    echo ""

    if [ -n "$SUDO_USER" ]; then
        echo "⚠️  IMPORTANT: User $SUDO_USER must log out and back in if docker group was added"
    fi
    echo ""
    echo "To start the deployment service:"
    echo "  sudo systemctl start roko-deploy-watcher"
    echo ""
}

# Main execution
main() {
    log_header "ROKO Marketing Deployment Setup"

    check_sudo
    verify_dependencies
    create_directories
    initialize_configs
    setup_sudoers
    install_service
    final_setup
}

# Run main function
main "$@"