# HTTPS Setup Guide

## Why HTTPS is Required

Push notifications **require HTTPS** in production. Service workers only work over HTTPS (except localhost for development). This guide shows how to set up HTTPS using various reverse proxy solutions.

## Option 1: Nginx Reverse Proxy (Recommended)

### Prerequisites
- Domain name pointing to your server
- Nginx installed
- Certbot for Let's Encrypt SSL

### Step 1: Install Nginx and Certbot

```bash
# Ubuntu/Debian
sudo apt update
sudo apt install nginx certbot python3-certbot-nginx

# CentOS/RHEL
sudo yum install nginx certbot python3-certbot-nginx
```

### Step 2: Configure Nginx

Create `/etc/nginx/sites-available/push-notifications`:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration (will be managed by certbot)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    # Security Headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;

    # API Backend
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Frontend
    location / {
        proxy_pass http://localhost:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # Service Worker
    location /sw.js {
        proxy_pass http://localhost:5173/sw.js;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        add_header Service-Worker-Allowed "/";
        add_header Cache-Control "no-cache";
    }
}
```

### Step 3: Enable Configuration

```bash
sudo ln -s /etc/nginx/sites-available/push-notifications /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Step 4: Get SSL Certificate

```bash
sudo certbot --nginx -d your-domain.com
```

Certbot will automatically:
- Obtain SSL certificate
- Update Nginx configuration
- Set up auto-renewal

### Step 5: Verify Auto-Renewal

```bash
sudo certbot renew --dry-run
```

## Option 2: Caddy (Easiest - Automatic HTTPS)

Caddy automatically handles SSL certificates with zero configuration.

### Install Caddy

```bash
# Ubuntu/Debian
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/caddy-stable-archive-keyring.gpg] https://dl.cloudsmith.io/public/caddy/stable/deb/debian any-version main" | sudo tee /etc/apt/sources.list.d/caddy-stable.list
sudo apt update
sudo apt install caddy
```

### Configure Caddy

Create `/etc/caddy/Caddyfile`:

```caddy
your-domain.com {
    # API Backend
    reverse_proxy /api/* localhost:3000

    # Frontend
    reverse_proxy /* localhost:5173

    # Security headers
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        X-XSS-Protection "1; mode=block"
    }
}
```

### Start Caddy

```bash
sudo systemctl enable caddy
sudo systemctl start caddy
```

That's it! Caddy automatically obtains and renews SSL certificates.

## Option 3: Traefik (Docker Native)

If you're using Docker Compose, Traefik is excellent.

### Add to docker-compose.yml

```yaml
version: '3.8'

services:
  traefik:
    image: traefik:v2.10
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=your-email@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
      - "./letsencrypt:/letsencrypt"
    restart: unless-stopped

  backend:
    # Your existing backend config
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.backend.rule=Host(`your-domain.com`) && PathPrefix(`/api`)"
      - "traefik.http.routers.backend.entrypoints=websecure"
      - "traefik.http.routers.backend.tls.certresolver=myresolver"
      - "traefik.http.services.backend.loadbalancer.server.port=3000"

  frontend:
    # Your existing frontend config
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.frontend.rule=Host(`your-domain.com`)"
      - "traefik.http.routers.frontend.entrypoints=websecure"
      - "traefik.http.routers.frontend.tls.certresolver=myresolver"
      - "traefik.http.services.frontend.loadbalancer.server.port=5173"
```

## Option 4: Cloudflare (CDN + SSL)

If you use Cloudflare for DNS, you get free SSL automatically.

1. Add your domain to Cloudflare
2. Update nameservers to Cloudflare's
3. Enable "Full (Strict)" SSL mode
4. Enable "Always Use HTTPS"
5. Point A record to your server IP

Cloudflare provides:
- Automatic SSL certificates
- DDoS protection
- CDN caching
- Rate limiting

## Environment Variable Updates

Update your `.env` files:

```bash
# Backend .env
API_URL=https://your-domain.com/api
FRONTEND_URL=https://your-domain.com

# Frontend .env
VITE_API_URL=https://your-domain.com/api
```

## Testing HTTPS Setup

### 1. SSL Labs Test
Visit: https://www.ssllabs.com/ssltest/analyze.html?d=your-domain.com

### 2. Security Headers Test
Visit: https://securityheaders.com/?q=your-domain.com

### 3. Manual Test

```bash
# Test HTTPS connection
curl -I https://your-domain.com

# Test API
curl https://your-domain.com/api/health

# Check SSL certificate
openssl s_client -connect your-domain.com:443 -servername your-domain.com
```

## Production Checklist

- [ ] SSL certificate installed and valid
- [ ] HTTP redirects to HTTPS
- [ ] Security headers configured
- [ ] Auto-renewal set up (Let's Encrypt)
- [ ] Service worker accessible over HTTPS
- [ ] API endpoints work over HTTPS
- [ ] No mixed content warnings in browser
- [ ] SSL Labs grade A or better
- [ ] HSTS header enabled
- [ ] Certificate expiry monitoring set up

## Troubleshooting

### Mixed Content Errors
Ensure all resources (images, scripts, API calls) use HTTPS or relative URLs.

### Service Worker Not Registering
- Verify service worker is served over HTTPS
- Check `Service-Worker-Allowed` header
- Verify correct MIME type (`application/javascript`)

### Certificate Renewal Fails
```bash
# Check renewal logs
sudo cat /var/log/letsencrypt/letsencrypt.log

# Test renewal
sudo certbot renew --dry-run
```

### Nginx 502 Bad Gateway
- Check backend is running: `sudo systemctl status push-notifications`
- Verify port 3000 is accessible: `curl http://localhost:3000/health`
- Check Nginx error logs: `sudo tail -f /var/log/nginx/error.log`

## Additional Security Recommendations

1. **Use Strong SSL Protocols**: TLSv1.2 and TLSv1.3 only
2. **Enable HSTS**: Force HTTPS for 1 year minimum
3. **Implement Certificate Pinning**: For mobile apps
4. **Monitor Certificate Expiry**: Set up alerts 30 days before
5. **Use OCSP Stapling**: Improve SSL handshake performance
6. **Regular Security Updates**: Keep reverse proxy updated

## References

- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [Mozilla SSL Configuration Generator](https://ssl-config.mozilla.org/)
- [OWASP Transport Layer Protection](https://cheatsheetseries.owasp.org/cheatsheets/Transport_Layer_Protection_Cheat_Sheet.html)
