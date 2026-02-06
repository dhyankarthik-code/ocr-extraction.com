# Security Hardening Guide: L3/L4 DDoS Protection

To protect your infrastructure against volumetric Layer 3 (Network) and Layer 4 (Transport) attacks, we must ensure that **only** legitimate traffic processing infrastructure (Cloudflare) can reach your server.

## 1. Google Cloud Platform (GCP) Firewall

We need to close all open ports on your VM instance so that attackers cannot bypass Cloudflare and hit your IP directly.

### The Strategy
1.  **Block All Direct Ingress**: Deny all incoming connections from `0.0.0.0/0` on all ports.
2.  **Allow Cloudflare Tunnel**: Since Cloudflare Tunnel operates as an *outbound* connection from your server to Cloudflare, it does **not** requires open ingress ports. It works automatically even with all ingress blocked.
3.  **Allow Management Access**: Allow SSH access **only** via Google's Identity-Aware Proxy (IAP). This lets you use the "SSH" button in the Cloud Console without exposing Port 22 to the world.

### Implementation

 Run the provided script to set this up automatically:

```bash
cd deploy
./setup-firewall.sh
```

Or manually in Cloud Console:
1.  Go to **VPC Network** > **Firewall**.
2.  Create Rule **allow-ssh-from-iap**:
    *   Source range: `35.235.240.0/20`
    *   Protocol: `tcp:22`
    *   Targets: Your VM tags (e.g., `http-server`)
3.  Create Rule **deny-all-ingress**:
    *   Source range: `0.0.0.0/0`
    *   Action: **Deny**
    *   Priority: **Low** (e.g., 65534)
    *   Targets: Your VM tags

## 2. Cloudflare Configuration

Ensure your Cloudflare configuration is optimizing for protection.

1.  **Proxy Status**: Ensure all DNS records (A, CNAME) are **Proxied** (Orange Cloud).
2.  **Under Attack Mode**: If you are currently under attack, enable "Under Attack Mode" in the **Overview** tab of the Cloudflare Dashboard.
3.  **WAF Rules**: In **Security** > **WAF**, you can create rules to block traffic from specific countries or ASNs if you notice patterns.
