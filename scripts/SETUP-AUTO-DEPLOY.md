# Pull-Based Auto-Deployment Setup Guide

## Overview

This guide explains how to set up secure, pull-based automatic deployment for the ROKO Marketing site. The server polls GitHub for updates and deploys automatically - no SSH keys in GitHub, no external access required.

## Architecture

```
GitHub Repository (master branch)
        ↓
    [Server polls every 10 minutes]
        ↓
Deploy Watcher Service (systemd)
        ↓
    [If changes detected]
        ↓
- Backup current version
- Pull latest code
- Build application (npm/vite)
- Deploy to /home/roctinam/production-deploy/roko-marketing
        ↓
Caddy Web Server (Docker container)
    [Serves files without restart]
        ↓
- Health check on port 82
- Auto-rollback if failed
```

## Benefits

✅ **No SSH keys in GitHub** - Collaborators can't access your server
✅ **Zero attack surface** - Server only makes outbound connections
✅ **Automatic rollback** - Reverts on build/deploy failures
✅ **Resource efficient** - Builds use your server's resources
✅ **Simple and secure** - No complex secrets management

## Setup Instructions

### Step 1: Generate Deploy Key (Optional - for Private Repos)

If your repository is private, generate a read-only deploy key:

```bash
# Generate deploy key on your LOCAL machine
ssh-keygen -t ed25519 -C "deploy@roko.network" -f ~/.ssh/roko_deploy_key -N ""

# Display the public key
cat ~/.ssh/roko_deploy_key.pub
```

Add this public key to your GitHub repository:
- Go to Repository → Settings → Deploy keys
- Click "Add deploy key"
- Title: "Server Auto-Deploy (Read-Only)"
- Paste the public key
- Do NOT check "Allow write access"

### Step 2: Server Initial Setup

SSH into your server and run:

```bash
# Install required packages
sudo apt-get update
sudo apt-get install -y nodejs npm git docker.io docker-compose curl

# Add user to docker group
sudo usermod -aG docker $USER
# Log out and back in for group change to take effect

# Create directories
mkdir -p ~/roko-marketing
mkdir -p ~/production-deploy/roko-marketing
sudo mkdir -p /var/lib/roko-marketing
sudo mkdir -p /var/backups/roko-marketing

# Set permissions
sudo chown -R $USER:$USER /var/lib/roko-marketing
sudo chown -R $USER:$USER /var/backups/roko-marketing

# If using deploy key for private repo
mkdir -p ~/.ssh
nano ~/.ssh/roko_deploy_key
# Paste the PRIVATE key content, save and exit

chmod 600 ~/.ssh/roko_deploy_key

# Configure git to use the deploy key
git config --global core.sshCommand "ssh -i ~/.ssh/roko_deploy_key"
```

### Step 3: Install the Deployment Scripts

```bash
# Clone the repository initially
cd ~/roko-marketing
git clone https://github.com/Roko-Network/roko-marketing.git .

# Make scripts executable
chmod +x scripts/deploy-watcher.sh
chmod +x deploy-static.sh

# Start Caddy container (one-time setup)
docker-compose -f docker-compose.caddy.yml up -d

# Verify Caddy is running
docker ps | grep roko-marketing-server
curl -I http://localhost:82/health
```

### Step 4: Install Systemd Service

```bash
# Copy the service file
sudo cp scripts/roko-deploy-watcher.service /etc/systemd/system/

# Reload systemd
sudo systemctl daemon-reload

# Enable the service to start on boot
sudo systemctl enable roko-deploy-watcher

# Start the service
sudo systemctl start roko-deploy-watcher

# Check service status
sudo systemctl status roko-deploy-watcher
```

### Step 5: Verify Deployment Setup

The deployment uses Caddy running in Docker, which is already configured:

```bash
# Check Caddy is serving the site
curl -I http://localhost:82

# Check health endpoint
curl http://localhost:82/health

# View Caddy logs
docker-compose -f ~/roko-marketing/docker-compose.caddy.yml logs -f

# Files are served from
ls -la ~/production-deploy/roko-marketing/
```

**Note:** Caddy automatically serves new files without restart when they're updated in the deployment directory!

## Usage

### Service Management

```bash
# Check service status
sudo systemctl status roko-deploy-watcher

# View live logs
sudo journalctl -u roko-deploy-watcher -f

# Stop the service
sudo systemctl stop roko-deploy-watcher

# Start the service
sudo systemctl start roko-deploy-watcher

# Restart the service
sudo systemctl restart roko-deploy-watcher
```

### Manual Operations

Run the deployment script manually:

```bash
cd ~/roko-marketing

# Check deployment status
./scripts/deploy-watcher.sh status

# Force immediate check and deploy
./scripts/deploy-watcher.sh check

# Force deployment even if up to date
./scripts/deploy-watcher.sh force

# Or use the original deploy script
SKIP_BUILD=0 ./deploy-static.sh  # Builds and deploys
SKIP_BUILD=1 ./deploy-static.sh  # Deploys existing build
```

### Monitoring

View deployment logs:

```bash
# Systemd journal (recommended)
sudo journalctl -u roko-deploy-watcher -f

# Or direct log file
tail -f /var/log/roko-deploy-watcher.log
```

## Configuration

Edit the systemd service to adjust settings:

```bash
sudo systemctl edit roko-deploy-watcher
```

Available environment variables:

- `CHECK_INTERVAL=600` - Check interval in seconds (default: 10 minutes)
- `DEPLOY_BRANCH=master` - Branch to deploy (default: master)
- `APP_DIR=/home/roctinam/roko-marketing` - Application source directory
- `DEPLOY_DIR=/home/roctinam/production-deploy/roko-marketing` - Deployment directory (where Caddy serves from)
- `BUILD_MEMORY=4096` - Node.js memory limit for builds (MB)
- `LOG_FILE=/home/roctinam/roko-marketing/deploy.log` - Log file location

After editing, reload and restart:

```bash
sudo systemctl daemon-reload
sudo systemctl restart roko-deploy-watcher
```

## Rollback

If deployment fails, the system automatically rolls back. To manually rollback:

```bash
cd /var/www/roko-marketing

# List available backups
ls -la /var/backups/roko-marketing/

# Restore specific backup
sudo tar -xzf /var/backups/roko-marketing/backup-TIMESTAMP.tar.gz -C /var/www/roko-marketing/
sudo systemctl reload nginx
```

## Troubleshooting

### Service Won't Start

```bash
# Check for syntax errors
bash -n /var/www/roko-marketing/scripts/deploy-watcher.sh

# Check permissions
ls -la /var/www/roko-marketing/
ls -la /var/lib/roko-marketing/
```

### Build Failures

```bash
# Check available memory
free -h

# Increase memory limit
sudo systemctl edit roko-deploy-watcher
# Add: Environment="BUILD_MEMORY=8192"
```

### Git Authentication Issues

```bash
# Test git access
sudo -u roko-deploy git ls-remote https://github.com/Roko-Network/roko-marketing.git

# For private repos, verify deploy key
sudo -u roko-deploy ssh -T git@github.com
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log
```

## Security Notes

1. **No GitHub Secrets Required** - The server pulls changes, no push access needed
2. **Limited User Permissions** - Service runs as non-root user
3. **Automatic Backups** - Last 5 deployments are kept for rollback
4. **Health Checks** - Failed deployments automatically revert
5. **Resource Limits** - CPU and memory limits prevent resource exhaustion

## Workflow

1. Developers push to `master` branch
2. GitHub Actions runs CI tests
3. Server checks for updates every 10 minutes
4. If updates found:
   - Creates backup
   - Pulls latest code
   - Builds application
   - Runs health check
   - Rolls back if anything fails
5. Deployment completes with zero downtime

## Monitoring Checklist

- [ ] Service is running: `systemctl is-active roko-deploy-watcher`
- [ ] No errors in logs: `journalctl -u roko-deploy-watcher -p err`
- [ ] Disk space available: `df -h /var/www`
- [ ] Backups are rotating: `ls -la /var/backups/roko-marketing/ | wc -l`
- [ ] Site is accessible: `curl -I http://localhost`

## Support

For issues:
1. Check service logs: `journalctl -u roko-deploy-watcher -n 100`
2. Run manual check: `./scripts/deploy-watcher.sh status`
3. Verify git access: `git ls-remote origin`
4. Check nginx: `sudo nginx -t`