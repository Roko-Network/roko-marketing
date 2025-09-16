#!/bin/bash

# Restart script for ROKO Marketing production deployment

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.production.yml"

echo -e "${YELLOW}Restarting ROKO Marketing production containers...${NC}"

# Load environment
if [[ -f "$ENV_FILE" ]]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Restart containers
echo -e "${BLUE}Stopping containers...${NC}"
docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down

echo -e "${BLUE}Starting containers...${NC}"
if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" up -d; then
    echo -e "${GREEN}✓ Containers restarted successfully${NC}"
    
    # Show status
    echo -e "${BLUE}Container status:${NC}"
    docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" ps
else
    echo -e "${RED}✗ Failed to restart containers${NC}"
    exit 1
fi