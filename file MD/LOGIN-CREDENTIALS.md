# 🔐 LOGIN CREDENTIALS

## 📋 **Akun Yang Tersedia**

### 👤 **ADMIN ACCOUNTS**
1. **Admin Pergunu**
   - Username: `admin`
   - Password: `admin123`
   - Role: admin
   - Email: admin@pergunu.com

2. **Fairuz**
   - Username: `fairuz`
   - Password: `fairuz123`
   - Role: admin
   - Email: fairuz.fuadi04@gmail.com

### 👥 **USER ACCOUNTS**
3. **akun1**
   - Username: `akun1`
   - Password: (gunakan password asli dari database)
   - Role: user

4. **Muhammad Rizky Fajar Nugraha**
   - Username: `muhammad rizky fajar nugraha`
   - Password: (gunakan password asli dari database)
   - Role: user

5. **Adi Pratama**
   - Username: `adi`
   - Password: (gunakan password asli dari database)
   - Role: user
   - Note: User ini memiliki certificates

6. **akbar maulana**
   - Username: `akbar`
   - Password: `akbar123`
   - Role: user

## 🚀 **Cara Login**

### **Frontend (Website)**
1. Buka: http://localhost:5173/login
2. Masukkan username dan password
3. Klik login

### **Direct API Test**
```bash
# Test dengan PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/auth/login" -Method POST -Body '{"username": "admin", "password": "admin123"}' -ContentType "application/json"
```

## 🛠️ **Server Status**
- ✅ Frontend: http://localhost:5173/
- ✅ Express API: http://localhost:3001/api/
- ✅ File Server: http://localhost:3002/

## 🔧 **Troubleshooting**

Jika login tidak berhasil:
1. Pastikan semua server berjalan (`npm run full-demo`)
2. Check console browser untuk error
3. Test API langsung dengan PowerShell
4. Periksa password hash di `api/db.json`

## 📊 **Database Location**
- Main Database: `C:\Users\fairu\campus\KP\api\db.json`
- Backup: `C:\Users\fairu\campus\KP\db.json`
