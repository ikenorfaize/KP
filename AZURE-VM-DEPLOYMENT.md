# ===================================
# 🚀 DEPLOYMENT GUIDE - AZURE VM
# ===================================

## Prerequisites
- Azure Linux VM dengan Docker & Docker Compose installed
- Domain name pointed to your VM IP
- SSH access ke VM

## 🔧 Setup Steps

### 1. Clone Repository ke Azure VM
```bash
cd /home/azureuser
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Setup Environment Variables

#### Backend Environment (.env.docker)
```bash
cd backend
cp .env.docker .env.docker.backup  # Backup original
nano .env.docker
```

**Update these values:**
```env
NODE_ENV=production
PORT=3001
FILE_PORT=3002

# ⚠️ CRITICAL: Replace dengan domain Anda
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# Optional: Cloudinary credentials
# CLOUDINARY_CLOUD_NAME=your_cloud_name
# CLOUDINARY_API_KEY=your_api_key
# CLOUDINARY_API_SECRET=your_api_secret
```

#### Frontend Environment (Build Args in docker-compose.yml)
```bash
cd ..
nano docker-compose.yml
```

**Update frontend build args:**
```yaml
frontend:
  build:
    args:
      - VITE_API_BASE_URL=https://api.yourdomain.com/api
      - VITE_FILE_SERVER_URL=https://api.yourdomain.com
```

#### Traefik Configuration
**Update domains in docker-compose.yml:**
```yaml
traefik:
  labels:
    - "traefik.http.routers.traefik-dashboard.rule=Host(`traefik.yourdomain.com`)"

frontend:
  labels:
    - "traefik.http.routers.frontend.rule=Host(`yourdomain.com`) || Host(`www.yourdomain.com`)"

backend:
  labels:
    - "traefik.http.routers.backend.rule=Host(`api.yourdomain.com`)"
    - "traefik.http.middlewares.backend-cors.headers.accesscontrolalloworiginlist=https://yourdomain.com,https://www.yourdomain.com"
```

### 3. Setup Database
```bash
# Copy sample data ke backend folder
cd backend
# Pastikan db.json ada dengan data awal
```

### 4. Build & Deploy
```bash
# Kembali ke root folder
cd ..

# Build images (first time only)
docker-compose build --no-cache

# Start services
docker-compose up -d

# Check logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f traefik
```

### 5. Verify Deployment
```bash
# Check container status
docker-compose ps

# Test backend health
curl https://api.yourdomain.com/api/health

# Test frontend
curl https://yourdomain.com
```

## 🔄 Update Deployment

### Update Code
```bash
# SSH ke VM
ssh azureuser@your-vm-ip

# Navigate to project
cd /path/to/project

# Pull latest changes
git pull origin main

# Rebuild & restart
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Update Environment Variables Only
```bash
# Edit .env.docker
nano backend/.env.docker

# Restart backend only
docker-compose restart backend
```

### Update Frontend Build Args
```bash
# Edit docker-compose.yml
nano docker-compose.yml

# Rebuild frontend
docker-compose build frontend
docker-compose up -d frontend
```

## 🐛 Troubleshooting

### Backend tidak bisa diakses
```bash
# Check logs
docker-compose logs backend

# Check if port 3001 is listening inside container
docker exec -it backend sh -c "netstat -tuln | grep 3001"

# Check Traefik routing
docker-compose logs traefik | grep backend
```

### CORS Errors
```bash
# Verify env vars in running container
docker exec -it backend sh -c "printenv | grep ALLOWED_ORIGINS"
docker exec -it backend sh -c "printenv | grep FRONTEND_URL"

# Update .env.docker and restart
docker-compose restart backend
```

### SSL/TLS Issues
```bash
# Check Traefik logs
docker-compose logs traefik | grep -i cert

# Check ACME folder permissions
ls -la traefik/acme/

# Force cert renewal
docker-compose restart traefik
```

### Database Issues
```bash
# Check if db.json exists
docker exec -it backend ls -la /app/data/

# Check volume mount
docker volume inspect kp_backend_db

# Backup database
docker cp backend:/app/data/db.json ./backup-db.json
```

## 📊 Monitoring

### Check Service Health
```bash
# Health check
curl https://api.yourdomain.com/api/health

# Database status
curl https://api.yourdomain.com/api/admin/db-status
```

### Resource Usage
```bash
# Check Docker stats
docker stats

# Check disk space
df -h

# Check logs size
du -sh /var/lib/docker/containers/*/
```

## 🔐 Security Checklist

- [ ] Changed Traefik dashboard password
- [ ] Updated all domain names in configs
- [ ] Set proper CORS origins
- [ ] Configured Cloudinary (if using)
- [ ] SSL certificates are auto-renewed
- [ ] Database is backed up regularly
- [ ] Environment variables are not hardcoded
- [ ] Sensitive files are in .gitignore

## 🚨 Emergency Rollback
```bash
# Stop all services
docker-compose down

# Restore previous code
git checkout <previous-commit-hash>

# Rebuild and start
docker-compose build
docker-compose up -d
```

## 📝 Notes

1. **Environment Variables Priority:**
   - Docker Compose `environment:` > `.env.docker` > defaults in code

2. **Build Args vs Runtime Env:**
   - Frontend: Uses build args (baked at build time)
   - Backend: Uses runtime env vars (can change without rebuild)

3. **Domain Changes:**
   - Backend: Edit `.env.docker`, restart container
   - Frontend: Edit `docker-compose.yml` build args, **rebuild container**

4. **Database Persistence:**
   - Data stored in Docker volume `kp_backend_db`
   - Volume persists even after `docker-compose down`
   - Use `docker-compose down -v` to remove volumes (⚠️ DELETES DATA)
