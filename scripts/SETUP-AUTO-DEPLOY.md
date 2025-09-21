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
- Build application
- Health check
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

SSH into your Contabo Ubuntu 24 server and run:

```bash
# Install required packages
sudo apt-get update
sudo apt-get install -y nodejs npm git nginx

# Create application user (if not exists)
sudo useradd -m -s /bin/bash roko-deploy || true

# Create directories
sudo mkdir -p /var/www/roko-marketing
sudo mkdir -p /var/lib/roko-marketing
sudo mkdir -p /var/backups/roko-marketing
sudo mkdir -p /var/log

# Set permissions
sudo chown -R roko-deploy:roko-deploy /var/www/roko-marketing
sudo chown -R roko-deploy:roko-deploy /var/lib/roko-marketing
sudo chown -R roko-deploy:roko-deploy /var/backups/roko-marketing

# If using deploy key for private repo
sudo -u roko-deploy mkdir -p /home/roko-deploy/.ssh
sudo -u roko-deploy nano /home/roko-deploy/.ssh/id_ed25519
# Paste the PRIVATE key content, save and exit

sudo -u roko-deploy chmod 600 /home/roko-deploy/.ssh/id_ed25519

# Configure git to use the deploy key
sudo -u roko-deploy git config --global core.sshCommand "ssh -i /home/roko-deploy/.ssh/id_ed25519"
```

### Step 3: Install the Deployment Scripts

```bash
# Clone the repository initially
cd /var/www/roko-marketing
sudo -u roko-deploy git clone https://github.com/Roko-Network/roko-marketing.git .

# Make scripts executable
chmod +x scripts/deploy-watcher.sh
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

### Step 5: Configure Nginx

Create nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/roko-marketing
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;

    root /var/www/roko-marketing/dist;
    index index.html;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # Gzip
    gzip on;
    gzip_types text/plain text/css application/javascript application/json;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

Enable the site:

```bash
sudo ln -sf /etc/nginx/sites-available/roko-marketing /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

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
cd /var/www/roko-marketing

# Check deployment status
./scripts/deploy-watcher.sh status

# Force immediate check and deploy
./scripts/deploy-watcher.sh check

# Force deployment even if up to date
./scripts/deploy-watcher.sh force
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
- `APP_DIR=/var/www/roko-marketing` - Application directory
- `BUILD_MEMORY=4096` - Node.js memory limit for builds (MB)

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