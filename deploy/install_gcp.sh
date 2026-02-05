#!/bin/bash

# ============================================
# Stirling PDF Deployment Script for GCP
# Ubuntu 22.04 LTS
# ============================================

set -e  # Exit on any error

echo "🚀 Starting Stirling PDF Deployment..."

# ============================================
# 1. Update System
# ============================================
echo "📦 Updating system..."
sudo apt-get update && sudo apt-get upgrade -y

# ============================================
# 2. Install Docker
# ============================================
echo "🐳 Installing Docker..."
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

echo "✅ Docker version: $(sudo docker --version)"

# ============================================
# 3. Create Project Structure
# ============================================
echo "📁 Creating project directories..."
mkdir -p ~/stirling-pdf
cd ~/stirling-pdf
mkdir -p trainingData extraConfigs customFiles

# ============================================
# 4. Create Docker Compose
# ============================================
echo "📝 Writing Docker Compose configuration..."
cat > docker-compose.yml << 'EOF'
version: '3.3'
services:
  stirling-pdf:
    image: frooodle/s-pdf:latest
    container_name: stirling-pdf
    ports:
      - '127.0.0.1:8080:8080'
    volumes:
      - ./trainingData:/usr/share/tessdata
      - ./extraConfigs:/configs
      - ./customFiles:/customFiles/
    environment:
      - DOCKER_ENABLE_SECURITY=false
      - INSTALL_BOOK_AND_ADVANCED_HTML_OPS=false
      - SYSTEM_DEFAULT_LOCALE=en-US
      - METRICS_ENABLED=true
      # Performance (e2-medium: 2 vCPU / 4GB RAM)
      - SYSTEM_OPENOFFICE_PROCESS_COUNT=2
      - SYSTEM_JOBS_EXECUTOR_POOL_SIZE=10
      - SYSTEM_TIMEOUT_MINUTES=5
      # Cleanup (mentor suggestion)
      - SYSTEM_TEMP_FILE_RETENTION_DAYS=1
      # Branding
      - UI_APP_NAME=InfyGalaxy PDF
      - UI_HOME_DESCRIPTION=High Performance PDF Tools
      - UI_APP_NAVBAR_NAME=InfyGalaxy
    deploy:
      resources:
        limits:
          memory: 3G
    restart: unless-stopped
EOF

# ============================================
# 5. Start Stirling PDF
# ============================================
echo "🔥 Starting Stirling PDF..."
sudo docker compose up -d

# Wait for startup
sleep 10

# ============================================
# 6. Verify Installation
# ============================================
echo "🔍 Verifying installation..."
if sudo docker ps | grep -q stirling-pdf; then
    echo "✅ Stirling PDF is running!"
    echo ""
    echo "📊 Container Status:"
    sudo docker ps --filter "name=stirling-pdf" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
    echo ""
    echo "🔒 Note: Stirling is bound to localhost:8080 only."
    echo "📌 Next Step: Set up Cloudflare Tunnel to expose it securely."
else
    echo "❌ Stirling PDF failed to start. Check logs:"
    sudo docker logs stirling-pdf
    exit 1
fi

# ============================================
# 7. Install Cloudflared (Optional - Run Separately)
# ============================================
echo ""
echo "============================================"
echo "⚡ Optional: Install Cloudflare Tunnel"
echo "============================================"
echo "Run these commands to set up Cloudflare Tunnel:"
echo ""
echo "  curl -L --output cloudflared.deb https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb"
echo "  sudo dpkg -i cloudflared.deb"
echo "  cloudflared tunnel login"
echo "  cloudflared tunnel create stirling-tunnel"
echo ""
echo "============================================"
echo "🎉 Deployment Complete!"
echo "============================================"
