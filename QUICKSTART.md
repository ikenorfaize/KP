# ===================================
# 🎯 QUICK START GUIDE
# ===================================

## 🔥 LOCAL DEVELOPMENT

### 1. Setup Backend
```bash
cd backend

# Copy environment file
cp .env.local .env

# Edit .env jika perlu (sudah diset untuk localhost)
# nano .env

# Install dependencies
npm install

# Start backend server
npm start
```

**Backend akan jalan di:** `http://localhost:3001`

### 2. Setup Frontend
```bash
cd frontend

# Copy environment file
cp .env.local .env

# Edit .env jika perlu (sudah diset untuk localhost)
# nano .env

# Install dependencies
npm install

# Start development server
npm run dev
```

**Frontend akan jalan di:** `http://localhost:5173`

---

## 🚀 DEPLOY KE AZURE VM

### Quick Deploy (Sudah punya Docker)
```bash
# SSH ke Azure VM
ssh azureuser@your-vm-ip

# Clone repo (first time)
git clone https://github.com/your-username/your-repo.git
cd your-repo

# Update environment variables
nano backend/.env.docker
# ⚠️ GANTI: ALLOWED_ORIGINS, FRONTEND_URL dengan domain Anda

# Update docker-compose.yml
nano docker-compose.yml
# ⚠️ GANTI: Semua domain fairuzfd.site dengan domain Anda

# Build & start
docker-compose build
docker-compose up -d

# Check logs
docker-compose logs -f
```

### Update Deployment
```bash
# Pull latest code
git pull origin main

# Rebuild & restart
docker-compose build
docker-compose up -d
```

---

## ✅ CHECKLIST SEBELUM DEPLOY

### Backend (.env.docker)
- [ ] `ALLOWED_ORIGINS` berisi domain Anda
- [ ] `FRONTEND_URL` berisi domain frontend Anda
- [ ] `PORT=3001` dan `FILE_PORT=3002`

### Frontend (docker-compose.yml build args)
- [ ] `VITE_API_BASE_URL` berisi URL backend API Anda
- [ ] `VITE_FILE_SERVER_URL` berisi URL backend Anda

### Docker Compose (docker-compose.yml)
- [ ] Semua `Host(...)` berisi domain Anda
- [ ] CORS middleware berisi domain Anda
- [ ] Traefik dashboard password sudah diganti

---

## 🔍 VERIFIKASI

### Local Development
```bash
# Test backend
curl http://localhost:3001/api/health

# Test frontend
open http://localhost:5173
```

### Production (Azure VM)
```bash
# Test backend
curl https://api.yourdomain.com/api/health

# Test frontend
curl https://yourdomain.com

# Check containers
docker-compose ps
```

---

## 📚 DOCUMENTATION

- **Full Deployment Guide:** [AZURE-VM-DEPLOYMENT.md](AZURE-VM-DEPLOYMENT.md)
- **Docker Guide:** [DOCKER-DEPLOYMENT-GUIDE.md](DOCKER-DEPLOYMENT-GUIDE.md)
- **Setup Guide:** [DEPLOYMENT-SETUP-GUIDE.md](DEPLOYMENT-SETUP-GUIDE.md)

---

## 🆘 TROUBLESHOOTING

### "CORS error" di browser
**Penyebab:** Frontend domain tidak ada di `ALLOWED_ORIGINS`
**Fix:**
```bash
# Edit backend/.env.docker
nano backend/.env.docker
# Tambahkan domain frontend Anda ke ALLOWED_ORIGINS

# Restart backend
docker-compose restart backend
```

### "Cannot connect to backend"
**Penyebab:** Frontend masih pakai localhost URL
**Fix:**
```bash
# Edit docker-compose.yml
nano docker-compose.yml
# Update VITE_API_BASE_URL ke URL backend Anda

# Rebuild frontend (HARUS rebuild)
docker-compose build frontend
docker-compose up -d frontend
```

### "Database not found"
**Penyebab:** db.json tidak ada atau volume tidak di-mount
**Fix:**
```bash
# Copy db.json ke backend folder
cp mongodb-import/*.json backend/src/

# Check volume mount
docker-compose down
docker-compose up -d
```

---

## 🎓 KEY CONCEPTS

### Environment Variables
- **Backend:** Runtime vars dari `.env.docker` (bisa diubah tanpa rebuild)
- **Frontend:** Build-time vars dari `docker-compose.yml` args (⚠️ HARUS rebuild jika ubah)

### Ports
- Backend: `3001` (internal container, exposed via Traefik)
- Frontend: `80` (internal container, exposed via Traefik)
- Traefik: `80` (HTTP), `443` (HTTPS)

### Domains (Contoh)
- Frontend: `https://yourdomain.com`
- Backend API: `https://api.yourdomain.com`
- Traefik Dashboard: `https://traefik.yourdomain.com`

---

## ⚡ QUICK COMMANDS

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# Restart service
docker-compose restart backend

# View logs
docker-compose logs -f backend

# Rebuild service
docker-compose build backend

# Update & restart
git pull && docker-compose build && docker-compose up -d
```
