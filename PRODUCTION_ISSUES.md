# Production Deployment Issues

## Current Status
- ✅ Deployment scripts fixed and separated (deploy-static.sh and manage-docker.sh)  
- ✅ CSP headers updated to allow Google Fonts
- ✅ Placeholder files created for fonts and favicons
- ❌ Production build failing due to TypeScript errors
- ❌ React undefined error preventing app from loading

## Critical Issues to Fix

### 1. Build Failures (HIGH PRIORITY)
The production build is failing with:
- **1,450 TypeScript errors** in 76 files
- **Memory issues** during build (needs NODE_OPTIONS="--max-old-space-size=4096")
- React is undefined in chunk files (bundling issue)

**Fix Steps:**
```bash
# Fix TypeScript errors first
npm run lint:fix

# Try building with increased memory
NODE_OPTIONS="--max-old-space-size=4096" npx vite build --mode production

# Or build without type checking
npx tsc --noEmit false
NODE_OPTIONS="--max-old-space-size=4096" npx vite build
```

### 2. Font Files (MEDIUM PRIORITY)
Current placeholder text files are being rejected by browser's font sanitizer.

**Fix Steps:**
- Either remove font references from the build
- Or download actual HKGuise font files from a legitimate source
- Place real .woff and .woff2 files in `/dist/fonts/`

### 3. Favicon Files (LOW PRIORITY)  
Created placeholder files, but need actual images.

**Fix Steps:**
- Create or obtain actual favicon images (16x16, 32x32, 180x180)
- Replace placeholder files in `/dist/`

## Working Features
- ✅ Docker container management
- ✅ Static file serving via Caddy
- ✅ CSP allows Google Fonts
- ✅ Deployment automation

## Deployment Commands
```bash
# Deploy files only
./deploy-static.sh

# Skip build, deploy existing dist
SKIP_BUILD=1 ./deploy-static.sh

# Deploy and start Docker
START_DOCKER=1 ./deploy-static.sh

# Manage Docker separately
sudo ./manage-docker.sh start|stop|restart|status|logs
```

## Next Steps
1. Fix TypeScript errors to get a clean build
2. Replace placeholder font files with actual fonts
3. Test the production build locally before deploying