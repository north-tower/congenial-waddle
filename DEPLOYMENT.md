# Frontend Deployment Guide - VPS with Docker

This guide will help you deploy the Retailer Comparison Frontend to a VPS using Docker and Nginx.

## Prerequisites

- A VPS with Ubuntu 20.04+ or similar Linux distribution
- SSH access to your VPS
- Domain name (optional, but recommended)
- Backend API already deployed and accessible
- Basic knowledge of Linux commands

## Step 1: Initial VPS Setup

### 1.1 Connect to your VPS

```bash
ssh root@your_vps_ip
```

### 1.2 Update system packages

```bash
apt update && apt upgrade -y
```

### 1.3 Install Docker and Docker Compose

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Verify installation
docker --version
docker compose version
```

## Step 2: Prepare Your Application

### 2.1 Clone or upload your code to the VPS

**Option A: Using Git (Recommended)**

```bash
# Install Git if not already installed
apt install git -y

# Clone your repository
cd /opt
git clone https://github.com/yourusername/retailer-comparison-frontend.git
cd retailer-comparison-frontend
```

**Option B: Using SCP (from your local machine)**

```bash
# From your local machine
scp -r retailer-comparison-frontend root@your_vps_ip:/opt/
ssh root@your_vps_ip
cd /opt/retailer-comparison-frontend
```

### 2.2 Create environment file

```bash
cat > .env << EOF
# Backend API URL (replace with your backend URL)
VITE_API_BASE_URL=https://api.yourdomain.com/api

# Host port (default: 80)
HOST_PORT=80
EOF
```

**Important:** Replace `https://api.yourdomain.com/api` with your actual backend API URL.

## Step 3: Build and Start Container

### 3.1 Build and start the container

```bash
docker compose up -d --build
```

This will:
- Build the frontend Docker image
- Start the Nginx container
- Serve the built React application

### 3.2 Check container status

```bash
docker compose ps
```

You should see the container running.

### 3.3 View logs

```bash
# View all logs
docker compose logs -f

# View frontend logs only
docker compose logs -f frontend
```

## Step 4: Verify Deployment

### 4.1 Check health endpoint

```bash
curl http://localhost/health
```

You should see:
```
healthy
```

### 4.2 Check the application

Open in your browser:
```
http://your_vps_ip
```

## Step 5: Set Up Reverse Proxy (Nginx) - Optional

If you want to use a custom domain and SSL, set up Nginx as a reverse proxy:

### 5.1 Install Nginx

```bash
apt install nginx -y
```

### 5.2 Create Nginx configuration

```bash
nano /etc/nginx/sites-available/retailer-comparison
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.3 Enable the site

```bash
ln -s /etc/nginx/sites-available/retailer-comparison /etc/nginx/sites-enabled/
nginx -t  # Test configuration
systemctl restart nginx
```

### 5.4 Set up SSL with Let's Encrypt

```bash
# Install Certbot
apt install certbot python3-certbot-nginx -y

# Obtain SSL certificate
certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Certbot will automatically configure Nginx for HTTPS
```

## Step 6: Firewall Configuration

### 6.1 Configure UFW (Uncomplicated Firewall)

```bash
# Install UFW if not installed
apt install ufw -y

# Allow SSH
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable firewall
ufw enable

# Check status
ufw status
```

## Step 7: Environment Variables

### 7.1 Build-time vs Runtime Variables

**Important:** Vite requires environment variables to be set at **build time**. The `VITE_` prefixed variables are embedded into the JavaScript bundle during build.

To change the API URL after building, you need to rebuild the Docker image:

```bash
# Update .env file
nano .env

# Rebuild with new environment variables
docker compose up -d --build
```

### 7.2 Available Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (required)
- `HOST_PORT` - Host port to map to container port 80 (default: 80)

## Step 8: Monitoring and Maintenance

### 8.1 View container resource usage

```bash
docker stats
```

### 8.2 Set up log rotation

Create log rotation configuration:

```bash
nano /etc/logrotate.d/docker-containers
```

Add:

```
/var/lib/docker/containers/*/*.log {
    rotate 7
    daily
    compress
    size=1M
    missingok
    delaycompress
    copytruncate
}
```

### 8.3 Set up automatic updates (optional)

Create a cron job for security updates:

```bash
crontab -e
```

Add:

```
0 2 * * 0 apt update && apt upgrade -y && docker compose pull && docker compose up -d
```

## Step 9: Common Commands

### Restart service

```bash
docker compose restart
```

### Stop service

```bash
docker compose down
```

### Update application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker compose up -d --build
```

### View logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f frontend

# Last 100 lines
docker compose logs --tail=100 frontend
```

## Step 10: Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs frontend

# Check if port is already in use
netstat -tulpn | grep 80

# Rebuild from scratch
docker compose down
docker compose build --no-cache
docker compose up -d
```

### API connection issues

```bash
# Check if VITE_API_BASE_URL is correct
docker compose exec frontend env | grep VITE

# Test API connectivity from container
docker compose exec frontend wget -O- http://your-backend-url/api/health
```

### Permission issues

```bash
# Fix file permissions
chown -R $USER:$USER /opt/retailer-comparison-frontend
```

### Build fails

```bash
# Clear Docker build cache
docker builder prune -a

# Rebuild without cache
docker compose build --no-cache
```

## Security Best Practices

1. **Use HTTPS**: Always use SSL/TLS in production
2. **Keep system updated**: Regularly run `apt update && apt upgrade`
3. **Use strong passwords**: For any services that require authentication
4. **Restrict access**: Use firewall to restrict unnecessary ports
5. **Monitor logs**: Regularly check application and system logs
6. **Backup regularly**: Set up automated backups if needed
7. **Use environment variables**: Never hardcode sensitive data

## Production Checklist

- [ ] Backend API is deployed and accessible
- [ ] VITE_API_BASE_URL is correctly set
- [ ] SSL certificate installed (HTTPS)
- [ ] Firewall configured
- [ ] Log rotation set up
- [ ] Monitoring in place
- [ ] Domain name configured (optional)
- [ ] Health checks working

## Support

If you encounter issues:

1. Check container logs: `docker compose logs -f`
2. Verify environment variables: Check `.env` file
3. Test API connectivity: `curl https://your-api-url/api/health`
4. Check Nginx logs: `tail -f /var/log/nginx/error.log` (if using external Nginx)

## Next Steps

After deployment:

1. Test all frontend features
2. Verify API connectivity
3. Set up monitoring (e.g., UptimeRobot, Pingdom)
4. Configure CDN (optional, for better performance)
5. Set up CI/CD pipeline (optional)

