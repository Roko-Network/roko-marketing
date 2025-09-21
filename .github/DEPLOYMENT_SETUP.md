# GitHub Actions Deployment Setup Guide

## Overview

This guide explains how to set up the GitHub Actions CI/CD pipeline for deploying the ROKO Marketing site to a Contabo Ubuntu 24 LTS VM.

## Prerequisites

- Ubuntu 24 LTS server (Contabo VM)
- Node.js 20.x installed on the server
- Nginx installed and configured
- GitHub repository access
- SSH access to the server

## Setup Instructions

### 1. Generate SSH Keys (On Your Local Machine)

Generate an ED25519 SSH key pair for secure authentication:

```bash
ssh-keygen -t ed25519 -C "github-actions@roko.network" -f ~/.ssh/github_actions_deploy
```

**Important**: Do not set a passphrase when prompted (press Enter twice)

### 2. Configure Server Access

Copy the public key to your server:

```bash
# Display the public key
cat ~/.ssh/github_actions_deploy.pub

# SSH into your server
ssh user@your-server-ip

# Add the public key to authorized_keys
mkdir -p ~/.ssh
echo "YOUR_PUBLIC_KEY_HERE" >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Generate Known Hosts Entry

Get the server's SSH fingerprint:

```bash
# From your local machine
ssh-keyscan -t ed25519 your-server-ip
```

Save the output - you'll need it for GitHub Secrets.

### 4. Configure GitHub Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add the following secrets:

| Secret Name | Description | Example Value |
|------------|-------------|---------------|
| `SSH_HOST` | Your server's IP address | `123.456.789.0` |
| `SSH_USER` | SSH username | `ubuntu` |
| `SSH_PORT` | SSH port (optional, defaults to 22) | `22` |
| `SSH_PRIVATE_KEY` | Complete private key content | `-----BEGIN OPENSSH PRIVATE KEY-----...` |

To get the private key content:
```bash
cat ~/.ssh/github_actions_deploy
```

Copy the ENTIRE output, including the BEGIN and END lines.

### 5. Server Preparation

SSH into your server and run:

```bash
# Create application directory
sudo mkdir -p /var/www/roko-marketing
sudo chown -R $USER:$USER /var/www/roko-marketing

# Create backup directory
sudo mkdir -p /var/backups/roko-marketing
sudo chown -R $USER:$USER /var/backups/roko-marketing

# Install Node.js 20.x if not already installed
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install nginx if not already installed
sudo apt-get update
sudo apt-get install -y nginx

# Install git
sudo apt-get install -y git
```

### 6. Initial Deployment

Once everything is configured:

1. Push to the `master` or `main` branch to trigger automatic deployment
2. Or manually trigger deployment from Actions tab → Deploy to Production → Run workflow

### 7. Manual Deployment Script

The repository includes `scripts/deploy-server.sh` which can be run directly on the server:

```bash
# Deploy latest version
./scripts/deploy-server.sh deploy

# Rollback to previous version
./scripts/deploy-server.sh rollback

# Run health check
./scripts/deploy-server.sh health

# Create backup
./scripts/deploy-server.sh backup
```

## Workflows

### CI Workflow (`ci.yml`)
- Triggers on: Pull requests and pushes to `develop`
- Runs: Linting, type checking, tests, and build validation
- Purpose: Ensure code quality before merging

### Deploy Workflow (`deploy.yml`)
- Triggers on: Pushes to `master`/`main` or manual dispatch
- Actions:
  - Connects to server via SSH
  - Pulls latest code
  - Builds on server (using server resources)
  - Creates backup of current deployment
  - Deploys new build
  - Runs health check
  - Auto-rollback on failure

## Security Best Practices

1. **Never commit SSH keys to the repository**
2. **Use GitHub Secrets for all sensitive information**
3. **Regularly rotate SSH keys** (recommended every 90 days)
4. **Limit SSH key permissions** to specific directories
5. **Use fail2ban on the server** to prevent brute force attempts
6. **Enable UFW firewall** with only necessary ports open
7. **Monitor deployment logs** for suspicious activity

## Troubleshooting

### SSH Connection Failed
- Verify SSH_HOST is correct
- Check if SSH_PORT matches server configuration
- Ensure SSH_PRIVATE_KEY is correctly formatted (includes newlines)
- Verify server is accessible from GitHub Actions IPs

### Build Fails on Server
- Check server has enough memory (minimum 2GB recommended)
- Verify Node.js version matches project requirements
- Check disk space availability
- Review npm error logs on the server

### Health Check Fails
- Ensure nginx is running: `sudo systemctl status nginx`
- Check nginx configuration: `sudo nginx -t`
- Verify dist directory exists after build
- Check firewall isn't blocking local connections

### Rollback Issues
- Ensure backup directory has sufficient space
- Verify at least one backup exists
- Check file permissions in backup directory

## Maintenance

### Log Locations
- GitHub Actions logs: Repository → Actions tab
- Server deployment logs: `/var/log/nginx/error.log`
- Application logs: Check systemd journal

### Regular Tasks
- Monitor disk space on server
- Clean old backups (automated to keep last 3)
- Update Node.js dependencies monthly
- Review and update nginx configuration as needed

## Support

For issues or questions:
1. Check GitHub Actions logs for detailed error messages
2. SSH to server and check local logs
3. Review this documentation
4. Create an issue in the repository