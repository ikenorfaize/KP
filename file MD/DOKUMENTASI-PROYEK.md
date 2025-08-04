# 📋 DOKUMENTASI LENGKAP PROYEK PERGUNU

## 🎯 GAMBARAN UMUM PROYEK

**Nama Proyek:** PERGUNU (Persatuan Guru Nahdlatul Ulama)  
**Jenis:** Website Organisasi dengan Sistem Manajemen Anggota  
**Teknologi:** React.js + Node.js + JSON Server  
**Tujuan:** Platform digital untuk organisasi guru dengan fitur pendaftaran, beasiswa, berita, dan manajemen anggota

---

## 🏗️ ARSITEKTUR PROYEK

### Frontend (React.js)
```
src/
├── main.jsx              # Entry point aplikasi
├── App.jsx               # Router utama dan layout
├── App.css               # Style global
├── index.css             # Style dasar
├── componen/             # Komponen reusable
├── pages/                # Halaman lengkap
├── services/             # Service layer (API, Email)
├── hooks/                # Custom React hooks
└── assets/               # Gambar, icon, file statis
```

### Backend Services
```
- db.json                 # Database JSON (JSON Server)
- file-server.js          # Server upload file
- webhook-handler.js      # Handler webhook
```

---

## 🌐 WORKFLOW APLIKASI

### 1. ALUR PENGGUNA UMUM
```
Landing Page (/) 
    ↓
Baca Informasi (Hero, Tentang, Berita, Beasiswa, Layanan)
    ↓
Daftar Anggota (/daftar) 
    ↓
Status Tracking (cek status pendaftaran)
    ↓
Login (/login) setelah disetujui
    ↓
User Dashboard (/user-dashboard)
```

### 2. ALUR ADMIN
```
Login Admin (/login)
    ↓
Admin Dashboard (/admin)
    ↓
Kelola Data Pengguna, Approve/Reject Pendaftaran
    ↓
Kirim Email Notifikasi Otomatis
```

---

## 📱 PENJELASAN SETIAP HALAMAN

### **HALAMAN UTAMA (/)**
**File:** `src/App.jsx` (Route "/")  
**Komponen yang ditampilkan:**
- `Navbar` - Menu navigasi
- `Hero` - Banner utama dengan CTA
- `Tentang` - Informasi organisasi  
- `StatsSection` - Statistik organisasi
- `Anggota` - Informasi keanggotaan
- `Berita` - Berita terbaru
- `BeasiswaCard` - Program beasiswa
- `Layanan` - Layanan yang ditawarkan
- `StatusTracker` - Cek status pendaftaran
- `Sponsor` - Sponsor/mitra
- `Footer` - Footer dengan kontak

### **HALAMAN PENDAFTARAN (/daftar)**
**File:** `src/pages/RegisterForm/RegisterForm.jsx`  
**Fungsi:**
- Form pendaftaran anggota lengkap
- Upload foto dan sertifikat  
- Validasi data
- Integrasi email otomatis
- Simpan ke database JSON

### **HALAMAN LOGIN (/login)**
**File:** `src/pages/Login/Login.jsx`  
**Fungsi:**
- Autentikasi pengguna
- Redirect ke dashboard sesuai role (admin/user)
- Session management

### **DASHBOARD USER (/user-dashboard)**
**File:** `src/pages/UserDashboard/UserDashboard.jsx`  
**Fungsi:**
- Profile management
- Download sertifikat
- Riwayat aktivitas
- Update data pribadi

### **DASHBOARD ADMIN (/admin)**
**File:** `src/pages/AdminDashboard/AdminDashboard.jsx`  
**Fungsi:**
- Kelola semua pengguna
- Approve/reject pendaftaran
- Kirim email notifikasi
- Generate sertifikat
- Statistik pengguna

### **HALAMAN BERITA**
**File:** `src/pages/Berita/` 
- `BeritaUtama.jsx` - Berita utama
- `Berita1.jsx`, `Berita2.jsx`, `Berita3.jsx` - Artikel berita

---

## 🔧 TEKNOLOGI & LIBRARY

### Frontend Dependencies
```json
{
  "@emailjs/browser": "^4.4.1",        // Service email
  "react": "^19.1.0",                  // Framework utama
  "react-dom": "^19.1.0",             // DOM rendering
  "react-icons": "^5.5.0",            // Icon library
  "react-router-dom": "^7.7.0"        // Routing
}
```

### Backend Dependencies  
```json
{
  "express": "^5.1.0",                 // Web server
  "multer": "^2.0.2",                 // File upload
  "cors": "^2.8.5",                   // CORS handling
  "bcryptjs": "^3.0.2"                // Password hashing
}
```

### Development Tools
```json
{
  "vite": "^7.0.0",                    // Build tool
  "tailwindcss": "^4.1.11",          // CSS framework
  "json-server": "^1.0.0-beta.3",    // Mock API server
  "concurrently": "^9.2.0"           // Run multiple commands
}
```

---

## 🗃️ STRUKTUR DATABASE (db.json)

### Table: users
```json
{
  "id": "unique_id",
  "fullName": "Nama lengkap",
  "email": "email@example.com", 
  "username": "username",
  "password": "hashed_password",
  "role": "user/admin",
  "certificates": ["cert1.pdf"],
  "downloads": 0,
  "profileImage": "url_gambar"
}
```

### Table: applications  
```json
{
  "id": "unique_id",
  "fullName": "Nama lengkap",
  "email": "email@example.com",
  "phone": "nomor_telpon", 
  "position": "jabatan",
  "status": "pending/approved/rejected",
  "submittedAt": "timestamp"
}
```

---

## 📧 SISTEM EMAIL OTOMATIS

### Service: EmailJS
**File:** `src/services/EmailService.js`  
**Konfigurasi:**
- Service ID: `service_ublbpnp`
- Template ID: `template_qnuud6d` 
- Public Key: `AIgbwO-ayq2i-I0ou`
- Admin Email: `fairuzo1dyck@gmail.com`

### Email Templates
**File:** `src/services/EmailTemplates.js`
- Template persetujuan pendaftaran
- Template penolakan pendaftaran  
- Template notifikasi admin
- Template selamat datang

---

## 🚀 CARA MENJALANKAN PROYEK

### Development Mode
```bash
npm run dev          # Frontend (port 5173)
npm run api          # JSON Server (port 3001) 
npm run file-server  # File Server (port 3002)
npm run demo         # Frontend + API
npm run full-demo    # All services
```

### Production Mode
```bash
npm run build        # Build untuk production
npm run preview      # Preview build
```

---

## 🔄 ALUR DATA & API

### API Endpoints (JSON Server - Port 3001)
```
GET    /users           # Ambil semua pengguna
POST   /users           # Tambah pengguna baru
PUT    /users/:id       # Update pengguna
DELETE /users/:id       # Hapus pengguna

GET    /applications    # Ambil semua aplikasi
POST   /applications    # Submit aplikasi baru
PUT    /applications/:id # Update status aplikasi
```

### File Server (Port 3002)
```
POST   /upload          # Upload file
GET    /download/:id    # Download file
GET    /files           # List files
```

---

## 🎨 SISTEM STYLING

### TailwindCSS
- Framework CSS utility-first
- Konfigurasi: `tailwind.config.js`
- PostCSS: `postcss.config.js`

### CSS Modules
- Setiap komponen punya file CSS sendiri
- Scoped styling per komponen
- Responsive design

---

## 🔐 SISTEM KEAMANAN

### Autentikasi
- Password hashing dengan bcryptjs
- Session-based authentication
- Role-based access control (admin/user)

### File Upload
- Multer untuk handling upload
- Validasi tipe file
- Penyimpanan di folder `uploads/`

---

## 📊 FITUR UTAMA

1. **Landing Page Responsif** - Informasi organisasi lengkap
2. **Sistem Pendaftaran** - Form kompleks dengan upload file
3. **Email Otomatis** - Notifikasi berbasis EmailJS
4. **Dashboard Admin** - Manajemen anggota lengkap  
5. **Dashboard User** - Profile dan download sertifikat
6. **Status Tracking** - Cek status pendaftaran real-time
7. **Manajemen Berita** - Sistem publikasi berita
8. **Program Beasiswa** - Informasi dan pendaftaran beasiswa

---

## 🗂️ FILE PENTING

### Konfigurasi
- `package.json` - Dependencies dan scripts
- `vite.config.js` - Build configuration  
- `tailwind.config.js` - CSS framework config
- `eslint.config.js` - Code linting rules

### Entry Points
- `index.html` - HTML template utama
- `src/main.jsx` - JavaScript entry point
- `src/App.jsx` - React app router

### Database
- `db.json` - JSON database untuk development

---

Dokumentasi ini memberikan gambaran lengkap tentang struktur dan cara kerja proyek PERGUNU. Setiap file memiliki peran spesifik dalam ekosistem aplikasi.
