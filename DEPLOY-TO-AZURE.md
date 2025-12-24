# 🚀 Deploy Updates to Azure VM

## Prerequisites
- SSH access to Azure VM
- Docker and docker-compose installed on VM
- Git configured on VM

## 📋 Deployment Steps

### 1. Connect to Azure VM
```bash
# SSH to your Azure VM (replace with your actual VM address)
ssh your-username@fairuzfd.site
# OR
ssh your-username@<VM-IP-ADDRESS>
```

### 2. Navigate to Project Directory
```bash
# Navigate to your KP project directory
cd /home/your-username/KP
# OR wherever your docker-compose.yml is located
# Use: cd $(find ~ -name "docker-compose.yml" -path "*/KP/*" -exec dirname {} \; 2>/dev/null | head -1)
```

### 3. Pull Latest Code from GitHub
```bash
# Pull latest changes
git pull origin main

# Verify files updated
git log --oneline -1
# Should show: "fix: integrate file-server routes into main backend API"
```

### 4. Stop Running Containers
```bash
# Stop all containers
docker-compose down

# Optional: Remove old images to force rebuild
docker-compose down --rmi local
```

### 5. Rebuild Backend & Frontend with No Cache
```bash
# Rebuild both frontend and backend (recommended)
docker-compose build --no-cache

# OR rebuild individually:
# docker-compose build --no-cache backend
# docker-compose build --no-cache frontend
```

### 6. Start Containers
```bash
# Start all containers in detached mode
docker-compose up -d

# Wait for containers to be healthy (30-60 seconds)
sleep 30
```

### 7. Verify Deployment
```bash
# Check container status
docker-compose ps

# Check backend logs
docker-compose logs backend | tail -50

# Should see:
# 📝 API Routes:
#   📄 /upload-certificate - Certificate upload
#   🗑️  /delete-certificate/:id - Certificate delete
#   ⬇️  /download-certificate/:id - Certificate download

# Check frontend logs
docker-compose logs frontend | tail -20
```

### 8. Test Endpoints from VM
```bash
# Test health check
curl -X GET http://localhost:3001/api/health

# Test GET all news (check if featured route exists)
curl -X GET http://localhost:3001/api/news | jq '.[0] | {id, title, featured}'

# Test SET FEATURED NEWS (IMPORTANT - NEW ENDPOINT!)
# Replace 1758789415408 with actual news ID from above command
curl -X PUT http://localhost:3001/api/news/1758789415408/feature \
  -H "Content-Type: application/json" \
  -H "x-user-id: admin_user_id" \
  -d '{"featured": true}'
# Expected: {"success":true,"data":{"id":"1758789415408","featured":true},"message":"Featured news set successfully"}

# Test GET FEATURED NEWS
curl -X GET http://localhost:3001/api/news/featured
# Expected: JSON object dengan featured: true

# Test DELETE route (should return "Certificate not found" - this is correct!)
curl -X DELETE http://localhost:3001/delete-certificate/test123
# Expected: {"error":"Certificate not found"}

# Test UPLOAD route (should return "No file uploaded" - this is correct!)
curl -X POST http://localhost:3001/upload-certificate \
  -H "Content-Type: application/json" \
  -d '{"userId":"test"}'
# Expected: {"error":"No file uploaded"}
```

### 9. Test from Browser
Open browser and test:

1. **Test Featured News (NEW FEATURE!):**
   - Go to: https://fairuzfd.site/admin (or your admin dashboard URL)
   - Login as admin
   - Scroll to "Kelola Berita" section
   - Click "⭐ Jadikan Utama" button on any news
   - **Expected:** 
     - Button turns yellow with text "⭐ Berita Utama"
     - News card gets yellow border and badge
     - News moves to top of list
     - Success message appears
   - Open https://fairuzfd.site in new tab
   - Scroll to "Berita" section
   - **Expected:** Featured news appears in large card at top with yellow border
   - Go back to admin panel, click "⭐ Berita Utama" again (toggle off)
   - **Expected:** Button returns to white, highlight removed
   - Refresh homepage → Featured news section shows newest news

2. **Test Upload Certificate:**
   - Go to: https://fairuzfd.site
   - Login as admin
   - Dashboard → Manage Users
   - Click "Upload PDF" on any user
   - Select a PDF file
   - **Expected:** No 404 error, file uploads successfully

3. **Test Delete Certificate:**
   - Click ❌ (delete) on a certificate
   - **Expected:** Certificate removed from UI immediately

4. **Test Persistence (CRITICAL):**
   - Press F5 to refresh page
   - **Expected:** Deleted certificate STAYS deleted (tidak kembali lagi)

## 🔍 Troubleshooting

### Problem: Still getting 404 errors
```bash
# Check if containers are actually running
docker-compose ps

# Restart containers
docker-compose restart

# Check backend is serving on correct port
docker-compose exec backend netstat -tuln | grep 3001
```

### Problem: Old code still running
```bash
# Force remove all containers and rebuild
docker-compose down --volumes --remove-orphans
docker system prune -af
docker-compose build --no-cache
docker-compose up -d
```

### Problem: Traefik routing issues
```bash
# Check Traefik logs
docker-compose logs traefik | tail -50

# Verify backend route registered
curl -X GET https://api.fairuzfd.site/api/health
```

### Problem: CORS errors
```bash
# Check backend CORS config in logs
docker-compose logs backend | grep -i cors

# Verify Traefik CORS middleware
docker-compose config | grep -A5 "backend-cors"
```

## 📝 Verification Checklist

After deployment, verify:

- [ ] `docker-compose ps` shows all containers running
- [ ] Backend logs show file-server routes registered
- [ ] Backend logs show news routes with PUT /:id/feature
- [ ] `curl localhost:3001/api/health` returns 200 OK
- [ ] `curl localhost:3001/api/news` returns news array with featured field
- [ ] `curl localhost:3001/delete-certificate/test` returns JSON (not 404 HTML)
- [ ] Browser: https://fairuzfd.site loads correctly
- [ ] Browser: Admin can click "⭐ Jadikan Utama" button (no 404 error)
- [ ] Browser: Featured news button turns yellow when activated
- [ ] Browser: Featured news appears at top of admin news list
- [ ] Browser: Homepage displays featured news in yellow-bordered card
- [ ] Browser: Upload certificate works (no 404)
- [ ] Browser: Delete certificate works
- [ ] Browser: Refresh page - deleted certificate stays deleted
- [ ] Browser: Refresh page - featured news status persists

## 🎯 Quick Deploy (One-Liner)

If you're confident, use this one-liner:
```bash
cd $(find ~ -name "docker-compose.yml" -path "*/KP/*" -exec dirname {} \; 2>/dev/null | head -1) && \
git pull origin main && \
docker-compose down && \
docker-compose build --no-cache && \
docker-compose up -d && \
sleep 30 && \
docker-compose logs backend | tail -30
```

## 🔐 Alternative: Use Git SSH Key
If git pull asks for password:
```bash
# Check remote URL
git remote -v

# If using HTTPS, switch to SSH
git remote set-url origin git@github.com:your-username/KP.git
```

## 📞 Need Help?
- Check logs: `docker-compose logs -f backend`
- Check container health: `docker-compose ps`
- Restart: `docker-compose restart backend frontend`
- Full rebuild: `docker-compose down && docker-compose up -d --build`
