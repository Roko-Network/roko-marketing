#!/bin/bash

# ROKO Marketing - Branch Deployment Manager
# Easily switch deployment branch for testing or recovery

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="/var/lib/roko-marketing/deploy-config"
SERVICE_NAME="roko-deploy-watcher"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Logging functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_header() { echo -e "\n${BLUE}=== $1 ===${NC}\n"; }

# Show current configuration
show_status() {
    log_header "Current Deployment Configuration"

    # Get current branch from config or service
    if [ -f "$CONFIG_FILE" ]; then
        source "$CONFIG_FILE"
        current_branch="${DEPLOY_BRANCH:-master}"
    else
        current_branch=$(systemctl show -p Environment roko-deploy-watcher 2>/dev/null | grep DEPLOY_BRANCH | cut -d= -f3 || echo "master")
    fi

    echo -e "Deployment Branch: ${GREEN}$current_branch${NC}"
    echo "Configuration File: $CONFIG_FILE"

    # Check service status - first check if service exists
    if systemctl list-unit-files 2>/dev/null | grep -q "$SERVICE_NAME.service"; then
        if systemctl is-active --quiet "$SERVICE_NAME" 2>/dev/null; then
            echo -e "Service Status: ${GREEN}Active${NC}"
        else
            echo -e "Service Status: ${YELLOW}Inactive (stopped)${NC}"
        fi
    else
        echo -e "Service Status: ${RED}Not installed${NC}"
    fi

    # Show last deployment
    if [ -f "/var/lib/roko-marketing/last-deployed-sha" ]; then
        last_sha=$(cat /var/lib/roko-marketing/last-deployed-sha)
        echo "Last Deployed SHA: ${last_sha:0:8}"
    fi

    echo ""
}

# List available branches
list_branches() {
    log_header "Available Remote Branches"

    git ls-remote --heads https://github.com/Roko-Network/roko-marketing.git | \
        awk '{print $2}' | \
        sed 's|refs/heads/||' | \
        while read branch; do
            if [ "$branch" = "${current_branch:-master}" ]; then
                echo -e "  ${GREEN}→ $branch (current)${NC}"
            else
                echo "    $branch"
            fi
        done
    echo ""
}

# Switch deployment branch
switch_branch() {
    local new_branch=$1

    if [ -z "$new_branch" ]; then
        log_error "Branch name required"
        echo "Usage: $0 switch <branch-name>"
        exit 1
    fi

    log_header "Switching Deployment Branch"

    # Verify branch exists
    if ! git ls-remote --heads https://github.com/Roko-Network/roko-marketing.git | grep -q "refs/heads/$new_branch"; then
        log_error "Branch '$new_branch' does not exist in remote repository"
        echo "Use '$0 list' to see available branches"
        exit 1
    fi

    log_info "Switching from '${current_branch:-master}' to '$new_branch'"

    # Create config directory if needed
    if [ -w "$(dirname "$CONFIG_FILE")" ]; then
        # We have write permission, no sudo needed
        mkdir -p "$(dirname "$CONFIG_FILE")"
        cat > "$CONFIG_FILE" <<EOF
# ROKO Marketing Deployment Configuration
# Generated: $(date)
DEPLOY_BRANCH="$new_branch"
EOF
    else
        # Need sudo
        sudo mkdir -p "$(dirname "$CONFIG_FILE")"
        sudo tee "$CONFIG_FILE" > /dev/null <<EOF
# ROKO Marketing Deployment Configuration
# Generated: $(date)
DEPLOY_BRANCH="$new_branch"
EOF
    fi

    # Update systemd service if it exists
    if systemctl list-unit-files | grep -q "$SERVICE_NAME"; then
        log_info "Updating systemd service configuration..."

        # Create override directory
        OVERRIDE_DIR="/etc/systemd/system/${SERVICE_NAME}.service.d"
        OVERRIDE_FILE="$OVERRIDE_DIR/branch.conf"

        if [ -w "$OVERRIDE_DIR" ] 2>/dev/null; then
            # We have write permission, no sudo needed
            mkdir -p "$OVERRIDE_DIR"
            cat > "$OVERRIDE_FILE" <<EOF
[Service]
Environment="DEPLOY_BRANCH=$new_branch"
EOF
        else
            # Need sudo
            sudo mkdir -p "$OVERRIDE_DIR"
            sudo tee "$OVERRIDE_FILE" > /dev/null <<EOF
[Service]
Environment="DEPLOY_BRANCH=$new_branch"
EOF
        fi

        # Reload systemd and restart service
        sudo systemctl daemon-reload

        if systemctl is-active --quiet "$SERVICE_NAME"; then
            log_info "Restarting deployment service..."
            sudo systemctl restart "$SERVICE_NAME"
            sleep 2

            if systemctl is-active --quiet "$SERVICE_NAME"; then
                log_info "Service restarted successfully"
            else
                log_error "Service failed to restart"
                sudo journalctl -u "$SERVICE_NAME" -n 20
            fi
        fi
    fi

    # Force deployment of new branch
    read -p "Deploy new branch immediately? (y/N) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        log_info "Triggering immediate deployment..."

        # Reset last deployed SHA to force update
        if [ -w "/var/lib/roko-marketing/last-deployed-sha" ]; then
            echo "branch-switch" > /var/lib/roko-marketing/last-deployed-sha
        else
            echo "branch-switch" | sudo tee /var/lib/roko-marketing/last-deployed-sha > /dev/null
        fi

        if [ -x "$SCRIPT_DIR/deploy-watcher.sh" ]; then
            log_info "Running deployment..."
            "$SCRIPT_DIR/deploy-watcher.sh" force
        else
            log_warn "Manual trigger not available. Service will deploy on next check."
        fi
    else
        log_info "Branch switched. Will deploy on next automatic check (or run 'deploy-watcher.sh force')"
    fi

    log_info "Branch switch complete!"
}

# Quick switch to common branches
quick_switch() {
    local target=$1

    case "$target" in
        main|master)
            switch_branch "master"
            ;;
        develop|dev)
            switch_branch "develop"
            ;;
        staging|stage)
            switch_branch "staging"
            ;;
        *)
            log_error "Unknown quick target: $target"
            echo "Available: main, develop, staging"
            exit 1
            ;;
    esac
}

# Emergency recovery mode
recovery_mode() {
    log_header "Emergency Recovery Mode"

    log_warn "This will switch to the last known stable branch (master) and force deployment"
    read -p "Continue with recovery? (y/N) " -n 1 -r
    echo

    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        log_info "Recovery cancelled"
        exit 0
    fi

    # Switch to master
    switch_branch "master"

    # Force immediate deployment
    log_info "Forcing immediate deployment..."
    if [ -x "$SCRIPT_DIR/deploy-watcher.sh" ]; then
        "$SCRIPT_DIR/deploy-watcher.sh" force
    fi

    # Clear any caches
    log_info "Clearing caches..."
    if command -v docker &> /dev/null; then
        docker exec roko-marketing-server caddy reload --config /etc/caddy/Caddyfile 2>/dev/null || true
    fi

    log_info "Recovery complete!"
}

# Test deployment from branch
test_branch() {
    local test_branch=$1

    if [ -z "$test_branch" ]; then
        log_error "Branch name required"
        echo "Usage: $0 test <branch-name>"
        exit 1
    fi

    log_header "Test Deployment from Branch: $test_branch"

    log_info "This will temporarily deploy from '$test_branch' for testing"
    log_warn "Remember to switch back to your production branch after testing!"

    # Save current branch
    current_saved="${current_branch:-master}"
    echo "$current_saved" > /tmp/roko-deploy-saved-branch

    # Switch to test branch
    switch_branch "$test_branch"

    log_info "Test deployment active on branch: $test_branch"
    echo ""
    echo "When testing is complete, run:"
    echo "  $0 switch $current_saved"
    echo "Or use:"
    echo "  $0 restore"
}

# Restore previous branch
restore_branch() {
    if [ -f "/tmp/roko-deploy-saved-branch" ]; then
        saved_branch=$(cat /tmp/roko-deploy-saved-branch)
        log_info "Restoring branch: $saved_branch"
        switch_branch "$saved_branch"
        rm -f /tmp/roko-deploy-saved-branch
    else
        log_error "No saved branch configuration found"
        exit 1
    fi
}

# Main menu
show_help() {
    cat <<EOF
ROKO Marketing - Branch Deployment Manager

Usage: $0 [command] [options]

Commands:
  status              Show current deployment configuration
  list               List available remote branches
  switch <branch>    Switch deployment to specified branch
  test <branch>      Temporarily deploy from a test branch
  restore            Restore previously saved branch
  recovery           Emergency recovery (switch to master)

Quick Switches:
  main              Switch to master branch
  develop           Switch to develop branch
  staging           Switch to staging branch

Examples:
  $0 status                    # Show current configuration
  $0 list                      # List all available branches
  $0 switch feature/new-ui     # Deploy from feature branch
  $0 test hotfix/urgent-fix    # Test a hotfix branch
  $0 restore                   # Go back to previous branch
  $0 recovery                  # Emergency switch to master
  $0 main                      # Quick switch to master

Configuration:
  Branch config: $CONFIG_FILE
  Service name: $SERVICE_NAME

EOF
}

# Parse arguments
case "${1:-help}" in
    status|stat|s)
        show_status
        ;;
    list|ls|l)
        show_status
        list_branches
        ;;
    switch|sw)
        show_status
        switch_branch "$2"
        ;;
    test|t)
        test_branch "$2"
        ;;
    restore|r)
        restore_branch
        ;;
    recovery|recover|emergency)
        recovery_mode
        ;;
    main|master)
        quick_switch "main"
        ;;
    develop|dev)
        quick_switch "develop"
        ;;
    staging|stage)
        quick_switch "staging"
        ;;
    help|h|--help|-h)
        show_help
        ;;
    *)
        log_error "Unknown command: $1"
        show_help
        exit 1
        ;;
esac