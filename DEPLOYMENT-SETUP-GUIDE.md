# 🚀 PANDUAN DEPLOYMENT & MAINTENANCE WEBSITE PERGUNU

## 📋 Informasi Server

- **VM**: Azure Ubuntu (20.2.83.176)
- **User**: azureuser
- **Domains**:
  - Frontend: https://pergunu.fairuzfd.site
  - Backend API: https://apipergunu.fairuzfd.site
  - File Server: https://fspergunu.fairuzfd.site
 - Frontend: https://pergunu.fairuzfd.site
 - Backend API: https://apipergunu.fairuzfd.site
 - File Server: https://fspergunu.fairuzfd.site

## 🔧 Setup Awal (Hanya Sekali)

### 1. Install Dependencies di VM
```bash
# SSH ke VM
ssh azureuser@20.2.83.176

# Install Node.js 22
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install cloudflared
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb

# Clone/Upload project
# Backend ke ~/backend
# Frontend ke ~/frontend
# File server ke ~/ (file-server.js)
```

### 2. Setup Cloudflare Tunnel
```bash
# Login cloudflare
cloudflared tunnel login

# Buat tunnel
cloudflared tunnel create pergunu-vm

# Edit config
nano ~/.cloudflared/config.yml
```

Isi `config.yml`:
```yaml
tunnel: pergunu-vm
credentials-file: /home/azureuser/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: pergunu.fairuzfd.site
    service: http://localhost:5173
  - hostname: apipergunu.fairuzfd.site
    service: http://localhost:3001
  - hostname: fspergunu.fairuzfd.site
    service: http://localhost:3002
  - service: http_status:404
    - hostname: pergunu.fairuzfd.site
    - hostname: apipergunu.fairuzfd.site
    - hostname: fspergunu.fairuzfd.site
```

### 3. Setup DNS di Cloudflare Dashboard
Tambahkan 3 CNAME records:
- `pergunu` → `<TUNNEL_ID>.cfargotunnel.com`
- `apipergunu` → `<TUNNEL_ID>.cfargotunnel.com`
- `fspergunu` → `<TUNNEL_ID>.cfargotunnel.com`

---

## 🚀 Cara Menjalankan Website (Setelah Restart/Update)

### Step 1: SSH ke VM
```bash
ssh azureuser@20.2.83.176
```

### Step 2: Start Cloudflare Tunnel
```bash
# Jalankan tunnel di background
nohup cloudflared tunnel run pergunu-vm > cloudflared.log 2>&1 &

# Cek tunnel aktif
ps aux | grep cloudflared | grep -v grep
```

### Step 3: Start Backend API
```bash
cd ~/backend
nohup node src/index-refactored.js > backend.log 2>&1 & echo $! > backend.pid

# Cek backend running
curl http://localhost:3001/api/health
```

### Step 4: Start File Server
```bash
cd ~/
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid

# Cek file server
curl http://localhost:3002/
```

### Step 5: Start Frontend (Vite)
```bash
cd ~/frontend
nohup npx vite --host 0.0.0.0 --force > frontend.log 2>&1 & echo $! > frontend.pid

# Tunggu 5 detik lalu test
sleep 5
curl http://localhost:5173
```

### Step 6: Verifikasi Semua Berjalan
```bash
# Cek semua process
ps aux | grep -E "(cloudflared|node|vite)" | grep -v grep

# Cek semua port listening
ss -tlnp | grep -E "(5173|3001|3002)"

# Test via tunnel
curl -I https://pergunu.fairuzfd.site
curl https://apipergunu.fairuzfd.site/api/health
```

---

## 🔄 Update Kode (Setelah Edit Lokal)

### 1. Upload File yang Diubah
Dari laptop/local:
```powershell
# Upload backend
scp "c:\Users\fairu\campus\KP\backend\src\routes\users.js" azureuser@20.2.83.176:~/backend/src/routes/users.js

# Upload frontend
scp "c:\Users\fairu\campus\KP\frontend\src\pages\AdminDashboard\AdminDashboard.jsx" azureuser@20.2.83.176:~/frontend/src/pages/AdminDashboard/AdminDashboard.jsx
```

### 2. Restart Service yang Diupdate

**Jika update BACKEND:**
```bash
ssh azureuser@20.2.83.176
pkill -f "index-refactored"
cd ~/backend
nohup node src/index-refactored.js > backend.log 2>&1 & echo $! > backend.pid
```

**Jika update FRONTEND:**
```bash
ssh azureuser@20.2.83.176
pkill -9 -f vite
cd ~/frontend
nohup npx vite --host 0.0.0.0 --force > frontend.log 2>&1 & echo $! > frontend.pid
```

**Jika update FILE SERVER:**
```bash
ssh azureuser@20.2.83.176
pkill -f "file-server"
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid
```

---

## 🛑 Cara Stop Semua Services

```bash
# Stop frontend
pkill -9 -f vite

# Stop backend
pkill -f "index-refactored"

# Stop file server
pkill -f "file-server"

# Stop tunnel
pkill cloudflared
```

---

## 🐛 Troubleshooting

### Website tidak bisa diakses (Error 1033)
```bash
# Cek tunnel mati
ps aux | grep cloudflared | grep -v grep

# Jika tidak ada, restart tunnel
nohup cloudflared tunnel run pergunu-vm > cloudflared.log 2>&1 &
```

### Login gagal / 401 error
```bash
# Cek backend logs
cd ~/backend
tail -50 backend.log

# Restart backend
pkill -f "index-refactored"
nohup node src/index-refactored.js > backend.log 2>&1 & echo $! > backend.pid
```

### Frontend blank / tidak muncul
```bash
# Cek Vite logs
cd ~/frontend
tail -50 frontend.log

# Jika ada error node_modules
rm -rf node_modules package-lock.json .vite-temp
npm install
nohup npx vite --host 0.0.0.0 --force > frontend.log 2>&1 & echo $! > frontend.pid
```

### Gambar tidak muncul
```bash
# Cek file server
curl http://localhost:3002/

# Restart file server
pkill -f "file-server"
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid
```

---

## 📊 Monitoring

### Cek Status Semua Services
```bash
#!/bin/bash
echo "=== CLOUDFLARE TUNNEL ==="
ps aux | grep cloudflared | grep -v grep && echo "✅ Running" || echo "❌ Stopped"

echo -e "\n=== BACKEND API (3001) ==="
curl -s http://localhost:3001/api/health && echo "✅ Running" || echo "❌ Stopped"

echo -e "\n=== FILE SERVER (3002) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:3002 && echo "✅ Running" || echo "❌ Stopped"

echo -e "\n=== FRONTEND VITE (5173) ==="
curl -s -o /dev/null -w "HTTP %{http_code}\n" http://localhost:5173 && echo "✅ Running" || echo "❌ Stopped"

echo -e "\n=== RESOURCE USAGE ==="
free -h | grep Mem
df -h / | tail -1
```

Save script di atas sebagai `~/check-status.sh` dan jalankan:
```bash
chmod +x ~/check-status.sh
./check-status.sh
```

---

## 🔐 Login Credentials

**Admin:**
- Username: `admin`
- Password: `admin123`

**Test User:**
- Username: `bdefuser`
- Password: `password`

---

## 📁 Struktur Directory di VM

```
~/
├── backend/
│   ├── src/
│   │   ├── index-refactored.js  (Main API server)
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── routes/
│   │   └── utils/
│   ├── db.json  (Database)
│   ├── backend.log
│   └── backend.pid
├── frontend/
│   ├── src/
│   ├── node_modules/
│   ├── frontend.log
│   └── frontend.pid
├── src/
│   └── file-server.js  (File upload server)
├── uploads/  (User uploaded files)
├── cloudflared.log
└── .cloudflared/
    ├── config.yml
    └── <tunnel-id>.json
```

---

## 🎯 Checklist Setelah Restart VM

- [ ] SSH ke VM berhasil
- [ ] Cloudflare tunnel running
- [ ] Backend API responding (curl health check)
- [ ] File server responding
- [ ] Frontend Vite serving
- [ ] https://pergunu.fairuzfd.dev accessible
- [ ] Login admin berhasil
- [ ] Dashboard admin muncul data users
- [ ] Upload/delete sertifikat works
- [ ] User login berhasil
- [ ] User dashboard muncul sertifikat

---

## 📞 Emergency Recovery

Jika semua gagal:
```bash
# Full restart
ssh azureuser@20.2.83.176
pkill -9 -f vite
pkill -f node
pkill cloudflared

# Wait 5 seconds
sleep 5

# Start from scratch
nohup cloudflared tunnel run pergunu-vm > cloudflared.log 2>&1 &
cd ~/backend && nohup node src/index-refactored.js > backend.log 2>&1 & echo $! > backend.pid
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid
cd ~/frontend && nohup npx vite --host 0.0.0.0 --force > frontend.log 2>&1 & echo $! > frontend.pid

# Wait 10 seconds then check
sleep 10
curl -I https://pergunu.fairuzfd.dev
```

---

**Terakhir diupdate**: 5 Desember 2025  
**Maintainer**: fairuz  
**Support**: Check logs di `*.log` files untuk debugging
