#!/bin/bash

# Stop script for ROKO Marketing production deployment

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.production.yml"

echo -e "${YELLOW}Stopping ROKO Marketing production containers...${NC}"

# Load environment
if [[ -f "$ENV_FILE" ]]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Stop containers
if docker-compose -f "$COMPOSE_FILE" --env-file "$ENV_FILE" down; then
    echo -e "${GREEN}✓ Containers stopped successfully${NC}"
else
    echo -e "${RED}✗ Failed to stop containers${NC}"
    exit 1
fi