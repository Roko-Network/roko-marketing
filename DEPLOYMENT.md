# ROKO Marketing Site - Deployment Guide

## Overview

The ROKO Marketing site uses a **secure, pull-based deployment system** that automatically deploys from GitHub without exposing SSH keys or requiring complex CI/CD configuration.

### Key Features
- ✅ **No SSH keys in GitHub** - Secure from repository collaborators
- ✅ **Zero-downtime deployment** - Caddy serves new files instantly
- ✅ **Automatic rollback** - Reverts on build/deploy failures
- ✅ **Branch flexibility** - Deploy any branch for testing/recovery
- ✅ **10-minute auto-deploy** - Polls GitHub for updates
- ✅ **One-time setup** - Single sudo command, then sudo-free operation

## Quick Start (New Setup)

For a complete new setup, see: **[scripts/QUICK-START.md](scripts/QUICK-START.md)**

```bash
# One-time setup (5 minutes)
sudo ./scripts/setup-deployment.sh

# Start automatic deployment
sudo systemctl start roko-deploy-watcher
```

That's it! The system will now automatically deploy updates from GitHub.

## Architecture

```
GitHub Repository (master branch)
        ↓
    [Polls every 10 minutes]
        ↓
Deploy Watcher Service (systemd)
        ↓
    [Builds locally on server]
        ↓
Deployment Directory (/home/roctinam/production-deploy/roko-marketing)
        ↓
    [Mounted as volume]
        ↓
Caddy Web Server (Docker) → Port 82
    [No restart needed - serves new files instantly]
```

## Common Operations

### Check Deployment Status
```bash
./scripts/deploy-branch.sh status
```

### Deploy Immediately
```bash
./scripts/deploy-watcher.sh check   # Deploy if updates available
./scripts/deploy-watcher.sh force    # Force deploy even if up-to-date
```

### Switch Branches
```bash
# Deploy from a different branch
./scripts/deploy-branch.sh switch develop
./scripts/deploy-branch.sh switch feature/new-ui
./scripts/deploy-branch.sh switch hotfix/urgent-fix

# Quick switches
./scripts/deploy-branch.sh main      # Switch to master
./scripts/deploy-branch.sh staging   # Switch to staging

# Emergency recovery
./scripts/deploy-branch.sh recovery  # Force switch to master
```

### View Logs
```bash
# Service logs
journalctl -u roko-deploy-watcher -f

# Deployment logs
tail -f ~/roko-marketing/deploy.log

# Caddy logs
docker-compose -f docker-compose.caddy.yml logs -f
```

### Manual Deployment (Legacy)
```bash
# Using the original deploy script
./deploy-static.sh              # Build and deploy
SKIP_BUILD=1 ./deploy-static.sh # Deploy existing build
```

## Directory Structure

```
/home/roctinam/
├── roko-marketing/              # Source code (git repository)
│   ├── scripts/
│   │   ├── deploy-watcher.sh   # Automatic deployment script
│   │   ├── deploy-branch.sh    # Branch management
│   │   └── setup-deployment.sh # One-time setup
│   └── dist/                    # Build output
│
├── production-deploy/
│   └── roko-marketing/          # Deployed files (Caddy serves from here)
│
└── /var/lib/roko-marketing/     # Deployment state
    ├── deploy-config            # Branch configuration
    ├── last-deployed-sha        # Current deployment version
    └── deploy.lock              # Deployment lock file
```

## Service Management

### Start/Stop Service
```bash
sudo systemctl start roko-deploy-watcher   # Start auto-deployment
sudo systemctl stop roko-deploy-watcher    # Stop auto-deployment
sudo systemctl restart roko-deploy-watcher # Restart service
sudo systemctl status roko-deploy-watcher  # Check service status
```

### Enable/Disable Auto-start
```bash
sudo systemctl enable roko-deploy-watcher  # Start on boot
sudo systemctl disable roko-deploy-watcher # Don't start on boot
```

## Configuration

### Change Deployment Branch
```bash
./scripts/deploy-branch.sh switch <branch-name>
```

### Adjust Check Interval
Edit the systemd service:
```bash
sudo systemctl edit roko-deploy-watcher
```

Add:
```ini
[Service]
Environment="CHECK_INTERVAL=300"  # 5 minutes instead of 10
```

### Environment Variables
- `DEPLOY_BRANCH` - Branch to deploy (default: master)
- `CHECK_INTERVAL` - Seconds between checks (default: 600)
- `APP_DIR` - Source directory (default: ~/roko-marketing)
- `DEPLOY_DIR` - Deployment directory (default: ~/production-deploy/roko-marketing)

## Rollback Procedures

### Automatic Rollback
The system automatically rolls back if:
- Build fails
- Health check fails
- Deployment errors occur

### Manual Rollback
```bash
# List available backups
ls -la /var/backups/roko-marketing/

# Restore specific backup
sudo tar -xzf /var/backups/roko-marketing/backup-TIMESTAMP.tar.gz \
  -C /home/roctinam/production-deploy/

# Or use the emergency recovery
./scripts/deploy-branch.sh recovery
```

## Troubleshooting

### Deployment Stuck
```bash
# Check for stale lock
./scripts/deploy-watcher.sh status

# Remove stale lock if needed
./scripts/deploy-watcher.sh unlock

# Retry deployment
./scripts/deploy-watcher.sh check
```

### Service Won't Start
```bash
# Check logs
journalctl -u roko-deploy-watcher -n 50

# Verify permissions
ls -la /var/lib/roko-marketing/

# Re-run setup if needed
sudo ./scripts/setup-deployment.sh
```

### Build Failures
```bash
# Check memory
free -h

# Increase build memory in script
# Edit CHECK_INTERVAL in deploy-watcher.sh
BUILD_MEMORY="8192"  # Increase from 4096
```

### Caddy Issues
```bash
# Check if Caddy is running
docker ps | grep roko-marketing-server

# Restart Caddy
docker-compose -f docker-compose.caddy.yml restart

# View Caddy logs
docker-compose -f docker-compose.caddy.yml logs
```

## Security Notes

1. **No GitHub Secrets** - The server pulls changes, no push access needed
2. **User-level Service** - Runs as your user, not root
3. **Limited Sudo** - Only specific service commands have passwordless sudo
4. **Automatic Backups** - Last 5 deployments kept for recovery
5. **Health Checks** - Failed deployments automatically revert

## Performance

- **Build Time**: ~1-2 minutes (depends on server specs)
- **Deployment**: Instant (file copy only)
- **Downtime**: Zero (Caddy serves new files immediately)
- **Check Interval**: 10 minutes (configurable)
- **Backup Retention**: 5 versions

## Related Documentation

- **[Quick Start Guide](scripts/QUICK-START.md)** - 5-minute setup for new installations
- **[Auto-Deploy Setup](scripts/SETUP-AUTO-DEPLOY.md)** - Detailed setup documentation
- **[CI Workflow](.github/workflows/ci.yml)** - GitHub Actions for testing PRs

## Migration from Old System

If you're migrating from the old GitHub Actions deployment:

1. Remove old GitHub Secrets (no longer needed)
2. Run the setup script: `sudo ./scripts/setup-deployment.sh`
3. Start the service: `sudo systemctl start roko-deploy-watcher`
4. Old workflows will continue to run CI tests but won't deploy

The new system is simpler, more secure, and requires no GitHub configuration!