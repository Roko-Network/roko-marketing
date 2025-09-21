#!/bin/bash

# ROKO Marketing - Git Repository Watcher and Auto-Deploy Script
# This script runs on the server and checks for updates to deploy automatically

set -e

# Load branch configuration if exists
CONFIG_FILE="/var/lib/roko-marketing/deploy-config"
if [ -f "$CONFIG_FILE" ]; then
    source "$CONFIG_FILE"
fi

# Configuration
APP_DIR="${APP_DIR:-/home/roctinam/roko-marketing}"  # Project source directory
DEPLOY_DIR="${DEPLOY_DIR:-/home/roctinam/production-deploy/roko-marketing}"  # Where Caddy serves from
REPO_URL="https://github.com/Roko-Network/roko-marketing.git"
BRANCH="${DEPLOY_BRANCH:-master}"  # Can be overridden by config file or environment
CHECK_INTERVAL="${CHECK_INTERVAL:-600}"  # 10 minutes default
LOG_FILE="${LOG_FILE:-/home/roctinam/roko-marketing/deploy.log}"
STATE_FILE="/var/lib/roko-marketing/last-deployed-sha"
STATE_BRANCH_FILE="/var/lib/roko-marketing/last-deployed-branch"
LOCK_FILE="/var/run/roko-deploy.lock"
BUILD_MEMORY="4096"

# Colors for output (when running interactively)
if [ -t 1 ]; then
    RED='\033[0;31m'
    GREEN='\033[0;32m'
    YELLOW='\033[1;33m'
    BLUE='\033[0;34m'
    NC='\033[0m'
else
    RED=''
    GREEN=''
    YELLOW=''
    BLUE=''
    NC=''
fi

# Logging functions
log_info() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] INFO: $1"
    echo -e "${GREEN}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

log_warn() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] WARN: $1"
    echo -e "${YELLOW}${msg}${NC}"
    echo "$msg" >> "$LOG_FILE"
}

log_error() {
    local msg="[$(date '+%Y-%m-%d %H:%M:%S')] ERROR: $1"
    echo -e "${RED}${msg}${NC}" >&2
    echo "$msg" >> "$LOG_FILE"
}

# Lock file management
acquire_lock() {
    local timeout=300  # 5 minutes
    local elapsed=0

    # Check if lock file exists and if the process is still running
    if [ -f "$LOCK_FILE" ]; then
        local lock_pid=$(cat "$LOCK_FILE" 2>/dev/null)
        if [ -n "$lock_pid" ] && ! kill -0 "$lock_pid" 2>/dev/null; then
            log_warn "Removing stale lock file from PID $lock_pid"
            rm -f "$LOCK_FILE"
        fi
    fi

    while [ -f "$LOCK_FILE" ] && [ $elapsed -lt $timeout ]; do
        log_warn "Waiting for existing deployment to complete..."
        sleep 10
        elapsed=$((elapsed + 10))
    done

    if [ -f "$LOCK_FILE" ]; then
        log_error "Could not acquire lock after ${timeout} seconds"
        log_error "If no deployment is running, remove lock with: rm $LOCK_FILE"
        return 1
    fi

    echo $$ > "$LOCK_FILE"
    trap 'rm -f "$LOCK_FILE"' EXIT
}

release_lock() {
    rm -f "$LOCK_FILE"
    trap - EXIT
}

# Initialize environment
init_environment() {
    # Create necessary directories
    mkdir -p "$APP_DIR"
    mkdir -p "$DEPLOY_DIR"
    sudo mkdir -p "$(dirname "$STATE_FILE")"
    mkdir -p "$(dirname "$LOG_FILE")"
    sudo mkdir -p /var/backups/roko-marketing
    mkdir -p "$APP_DIR/caddy_data" "$APP_DIR/caddy_config" "$APP_DIR/logs"

    # Set permissions
    sudo chown -R $USER:$USER "$(dirname "$STATE_FILE")"
    touch "$LOG_FILE"

    # Initialize state files if they don't exist
    if [ ! -f "$STATE_FILE" ]; then
        echo "none" > "$STATE_FILE"
    fi
    if [ ! -f "$STATE_BRANCH_FILE" ]; then
        echo "$BRANCH" > "$STATE_BRANCH_FILE"
    fi
}

# Get the current SHA from GitHub
get_remote_sha() {
    local sha=$(git ls-remote "$REPO_URL" "refs/heads/$BRANCH" 2>/dev/null | awk '{print $1}')

    if [ -z "$sha" ]; then
        log_error "Failed to get remote SHA for branch $BRANCH"
        return 1
    fi

    echo "$sha"
}

# Get the last deployed SHA
get_deployed_sha() {
    if [ -f "$STATE_FILE" ]; then
        cat "$STATE_FILE"
    else
        echo "none"
    fi
}

# Save the deployed SHA
save_deployed_sha() {
    local sha=$1
    echo "$sha" > "$STATE_FILE"
    log_info "Saved deployed SHA: $sha"
}

# Clone or update repository
update_repository() {
    cd "$APP_DIR"

    if [ ! -d ".git" ]; then
        log_info "Cloning repository for the first time..."
        git clone "$REPO_URL" .
        git checkout "$BRANCH"
    else
        log_info "Fetching latest changes..."
        git fetch origin
        git reset --hard "origin/$BRANCH"
        git clean -fd
    fi

    # Get current commit info
    local current_sha=$(git rev-parse HEAD)
    local commit_msg=$(git log -1 --pretty=%B)
    local author=$(git log -1 --pretty=%an)

    log_info "Current commit: $current_sha"
    log_info "Message: $commit_msg"
    log_info "Author: $author"
}

# Build the application
build_application() {
    cd "$APP_DIR"

    log_info "Installing dependencies..."
    npm ci --prefer-offline

    log_info "Building application..."
    export NODE_OPTIONS="--max-old-space-size=$BUILD_MEMORY"

    # Try to build with vite directly (matching deploy-static.sh approach)
    if ! npx vite build --mode production; then
        log_warn "Build failed, trying alternative method..."
        if ! VITE_DISABLE_PWA=1 npx vite build --mode production; then
            log_error "Build failed - all methods exhausted"
            return 1
        fi
    fi

    if [ ! -d "dist" ]; then
        log_error "Build failed - dist directory not found"
        return 1
    fi

    # Check build size
    local build_size=$(du -sh dist/ | awk '{print $1}')
    log_info "Build completed successfully. Size: $build_size"
}

# Create backup
create_backup() {
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A "$DEPLOY_DIR" 2>/dev/null)" ]; then
        local backup_name="backup-$(date +'%Y%m%d-%H%M%S')-${1:0:8}.tar.gz"
        local backup_path="/var/backups/roko-marketing/$backup_name"

        log_info "Creating backup: $backup_name"
        sudo tar -czf "$backup_path" -C "$(dirname "$DEPLOY_DIR")" "$(basename "$DEPLOY_DIR")"

        # Keep only last 5 backups
        ls -t /var/backups/roko-marketing/backup-*.tar.gz 2>/dev/null | tail -n +6 | xargs -r sudo rm

        log_info "Backup created successfully"
    else
        log_info "No existing deployment to backup"
    fi
}

# Deploy files to production directory
deploy_files() {
    log_info "Deploying files to production..."

    # Clear old files in deployment directory
    if [ -d "$DEPLOY_DIR" ] && [ "$(ls -A "$DEPLOY_DIR" 2>/dev/null)" ]; then
        log_info "Clearing old deployment files..."
        find "$DEPLOY_DIR" -mindepth 1 -delete 2>/dev/null || {
            log_warn "Could not clear some old files in $DEPLOY_DIR"
        }
    fi

    # Copy new files to deployment directory
    log_info "Copying new files to $DEPLOY_DIR..."
    cp -r "$APP_DIR/dist/"* "$DEPLOY_DIR/" || {
        log_error "Failed to copy files to deployment directory"
        return 1
    }

    # Set proper permissions
    find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
    find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;

    log_info "Files deployed successfully"

    # Note: Caddy automatically serves new files without restart!
    log_info "Caddy will automatically serve the updated files (no restart needed)"

    # Clear any CDN caches if configured
    if [ -n "$CF_ZONE_ID" ] && [ -n "$CF_API_TOKEN" ]; then
        log_info "Clearing Cloudflare cache..."
        curl -X POST "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/purge_cache" \
            -H "Authorization: Bearer $CF_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}' \
            -s -o /dev/null || true
    fi
}

# Health check
health_check() {
    log_info "Running health check..."

    local max_attempts=5
    local attempt=1
    local health_url="http://localhost:82/health"  # Caddy is on port 82

    while [ $attempt -le $max_attempts ]; do
        local response=$(curl -s -o /dev/null -w "%{http_code}" "$health_url" || echo "000")

        if [ "$response" = "200" ]; then
            log_info "Health check passed (HTTP $response)"

            # Also check if main site is accessible
            local site_response=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:82/" || echo "000")
            if [ "$site_response" = "200" ] || [ "$site_response" = "304" ]; then
                log_info "Site is accessible (HTTP $site_response)"
                return 0
            fi
        fi

        log_warn "Health check attempt $attempt failed (HTTP $response)"
        sleep 5
        attempt=$((attempt + 1))
    done

    log_error "Health check failed after $max_attempts attempts"
    return 1
}

# Rollback deployment
rollback() {
    log_error "Initiating rollback..."

    local latest_backup=$(ls -t /var/backups/roko-marketing/backup-*.tar.gz 2>/dev/null | head -n 1)

    if [ -z "$latest_backup" ]; then
        log_error "No backup available for rollback"
        return 1
    fi

    log_info "Rolling back to: $latest_backup"

    # Clear current deployment
    if [ -d "$DEPLOY_DIR" ]; then
        find "$DEPLOY_DIR" -mindepth 1 -delete 2>/dev/null || true
    fi

    # Restore backup to deployment directory
    sudo tar -xzf "$latest_backup" -C "$(dirname "$DEPLOY_DIR")"

    # Fix permissions
    find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
    find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;

    log_info "Rollback completed - Caddy will automatically serve restored files"
}

# Deploy new version
deploy() {
    local remote_sha=$1

    log_info "Starting deployment of $remote_sha"

    # Acquire deployment lock
    if ! acquire_lock; then
        log_error "Could not acquire deployment lock"
        return 1
    fi

    # Create backup of current deployment
    create_backup "$remote_sha"

    # Update repository
    if ! update_repository; then
        log_error "Failed to update repository"
        release_lock
        return 1
    fi

    # Build application
    if ! build_application; then
        log_error "Build failed, rolling back..."
        rollback
        release_lock
        return 1
    fi

    # Deploy files to production
    if ! deploy_files; then
        log_error "File deployment failed, rolling back..."
        rollback
        release_lock
        return 1
    fi

    # Health check
    if ! health_check; then
        log_error "Health check failed, rolling back..."
        rollback
        release_lock
        return 1
    fi

    # Save successful deployment
    save_deployed_sha "$remote_sha"

    log_info "Deployment completed successfully!"

    # Send notification if configured
    if [ -n "$SLACK_WEBHOOK" ]; then
        curl -X POST "$SLACK_WEBHOOK" \
            -H 'Content-Type: application/json' \
            -d "{\"text\":\"✅ ROKO Marketing deployed successfully\nVersion: ${remote_sha:0:8}\nBranch: $BRANCH\"}" \
            -s -o /dev/null || true
    fi

    release_lock
}

# Check for updates
check_for_updates() {
    # Check if branch has changed
    local last_branch=""
    if [ -f "$STATE_BRANCH_FILE" ]; then
        last_branch=$(cat "$STATE_BRANCH_FILE")
    fi

    if [ "$BRANCH" != "$last_branch" ]; then
        log_warn "Branch changed from '$last_branch' to '$BRANCH' - forcing update"
        echo "$BRANCH" > "$STATE_BRANCH_FILE"
        return 0
    fi

    local remote_sha=$(get_remote_sha)
    local deployed_sha=$(get_deployed_sha)

    if [ -z "$remote_sha" ]; then
        log_error "Could not get remote SHA for branch $BRANCH"
        return 1
    fi

    if [ "$remote_sha" != "$deployed_sha" ]; then
        log_info "New version detected on $BRANCH: ${remote_sha:0:8} (was: ${deployed_sha:0:8})"
        return 0
    else
        log_info "No updates available on $BRANCH (current: ${remote_sha:0:8})"
        return 1
    fi
}

# Continuous watching mode
watch_mode() {
    log_info "Starting deployment watcher..."
    log_info "Repository: $REPO_URL"
    log_info "Branch: $BRANCH"
    log_info "Check interval: ${CHECK_INTERVAL}s"
    log_info "App directory: $APP_DIR"

    while true; do
        if check_for_updates; then
            local remote_sha=$(get_remote_sha)
            deploy "$remote_sha"
        fi

        log_info "Sleeping for ${CHECK_INTERVAL} seconds..."
        sleep "$CHECK_INTERVAL"
    done
}

# Single check mode
single_check() {
    if check_for_updates; then
        local remote_sha=$(get_remote_sha)
        deploy "$remote_sha"
    else
        log_info "No deployment needed"
    fi
}

# Force deployment mode
force_deploy() {
    local remote_sha=$(get_remote_sha)
    log_info "Forcing deployment of $remote_sha"
    deploy "$remote_sha"
}

# Main script logic
main() {
    # Handle unlock before environment init (doesn't need full setup)
    if [ "${1:-}" = "unlock" ]; then
        if [ -f "$LOCK_FILE" ]; then
            echo "Removing lock file: $LOCK_FILE"
            rm -f "$LOCK_FILE"
            echo "Lock file removed"
        else
            echo "No lock file found"
        fi
        exit 0
    fi

    init_environment

    case "${1:-watch}" in
        watch)
            watch_mode
            ;;
        check)
            single_check
            ;;
        force)
            force_deploy
            ;;
        status)
            local deployed=$(get_deployed_sha)
            local remote=$(get_remote_sha)
            echo "Deployed SHA: ${deployed:0:8}"
            echo "Remote SHA: ${remote:0:8}"
            echo "Branch: $BRANCH"
            if [ "$deployed" = "$remote" ]; then
                echo "Status: Up to date"
            else
                echo "Status: Update available"
            fi
            if [ -f "$LOCK_FILE" ]; then
                local lock_pid=$(cat "$LOCK_FILE" 2>/dev/null)
                echo "Lock: Active (PID: $lock_pid)"
            else
                echo "Lock: None"
            fi
            ;;
        unlock)
            # Handled above
            ;;
        *)
            echo "Usage: $0 {watch|check|force|status|unlock}"
            echo ""
            echo "  watch  - Continuously watch for updates (default)"
            echo "  check  - Check once and deploy if needed"
            echo "  force  - Force deployment even if up to date"
            echo "  status - Show deployment status"
            echo "  unlock - Remove stale lock file"
            exit 1
            ;;
    esac
}

# Run main function
main "$@"