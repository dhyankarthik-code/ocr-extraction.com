#!/bin/bash
# Quick deployment script for Nginx security setup
# External IP: 34.123.26.52
# Domain: pdf-api.ocr-extraction.com

echo "Creating Nginx security setup script..."

cat > ~/nginx_secure_setup.sh << 'SCRIPT_END'
#!/bin/bash
set -e

# Nginx Reverse Proxy + Security Hardening Setup
# Run this script on your GCP Ubuntu VM

echo "================================================"
echo "Stirling PDF - Nginx Security Setup"
echo "================================================"

# 1. Stop Cloudflare Tunnel (if running)
echo "Step 1: Stopping Cloudflare Tunnel..."
sudo systemctl stop cloudflared 2>/dev/null || true
sudo systemctl disable cloudflared 2>/dev/null || true

# 2. Update system
echo "Step 2: Updating system packages..."
sudo apt-get update
sudo apt-get upgrade -y

# 3. Install Nginx
echo "Step 3: Installing Nginx..."
sudo apt-get install -y nginx

# 4. Install Certbot for SSL
echo "Step 4: Installing Certbot..."
sudo apt-get install -y certbot python3-certbot-nginx

# 5. Install fail2ban for DDoS protection
echo "Step 5: Installing fail2ban..."
sudo apt-get install -y fail2ban

# 6. Install UFW firewall
echo "Step 6: Configuring UFW firewall..."
sudo apt-get install -y ufw

# Configure UFW
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable

# 7. Configure Nginx reverse proxy
echo "Step 7: Configuring Nginx..."
sudo tee /etc/nginx/sites-available/stirling-pdf > /dev/null <<'EOF'
# Rate limiting zone
limit_req_zone $binary_remote_addr zone=stirling_limit:10m rate=10r/s;
limit_conn_zone $binary_remote_addr zone=addr:10m;

server {
    listen 80;
    server_name pdf-api.ocr-extraction.com;

    # Temporary: Allow HTTP for Certbot verification
    location /.well-known/acme-challenge/ {
        root /var/www/html;
    }

    # Redirect all other HTTP to HTTPS (will be enabled after SSL setup)
    location / {
        return 301 https://$server_name$request_uri;
    }
}

server {
    listen 443 ssl http2;
    server_name pdf-api.ocr-extraction.com;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/pdf-api.ocr-extraction.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/pdf-api.ocr-extraction.com/privkey.pem;

    # SSL configuration - A+ rating
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';
    ssl_prefer_server_ciphers off;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;
    ssl_stapling on;
    ssl_stapling_verify on;

    # Security headers
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains; preload" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self';" always;

    # Rate limiting
    limit_req zone=stirling_limit burst=20 nodelay;
    limit_conn addr 10;

    # Max request size (50MB for PDF uploads)
    client_max_body_size 50M;

    # Disable nginx version exposure
    server_tokens off;

    # Logging
    access_log /var/log/nginx/stirling_access.log;
    error_log /var/log/nginx/stirling_error.log;

    # Proxy to Stirling PDF on localhost:8080
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Timeouts for large file uploads
        proxy_connect_timeout 600s;
        proxy_send_timeout 600s;
        proxy_read_timeout 600s;
        send_timeout 600s;
        
        # Buffering
        proxy_buffering off;
        proxy_request_buffering off;
    }

    # Health check endpoint (no auth needed)
    location /api/v1/info/status {
        proxy_pass http://127.0.0.1:8080;
        access_log off;
    }
}
EOF

# Enable the site
sudo ln -sf /etc/nginx/sites-available/stirling-pdf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# 8. Configure fail2ban for Nginx
echo "Step 8: Configuring fail2ban..."
sudo tee /etc/fail2ban/jail.local > /dev/null <<'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = admin@ocr-extraction.com
sendername = Fail2Ban
action = %(action_mwl)s

[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/stirling_error.log

[nginx-limit-req]
enabled = true
port = http,https
logpath = /var/log/nginx/stirling_error.log
maxretry = 10

[nginx-botsearch]
enabled = true
port = http,https
logpath = /var/log/nginx/stirling_access.log
maxretry = 2
EOF

# Create custom fail2ban filter for rate limiting
sudo tee /etc/fail2ban/filter.d/nginx-limit-req.conf > /dev/null <<'EOF'
[Definition]
failregex = limiting requests, excess:.* by zone.*client: <HOST>
ignoreregex =
EOF

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban

# 9. Test Nginx configuration (will fail because SSL certs don't exist yet - that's OK)
echo "Step 9: Testing Nginx configuration..."
sudo nginx -t || echo "Note: Nginx test failed because SSL certificates don't exist yet. This is expected."

# 10. Start Nginx in HTTP-only mode first
echo "Step 10: Temporarily disabling HTTPS..."
sudo sed -i 's/listen 443/# listen 443/' /etc/nginx/sites-available/stirling-pdf
sudo sed -i 's/ssl_certificate/# ssl_certificate/' /etc/nginx/sites-available/stirling-pdf
sudo sed -i 's/ssl_/# ssl_/' /etc/nginx/sites-available/stirling-pdf
sudo sed -i 's/add_header/# add_header/' /etc/nginx/sites-available/stirling-pdf

# Test again
sudo nginx -t
sudo systemctl restart nginx

echo ""
echo "================================================"
echo "Initial Setup Complete!"
echo "================================================"
echo ""
echo "External IP: 34.123.26.52"
echo ""
echo "NEXT STEPS:"
echo ""
echo "1. Add DNS Record in Hostinger:"
echo "   - Type: A"
echo "   - Name: pdf-api"
echo "   - Points to: 34.123.26.52"
echo "   - TTL: 14400"
echo ""
echo "2. Wait 5-10 minutes for DNS propagation, then test:"
echo "   nslookup pdf-api.ocr-extraction.com"
echo ""
echo "3. Once DNS works, run SSL setup:"
echo "   sudo certbot --nginx -d pdf-api.ocr-extraction.com --non-interactive --agree-tos --email admin@ocr-extraction.com"
echo ""
echo "4. Re-enable HTTPS in Nginx:"
echo "   sudo nano /etc/nginx/sites-available/stirling-pdf"
echo "   (Uncomment all the lines starting with #)"
echo ""
echo "5. Restart Nginx:"
echo "   sudo systemctl restart nginx"
echo ""
echo "================================================"
SCRIPT_END

chmod +x ~/nginx_secure_setup.sh
echo "Script created! Running it now..."
sudo ~/nginx_secure_setup.sh
