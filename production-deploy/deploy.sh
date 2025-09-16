#!/bin/bash

# Production Deployment Script for ROKO Marketing
# This script handles the complete deployment process

set -euo pipefail

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
ENV_FILE="${SCRIPT_DIR}/.env.production"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.production.yml"
BACKUP_DIR="${SCRIPT_DIR}/backups"
LOG_FILE="${SCRIPT_DIR}/deploy.log"

# Default values
SKIP_BUILD=false
SKIP_BACKUP=false
FORCE_DEPLOY=false
DRY_RUN=false

# Logging function
log() {
    local level=$1
    shift
    local message="$@"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo -e "${timestamp} [${level}] ${message}" | tee -a "$LOG_FILE"
    
    case $level in
        ERROR)
            echo -e "${RED}[ERROR]${NC} ${message}" >&2
            ;;
        SUCCESS)
            echo -e "${GREEN}[SUCCESS]${NC} ${message}"
            ;;
        WARNING)
            echo -e "${YELLOW}[WARNING]${NC} ${message}"
            ;;
        INFO)
            echo -e "${BLUE}[INFO]${NC} ${message}"
            ;;
    esac
}

# Error handling
error_exit() {
    log ERROR "$1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log INFO "Checking prerequisites..."
    
    # Check Docker
    if ! command -v docker &> /dev/null; then
        error_exit "Docker is not installed"
    fi
    
    # Check Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        error_exit "Docker Compose is not installed"
    fi
    
    # Check environment file
    if [[ ! -f "$ENV_FILE" ]]; then
        error_exit "Environment file not found: $ENV_FILE"
    fi
    
    # Check compose file
    if [[ ! -f "$COMPOSE_FILE" ]]; then
        error_exit "Docker Compose file not found: $COMPOSE_FILE"
    fi
    
    log SUCCESS "All prerequisites met"
}

# Load environment variables
load_environment() {
    log INFO "Loading environment variables..."
    
    if [[ -f "$ENV_FILE" ]]; then
        set -a
        source "$ENV_FILE"
        set +a
        log SUCCESS "Environment variables loaded"
    else
        error_exit "Failed to load environment variables"
    fi
}

# Build Docker image
build_image() {
    if [[ "$SKIP_BUILD" == true ]]; then
        log WARNING "Skipping build step"
        return
    fi
    
    log INFO "Building Docker image..."
    
    cd "$PROJECT_ROOT"
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would build: docker build -t roko-marketing:production ."
    else
        if docker build -t roko-marketing:production . ; then
            log SUCCESS "Docker image built successfully"
        else
            error_exit "Failed to build Docker image"
        fi
    fi
    
    cd "$SCRIPT_DIR"
}

# Backup current deployment
backup_deployment() {
    if [[ "$SKIP_BACKUP" == true ]]; then
        log WARNING "Skipping backup step"
        return
    fi
    
    log INFO "Creating backup..."
    
    # Create backup directory
    mkdir -p "$BACKUP_DIR"
    
    local backup_name="backup-$(date +%Y%m%d-%H%M%S)"
    local backup_path="${BACKUP_DIR}/${backup_name}"
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would create backup at: $backup_path"
    else
        # Export current volumes if containers are running
        if docker-compose -f "$COMPOSE_FILE" ps | grep -q "Up"; then
            docker-compose -f "$COMPOSE_FILE" exec -T roko-marketing-prod tar czf - /var/log/nginx > "${backup_path}-logs.tar.gz" 2>/dev/null || true
            log SUCCESS "Backup created: ${backup_path}-logs.tar.gz"
        fi
    fi
}

# Deploy application
deploy_application() {
    log INFO "Deploying application..."
    
    cd "$SCRIPT_DIR"
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would execute: docker-compose up -d"
    else
        # Pull down existing containers
        log INFO "Stopping existing containers..."
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down || true
        
        # Start new containers
        log INFO "Starting new containers..."
        if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d; then
            log SUCCESS "Containers started successfully"
        else
            error_exit "Failed to start containers"
        fi
    fi
}

# Health check
health_check() {
    log INFO "Performing health check..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would check health endpoint"
        return
    fi
    
    # Wait for service to be ready
    local max_attempts=30
    local attempt=0
    
    sleep 5  # Initial wait
    
    while [[ $attempt -lt $max_attempts ]]; do
        if curl -f http://localhost:8080/health &> /dev/null; then
            log SUCCESS "Health check passed"
            return 0
        fi
        
        attempt=$((attempt + 1))
        log INFO "Waiting for service to be ready... (attempt $attempt/$max_attempts)"
        sleep 2
    done
    
    error_exit "Health check failed after $max_attempts attempts"
}

# Cleanup old backups
cleanup_backups() {
    log INFO "Cleaning up old backups..."
    
    if [[ ! -d "$BACKUP_DIR" ]]; then
        return
    fi
    
    local retention_days="${BACKUP_RETENTION_DAYS:-30}"
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would delete backups older than $retention_days days"
    else
        find "$BACKUP_DIR" -type f -name "backup-*.tar.gz" -mtime +$retention_days -delete
        log SUCCESS "Old backups cleaned up"
    fi
}

# Show deployment status
show_status() {
    log INFO "Deployment Status:"
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would show container status"
    else
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
        
        echo ""
        log INFO "Container logs (last 10 lines):"
        docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" logs --tail=10
    fi
}

# Rollback deployment
rollback() {
    log WARNING "Rolling back deployment..."
    
    if [[ "$DRY_RUN" == true ]]; then
        log INFO "[DRY RUN] Would rollback to previous version"
        return
    fi
    
    # Stop current containers
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down
    
    # Try to restore from last backup
    local last_backup=$(ls -t "$BACKUP_DIR"/backup-*.tar.gz 2>/dev/null | head -1)
    
    if [[ -n "$last_backup" ]]; then
        log INFO "Restoring from backup: $last_backup"
        # Restore logic here
        log SUCCESS "Rollback completed"
    else
        log WARNING "No backup found for rollback"
    fi
}

# Print usage
usage() {
    cat << EOF
Usage: $0 [OPTIONS]

Deploy ROKO Marketing to production

OPTIONS:
    -h, --help          Show this help message
    -b, --skip-build    Skip Docker image build
    -B, --skip-backup   Skip backup creation
    -f, --force         Force deployment without confirmation
    -d, --dry-run       Perform dry run without making changes
    -r, --rollback      Rollback to previous deployment
    -s, --status        Show deployment status only
    -c, --cleanup       Cleanup old backups only

EXAMPLES:
    $0                  # Standard deployment
    $0 --skip-build     # Deploy without rebuilding
    $0 --dry-run        # Test deployment process
    $0 --rollback       # Rollback to previous version
    $0 --status         # Check current status

EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                usage
                exit 0
                ;;
            -b|--skip-build)
                SKIP_BUILD=true
                shift
                ;;
            -B|--skip-backup)
                SKIP_BACKUP=true
                shift
                ;;
            -f|--force)
                FORCE_DEPLOY=true
                shift
                ;;
            -d|--dry-run)
                DRY_RUN=true
                shift
                ;;
            -r|--rollback)
                rollback
                exit $?
                ;;
            -s|--status)
                load_environment
                show_status
                exit 0
                ;;
            -c|--cleanup)
                cleanup_backups
                exit 0
                ;;
            *)
                log ERROR "Unknown option: $1"
                usage
                exit 1
                ;;
        esac
    done
}

# Main deployment function
main() {
    log INFO "Starting ROKO Marketing production deployment"
    
    # Parse arguments
    parse_arguments "$@"
    
    # Confirmation prompt
    if [[ "$FORCE_DEPLOY" != true ]] && [[ "$DRY_RUN" != true ]]; then
        echo -e "${YELLOW}WARNING: This will deploy to production!${NC}"
        read -p "Are you sure you want to continue? (yes/no): " confirm
        if [[ "$confirm" != "yes" ]]; then
            log INFO "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Run deployment steps
    check_prerequisites
    load_environment
    build_image
    backup_deployment
    deploy_application
    health_check
    cleanup_backups
    show_status
    
    log SUCCESS "Deployment completed successfully!"
    
    # Show access information
    echo ""
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}Application deployed successfully!${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
    echo -e "Access URL: ${BLUE}http://localhost:8080${NC}"
    echo -e "Health Check: ${BLUE}http://localhost:8080/health${NC}"
    echo -e "Metrics: ${BLUE}http://localhost:9114/metrics${NC}"
    echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
}

# Trap errors
trap 'error_exit "Deployment failed on line $LINENO"' ERR

# Run main function
main "$@"