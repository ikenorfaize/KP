# 🚀 Deploy Featured News Feature ke Azure VM

## ⚠️ MASALAH YANG TERJADI
Error saat klik "Jadikan Utama" di production:
```
api.fairuzfd.site/api/news/1758789415408/feature: Failed to load resource: the server responded with a status of 404 ()
❌ Failed to set featured: 404
```

**Root Cause**: Backend di Azure VM belum ter-update dengan code terbaru yang include route `/api/news/:id/feature`

## ✅ SOLUSI: Deploy Update ke Azure VM

### Step 1: SSH ke Azure VM
```bash
ssh your-username@fairuzfd.site
# Masukkan password VM
```

### Step 2: Navigate ke Project Directory
```bash
cd ~/KP
# Atau cari dengan: cd $(find ~ -name "docker-compose.yml" -path "*/KP/*" -exec dirname {} \; 2>/dev/null | head -1)
```

### Step 3: Pull Latest Code
```bash
# Pull code terbaru dari GitHub
git pull origin main

# Verify commit terbaru
git log --oneline -1
# Output expected: "8f73184 feat: 'utama' fitur" atau commit yang lebih baru
```

### Step 4: Stop Containers
```bash
# Stop semua containers
docker-compose down

# Optional: Remove old images untuk force rebuild
docker-compose down --rmi local
```

### Step 5: Rebuild dengan No Cache
```bash
# Rebuild backend & frontend (PENTING: gunakan --no-cache)
docker-compose build --no-cache backend frontend

# Atau rebuild semua:
# docker-compose build --no-cache
```

### Step 6: Start Containers
```bash
# Start semua containers
docker-compose up -d

# Wait 30 detik untuk containers fully started
sleep 30
```

### Step 7: Verify Logs
```bash
# Check backend logs - PASTIKAN route /news/:id/feature terdaftar
docker-compose logs backend | grep -A 20 "API Routes"

# Expected output harus include:
# 📰 /api/news/*        - News management

# Check detail routes
docker-compose logs backend | grep "feature"
```

### Step 8: Test Endpoints di VM

#### Test 1: Health Check
```bash
curl -X GET http://localhost:3001/api/health
# Expected: {"status":"healthy", ...}
```

#### Test 2: Get News List (Check IDs)
```bash
curl -X GET http://localhost:3001/api/news | jq '.[0:3] | .[] | {id, title, featured}'
# Expected: Array of news dengan field featured (true/false)
# Catat salah satu ID untuk test berikutnya
```

#### Test 3: Set Featured News (CRITICAL TEST!)
```bash
# Ganti 1758789415408 dengan ID news yang valid dari Test 2
NEWS_ID=1758789415408

curl -X PUT http://localhost:3001/api/news/$NEWS_ID/feature \
  -H "Content-Type: application/json" \
  -H "x-user-id: admin" \
  -d '{"featured": true}'

# Expected output:
# {"success":true,"data":{"id":"1758789415408","featured":true},"message":"Featured news set successfully"}

# Jika dapat 404 atau error, berarti route belum terdaftar - REBUILD ULANG!
```

#### Test 4: Get Featured News
```bash
curl -X GET http://localhost:3001/api/news/featured
# Expected: JSON object dari news yang featured
```

#### Test 5: Toggle Off Featured
```bash
curl -X PUT http://localhost:3001/api/news/$NEWS_ID/feature \
  -H "Content-Type: application/json" \
  -H "x-user-id: admin" \
  -d '{"featured": false}'

# Expected: {"success":true,"data":{"id":"...","featured":false}, ...}
```

### Step 9: Test dari Browser

#### A. Test Admin Panel
1. Buka https://fairuzfd.site/admin (atau URL admin dashboard Anda)
2. Login sebagai admin
3. Scroll ke section "Kelola Berita"
4. Klik button "⭐ Jadikan Utama" pada salah satu berita
5. **EXPECTED HASIL:**
   - ✅ Button berubah menjadi "⭐ Berita Utama" dengan background kuning gradient
   - ✅ Card berita mendapat border kuning (2px solid)
   - ✅ Badge "⭐ Berita Utama" muncul di pojok kanan atas card
   - ✅ Berita pindah ke posisi paling atas list
   - ✅ Success notification muncul: "✅ Berita berhasil dijadikan utama!"
   - ✅ **TIDAK ADA ERROR 404** di console

6. **JIKA MASIH ERROR 404:**
   - Berarti backend belum ter-update
   - Kembali ke Step 4-6 dan rebuild dengan `--no-cache`
   - Pastikan `docker-compose.yml` menggunakan `context: ./backend` yang benar

#### B. Test Homepage (Public View)
1. Buka https://fairuzfd.site (homepage) di tab/window baru
2. Scroll ke section "Berita"
3. **EXPECTED HASIL:**
   - ✅ Berita yang di-featured muncul di card besar (`.berita-utama-card`)
   - ✅ Card memiliki border kuning
   - ✅ Badge "⭐ Berita Utama" muncul di atas card
   - ✅ Gambar dan konten sesuai dengan berita yang di-featured

#### C. Test Toggle Off
1. Kembali ke admin panel
2. Klik button "⭐ Berita Utama" (yang sudah yellow) untuk toggle off
3. **EXPECTED HASIL:**
   - ✅ Konfirmasi muncul: "Batalkan berita utama ini?"
   - ✅ Setelah OK, button kembali ke "⭐ Jadikan Utama" (white)
   - ✅ Border kuning dan badge hilang dari card
   - ✅ Success notification: "✅ Status berita utama dibatalkan!"

4. Refresh homepage → Featured section menampilkan berita terbaru sebagai fallback

## 🐛 Troubleshooting

### Problem 1: Masih 404 setelah rebuild
**Symptom**: Browser console masih menunjukkan 404 pada `/api/news/:id/feature`

**Solution**:
```bash
# 1. Check apakah route terdaftar di backend
docker-compose exec backend cat src/routes/news.js | grep "feature"
# Expected: router.put('/:id/feature', requireAuth, requireAdmin, setFeaturedNews);

# 2. Check apakah controller ter-export
docker-compose exec backend cat src/controllers/newsController.js | grep "export.*setFeaturedNews"
# Expected: export const setFeaturedNews = (req, res) => {

# 3. Force rebuild dengan remove volumes
docker-compose down --volumes --remove-orphans
docker system prune -af
git pull origin main
docker-compose build --no-cache
docker-compose up -d
sleep 30
docker-compose logs backend | grep "news"
```

### Problem 2: Button tidak berubah warna
**Symptom**: Button tetap putih setelah diklik, tidak ada perubahan visual

**Solution**:
```bash
# Check apakah frontend ter-update
docker-compose exec frontend ls -la /usr/share/nginx/html/assets/ | grep -i css
# Verify file CSS ter-update (check timestamp)

# Rebuild frontend
docker-compose down
docker-compose build --no-cache frontend
docker-compose up -d
```

### Problem 3: Featured news tidak persist setelah refresh
**Symptom**: Setelah set featured, refresh page → status featured hilang

**Solution**:
```bash
# Check db.json permissions
docker-compose exec backend ls -la /app/src/db.json
# Expected: -rw-r--r--  (readable & writable)

# Check apakah data tersimpan
docker-compose exec backend cat /app/src/db.json | jq '.news[] | select(.featured == true)'
# Expected: News object dengan featured: true

# Jika tidak ada, berarti write gagal - check logs:
docker-compose logs backend | grep -i "featured"
```

### Problem 4: CORS Error
**Symptom**: Browser console menunjukkan CORS policy error

**Solution**:
```bash
# Check CORS config di backend
docker-compose logs backend | grep -i "cors"
# Expected: CORS Origins: ..., https://fairuzfd.site

# Jika CORS error persist, restart backend:
docker-compose restart backend
```

### Problem 5: Traefik routing issues
**Symptom**: 502 Bad Gateway atau timeout

**Solution**:
```bash
# Check Traefik logs
docker-compose logs traefik | tail -50

# Verify backend is registered with Traefik
docker-compose logs traefik | grep "backend"

# Restart Traefik
docker-compose restart traefik

# Test direct to backend (bypass Traefik)
curl -X GET http://localhost:3001/api/news/featured
```

## 📊 Expected Results Summary

### Backend Logs Should Show:
```
📝 API Routes:
  🔐 /api/auth/*        - Authentication
  📰 /api/news/*        - News management    ← This should include /:id/feature
  🎓 /api/beasiswa/*    - Beasiswa management
  👥 /api/users/*       - User management
  ...
```

### API Test Results:
```bash
# GET /api/news - Should return array with featured field
[
  {
    "id": 1758789415408,
    "title": "Some Title",
    "featured": true,  ← Field exists
    ...
  }
]

# PUT /api/news/:id/feature - Should NOT return 404
{
  "success": true,
  "data": { "id": "...", "featured": true },
  "message": "Featured news set successfully"
}

# GET /api/news/featured - Should return featured news
{
  "id": 1758789415408,
  "title": "Featured News Title",
  "featured": true,
  ...
}
```

### Browser Results:
- ✅ Admin panel: Button works, no 404 error
- ✅ Admin panel: Visual feedback (yellow button, border, badge)
- ✅ Admin panel: Auto-sort (featured news at top)
- ✅ Homepage: Featured news displayed prominently
- ✅ Homepage: Real-time update when featured status changes
- ✅ Persistence: Refresh page → status tetap tersimpan

## 🎯 Quick Deploy Command (All-in-One)

Jika sudah yakin, gunakan command ini untuk deploy cepat:

```bash
cd ~/KP && \
git pull origin main && \
docker-compose down && \
docker-compose build --no-cache backend frontend && \
docker-compose up -d && \
sleep 30 && \
echo "=== Backend Logs ===" && \
docker-compose logs backend | grep -A 10 "API Routes" && \
echo "" && \
echo "=== Testing Featured Endpoint ===" && \
curl -s -X GET http://localhost:3001/api/news | jq '.[0] | {id, title, featured}' && \
echo "" && \
echo "✅ Deployment complete! Test di browser sekarang."
```

## 📞 Next Steps After Deploy

1. **Test di Admin Panel**: Klik "⭐ Jadikan Utama" → Harus berhasil tanpa 404
2. **Test di Homepage**: Featured news muncul di card besar dengan border kuning
3. **Test Toggle**: Klik lagi untuk unset → Button kembali putih
4. **Test Persistence**: Refresh page → Status featured tetap tersimpan
5. **Monitor Logs**: `docker-compose logs -f backend` untuk lihat request masuk

## ✅ Success Indicators

Deploy dianggap **BERHASIL** jika:
- ✅ No 404 error saat klik "Jadikan Utama"
- ✅ Button berubah warna (white ↔ yellow gradient)
- ✅ Featured news muncul di homepage
- ✅ Status persist setelah refresh
- ✅ Backend logs show route registered
- ✅ `curl` test returns 200 OK, bukan 404

---

**Last Updated**: 24 Desember 2025  
**Git Commit**: `8f73184 feat: 'utama' fitur`  
**Affected Files**:
- `backend/src/routes/news.js` - Route definition
- `backend/src/controllers/newsController.js` - Business logic
- `frontend/src/componen/NewsManager/NewsManager.jsx` - Admin UI
- `frontend/src/componen/NewsManager/NewsManager.css` - Styling
- `frontend/src/componen/Berita/Berita.jsx` - Homepage display

**Deploy Status**: ✅ **DEPLOYED - DEBUGGING REQUIRED**

## 🔧 DEBUGGING: Error 404 dengan "News not found"

### Symptom yang Terjadi:
```
PUT https://api.fairuzfd.site/api/news/1758789415408/feature 404 (Not Found)
❌ Failed to set featured: 404 {success: false, message: 'News not found', error: null}
```

### Root Cause Analysis:
Error message `"News not found"` (bukan "Route not found") berarti:
- ✅ Route `/api/news/:id/feature` SUDAH terdaftar
- ✅ Request SAMPAI ke controller
- ❌ News dengan ID tersebut tidak ditemukan di database

### Possible Issues:
1. **Database Sync Issue**: db.json di production berbeda dengan yang di curl test
2. **Traefik Routing**: Request dari browser tidak sampai ke backend yang benar
3. **Cache Issue**: Browser/CDN cache masih serve versi lama
4. **Frontend Not Rebuilt**: Frontend masih versi lama dengan bug

---

## 🚨 IMMEDIATE FIX - Jalankan di Azure VM:

### Step 1: Clear Browser Cache
```bash
# Di browser:
# 1. Tekan Ctrl+Shift+Delete
# 2. Clear "Cached images and files"
# 3. Hard refresh: Ctrl+Shift+R (atau Cmd+Shift+R di Mac)
```

### Step 2: Check Database News IDs
```bash
# SSH ke VM
ssh azureuser@fairuzfd.site

# Check news IDs yang ada di database
sudo docker-compose exec backend cat /app/src/db.json | jq '.news[] | {id, title, featured}'

# Output akan menunjukkan news IDs yang VALID
# Pastikan ID yang diklik di browser ADA di list ini
```

### Step 3: Rebuild Frontend (CRITICAL!)
```bash
# Frontend mungkin belum ter-rebuild dengan code terbaru
cd ~/KP2/KP

# Force rebuild frontend
sudo docker-compose build --no-cache frontend

# Restart frontend
sudo docker-compose up -d frontend

# Wait 10 detik
sleep 10

# Verify frontend updated
sudo docker-compose exec frontend ls -la /usr/share/nginx/html/assets/ | head -10
# Check timestamp - harus baru (hari ini)
```

### Step 4: Check Traefik Routing
```bash
# Check Traefik logs untuk errors
sudo docker-compose logs traefik | tail -50

# Test direct ke backend (bypass Traefik)
curl -X GET http://localhost:3001/api/news | jq '.[0:3] | .[] | {id, title}'

# Test via Traefik (external URL)
curl -X GET https://api.fairuzfd.site/api/news | jq '.[0:3] | .[] | {id, title}'

# Bandingkan output - harus sama!
```

### Step 5: Test dengan News ID yang Valid
```bash
# 1. Get valid news ID dari database
VALID_ID=$(sudo docker-compose exec backend cat /app/src/db.json | jq -r '.news[0].id')
echo "Testing with ID: $VALID_ID"

# 2. Test set featured (masih akan error "Invalid user session" tapi bukan 404!)
curl -X PUT http://localhost:3001/api/news/$VALID_ID/feature \
  -H "Content-Type: application/json" \
  -H "x-user-id: admin" \
  -d '{"featured": true}'

# Expected: {"success":false,"message":"Invalid user session"}
# Jika dapat "News not found" → ID tidak valid
```

### Step 6: Restart All Services
```bash
# Nuclear option - restart semuanya
cd ~/KP2/KP
sudo docker-compose down
sudo docker-compose up -d
sleep 30

# Check logs
sudo docker-compose logs backend | tail -20
sudo docker-compose logs frontend | tail -20
```

### Step 7: Test di Browser (FRESH)
```bash
# 1. Buka browser INCOGNITO/PRIVATE window
# 2. Go to: https://api.fairuzfd.site/api/news
# 3. Copy salah satu news ID dari response
# 4. Login ke admin: https://fairuzfd.site/admin
# 5. Cari news dengan ID tersebut
# 6. Klik "⭐ Jadikan Utama"
# 7. Check console - HARUS berhasil atau error "Invalid user session" (bukan "News not found")
```

---

## 🔍 Advanced Debugging

### Check 1: Verify Controller Logic
```bash
# Check apakah controller punya logic findOne
sudo docker-compose exec backend cat /app/src/controllers/newsController.js | grep -A 10 "setFeaturedNews"

# Expected: Harus ada findOne atau find logic untuk check news exists
```

### Check 2: Database Integrity
```bash
# Check db.json format
sudo docker-compose exec backend cat /app/src/db.json | jq '.news | length'
# Expected: Angka > 0

# Check apakah news dengan ID specific ada
sudo docker-compose exec backend cat /app/src/db.json | jq '.news[] | select(.id == 1758789415408)'
# Jika empty → news tidak ada, gunakan ID lain
```

### Check 3: Backend Environment
```bash
# Check environment variables
sudo docker-compose exec backend env | grep NODE_ENV

# Check if backend using correct db.json
sudo docker-compose exec backend ls -la /app/src/db.json
# Expected: File exists dengan size > 0
```

---

## 🎯 Quick Fix Command (All-in-One)

Jalankan ini untuk fix semua issue sekaligus:

```bash
cd ~/KP2/KP && \
echo "=== Pulling latest code ===" && \
git pull origin main && \
echo "=== Rebuilding all services ===" && \
sudo docker-compose down && \
sudo docker-compose build --no-cache && \
sudo docker-compose up -d && \
sleep 30 && \
echo "=== Checking backend ===" && \
sudo docker-compose logs backend | tail -20 && \
echo "=== Getting valid news IDs ===" && \
sudo docker-compose exec backend cat /app/src/db.json | jq -r '.news[0:3] | .[] | {id, title}' && \
echo "" && \
echo "✅ Rebuild complete! Clear browser cache dan test lagi."
```

---

## ✅ Expected Results After Fix

### Backend Should Return:
```bash
# Test dengan valid ID
curl http://localhost:3001/api/news/VALID_ID/feature
# Expected: {"success":false,"message":"Invalid user session"}
# NOT: {"success":false,"message":"News not found"}
```

### Browser Should Show:
- ✅ Klik "⭐ Jadikan Utama" → Success (atau error auth, tapi bukan "News not found")
- ✅ Console tidak ada error 404
- ✅ Button berubah warna

---

## 📞 If Still Not Working

Jalankan diagnostic ini dan kirim output ke saya:

```bash
# Diagnostic report
echo "=== DIAGNOSTIC REPORT ===" > /tmp/debug.txt
echo "1. Backend logs:" >> /tmp/debug.txt
sudo docker-compose logs backend | tail -30 >> /tmp/debug.txt
echo "" >> /tmp/debug.txt
echo "2. Valid news IDs:" >> /tmp/debug.txt
sudo docker-compose exec backend cat /app/src/db.json | jq '.news[0:5] | .[] | {id, title, featured}' >> /tmp/debug.txt
echo "" >> /tmp/debug.txt
echo "3. Test endpoint:" >> /tmp/debug.txt
FIRST_ID=$(sudo docker-compose exec backend cat /app/src/db.json | jq -r '.news[0].id')
curl -X PUT http://localhost:3001/api/news/$FIRST_ID/feature \
  -H "Content-Type: application/json" \
  -H "x-user-id: test" \
  -d '{"featured": true}' >> /tmp/debug.txt 2>&1

cat /tmp/debug.txt
```
