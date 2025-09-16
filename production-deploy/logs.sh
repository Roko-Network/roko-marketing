#!/bin/bash

# Logs viewer for ROKO Marketing production deployment

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${SCRIPT_DIR}/.env.production"
COMPOSE_FILE="${SCRIPT_DIR}/docker-compose.production.yml"

# Default values
TAIL_LINES=100
FOLLOW=false
SERVICE=""

# Parse arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -f|--follow)
            FOLLOW=true
            shift
            ;;
        -n|--lines)
            TAIL_LINES="$2"
            shift 2
            ;;
        -s|--service)
            SERVICE="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo ""
            echo "Options:"
            echo "  -f, --follow         Follow log output"
            echo "  -n, --lines NUMBER   Number of lines to show (default: 100)"
            echo "  -s, --service NAME   Show logs for specific service"
            echo "  -h, --help          Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Load environment
if [[ -f "$ENV_FILE" ]]; then
    export $(grep -v '^#' "$ENV_FILE" | xargs)
fi

# Build command
CMD="docker-compose -f $COMPOSE_FILE --env-file $ENV_FILE logs --tail=$TAIL_LINES"

if [[ "$FOLLOW" == true ]]; then
    CMD="$CMD -f"
fi

if [[ -n "$SERVICE" ]]; then
    CMD="$CMD $SERVICE"
fi

# Execute
eval $CMD