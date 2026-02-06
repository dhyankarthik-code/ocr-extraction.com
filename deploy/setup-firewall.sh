#!/bin/bash

# Configuration
# Replace these with your specific values if not auto-detected
NETWORK="default"
TAG="http-server" # Standard tag for web servers, or use your specific instance tag
RULE_ALLOW_IAP="allow-ssh-from-iap"
RULE_DENY_ALL="deny-all-ingress"

echo "Configuring GCP Firewall rules for L3/L4 DDoS Protection..."
echo "Target Network: $NETWORK"

# 1. Allow SSH from Identity-Aware Proxy (IAP)
# This allows you to use the 'SSH' button in the Google Cloud Console
echo "Creating rule: $RULE_ALLOW_IAP..."
gcloud compute firewall-rules create $RULE_ALLOW_IAP \
    --network=$NETWORK \
    --direction=INGRESS \
    --action=ALLOW \
    --rules=tcp:22 \
    --source-ranges=35.235.240.0/20 \
    --target-tags=$TAG \
    --priority=1000 \
    --description="Allow SSH access only from Google Identity-Aware Proxy"

# 2. Deny All Other Ingress Traffic
# This blocks all other direct traffic to the VM, forcing traffic through Cloudflare Tunnel
echo "Creating rule: $RULE_DENY_ALL..."
gcloud compute firewall-rules create $RULE_DENY_ALL \
    --network=$NETWORK \
    --direction=INGRESS \
    --action=DENY \
    --rules=all \
    --source-ranges=0.0.0.0/0 \
    --target-tags=$TAG \
    --priority=65534 \
    --description="Deny all direct ingress traffic to prevent DDoS"

echo "✅ Firewall rules configured."
echo "Verify configuration at: https://console.cloud.google.com/networking/firewalls/list"
