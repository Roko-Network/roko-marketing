#!/bin/bash
# Deployment script for roko-marketing static serving with Caddy
# Builds and serves the production build through Caddy

set -e

echo "🚀 Deploying roko-marketing with Caddy static server..."

# Build the project
echo "📦 Building project..."
npm run build

# Check if dist directory was created
if [ ! -d "dist" ]; then
    echo "❌ Build failed: dist directory not found"
    exit 1
fi

# Production deployment directory
DEPLOY_DIR="/home/roctinam/production-deploy/roko-marketing"

# Ensure deployment directory exists
mkdir -p "$DEPLOY_DIR"

# Clear contents of deployment directory (but not the directory itself)
echo "🧹 Clearing old deployment files..."
find "$DEPLOY_DIR" -mindepth 1 -delete 2>/dev/null || true

# Copy new files to production
echo "📋 Copying new files to production..."
cp -r dist/* "$DEPLOY_DIR/"

# Create necessary directories for Caddy
echo "📁 Creating Caddy directories..."
mkdir -p caddy_data caddy_config logs

# Set proper permissions
echo "🔐 Setting permissions..."
find "$DEPLOY_DIR" -type f -exec chmod 644 {} \;
find "$DEPLOY_DIR" -type d -exec chmod 755 {} \;
chmod 755 caddy_data caddy_config logs

# Stop existing container if running
echo "🛑 Stopping existing container if running..."
docker-compose -f docker-compose.caddy.yml down 2>/dev/null || true

# Start Caddy server
echo "🐋 Starting Caddy server..."
docker-compose -f docker-compose.caddy.yml up -d

# Wait for health check
echo "⏳ Waiting for server to be healthy..."
sleep 5

# Check if server is running
if docker ps | grep -q roko-marketing-server; then
    echo "✅ Deployment complete!"
    echo "🌐 Server running at: http://localhost:82"
    echo "📁 Files deployed to: $DEPLOY_DIR"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs: docker-compose -f docker-compose.caddy.yml logs -f"
    echo "   Stop server: docker-compose -f docker-compose.caddy.yml down"
    echo "   Restart server: docker-compose -f docker-compose.caddy.yml restart"
    echo ""
    echo "💡 Note: The server is using port 82 to avoid conflicts with other services"
else
    echo "❌ Server failed to start. Check logs with:"
    echo "   docker-compose -f docker-compose.caddy.yml logs"
    exit 1
fi