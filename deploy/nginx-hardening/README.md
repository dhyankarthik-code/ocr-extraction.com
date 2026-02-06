# Nginx Hardening Guide

Since you are not using Cloudflare, we must harden Nginx to handle abusive traffic directly.

## 1. Install Configuration
Copy the provided `ddos_protection.conf` to your Nginx configuration directory (usually `/etc/nginx/conf.d/`).

```bash
sudo cp deploy/nginx-hardening/ddos_protection.conf /etc/nginx/conf.d/ddos_protection.conf
sudo nginx -t
sudo systemctl reload nginx
```

## 2. Firewall Strategy (L3/L4 Protection)
We have configured GCP Firewall to:
1.  **Block Everything** by default (`deny-all-ingress`).
2.  **Allow Only** ports 80 and 443 (`allow-http-https`).
3.  **Allow SSH** only via Google IAP (`allow-ssh-from-iap`).

This minimizes the attack surface. Only the web server is reachable.

## 3. Kernel Hardening (Optional)
To handle SYN Floods (L4 attack) better, verify your server's `sysctl.conf`:
```bash
# /etc/sysctl.conf
net.ipv4.tcp_syncookies = 1
net.ipv4.tcp_max_syn_backlog = 2048
net.ipv4.tcp_synack_retries = 2
```
