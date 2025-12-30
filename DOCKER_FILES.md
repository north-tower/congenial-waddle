# Docker Deployment Files Overview

This document describes all the Docker-related files created for deploying the frontend to a VPS.

## Files Created

### Core Docker Files

1. **Dockerfile**
   - Multi-stage build for optimized production image
   - Builder stage: Builds the React app with Vite
   - Production stage: Serves static files with Nginx
   - Includes health check endpoint
   - Uses Alpine Linux for smaller image size

2. **docker-compose.yml**
   - Orchestrates the frontend service
   - Handles networking
   - Builds with environment variables
   - Maps host port to container port 80

3. **docker-compose.prod.yml**
   - Production overrides for docker-compose.yml
   - Enhanced logging configuration
   - Use with: `docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d`

4. **.dockerignore**
   - Excludes unnecessary files from Docker build context
   - Reduces build time and image size
   - Excludes node_modules, dist, .env files, git files, etc.

5. **nginx.conf**
   - Nginx configuration for serving the React app
   - Handles React Router (SPA routing)
   - Gzip compression enabled
   - Security headers configured
   - Static asset caching
   - Health check endpoint

### Deployment Scripts

6. **deploy.sh**
   - Automated deployment script
   - Checks prerequisites
   - Validates environment variables
   - Builds and starts containers
   - Verifies deployment health
   - Usage: `./deploy.sh [environment]`

7. **Makefile**
   - Convenient commands for common tasks
   - Examples:
     - `make up` - Start container
     - `make down` - Stop container
     - `make logs` - View logs
     - `make deploy` - Deploy to production

### Documentation

8. **DEPLOYMENT.md**
   - Comprehensive deployment guide
   - Step-by-step instructions
   - Security best practices
   - Troubleshooting section
   - Production checklist

9. **QUICK_START.md**
   - Condensed quick start guide
   - Essential commands only
   - For experienced users

10. **.env.example**
    - Template for environment variables
    - Copy to .env and fill in values

## Quick Reference

### First Time Deployment

```bash
# 1. Create .env file
cp .env.example .env
nano .env  # Edit with your backend API URL

# 2. Deploy
./deploy.sh
```

### Using Docker Compose Directly

```bash
# Build and start
docker compose up -d --build

# View logs
docker compose logs -f

# Stop
docker compose down
```

### Using Makefile

```bash
# See all commands
make help

# Common commands
make up          # Start
make down        # Stop
make logs         # View logs
make deploy       # Deploy
```

## Environment Variables

Required in `.env` file:

- `VITE_API_BASE_URL` - Backend API base URL (REQUIRED)
  - Example: `https://api.yourdomain.com/api`
  - Example: `http://164.68.115.204:3001/api`
  
- `HOST_PORT` - Host port mapping (optional, default: 80)
  - Change if port 80 is already in use

## Important Notes

### Vite Environment Variables

⚠️ **Critical:** Vite requires environment variables to be set at **build time**. The `VITE_` prefixed variables are embedded into the JavaScript bundle during the Docker build process.

**To change the API URL:**
1. Update `VITE_API_BASE_URL` in `.env`
2. Rebuild the Docker image: `docker compose up -d --build`

The environment variable is passed as a build argument to the Dockerfile.

## Architecture

```
┌─────────────────┐
│   Nginx (80)    │  ← Serves static React app
└─────────────────┘
         │
         │ HTTP Requests
         ▼
┌─────────────────┐
│  React App      │  ← Built static files
└─────────────────┘
         │
         │ API Calls
         ▼
┌─────────────────┐
│  Backend API    │  ← Your backend service
└─────────────────┘
```

## Security Features

- ✅ Security headers (X-Frame-Options, X-Content-Type-Options, etc.)
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ Health checks
- ✅ Proper signal handling (dumb-init)
- ✅ Nginx running as non-root user

## Production Recommendations

1. Use `docker-compose.prod.yml` for production
2. Set up SSL/TLS with Let's Encrypt
3. Configure firewall (UFW)
4. Set up monitoring
5. Use CDN for static assets (optional)
6. Configure proper CORS on backend
7. Set up log rotation
8. Use domain name (not just IP)

## Troubleshooting

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed troubleshooting steps.

Common issues:
- **Port conflicts**: Change HOST_PORT in .env
- **API connection errors**: Verify VITE_API_BASE_URL is correct and rebuild
- **Build fails**: Check Docker logs, clear cache with `docker builder prune`
- **Container won't start**: Check logs with `docker compose logs frontend`

## Next Steps

After deployment:

1. Verify frontend loads correctly
2. Test API connectivity
3. Set up SSL certificate
4. Configure domain name
5. Set up monitoring
6. Test all features end-to-end

