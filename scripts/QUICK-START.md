# Quick Start - ROKO Marketing Deployment

## One-Time Setup (5 minutes)

Run this **ONCE** to set up the entire deployment system:

```bash
# Clone the repository
cd ~
git clone https://github.com/Roko-Network/roko-marketing.git
cd roko-marketing

# Run the setup script (requires sudo ONLY for initial setup)
sudo ./scripts/setup-deployment.sh
```

That's it! The setup script will:
- ✅ Create all required directories with proper permissions
- ✅ Configure sudo-free operation for your user
- ✅ Install and enable the systemd service
- ✅ Initialize configuration files
- ✅ Set up branch management

## After Setup - No Sudo Required!

Once setup is complete, you can manage everything WITHOUT sudo:

### Start the Service
```bash
# Start automatic deployment (checks every 10 minutes)
sudo systemctl start roko-deploy-watcher  # (passwordless sudo configured)
```

### Branch Management (No Sudo!)
```bash
# Check current branch
./scripts/deploy-branch.sh status

# Switch to a different branch
./scripts/deploy-branch.sh switch develop
./scripts/deploy-branch.sh switch feature/new-ui

# Quick switches
./scripts/deploy-branch.sh main     # Switch to master
./scripts/deploy-branch.sh develop  # Switch to develop

# Test a branch temporarily
./scripts/deploy-branch.sh test hotfix/urgent-fix
# ... test it ...
./scripts/deploy-branch.sh restore  # Go back to previous

# Emergency recovery
./scripts/deploy-branch.sh recovery  # Switch to master immediately
```

### Manual Deployment (No Sudo!)
```bash
# Deploy immediately
./scripts/deploy-watcher.sh check

# Force deployment
./scripts/deploy-watcher.sh force

# Check status
./scripts/deploy-watcher.sh status
```

### View Logs (No Sudo!)
```bash
# Live service logs
journalctl -u roko-deploy-watcher -f

# Deployment logs
tail -f ~/roko-marketing/deploy.log
```

## How It Works

1. **Initial Setup** (`setup-deployment.sh`):
   - Creates directories with your user as owner
   - Configures passwordless sudo for specific service commands
   - Installs systemd service

2. **Branch Switching** (`deploy-branch.sh`):
   - Updates config file (no sudo - you own it!)
   - Restarts service (passwordless sudo configured)
   - Optionally triggers immediate deployment

3. **Automatic Deployment**:
   - Service checks GitHub every 10 minutes
   - Pulls and builds if changes detected
   - Deploys to Caddy (zero-downtime)
   - Auto-rollback on failures

## Common Tasks

### Deploy a Hotfix
```bash
# Quick deployment of urgent fix
./scripts/deploy-branch.sh switch hotfix/critical-bug
# Automatically deploys within 10 minutes (or force immediate)
./scripts/deploy-watcher.sh force
```

### Test a Feature Branch
```bash
# Test without affecting main configuration
./scripts/deploy-branch.sh test feature/experimental
# ... test the feature ...
./scripts/deploy-branch.sh restore
```

### View Current Configuration
```bash
./scripts/deploy-branch.sh status
```
Output:
```
=== Current Deployment Configuration ===

Deployment Branch: master
Configuration File: /var/lib/roko-marketing/deploy-config
Service Status: Active
Last Deployed SHA: abc12345
```

### Switch to Staging
```bash
./scripts/deploy-branch.sh staging
# or
./scripts/deploy-branch.sh switch staging
```

## Troubleshooting

### Permission Denied?
If you get permission errors, the initial setup may not have completed:
```bash
sudo ./scripts/setup-deployment.sh
```

### Service Not Starting?
Check the logs:
```bash
journalctl -u roko-deploy-watcher -n 50
```

### Docker Permission Issues?
Make sure you logged out and back in after setup (for docker group):
```bash
# Logout and login again, or:
newgrp docker
```

### Need to Reset Everything?
```bash
# Stop service
sudo systemctl stop roko-deploy-watcher

# Re-run setup
sudo ./scripts/setup-deployment.sh

# Start fresh
sudo systemctl start roko-deploy-watcher
```

## Security Notes

- Initial setup requires sudo ONCE
- After setup, all operations work without sudo
- Service runs as your user (not root)
- Passwordless sudo is limited to specific service commands only
- No SSH keys or secrets in GitHub
- All changes are local to your server

## Summary

**One sudo command** for setup, then **everything works without sudo**:
- Switch branches instantly
- Deploy any branch
- Test features safely
- Recover from problems
- View logs and status

The perfect balance of security and convenience! 🚀