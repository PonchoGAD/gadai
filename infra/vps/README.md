# VPS (Docker + Nginx) baseline

## 1) Install (Ubuntu 22.04+)
- Docker + Docker Compose plugin
- UFW (open 80/443)
- (Optional) fail2ban

## 2) Deploy
- git clone
- copy env.example -> .env
- docker compose up -d

## 3) SSL
- Use certbot with nginx (later)
