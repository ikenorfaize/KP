# ⚠️ PENTING: Setup Environment Variables di Vercel

## Masalah Saat Ini
MongoDB tidak terkoneksi di Vercel karena `MONGODB_URI` belum di-set di Vercel Dashboard.

## Langkah-langkah Setup:

### 1. Buka Vercel Dashboard
Kunjungi: https://vercel.com/fairuzs-projects-d3e0b8cf/kp/settings/environment-variables

### 2. Tambahkan Environment Variable Berikut:

**Variable Name:**
```
MONGODB_URI
```

**Value:**
```
mongodb+srv://fairuzo1dyck_db_user:8jRYtyQs0Ektu5N8@cluster01.7tyzyh4.mongodb.net/pergunu_db?retryWrites=true&w=majority
```

**Environment:** 
- ✅ Production
- ✅ Preview
- ✅ Development

### 3. Save dan Redeploy

Setelah menambahkan environment variable, lakukan redeploy:

```powershell
vercel --prod --yes
```

### 4. Verifikasi MongoDB Connection

Setelah redeploy selesai, jalankan:

```powershell
.\migrate-mongodb.ps1
```

Output yang diharapkan:
```json
{
    "useMongoDB": true,    // ← Harus true!
    "isConnected": true,
    "collections": {
        "users": 6,
        "news": 8,
        "beasiswa": 6,
        "applications": 8,
        "beasiswa_applications": 0
    }
}
```

### 5. Jalankan Migrasi Data

Kalau MongoDB sudah connect (`useMongoDB: true`), script otomatis akan migrate data dari `db.json` ke MongoDB.

---

## Kenapa MongoDB Tidak Connect?

Vercel **TIDAK** membaca file `.env` dari repository. Environment variables harus di-set manual di Vercel Dashboard untuk setiap project.

File `.env` hanya digunakan untuk development local.

---

## Troubleshooting

### Problem: "MongoDB not connected" setelah set MONGODB_URI

**Solusi:**
1. Pastikan MONGODB_URI di-copy dengan benar (tidak ada spasi atau karakter tambahan)
2. Cek MongoDB Atlas: pastikan IP `0.0.0.0/0` sudah di-whitelist di Network Access
3. Redeploy ulang setelah menambahkan environment variable
4. Tunggu 1-2 menit setelah deployment untuk cold start

### Problem: Data masih muncul kembali setelah dihapus

**Penyebab:** MongoDB belum diisi data, jadi sistem fallback ke `db.json` yang selalu di-copy ulang.

**Solusi:** 
1. Setup `MONGODB_URI` di Vercel (langkah di atas)
2. Redeploy
3. Jalankan `.\migrate-mongodb.ps1`
4. Setelah migrasi berhasil, data akan persist di MongoDB dan tidak akan kembali lagi

---

## Setelah Setup Selesai

Anda bisa test approve/reject di admin panel:
- URL: https://kp-mocha.vercel.app/admin
- Approve/reject akan langsung tersimpan di MongoDB
- Data tidak akan hilang setelah refresh
- User yang dihapus tidak akan muncul kembali

---

## Environment Variables yang Sudah Ter-set di Vercel

✅ VITE_API_BASE_URL
✅ VITE_FILE_SERVER_URL  
✅ CLOUDINARY_CLOUD_NAME
✅ CLOUDINARY_API_KEY
✅ CLOUDINARY_API_SECRET

❌ MONGODB_URI ← **PERLU DITAMBAHKAN MANUAL**
