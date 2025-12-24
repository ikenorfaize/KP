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

**Deploy Status**: 🔴 **NEEDS DEPLOYMENT TO AZURE VM**
