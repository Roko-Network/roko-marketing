#!/bin/bash

# This script installs the sudoers configuration for ROKO deployment
# Run with: sudo ./scripts/apply-sudoers.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SUDOERS_FILE="$SCRIPT_DIR/sudoers-deploy.conf"
TARGET_FILE="/etc/sudoers.d/roko-deploy"

echo "Installing sudoers configuration for ROKO deployment..."

# Check if running as root
if [[ $EUID -ne 0 ]]; then
   echo "This script must be run as root (use sudo)"
   exit 1
fi

# Validate the sudoers file first
if visudo -c -f "$SUDOERS_FILE"; then
    echo "✓ Sudoers file validated successfully"

    # Install to sudoers.d directory
    cp "$SUDOERS_FILE" "$TARGET_FILE"
    chmod 440 "$TARGET_FILE"

    echo "✓ Sudoers configuration installed to $TARGET_FILE"
    echo ""
    echo "You can now run the following commands without sudo password:"
    echo "  - sudo systemctl restart roko-deploy-watcher"
    echo "  - sudo killall npm"
    echo "  - sudo journalctl -u roko-deploy-watcher"
    echo ""
else
    echo "✗ Sudoers file validation failed!"
    exit 1
fi