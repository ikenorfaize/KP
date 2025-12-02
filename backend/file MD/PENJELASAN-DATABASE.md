# 🗄️ PENJELASAN DATABASE (db.json)

## 📊 Struktur Database JSON Server

File `db.json` adalah database berbasis JSON yang digunakan oleh JSON Server untuk menyediakan REST API. Database ini berisi data untuk development dan testing.

## 📋 Table: users
**Fungsi:** Menyimpan data pengguna yang sudah terdaftar dan disetujui

### Struktur Data User:
```json
{
  "id": "1",                    // Primary key (string)
  "fullName": "Demo User",      // Nama lengkap pengguna
  "email": "demo@pergunu.com",  // Email (unique)
  "username": "demo",           // Username untuk login (unique)
  "password": "$2b$10$...",      // Password yang sudah di-hash dengan bcryptjs
  "createdAt": "2025-01-18T10:00:00Z", // Timestamp pembuatan akun
  "role": "user",               // Role: "user" atau "admin"
  "avatar": "https://ui-avatars.com/...", // URL avatar (auto-generated)
  "certificates": [],           // Array nama file sertifikat yang dimiliki
  "downloads": 0,               // Jumlah total download sertifikat
  "lastDownload": null,         // Timestamp download terakhir
  "downloadHistory": [],        // Array riwayat download
  "profileImage": "https://...", // URL gambar profile
  "status": "active",           // Status akun: "active" atau "inactive"
  "phone": "08123456789",       // Nomor telepon
  "position": "Guru",           // Posisi/jabatan
  "address": "Alamat lengkap",  // Alamat
  "pw": "Jawa Timur",          // Pengurus Wilayah
  "pc": "Situbondo"            // Pengurus Cabang
}
```

### User Default yang Tersedia:
1. **Demo User** (ID: 1) - Role: user - untuk testing user dashboard
2. **Admin Pergunu** (ID: 2) - Role: admin - untuk testing admin dashboard

## 📋 Table: applications
**Fungsi:** Menyimpan data aplikasi pendaftaran yang belum disetujui

### Struktur Data Application:
```json
{
  "id": "app_1",                    // Primary key aplikasi
  "fullName": "Nama Pendaftar",     // Nama lengkap pendaftar
  "email": "email@example.com",     // Email pendaftar
  "phone": "08123456789",           // Nomor telepon
  "position": "Guru",               // Posisi yang dilamar
  "school": "SD Negeri 1",          // Nama sekolah/institusi
  "pw": "Jawa Timur",               // Pengurus Wilayah
  "pc": "Situbondo",                // Pengurus Cabang
  "experience": "5 tahun",          // Pengalaman kerja
  "education": "S1 Pendidikan",     // Pendidikan terakhir
  "status": "pending",              // Status: "pending", "approved", "rejected"
  "submittedAt": "2025-01-18T10:00:00Z", // Timestamp pengajuan
  "reviewedAt": null,               // Timestamp review (jika sudah direview)
  "reviewedBy": null,               // ID admin yang mereview
  "rejectionReason": null,          // Alasan penolakan (jika ditolak)
  "documents": {                    // Dokumen yang diupload
    "photo": "profile_123.jpg",     // Nama file foto profil
    "certificate": "cert_123.pdf"   // Nama file sertifikat
  }
}
```

### Status Application:
- **pending** - Menunggu review admin
- **approved** - Disetujui, akan dibuat akun user
- **rejected** - Ditolak dengan alasan tertentu

## 🔗 Relasi Antar Table

### Application → User Flow:
```
1. User submit RegisterForm → Create record di table applications (status: pending)
2. Admin review di AdminDashboard → Update status menjadi approved/rejected
3. Jika approved → Create record baru di table users
4. Send email notification → Update reviewedAt dan reviewedBy
```

### Foreign Key Relationships:
- `applications.reviewedBy` → `users.id` (admin yang mereview)
- Saat approved, data dari `applications` dipindah ke `users`

## 🛠️ API Endpoints (JSON Server)

### Users Endpoints:
```
GET    /users           // Ambil semua users
GET    /users/:id       // Ambil user by ID
POST   /users           // Tambah user baru
PUT    /users/:id       // Update user
DELETE /users/:id       // Hapus user
```

### Applications Endpoints:
```
GET    /applications         // Ambil semua applications
GET    /applications/:id     // Ambil application by ID
POST   /applications         // Submit application baru
PUT    /applications/:id     // Update application (review)
DELETE /applications/:id     // Hapus application
```

### Query Parameters:
```
GET /users?role=admin        // Filter by role
GET /applications?status=pending  // Filter by status
GET /users?_sort=createdAt&_order=desc  // Sort by date
```

## 🔐 Security Considerations

### Password Hashing:
- Semua password disimpan dalam bentuk hash menggunakan bcryptjs
- Salt rounds: 12 (tingkat kesulitan tinggi)
- Plain text password tidak pernah disimpan

### Data Validation:
- Email harus unique di table users
- Username harus unique di table users
- Required fields harus diisi
- File upload divalidasi (type dan size)

## 📈 Sample Data Statistics

### Current Data Count:
- Users: ~50 records (mix of demo users dan data testing)
- Applications: ~20 records (berbagai status untuk testing)

### Test Credentials:
```
Admin Login:
- Username: admin / Email: admin@pergunu.com
- Password: admin123

User Login:
- Username: demo / Email: demo@pergunu.com  
- Password: demo123
```

## 🚀 Development Usage

### Reset Database:
```bash
# Backup current db.json
cp db.json db_backup.json

# Reset to clean state
echo '{"users":[],"applications":[]}' > db.json

# Restart JSON Server
npm run api
```

### Add Test Data:
```bash
# POST new application
curl -X POST http://localhost:3001/applications \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test User","email":"test@example.com",...}'
```

Database ini dirancang untuk mendukung semua fitur aplikasi PERGUNU dalam environment development yang aman dan mudah di-reset.
