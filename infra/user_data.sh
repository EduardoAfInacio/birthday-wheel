#!/bin/bash
apt-get update -y
apt-get upgrade -y
apt-get install -y git nginx certbot python3-certbot-nginx

curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh
usermod -aG docker ubuntu

apt-get install -y docker-compose-plugin

fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab

mkdir -p /app
cd /app
git clone ${git_repo_url} .

cat <<EOF > /app/birthday-wheel-backend/.env
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:${db_password}@${db_endpoint}/birthday_wheel?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=123
MAIL_HOST=localhost
MAIL_PORT=1025
EOF

cd /app/docker
docker compose -f docker-compose.prod.yml up -d --build

sleep 10

docker compose -f docker-compose.prod.yml exec -T backend npx prisma migrate deploy

docker compose -f docker-compose.prod.yml exec -T backend npx prisma db seed

cat <<EOF > /etc/nginx/sites-available/default
server {
    listen 80;
    server_name ${domain_name} _;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

systemctl restart nginx