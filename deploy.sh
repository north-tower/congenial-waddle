#!/bin/bash

# Deployment script for Retailer Comparison Frontend
# Usage: ./deploy.sh [environment]
# Example: ./deploy.sh production

set -e

ENVIRONMENT=${1:-production}

echo "🚀 Starting frontend deployment for environment: $ENVIRONMENT"

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "📝 Please create .env file with VITE_API_BASE_URL"
    echo ""
    echo "Example .env file:"
    echo "VITE_API_BASE_URL=https://api.yourdomain.com/api"
    echo "HOST_PORT=80"
    exit 1
fi

# Check if VITE_API_BASE_URL is set
if ! grep -q "VITE_API_BASE_URL" .env; then
    echo "⚠️  Warning: VITE_API_BASE_URL not found in .env file"
    echo "📝 Please add VITE_API_BASE_URL to your .env file"
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Error: Docker is not installed!"
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker compose &> /dev/null; then
    echo "❌ Error: Docker Compose is not installed!"
    exit 1
fi

echo "📦 Building and starting container..."

# Build and start containers
if [ "$ENVIRONMENT" = "production" ]; then
    docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
else
    docker compose up -d --build
fi

echo "⏳ Waiting for service to be ready..."
sleep 5

# Check if container is running
if docker compose ps | grep -q "Up"; then
    echo "✅ Container is running!"
else
    echo "❌ Error: Container failed to start!"
    echo "📋 Checking logs..."
    docker compose logs --tail=50
    exit 1
fi

# Check health endpoint
echo "🏥 Checking health endpoint..."
if curl -f http://localhost/health > /dev/null 2>&1; then
    echo "✅ Health check passed!"
else
    echo "⚠️  Warning: Health check failed, but container is running"
    echo "📋 Check logs with: docker compose logs -f frontend"
fi

echo ""
echo "🎉 Deployment completed!"
echo ""
echo "📊 Container status:"
docker compose ps
echo ""
echo "🌐 Frontend should be available at:"
echo "   http://$(hostname -I | awk '{print $1}')"
echo ""
echo "📋 Useful commands:"
echo "  View logs:        docker compose logs -f"
echo "  Stop service:    docker compose down"
echo "  Restart service: docker compose restart"
echo "  View frontend logs: docker compose logs -f frontend"
echo ""

