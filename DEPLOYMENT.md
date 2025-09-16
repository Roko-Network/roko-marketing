# ROKO Network Marketing Site - Deployment Guide

This comprehensive guide covers all aspects of deploying the ROKO Network marketing site, from development to production environments.

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Local Development](#local-development)
5. [Build Process](#build-process)
6. [Deployment Strategies](#deployment-strategies)
7. [Platform-Specific Deployment](#platform-specific-deployment)
8. [Docker Deployment](#docker-deployment)
9. [CI/CD Pipeline](#cicd-pipeline)
10. [Monitoring & Observability](#monitoring--observability)
11. [Performance Optimization](#performance-optimization)
12. [Security Configuration](#security-configuration)
13. [Troubleshooting](#troubleshooting)
14. [Rollback Procedures](#rollback-procedures)
15. [Maintenance](#maintenance)

## Overview

The ROKO Network marketing site is a high-performance React application built with Vite, featuring:

- **Zero-downtime deployments** across multiple platforms
- **Automatic rollback** on deployment failures
- **Real-time monitoring** and alerting
- **Multi-environment support** (development, staging, production)
- **CDN optimization** for global performance
- **Progressive Web App** capabilities

### Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Development   │    │     Staging     │    │   Production    │
│                 │    │                 │    │                 │
│ localhost:5173  │───▶│staging.roko.net │───▶│  roko.network   │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Local Build   │    │  Preview Build  │    │ Production Build│
│                 │    │                 │    │                 │
│ Unoptimized     │    │ Pre-optimized   │    │ Fully Optimized │
│ Source maps     │    │ Basic minify    │    │ Advanced minify │
│ Hot reload      │    │ Error tracking  │    │ All monitoring  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Prerequisites

### Required Software

- **Node.js**: v20.0.0 or higher
- **npm**: v10.0.0 or higher
- **Git**: Latest version
- **Docker**: v20.0.0+ (optional, for containerized deployment)

### Required Accounts & Services

- **GitHub**: For code repository and CI/CD
- **Vercel**: For primary hosting (recommended)
- **Netlify**: For backup hosting
- **AWS**: For S3 + CloudFront deployment
- **Cloudflare**: For CDN and DNS management
- **Sentry**: For error tracking
- **DataDog**: For performance monitoring

### Environment Variables

Copy `.env.example` to create environment-specific configuration files:

```bash
# Development
cp .env.example .env.local

# Staging
cp .env.example .env.staging

# Production
cp .env.example .env.production
```

## Environment Setup

### Development Environment

1. **Clone the repository**:
   ```bash
   git clone https://github.com/roko-network/roko-marketing.git
   cd roko-marketing
   ```

2. **Install dependencies**:
   ```bash
   npm ci --prefer-offline
   ```

3. **Configure environment**:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

### Staging Environment

1. **Configure staging variables**:
   ```bash
   # .env.staging
   NODE_ENV=production
   VITE_BUILD_ENV=staging
   VITE_API_BASE_URL=https://staging-api.roko.network
   VITE_ENABLE_ANALYTICS=false
   VITE_ENABLE_ERROR_TRACKING=true
   ```

2. **Build for staging**:
   ```bash
   npm run build:staging
   ```

### Production Environment

1. **Configure production variables**:
   ```bash
   # .env.production
   NODE_ENV=production
   VITE_BUILD_ENV=production
   VITE_API_BASE_URL=https://api.roko.network
   VITE_ENABLE_ANALYTICS=true
   VITE_ENABLE_ERROR_TRACKING=true
   VITE_SENTRY_DSN=your_sentry_dsn
   ```

2. **Build for production**:
   ```bash
   npm run build
   ```

## Build Process

### Build Scripts

| Script | Purpose | Environment |
|--------|---------|-------------|
| `npm run dev` | Development server | Development |
| `npm run build` | Production build | Production |
| `npm run build:staging` | Staging build | Staging |
| `npm run build:ci` | CI/CD build | All |
| `npm run build:docker` | Docker build | Production |
| `npm run preview` | Preview built app | Any |

### Build Optimization

The build process includes:

1. **TypeScript compilation** with strict checks
2. **Code splitting** for optimal loading
3. **Asset optimization** (images, fonts, etc.)
4. **Tree shaking** to remove unused code
5. **Minification** and compression
6. **Source map generation** (hidden in production)
7. **Bundle analysis** and size checking

### Build Verification

After building, verify the output:

```bash
# Check build size
npm run size

# Analyze bundle composition
npm run build:analyze

# Preview the built application
npm run preview

# Run performance audit
npm run perf:lighthouse
```

## Deployment Strategies

### 1. Blue-Green Deployment

Deploy to a parallel environment, then switch traffic:

```bash
# Deploy to green environment
vercel deploy --target=staging

# Run health checks
npm run health:check

# Promote to production
vercel promote
```

### 2. Rolling Deployment

Gradual rollout with automatic rollback:

```bash
# Deploy with canary release
kubectl apply -f k8s/canary-deployment.yaml

# Monitor metrics
kubectl get pods -l version=canary

# Complete rollout or rollback
kubectl apply -f k8s/production-deployment.yaml
```

### 3. Atomic Deployment

Single-step deployment with instant rollback capability:

```bash
# Deploy atomically
npm run deploy:production

# Automatic health checks run
# Rollback triggered if checks fail
```

## Platform-Specific Deployment

### Vercel (Recommended Primary)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Configure Vercel**:
   ```bash
   vercel login
   vercel link
   ```

3. **Deploy**:
   ```bash
   # Preview deployment
   vercel

   # Production deployment
   vercel --prod
   ```

4. **Environment Variables**:
   ```bash
   vercel env add VITE_API_BASE_URL production
   vercel env add VITE_SENTRY_DSN production
   ```

### Netlify (Backup Hosting)

1. **Install Netlify CLI**:
   ```bash
   npm install -g netlify-cli
   ```

2. **Configure Netlify**:
   ```bash
   netlify login
   netlify link
   ```

3. **Deploy**:
   ```bash
   # Build and deploy
   npm run build
   netlify deploy --prod --dir=dist
   ```

### AWS S3 + CloudFront

1. **Configure AWS CLI**:
   ```bash
   aws configure
   ```

2. **Deploy script** (included in CI/CD):
   ```bash
   # Sync to S3
   aws s3 sync dist/ s3://roko-marketing-production --delete

   # Invalidate CloudFront
   aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
   ```

### Cloudflare Pages

1. **Connect GitHub repository** to Cloudflare Pages
2. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `dist`
   - Environment variables: Set in dashboard

## Docker Deployment

### Building Docker Image

```bash
# Build production image
docker build -t roko-marketing:latest .

# Build with build arguments
docker build \
  --build-arg VERSION=1.0.0 \
  --build-arg BUILD_DATE=$(date -u +'%Y-%m-%dT%H:%M:%SZ') \
  -t roko-marketing:1.0.0 .
```

### Running Docker Container

```bash
# Run single container
docker run -p 80:80 roko-marketing:latest

# Run with Docker Compose
docker-compose up -d

# Scale with Docker Compose
docker-compose up -d --scale roko-marketing=3
```

### Kubernetes Deployment

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: roko-marketing
spec:
  replicas: 3
  selector:
    matchLabels:
      app: roko-marketing
  template:
    metadata:
      labels:
        app: roko-marketing
    spec:
      containers:
      - name: roko-marketing
        image: roko-marketing:latest
        ports:
        - containerPort: 80
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "500m"
```

Deploy to Kubernetes:

```bash
kubectl apply -f k8s/
kubectl rollout status deployment/roko-marketing
```

## CI/CD Pipeline

### GitHub Actions Workflow

The CI/CD pipeline automatically:

1. **Runs quality checks** (linting, type checking, tests)
2. **Builds the application** for multiple environments
3. **Performs security scans** and audits
4. **Runs performance tests** and accessibility checks
5. **Deploys to staging** for integration testing
6. **Deploys to production** after approval
7. **Monitors deployment** and rolls back on failure

### Manual Deployment

For manual deployments, use the provided scripts:

```bash
# Deploy to staging
npm run deploy:staging

# Deploy to production (requires confirmation)
npm run deploy:production

# Emergency deployment (skips some checks)
npm run deploy:emergency
```

### Environment Promotion

Promote builds through environments:

```bash
# Promote staging to production
vercel promote --scope=roko-network

# Or use the GitHub Actions workflow
gh workflow run deploy.yml -f environment=production
```

## Monitoring & Observability

### Health Checks

Automated health checks run every 30 seconds:

```bash
# Manual health check
npm run health:check

# Continuous monitoring
npm run health:monitor
```

### Performance Monitoring

Real-time performance tracking includes:

- **Core Web Vitals** (LCP, FID, CLS)
- **Custom metrics** (API response times, bundle sizes)
- **User experience** tracking
- **Error rate** monitoring

### Alerting

Alerts are sent via:

- **Slack** notifications for deployment events
- **Email** alerts for critical errors
- **PagerDuty** integration for emergency issues

### Dashboards

Monitor the application through:

- **Vercel Analytics**: Built-in performance metrics
- **DataDog**: Custom dashboards and alerts
- **Sentry**: Error tracking and performance
- **Lighthouse CI**: Automated performance audits

## Performance Optimization

### CDN Configuration

The application uses multiple CDN layers:

1. **Vercel Edge Network** (primary)
2. **Cloudflare** (DNS and additional caching)
3. **AWS CloudFront** (backup)

### Caching Strategy

| Asset Type | Cache Duration | Strategy |
|------------|----------------|----------|
| HTML files | 1 hour | `must-revalidate` |
| JS/CSS files | 1 year | `immutable` |
| Images | 1 year | `immutable` |
| Fonts | 1 year | `immutable` |
| API responses | 5 minutes | `stale-while-revalidate` |

### Asset Optimization

Automated optimization includes:

- **Image compression** with WebP fallbacks
- **Font optimization** with preloading
- **JavaScript splitting** for optimal loading
- **CSS purging** to remove unused styles

## Security Configuration

### Content Security Policy (CSP)

Strict CSP headers are enforced:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https:; font-src 'self' https://fonts.gstatic.com;
```

### Security Headers

All responses include security headers:

- `X-Frame-Options: SAMEORIGIN`
- `X-Content-Type-Options: nosniff`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`
- `Referrer-Policy: strict-origin-when-cross-origin`

### Dependency Scanning

Automated security scanning includes:

- **npm audit** for known vulnerabilities
- **Snyk scanning** for advanced threat detection
- **Dependabot** for automatic dependency updates

## Troubleshooting

### Common Issues

#### Build Failures

**Issue**: TypeScript compilation errors
```bash
# Solution: Fix type errors
npm run type-check
```

**Issue**: Bundle size exceeds limits
```bash
# Solution: Analyze and optimize
npm run build:analyze
npm run size:why
```

#### Deployment Failures

**Issue**: Environment variables missing
```bash
# Solution: Check environment configuration
vercel env ls
```

**Issue**: Build artifacts too large
```bash
# Solution: Enable compression
# Already configured in nginx.conf and vercel.json
```

#### Runtime Issues

**Issue**: API calls failing
```bash
# Check network connectivity
curl -I https://api.roko.network/health

# Check CORS configuration
# Verify in browser network tab
```

**Issue**: Performance degradation
```bash
# Run performance audit
npm run perf:lighthouse

# Check Core Web Vitals
npm run perf:check
```

### Debug Mode

Enable debug mode for detailed logging:

```bash
# Development
VITE_DEBUG=true npm run dev

# Production (not recommended)
VITE_DEBUG=true npm run build
```

### Log Analysis

Access deployment logs:

```bash
# Vercel logs
vercel logs

# Netlify logs
netlify logs

# Docker logs
docker logs roko-marketing
```

## Rollback Procedures

### Automatic Rollback

The system automatically rolls back if:

- Health checks fail after deployment
- Error rate exceeds 5% for 5 minutes
- Core Web Vitals degrade significantly

### Manual Rollback

#### Vercel Rollback

```bash
# List recent deployments
vercel list

# Rollback to specific deployment
vercel rollback <deployment-url>
```

#### AWS S3 Rollback

```bash
# Restore from backup
aws s3 sync s3://roko-marketing-backup-$(date +%Y%m%d) s3://roko-marketing-production --delete

# Invalidate CloudFront
aws cloudfront create-invalidation --distribution-id EXXXXX --paths "/*"
```

#### Docker Rollback

```bash
# Rollback to previous image
kubectl rollout undo deployment/roko-marketing

# Or rollback to specific revision
kubectl rollout undo deployment/roko-marketing --to-revision=2
```

### Emergency Procedures

For critical issues:

1. **Immediate rollback**:
   ```bash
   npm run rollback:emergency
   ```

2. **Enable maintenance mode**:
   ```bash
   # Redirect traffic to maintenance page
   vercel alias set maintenance.roko.network roko.network
   ```

3. **Hotfix deployment**:
   ```bash
   # Skip CI/CD for critical fixes
   npm run deploy:hotfix
   ```

## Maintenance

### Regular Maintenance Tasks

#### Weekly Tasks

- **Dependency updates**: Review and update dependencies
- **Performance review**: Analyze Core Web Vitals trends
- **Security audit**: Review security scan results
- **Backup verification**: Test backup restoration

#### Monthly Tasks

- **Bundle size optimization**: Analyze and optimize bundle size
- **CDN performance review**: Check CDN hit rates and performance
- **Error trend analysis**: Review error patterns and fix issues
- **Capacity planning**: Review traffic trends and scale accordingly

#### Quarterly Tasks

- **Major dependency updates**: Update major dependencies
- **Security assessment**: Comprehensive security review
- **Performance optimization**: Deep performance analysis and optimization
- **Disaster recovery testing**: Test complete system recovery

### Maintenance Scripts

```bash
# Update dependencies
npm run update:dependencies

# Clean up old builds
npm run cleanup:builds

# Optimize assets
npm run optimize:assets

# Generate performance report
npm run report:performance
```

### Monitoring Maintenance

Keep monitoring systems healthy:

```bash
# Health check monitoring endpoints
npm run health:monitoring

# Verify alert systems
npm run test:alerts

# Update monitoring configuration
npm run update:monitoring
```

## Support & Contact

For deployment issues:

- **DevOps Team**: devops@roko.network
- **Emergency Hotline**: Available in internal docs
- **Documentation**: This file and related docs in `/docs`
- **Issue Tracking**: GitHub Issues for non-urgent items

---

**Last Updated**: $(date)
**Document Version**: 1.0.0
**Maintained By**: ROKO DevOps Team