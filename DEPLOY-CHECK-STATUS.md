# Deployment: Check Application Status Feature

## 📋 OVERVIEW

Fitur baru untuk mengecek status pendaftaran beasiswa berdasarkan email dengan informasi lengkap termasuk kontak admin WhatsApp.

## ✨ FEATURES

### **Backend API**
- **Endpoint:** `GET /api/check-status/:email`
- **Response Status:**
  - `pending` → "Sedang diproses"
  - `approved` → "Disetujui" + Kontak admin WhatsApp
  - `rejected` → "Ditolak" + Catatan admin
  - `not_found` → "Email tidak terdaftar"

### **Frontend Improvements**
- ✅ Popup alert untuk status `rejected`
- ✅ Popup alert untuk status `approved` dengan nomor WhatsApp
- ✅ Tombol WhatsApp langsung ke chat admin
- ✅ Status visual yang jelas (pending/approved/rejected)
- ✅ Error handling yang robust

## 🚀 DEPLOYMENT TO AZURE VM

### **Step 1: SSH to Server**
```bash
ssh azureuser@fairuzfd.site
cd ~/KP2/KP
```

### **Step 2: Pull Latest Changes**
```bash
git pull origin main
# Commit: eed27e0 "feat: add check application status API with WhatsApp contact"
```

### **Step 3: Rebuild Docker Images**
```bash
sudo docker-compose build --no-cache backend frontend
```

### **Step 4: Restart Containers**
```bash
sudo docker-compose down
sudo docker-compose up -d
```

### **Step 5: Verify API**
```bash
# Test check-status endpoint
curl https://api.fairuzfd.site/api/check-status/fairuz4@gmail.com

# Expected response:
# {
#   "success": true,
#   "message": "Selamat! Pendaftaran Anda telah disetujui...",
#   "application": {
#     "id": "...",
#     "email": "fairuz4@gmail.com",
#     "fullName": "eko",
#     "status": "approved",
#     "adminContact": "082143006775",
#     ...
#   }
# }
```

## 🧪 TESTING CHECKLIST

### **Test Backend API**
```bash
# Test 1: Approved application
curl https://api.fairuzfd.site/api/check-status/fairuz4@gmail.com

# Test 2: Pending application  
curl https://api.fairuzfd.site/api/check-status/akbar@gmail.com

# Test 3: Not found
curl https://api.fairuzfd.site/api/check-status/notexist@example.com
```

### **Test Frontend**
1. Buka https://fairuzfd.site
2. Scroll ke section "Cek Status Pendaftaran"
3. Masukkan email: `fairuz4@gmail.com` (approved)
4. Klik "🔍 Cek Status"
5. **Verify:**
   - ✅ Popup muncul: "PENDAFTARAN DISETUJUI" dengan nomor WA
   - ✅ Status card menampilkan kontak admin
   - ✅ Tombol "💬 Chat Admin via WhatsApp" berfungsi
   - ✅ Link WhatsApp: `https://wa.me/082143006775`

6. Test rejected: `dwad@gmail.com` (jika ada yang rejected)
   - ✅ Popup muncul: "PENDAFTARAN DITOLAK"
   - ✅ Catatan admin ditampilkan

7. Test pending: `akbar@gmail.com`
   - ✅ Status: "Sedang diproses"
   - ✅ Instruksi menunggu ditampilkan

## 📁 FILES CHANGED

### **New Files:**
```
backend/src/controllers/statusController.js  (108 lines)
backend/src/routes/status.js                 (9 lines)
```

### **Modified Files:**
```
backend/src/index-refactored.js              (+2 lines - import & route)
frontend/src/componen/StatusTracker/StatusTracker.jsx  (+20 lines - popup logic)
```

## 🔧 CONFIGURATION

### **Admin Contact**
Nomor WhatsApp admin hardcoded di:
- **File:** `backend/src/controllers/statusController.js`
- **Line:** 39
- **Value:** `'082143006775'`

Untuk mengubah:
```javascript
// backend/src/controllers/statusController.js line 39
const adminContact = '082143006775'; // ← Ubah nomor disini
```

## 💡 STATUS FLOW

```
User input email → API check → Database lookup
                                      ↓
                              ┌───────┴───────┐
                              │               │
                          Found           Not Found
                              │               │
                     ┌────────┴────────┐      │
                     │                 │      │
                  pending           status    │
                     │                 │      │
                     ↓                 ↓      ↓
              "Sedang diproses"   approved/  "Email tidak
                                  rejected   terdaftar"
                                      │
                                      ↓
                                  Show popup
                                  + contact info
```

## 🐛 TROUBLESHOOTING

### **Problem: 404 Not Found**
```bash
# Check if route registered
sudo docker-compose logs backend | grep "check-status"
# Should see: ✅ /api/check-status/:email - Check application status
```

### **Problem: 500 Internal Server Error**
```bash
# Check backend logs
sudo docker-compose logs backend | tail -50

# Common causes:
# - Database file missing
# - Applications collection empty
# - Invalid email format
```

### **Problem: Popup tidak muncul**
- Buka Browser DevTools → Console
- Cek error JavaScript
- Verify `data.application.adminContact` exists untuk approved

### **Problem: WhatsApp button tidak berfungsi**
- Cek format nomor: harus tanpa spasi/karakter khusus
- Format: `082143006775` bukan `082-143-006-775`
- Link format: `https://wa.me/082143006775`

## 📊 API RESPONSE EXAMPLES

### **Approved Application**
```json
{
  "success": true,
  "message": "Selamat! Pendaftaran Anda telah disetujui. Silakan hubungi admin di WhatsApp: 082143006775",
  "application": {
    "id": "...",
    "email": "fairuz4@gmail.com",
    "fullName": "eko",
    "position": "N/A",
    "school": "N/A",
    "status": "approved",
    "submittedAt": "2025-01-10T...",
    "processedAt": null,
    "notes": "",
    "adminContact": "082143006775"
  }
}
```

### **Pending Application**
```json
{
  "success": true,
  "message": "Pendaftaran Anda sedang dalam proses review oleh admin. Mohon tunggu untuk update selanjutnya.",
  "application": {
    "id": "...",
    "email": "akbar@gmail.com",
    "status": "pending",
    ...
    "adminContact": null
  }
}
```

### **Rejected Application**
```json
{
  "success": true,
  "message": "Pendaftaran Anda ditolak. Silakan periksa catatan dari admin dan lakukan pendaftaran ulang jika diperlukan.",
  "application": {
    "status": "rejected",
    "notes": "Data tidak lengkap",
    "adminContact": null,
    ...
  }
}
```

### **Not Found**
```json
{
  "success": false,
  "message": "Email tidak terdaftar dalam sistem kami. Pastikan Anda telah melakukan pendaftaran.",
  "application": null
}
```

## ✅ DEPLOYMENT READY

**Commit:** `eed27e0`  
**Branch:** `main`  
**Status:** Ready for production deployment

**Deployment Command:**
```bash
ssh azureuser@fairuzfd.site
cd ~/KP2/KP
git pull origin main
sudo docker-compose build --no-cache backend frontend
sudo docker-compose up -d
```

**Testing URL:**  
https://fairuzfd.site → Scroll to "Cek Status Pendaftaran"

**API Endpoint:**  
https://api.fairuzfd.site/api/check-status/:email
