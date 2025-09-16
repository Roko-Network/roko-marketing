# ROKO Marketing Production Deployment

This directory contains the production deployment configuration for the ROKO Marketing website.

## Directory Structure

```
production-deploy/
├── docker-compose.production.yml  # Production Docker Compose configuration
├── .env.production                # Production environment variables (template)
├── nginx/                         # Nginx configuration files
│   ├── nginx.production.conf      # Main Nginx configuration
│   └── security.production.conf   # Security headers and rules
├── deploy.sh                      # Main deployment script
├── stop.sh                        # Stop containers
├── restart.sh                     # Restart containers
├── logs.sh                        # View container logs
└── backups/                       # Deployment backups (created automatically)
```

## Quick Start

1. **Setup Environment**
   ```bash
   cd production-deploy
   cp .env.production .env.production.local
   # Edit .env.production.local with your actual values
   ```

2. **Deploy Application**
   ```bash
   ./deploy.sh
   ```

3. **View Status**
   ```bash
   ./deploy.sh --status
   ```

## Deployment Scripts

### deploy.sh
Main deployment script with full lifecycle management.

**Usage:**
```bash
./deploy.sh [OPTIONS]

Options:
  -h, --help          Show help message
  -b, --skip-build    Skip Docker image build
  -B, --skip-backup   Skip backup creation
  -f, --force         Force deployment without confirmation
  -d, --dry-run       Perform dry run without changes
  -r, --rollback      Rollback to previous deployment
  -s, --status        Show deployment status
  -c, --cleanup       Cleanup old backups
```

**Examples:**
```bash
# Standard deployment
./deploy.sh

# Deploy without rebuilding image
./deploy.sh --skip-build

# Test deployment process
./deploy.sh --dry-run

# Check current status
./deploy.sh --status
```

### stop.sh
Stop all production containers.

```bash
./stop.sh
```

### restart.sh
Restart all production containers.

```bash
./restart.sh
```

### logs.sh
View container logs with various options.

```bash
# View last 100 lines
./logs.sh

# Follow logs in real-time
./logs.sh -f

# View specific service logs
./logs.sh -s roko-marketing-prod

# View last 50 lines and follow
./logs.sh -n 50 -f
```

## Configuration

### Environment Variables
Edit `.env.production` to configure:
- Docker settings
- Resource limits
- Monitoring options
- Security settings
- Feature flags

### Docker Compose
The `docker-compose.production.yml` includes:
- Main application service
- Nginx metrics exporter
- Optional Traefik reverse proxy
- Health checks
- Resource limits
- Security configurations

### Nginx Configuration
- `nginx.production.conf`: Main server configuration
- `security.production.conf`: Security headers and protections

## Ports

- **8080**: Main application (HTTP)
- **9114**: Nginx metrics exporter
- **8081**: Traefik dashboard (if enabled)

## Security Features

- Non-root container execution
- Read-only filesystem
- Security headers (CSP, HSTS, etc.)
- Rate limiting
- DDoS protection
- SQL injection blocking
- XSS protection

## Monitoring

### Health Check
```bash
curl http://localhost:8080/health
```

### Metrics
```bash
curl http://localhost:9114/metrics
```

### Logs
```bash
./logs.sh -f
```

## Backup and Recovery

### Automatic Backups
Backups are created automatically during deployment.

### Manual Backup
```bash
docker-compose -f docker-compose.production.yml exec roko-marketing-prod \
  tar czf - /var/log/nginx > backup-manual-$(date +%Y%m%d).tar.gz
```

### Rollback
```bash
./deploy.sh --rollback
```

## Troubleshooting

### Container Won't Start
1. Check logs: `./logs.sh`
2. Verify environment: `docker-compose config`
3. Check resources: `docker system df`

### Health Check Failing
1. Check endpoint: `curl http://localhost:8080/health`
2. Review nginx logs: `./logs.sh -s roko-marketing-prod`
3. Verify configuration: `docker-compose exec roko-marketing-prod nginx -t`

### High Memory Usage
1. Check limits: `docker stats`
2. Adjust in `.env.production`: `MAX_MEMORY`
3. Restart: `./restart.sh`

## Maintenance

### Update Image
```bash
# Build new image
cd ..
docker build -t roko-marketing:production .

# Deploy
cd production-deploy
./deploy.sh --skip-build
```

### Clean Old Backups
```bash
./deploy.sh --cleanup
```

### System Cleanup
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

## Best Practices

1. **Always test in staging first**
2. **Keep backups before major changes**
3. **Monitor logs during deployment**
4. **Use dry-run for testing**
5. **Document any manual changes**
6. **Keep environment files secure**
7. **Regular backup cleanup**
8. **Monitor resource usage**

## Support

For issues or questions:
1. Check logs: `./logs.sh`
2. Review status: `./deploy.sh --status`
3. Test configuration: `./deploy.sh --dry-run`

## License

Proprietary - ROKO Network