# 🔐 LOGIN SYSTEM GUIDE

## 📋 **User Account Types**

### 👤 **ADMIN ACCOUNTS**
1. **Admin Users**
   - Role: admin
   - Access: Full system administration
   - Permissions: Manage users, content, applications

### 👥 **REGULAR USER ACCOUNTS**
2. **Standard Users**
   - Role: user
   - Access: User dashboard, applications
   - Permissions: View content, submit applications

## 🔑 **Authentication Method**
- Users can login with either **username** or **email**
- Passwords are securely hashed using bcrypt
- Rate limiting prevents brute force attacks
- Sessions are managed securely

## 🛡️ **Security Features**
- Input validation and sanitization
- Rate limiting (5 attempts per 15 minutes)
- Secure session management
- Password strength requirements
- CORS protection

**⚠️ SECURITY NOTE:** 
Default credentials should be changed immediately in production environments. Contact system administrator for access credentials.

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
