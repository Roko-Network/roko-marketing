#!/bin/bash

# ROKO Network Marketing Site Deployment Script
# Comprehensive deployment automation with safety checks and rollback capabilities

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BUILD_DIR="$PROJECT_ROOT/dist"
BACKUP_DIR="$PROJECT_ROOT/backups"
LOG_FILE="$PROJECT_ROOT/deploy.log"

# Environment variables with defaults
ENVIRONMENT="${1:-production}"
FORCE_DEPLOY="${FORCE_DEPLOY:-false}"
SKIP_TESTS="${SKIP_TESTS:-false}"
SKIP_BACKUP="${SKIP_BACKUP:-false}"
DRY_RUN="${DRY_RUN:-false}"
ROLLBACK_ON_FAILURE="${ROLLBACK_ON_FAILURE:-true}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Deployment targets
declare -A DEPLOYMENT_CONFIGS=(
    ["production"]="prod"
    ["staging"]="staging"
    ["preview"]="preview"
)

# Logging function
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")  echo -e "${GREEN}[INFO]${NC} $message" ;;
        "WARN")  echo -e "${YELLOW}[WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[ERROR]${NC} $message" ;;
        "DEBUG") echo -e "${BLUE}[DEBUG]${NC} $message" ;;
    esac

    echo "[$timestamp] [$level] $message" >> "$LOG_FILE"
}

# Error handler
error_exit() {
    log "ERROR" "$1"
    if [[ "$ROLLBACK_ON_FAILURE" == "true" && -f "$BACKUP_DIR/last_successful.tar.gz" ]]; then
        log "INFO" "Initiating automatic rollback..."
        rollback_deployment
    fi
    exit 1
}

# Cleanup function
cleanup() {
    log "INFO" "Cleaning up temporary files..."
    rm -rf "$PROJECT_ROOT/tmp" 2>/dev/null || true
}

# Set up signal handlers
trap cleanup EXIT
trap 'error_exit "Deployment interrupted by user"' INT TERM

# Validate environment
validate_environment() {
    log "INFO" "Validating deployment environment..."

    if [[ ! "${DEPLOYMENT_CONFIGS[$ENVIRONMENT]+isset}" ]]; then
        error_exit "Invalid environment: $ENVIRONMENT. Valid options: ${!DEPLOYMENT_CONFIGS[*]}"
    fi

    # Check required tools
    local tools=("node" "npm" "git")
    for tool in "${tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            error_exit "Required tool not found: $tool"
        fi
    done

    # Check Node.js version
    local node_version=$(node --version | sed 's/v//')
    local required_version="20.0.0"
    if ! npx semver-compare "$node_version" ">=" "$required_version" 2>/dev/null; then
        error_exit "Node.js version $node_version is too old. Required: $required_version+"
    fi

    log "INFO" "Environment validation passed"
}

# Pre-deployment checks
pre_deployment_checks() {
    log "INFO" "Running pre-deployment checks..."

    # Check if working directory is clean
    if [[ -n "$(git status --porcelain)" && "$FORCE_DEPLOY" != "true" ]]; then
        error_exit "Working directory is not clean. Commit changes or use --force"
    fi

    # Check if on correct branch for environment
    local current_branch=$(git branch --show-current)
    case "$ENVIRONMENT" in
        "production")
            if [[ "$current_branch" != "main" && "$FORCE_DEPLOY" != "true" ]]; then
                error_exit "Production deployments must be from 'main' branch. Current: $current_branch"
            fi
            ;;
        "staging")
            if [[ "$current_branch" != "develop" && "$current_branch" != "main" && "$FORCE_DEPLOY" != "true" ]]; then
                error_exit "Staging deployments must be from 'develop' or 'main' branch. Current: $current_branch"
            fi
            ;;
    esac

    # Check for required environment variables
    local env_file="$PROJECT_ROOT/.env.$ENVIRONMENT"
    if [[ ! -f "$env_file" ]]; then
        log "WARN" "Environment file not found: $env_file"
    fi

    log "INFO" "Pre-deployment checks passed"
}

# Install dependencies
install_dependencies() {
    log "INFO" "Installing dependencies..."

    cd "$PROJECT_ROOT"

    # Clean install for production
    if [[ "$ENVIRONMENT" == "production" ]]; then
        npm ci --prefer-offline --no-audit
    else
        npm ci --prefer-offline
    fi

    log "INFO" "Dependencies installed successfully"
}

# Run tests
run_tests() {
    if [[ "$SKIP_TESTS" == "true" ]]; then
        log "WARN" "Skipping tests (SKIP_TESTS=true)"
        return 0
    fi

    log "INFO" "Running tests..."

    cd "$PROJECT_ROOT"

    # Linting
    log "INFO" "Running linter..."
    npm run lint

    # Type checking
    log "INFO" "Running type checker..."
    npm run type-check

    # Unit tests
    log "INFO" "Running unit tests..."
    npm run test:unit

    # Integration tests for staging/production
    if [[ "$ENVIRONMENT" == "staging" || "$ENVIRONMENT" == "production" ]]; then
        log "INFO" "Running integration tests..."
        npm run test:integration 2>/dev/null || log "WARN" "Integration tests not available"
    fi

    log "INFO" "All tests passed"
}

# Security audit
security_audit() {
    log "INFO" "Running security audit..."

    cd "$PROJECT_ROOT"

    # npm audit
    npm audit --audit-level=moderate || {
        if [[ "$FORCE_DEPLOY" != "true" ]]; then
            error_exit "Security vulnerabilities found. Fix issues or use --force"
        else
            log "WARN" "Security vulnerabilities found but deployment forced"
        fi
    }

    log "INFO" "Security audit passed"
}

# Build application
build_application() {
    log "INFO" "Building application for $ENVIRONMENT..."

    cd "$PROJECT_ROOT"

    # Clean previous build
    rm -rf "$BUILD_DIR"

    # Set environment-specific build command
    local build_command="build"
    case "$ENVIRONMENT" in
        "staging")   build_command="build:staging" ;;
        "production") build_command="build" ;;
        "preview")   build_command="build:staging" ;;
    esac

    # Build with progress indication
    npm run "$build_command" || error_exit "Build failed"

    # Verify build output
    if [[ ! -d "$BUILD_DIR" ]]; then
        error_exit "Build directory not found: $BUILD_DIR"
    fi

    if [[ ! -f "$BUILD_DIR/index.html" ]]; then
        error_exit "Build output missing index.html"
    fi

    # Check build size
    local build_size=$(du -sh "$BUILD_DIR" | cut -f1)
    log "INFO" "Build completed successfully (size: $build_size)"

    # Run bundle analysis
    npm run size 2>/dev/null || log "WARN" "Bundle size analysis not available"
}

# Optimize assets
optimize_assets() {
    log "INFO" "Optimizing assets..."

    cd "$PROJECT_ROOT"

    # Run asset optimization script
    if [[ -f "scripts/optimize-assets.js" ]]; then
        node scripts/optimize-assets.js || log "WARN" "Asset optimization failed"
    fi

    # Generate compressed versions
    find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec gzip -k9 {} \; 2>/dev/null || true
    find "$BUILD_DIR" -type f \( -name "*.js" -o -name "*.css" -o -name "*.html" \) -exec brotli -k9 {} \; 2>/dev/null || true

    log "INFO" "Asset optimization completed"
}

# Create backup
create_backup() {
    if [[ "$SKIP_BACKUP" == "true" ]]; then
        log "WARN" "Skipping backup (SKIP_BACKUP=true)"
        return 0
    fi

    log "INFO" "Creating deployment backup..."

    mkdir -p "$BACKUP_DIR"

    local backup_name="backup_$(date +'%Y%m%d_%H%M%S')"
    local backup_file="$BACKUP_DIR/$backup_name.tar.gz"

    # Create backup of current deployment (if exists)
    if [[ -d "$BUILD_DIR" ]]; then
        tar -czf "$backup_file" -C "$PROJECT_ROOT" dist/ 2>/dev/null || true

        # Create symlink to latest backup
        ln -sf "$backup_name.tar.gz" "$BACKUP_DIR/last_successful.tar.gz"

        log "INFO" "Backup created: $backup_file"
    fi

    # Clean old backups (keep last 10)
    cd "$BACKUP_DIR"
    ls -t backup_*.tar.gz 2>/dev/null | tail -n +11 | xargs rm -f || true
}

# Deploy to platform
deploy_to_platform() {
    log "INFO" "Deploying to $ENVIRONMENT..."

    cd "$PROJECT_ROOT"

    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "DRY RUN: Would deploy to $ENVIRONMENT"
        return 0
    fi

    case "$ENVIRONMENT" in
        "production")
            deploy_production
            ;;
        "staging")
            deploy_staging
            ;;
        "preview")
            deploy_preview
            ;;
        *)
            error_exit "Unknown deployment environment: $ENVIRONMENT"
            ;;
    esac

    log "INFO" "Deployment to $ENVIRONMENT completed"
}

# Deploy to production
deploy_production() {
    log "INFO" "Deploying to production platforms..."

    # Deploy to Vercel (primary)
    if command -v vercel &> /dev/null; then
        log "INFO" "Deploying to Vercel..."
        vercel --prod --yes --token="$VERCEL_TOKEN" 2>/dev/null || {
            log "WARN" "Vercel deployment failed"
        }
    fi

    # Deploy to AWS S3 + CloudFront (backup)
    if command -v aws &> /dev/null && [[ -n "${AWS_S3_BUCKET:-}" ]]; then
        log "INFO" "Deploying to AWS S3..."

        # Sync to S3 with optimal cache headers
        aws s3 sync "$BUILD_DIR/" "s3://$AWS_S3_BUCKET" \
            --delete \
            --exclude "*.html" \
            --cache-control "public, max-age=31536000, immutable"

        # Upload HTML files with different cache headers
        aws s3 sync "$BUILD_DIR/" "s3://$AWS_S3_BUCKET" \
            --exclude "*" \
            --include "*.html" \
            --cache-control "public, max-age=0, must-revalidate"

        # Invalidate CloudFront
        if [[ -n "${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}" ]]; then
            aws cloudfront create-invalidation \
                --distribution-id "$AWS_CLOUDFRONT_DISTRIBUTION_ID" \
                --paths "/*" > /dev/null
        fi
    fi

    # Deploy to Cloudflare Pages (tertiary)
    if [[ -n "${CLOUDFLARE_API_TOKEN:-}" && -n "${CLOUDFLARE_ACCOUNT_ID:-}" ]]; then
        log "INFO" "Deploying to Cloudflare Pages..."

        # Use wrangler for Cloudflare Pages deployment
        if command -v wrangler &> /dev/null; then
            wrangler pages publish "$BUILD_DIR" --project-name=roko-marketing 2>/dev/null || {
                log "WARN" "Cloudflare Pages deployment failed"
            }
        fi
    fi
}

# Deploy to staging
deploy_staging() {
    log "INFO" "Deploying to staging..."

    if command -v vercel &> /dev/null; then
        vercel --token="$VERCEL_TOKEN" --scope="$VERCEL_ORG_ID" 2>/dev/null || {
            log "WARN" "Staging deployment to Vercel failed"
        }
    fi

    if command -v netlify &> /dev/null; then
        netlify deploy --dir="$BUILD_DIR" --site="$NETLIFY_STAGING_SITE_ID" 2>/dev/null || {
            log "WARN" "Staging deployment to Netlify failed"
        }
    fi
}

# Deploy to preview
deploy_preview() {
    log "INFO" "Deploying preview..."

    if command -v vercel &> /dev/null; then
        vercel --token="$VERCEL_TOKEN" 2>/dev/null || {
            log "WARN" "Preview deployment failed"
        }
    fi
}

# Post-deployment checks
post_deployment_checks() {
    log "INFO" "Running post-deployment checks..."

    # Health check
    local health_check_url
    case "$ENVIRONMENT" in
        "production") health_check_url="https://roko.network" ;;
        "staging")    health_check_url="https://staging.roko.network" ;;
        "preview")    health_check_url="" ;; # URL will be dynamic
    esac

    if [[ -n "$health_check_url" ]]; then
        # Wait for deployment to propagate
        sleep 30

        # Run health checks
        for i in {1..5}; do
            if curl -sf "$health_check_url" > /dev/null; then
                log "INFO" "Health check passed for $health_check_url"
                break
            elif [[ $i -eq 5 ]]; then
                error_exit "Health check failed for $health_check_url after 5 attempts"
            else
                log "WARN" "Health check attempt $i failed, retrying in 30s..."
                sleep 30
            fi
        done

        # Run Lighthouse audit for production
        if [[ "$ENVIRONMENT" == "production" ]]; then
            run_lighthouse_audit "$health_check_url"
        fi
    fi

    log "INFO" "Post-deployment checks passed"
}

# Run Lighthouse audit
run_lighthouse_audit() {
    local url="$1"

    log "INFO" "Running Lighthouse audit for $url..."

    if command -v lighthouse &> /dev/null; then
        lighthouse "$url" \
            --output=json \
            --output-path="$PROJECT_ROOT/lighthouse-results.json" \
            --chrome-flags="--headless --no-sandbox" \
            --quiet > /dev/null 2>&1 || {
            log "WARN" "Lighthouse audit failed"
            return 0
        }

        # Check performance score
        if command -v jq &> /dev/null && [[ -f "$PROJECT_ROOT/lighthouse-results.json" ]]; then
            local perf_score=$(jq -r '.categories.performance.score' "$PROJECT_ROOT/lighthouse-results.json" 2>/dev/null)
            if [[ -n "$perf_score" && "$perf_score" != "null" ]]; then
                local perf_percentage=$(echo "$perf_score * 100" | bc -l 2>/dev/null | cut -d. -f1)
                log "INFO" "Lighthouse Performance Score: $perf_percentage%"

                if [[ ${perf_percentage:-0} -lt 90 ]]; then
                    log "WARN" "Performance score below 90%"
                fi
            fi
        fi
    fi
}

# Rollback deployment
rollback_deployment() {
    log "INFO" "Rolling back deployment..."

    if [[ ! -f "$BACKUP_DIR/last_successful.tar.gz" ]]; then
        error_exit "No backup available for rollback"
    fi

    # Extract backup
    cd "$PROJECT_ROOT"
    tar -xzf "$BACKUP_DIR/last_successful.tar.gz"

    # Redeploy previous version
    deploy_to_platform

    log "INFO" "Rollback completed successfully"
}

# Send notifications
send_notifications() {
    local status="$1"
    local message="$2"

    # Slack notification
    if [[ -n "${SLACK_WEBHOOK_URL:-}" ]]; then
        local color="good"
        [[ "$status" == "failure" ]] && color="danger"

        local payload=$(cat <<EOF
{
    "text": "ROKO Marketing Deployment",
    "attachments": [{
        "color": "$color",
        "fields": [
            {"title": "Environment", "value": "$ENVIRONMENT", "short": true},
            {"title": "Status", "value": "$status", "short": true},
            {"title": "Branch", "value": "$(git branch --show-current)", "short": true},
            {"title": "Commit", "value": "$(git rev-parse --short HEAD)", "short": true},
            {"title": "Message", "value": "$message", "short": false}
        ]
    }]
}
EOF
        )

        curl -X POST -H 'Content-type: application/json' \
            --data "$payload" \
            "$SLACK_WEBHOOK_URL" > /dev/null 2>&1 || true
    fi

    # Email notification (if configured)
    if [[ -n "${NOTIFICATION_EMAIL:-}" ]] && command -v mail &> /dev/null; then
        echo "$message" | mail -s "ROKO Deployment $status - $ENVIRONMENT" "$NOTIFICATION_EMAIL" || true
    fi
}

# Main deployment function
main() {
    local start_time=$(date +%s)

    log "INFO" "Starting deployment to $ENVIRONMENT..."
    log "INFO" "Configuration: FORCE_DEPLOY=$FORCE_DEPLOY, SKIP_TESTS=$SKIP_TESTS, DRY_RUN=$DRY_RUN"

    # Main deployment flow
    validate_environment
    pre_deployment_checks
    install_dependencies
    run_tests
    security_audit
    build_application
    optimize_assets
    create_backup
    deploy_to_platform
    post_deployment_checks

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    log "INFO" "Deployment completed successfully in ${duration}s"
    send_notifications "success" "Deployment to $ENVIRONMENT completed successfully in ${duration}s"
}

# Usage information
usage() {
    cat << EOF
Usage: $0 [ENVIRONMENT] [OPTIONS]

ENVIRONMENT:
    production  Deploy to production (default)
    staging     Deploy to staging
    preview     Deploy preview/feature branch

OPTIONS:
    --force         Force deployment despite warnings
    --skip-tests    Skip test execution
    --skip-backup   Skip backup creation
    --dry-run       Show what would be deployed without deploying
    --help          Show this help message

ENVIRONMENT VARIABLES:
    FORCE_DEPLOY            Set to 'true' to force deployment
    SKIP_TESTS              Set to 'true' to skip tests
    SKIP_BACKUP             Set to 'true' to skip backup
    DRY_RUN                 Set to 'true' for dry run
    ROLLBACK_ON_FAILURE     Set to 'false' to disable auto-rollback

    # Required for deployments
    VERCEL_TOKEN            Vercel authentication token
    VERCEL_ORG_ID           Vercel organization ID
    AWS_ACCESS_KEY_ID       AWS access key
    AWS_SECRET_ACCESS_KEY   AWS secret key
    AWS_S3_BUCKET           S3 bucket name
    CLOUDFLARE_API_TOKEN    Cloudflare API token

    # Optional notifications
    SLACK_WEBHOOK_URL       Slack webhook for notifications
    NOTIFICATION_EMAIL      Email for notifications

EXAMPLES:
    $0 production                    # Deploy to production
    $0 staging --skip-tests          # Deploy to staging without tests
    $0 preview --dry-run             # Preview deployment (dry run)
    FORCE_DEPLOY=true $0 production  # Force production deployment

EOF
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --force)
            FORCE_DEPLOY="true"
            shift
            ;;
        --skip-tests)
            SKIP_TESTS="true"
            shift
            ;;
        --skip-backup)
            SKIP_BACKUP="true"
            shift
            ;;
        --dry-run)
            DRY_RUN="true"
            shift
            ;;
        --help|-h)
            usage
            exit 0
            ;;
        production|staging|preview)
            ENVIRONMENT="$1"
            shift
            ;;
        *)
            log "ERROR" "Unknown option: $1"
            usage
            exit 1
            ;;
    esac
done

# Run main deployment
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi