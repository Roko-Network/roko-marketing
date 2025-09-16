#!/bin/bash
# Docker container management script for roko-marketing
# This script manages the Caddy Docker container separately from deployment

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}"
DEPLOY_DIR="/home/roctinam/production-deploy/roko-marketing"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Docker is available
check_docker() {
    if ! command -v docker >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker is not installed or not in PATH${NC}"
        exit 1
    fi

    if ! command -v docker-compose >/dev/null 2>&1; then
        echo -e "${RED}❌ Docker Compose is not installed or not in PATH${NC}"
        exit 1
    fi

    # Check Docker permissions
    if ! docker info >/dev/null 2>&1; then
        # Try with sudo as fallback
        if command -v sudo >/dev/null 2>&1 && sudo docker info >/dev/null 2>&1; then
            DOCKER_CMD="sudo docker"
            DOCKER_COMPOSE_CMD="sudo docker-compose"
            echo -e "${YELLOW}⚠️  Using sudo for Docker commands${NC}"
        else
            echo -e "${RED}❌ Docker permission issue detected${NC}"
            echo -e "${YELLOW}💡 You may need to:${NC}"
            echo "   1. Add your user to the docker group: sudo usermod -aG docker \$USER"
            echo "   2. Restart your session or run: newgrp docker"
            exit 1
        fi
    else
        DOCKER_CMD="docker"
        DOCKER_COMPOSE_CMD="docker-compose"
    fi
}

# Start the Caddy container
start_container() {
    echo -e "${BLUE}🚀 Starting Caddy server...${NC}"
    
    # Check if deployment directory exists
    if [[ ! -d "${DEPLOY_DIR}" ]]; then
        echo -e "${RED}❌ Deployment directory not found: ${DEPLOY_DIR}${NC}"
        echo -e "${YELLOW}💡 Run ./deploy-static.sh first to build and deploy files${NC}"
        exit 1
    fi
    
    # Check if docker-compose.caddy.yml exists
    if [[ ! -f "${PROJECT_ROOT}/docker-compose.caddy.yml" ]]; then
        echo -e "${RED}❌ docker-compose.caddy.yml not found${NC}"
        exit 1
    fi
    
    # Start container
    if ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" up -d; then
        echo -e "${GREEN}✅ Container started successfully${NC}"
        echo -e "${BLUE}🌐 Server should be available at: http://localhost:82${NC}"
        echo -e "${YELLOW}📋 Check logs with: ${DOCKER_COMPOSE_CMD} -f docker-compose.caddy.yml logs -f${NC}"
    else
        echo -e "${RED}❌ Failed to start container${NC}"
        ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" logs || true
        exit 1
    fi
}

# Stop the Caddy container
stop_container() {
    echo -e "${BLUE}🛑 Stopping Caddy server...${NC}"
    
    if ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" down; then
        echo -e "${GREEN}✅ Container stopped successfully${NC}"
    else
        echo -e "${YELLOW}⚠️  Container may not have been running${NC}"
    fi
}

# Restart the Caddy container
restart_container() {
    echo -e "${BLUE}🔄 Restarting Caddy server...${NC}"
    stop_container
    start_container
}

# Check container status
status_container() {
    echo -e "${BLUE}📊 Checking container status...${NC}"
    
    if ${DOCKER_CMD} ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -q roko-marketing-server; then
        echo -e "${GREEN}✅ Container is running:${NC}"
        ${DOCKER_CMD} ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAMES|roko-marketing-server"
        
        # Test if server is responding
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:82/ | grep -q "200\|404"; then
            echo -e "${GREEN}✅ Server is responding at http://localhost:82${NC}"
        else
            echo -e "${YELLOW}⚠️  Container is running but server is not responding${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  Container is not running${NC}"
        echo -e "${YELLOW}💡 Start it with: $0 start${NC}"
    fi
}

# View container logs
logs_container() {
    echo -e "${BLUE}📋 Showing container logs...${NC}"
    ${DOCKER_COMPOSE_CMD} -f "${PROJECT_ROOT}/docker-compose.caddy.yml" logs -f
}

# Main script logic
check_docker

case "${1:-}" in
    start)
        start_container
        ;;
    stop)
        stop_container
        ;;
    restart)
        restart_container
        ;;
    status)
        status_container
        ;;
    logs)
        logs_container
        ;;
    *)
        echo "Usage: $0 {start|stop|restart|status|logs}"
        echo ""
        echo "Commands:"
        echo "  start    - Start the Caddy Docker container"
        echo "  stop     - Stop the Caddy Docker container"
        echo "  restart  - Restart the Caddy Docker container"
        echo "  status   - Check container status"
        echo "  logs     - View container logs (follow mode)"
        echo ""
        echo "Note: Run ./deploy-static.sh first to build and deploy files"
        exit 1
        ;;
esac