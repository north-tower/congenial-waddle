# Quick Start Guide - Frontend Docker Deployment

This is a condensed guide for quickly deploying the frontend to a VPS.

## Prerequisites

- VPS with Ubuntu 20.04+
- SSH access
- Backend API URL
- Domain name (optional)

## Quick Deployment Steps

### 1. Install Docker

```bash
curl -fsSL https://get.docker.com -o get-docker.sh && sh get-docker.sh
apt install docker-compose-plugin -y
```

### 2. Clone/Upload Code

```bash
cd /opt
git clone <your-repo-url> retailer-comparison-frontend
cd retailer-comparison-frontend
```

### 3. Configure Environment

```bash
# Create .env file
cat > .env << EOF
VITE_API_BASE_URL=https://api.yourdomain.com/api
HOST_PORT=80
EOF
```

**Important:** Replace `https://api.yourdomain.com/api` with your actual backend API URL.

### 4. Deploy

```bash
# Make deploy script executable (if exists)
chmod +x deploy.sh 2>/dev/null || true

# Deploy
docker compose up -d --build
```

### 5. Verify

```bash
# Check status
docker compose ps

# Check health
curl http://localhost/health

# View logs
docker compose logs -f frontend
```

## Common Commands

```bash
# View logs
docker compose logs -f

# Restart
docker compose restart

# Stop
docker compose down

# Update
git pull && docker compose up -d --build
```

## Nginx Setup (Optional)

```bash
apt install nginx -y

cat > /etc/nginx/sites-available/frontend << EOF
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:80;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF

ln -s /etc/nginx/sites-available/frontend /etc/nginx/sites-enabled/
nginx -t && systemctl restart nginx
```

## SSL with Let's Encrypt

```bash
apt install certbot python3-certbot-nginx -y
certbot --nginx -d yourdomain.com
```

## Troubleshooting

**Container won't start:**
```bash
docker compose logs frontend
```

**API connection issues:**
```bash
# Check environment variable
docker compose exec frontend env | grep VITE

# Rebuild with correct API URL
docker compose up -d --build
```

**Port already in use:**
```bash
# Change HOST_PORT in .env file
# Or stop the service using port 80
```

## Important Notes

- **Vite environment variables** must be set at **build time**
- To change `VITE_API_BASE_URL`, you must rebuild: `docker compose up -d --build`
- The frontend is served on port 80 inside the container
- Use `HOST_PORT` in `.env` to map to a different host port if needed

For detailed instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)

