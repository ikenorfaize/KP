# PERGUNU Website - KP Project

Website resmi PERGUNU dengan sistem manajemen user dan admin dashboard.

## SETUP UNTUK DEVELOPMENT

### Prasyarat
- Node.js versi 18 atau lebih baru (Download dari: https://nodejs.org/)
- Git (Download dari: https://git-scm.com/)

### Langkah Setup (Untuk Teman Developer):

#### 1. Clone Repository
```bash
git clone <repository-url>
cd KP
```

#### 2. Install Dependencies
```bash
npm install
```

#### 3. Jalankan Aplikasi (SATU COMMAND!)
```bash
npm run demo
```

SELESAI! Aplikasi akan otomatis membuka:
- Website: http://localhost:5173
- API Server: http://localhost:3001

---

## DEMO UNTUK PRESENTASI CLIENT

### Demo Credentials:
- User Demo: demo / password: demo123
- Admin: admin / password: admin123

### Demo Flow:
1. Homepage: http://localhost:5173
2. Register: Buat user baru di /register
3. Login: Test login dengan user yang dibuat
4. Admin Panel: Login sebagai admin di /admin

---

## FITUR UTAMA

### User Features:
- Register & Login System
- Profile Management
- Certificate Upload & Download
- Responsive Design

### Admin Features:
- User Management (CRUD)
- Dashboard Analytics
- Certificate Management
- Secure Password Hashing (bcrypt)

---

## MANUAL SETUP (Jika npm run demo tidak jalan)

#### Terminal 1 - API Server:
```bash
npm run api
```

#### Terminal 2 - Website:
```bash
npm run dev
```

---

## SECURITY NOTES

- Password di-hash menggunakan bcrypt dengan salt rounds 12
- Session management dengan proper authentication
- Admin dashboard dengan role-based access
- No auto-generated passwords (manual input only)

---

## PROJECT STRUCTURE
```
KP/
├── src/
│   ├── components/     # React components
│   ├── pages/         # Page components
│   ├── assets/        # Images & static files
│   └── hooks/         # Custom React hooks
├── db.json           # JSON Server database
├── package.json      # Dependencies
└── README.md         # This file
```

---

## TROUBLESHOOTING

### Port sudah dipakai?
```bash
# Cek port yang dipakai
netstat -ano | findstr :5173
netstat -ano | findstr :3001

# Kill process
taskkill /F /PID <PID_NUMBER>
```

### Dependencies error?
```bash
# Hapus node_modules dan install ulang
rmdir /s node_modules
del package-lock.json
npm install
```

---

## SUPPORT

Jika ada masalah setup, hubungi developer atau buat issue di repository ini.
