# Docker Deployment Guide - fairuzfd.site

Panduan lengkap untuk deploy aplikasi menggunakan Docker dan Docker Compose dengan Traefik sebagai reverse proxy.

## 📋 Prerequisites

1. **Server/VPS** dengan:
   - Docker Engine 20.10+
   - Docker Compose v2+
   - Domain `fairuzfd.dev` yang sudah pointing ke IP server

2. **DNS Configuration** - Pastikan DNS records sudah dikonfigurasi:
  ```
  A    fairuzfd.site       → IP_SERVER
  A    www.fairuzfd.site   → IP_SERVER
  A    api.fairuzfd.site   → IP_SERVER
  A    traefik.fairuzfd.site → IP_SERVER (optional, untuk dashboard)
  ```

## 🚀 Quick Start

### 1. Clone Repository ke Server

```bash
git clone <your-repo-url> /opt/kp-app
cd /opt/kp-app
```

### 2. Setup Traefik Directories & Permissions

```bash
# Buat direktori untuk acme certificates
mkdir -p traefik/acme
mkdir -p traefik/config

# Set permissions untuk acme.json
touch traefik/acme/acme.json
chmod 600 traefik/acme/acme.json
```

### 3. Konfigurasi Environment

Edit file `backend/.env.docker` sesuai kebutuhan:

```bash
nano backend/.env.docker
```

**Penting untuk diubah:**
- `MONGODB_URI` - Connection string MongoDB
- `CLOUDINARY_*` - Jika menggunakan Cloudinary

### 4. Update Email di Traefik Config

Edit `traefik/traefik.yml` dan ganti email untuk Let's Encrypt:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@fairuzfd.site  # GANTI INI
```

### 5. Build & Run

```bash
# Build images
docker compose build

# Start semua services
docker compose up -d

# Lihat logs
docker compose logs -f
```

## 📁 Struktur File Docker

```
KP/
├── docker-compose.yml          # Main compose file
├── .dockerignore               # Docker ignore rules
├── traefik/
│   ├── traefik.yml            # Traefik static config
│   ├── config/
│   │   └── dynamic.yml        # Traefik dynamic config
│   └── acme/
│       └── acme.json          # SSL certificates (auto-generated)
├── backend/
│   ├── Dockerfile
│   ├── .dockerignore
│   └── .env.docker
└── frontend/
    ├── Dockerfile
    ├── .dockerignore
    └── nginx.conf
```

## 🔐 SSL/HTTPS Configuration

SSL certificates akan otomatis di-generate oleh Let's Encrypt melalui Traefik.

### Testing dengan Staging Server

Untuk testing, gunakan Let's Encrypt staging server untuk menghindari rate limits:

Edit `traefik/traefik.yml`:

```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      caServer: https://acme-staging-v02.api.letsencrypt.org/directory
```

⚠️ **Hapus baris ini untuk production!**

## 🌐 URL Endpoints

| Service | URL |
|---------|-----|
| Frontend | https://fairuzfd.site |
| Frontend (www) | https://www.fairuzfd.site → redirect ke https://fairuzfd.site |
| Backend API | https://api.fairuzfd.site |
| Traefik Dashboard | https://traefik.fairuzfd.site (protected) |

## 📝 Useful Commands

### Container Management

```bash
# Start semua services
docker compose up -d

# Stop semua services
docker compose down

# Restart specific service
docker compose restart frontend
docker compose restart backend

# View logs
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend
docker compose logs -f traefik

# Rebuild dan restart
docker compose up -d --build

# Force recreate containers
docker compose up -d --force-recreate
```

### Debugging

```bash
# Masuk ke container
docker compose exec frontend sh
docker compose exec backend sh

# Check container status
docker compose ps

# Check resource usage
docker stats

# Check network
docker network ls
docker network inspect kp_web
```

### SSL Certificate Troubleshooting

```bash
# Check acme.json
cat traefik/acme/acme.json | jq .

# Force certificate renewal (delete and restart)
rm traefik/acme/acme.json
touch traefik/acme/acme.json
chmod 600 traefik/acme/acme.json
docker compose restart traefik
```

## 🔧 Customization

### Mengubah Domain

Jika ingin menggunakan domain berbeda, update di:

1. `docker-compose.yml` - Semua label yang mengandung `fairuzfd.site`
2. `traefik/traefik.yml` - Email address
3. `backend/.env.docker` - CORS dan FRONTEND_URL

### Menambah Service Baru

Tambahkan di `docker-compose.yml`:

```yaml
services:
  new-service:
    build: ./new-service
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.new-service.rule=Host(`newservice.fairuzfd.site`)"
      - "traefik.http.routers.new-service.entrypoints=websecure"
      - "traefik.http.routers.new-service.tls.certresolver=letsencrypt"
    networks:
      - web
```

### Traefik Dashboard Password

Generate password baru:

```bash
# Install htpasswd (jika belum ada)
apt-get install apache2-utils

# Generate password
echo $(htpasswd -nb admin YourNewPassword) | sed -e s/\\$/\\$\\$/g
```

Update di `docker-compose.yml` pada label traefik.

## ⚠️ Security Notes

1. **Jangan commit `.env.docker` dengan credentials asli ke repository**
2. **Ganti password Traefik dashboard** dari default
3. **Backup `traefik/acme/acme.json`** untuk menghindari rate limits
4. **Set proper firewall rules** - hanya buka port 80 dan 443

## 🐛 Troubleshooting

### Certificate tidak ter-generate

1. Pastikan DNS sudah pointing ke server
2. Check apakah port 80 accessible dari internet
3. Lihat Traefik logs: `docker compose logs traefik`

### Backend tidak bisa connect ke MongoDB

1. Check `MONGODB_URI` di `.env.docker`
2. Pastikan MongoDB accessible dari container

### Frontend 404 pada refresh

Nginx sudah dikonfigurasi untuk handle SPA routing. Jika masih error:
1. Check `nginx.conf` sudah ter-copy dengan benar
2. Rebuild frontend: `docker compose build frontend`

### CORS Error

1. Update `ALLOWED_ORIGINS` di `backend/.env.docker`
2. Restart backend: `docker compose restart backend`
