# ========================================
# 🔑 DAFTAR LOGIN CREDENTIALS
# ========================================
# File ini berisi daftar username dan password untuk semua akun
# Password sudah di-hash di database dengan bcrypt

# ========================================
# 👨‍💼 ADMIN ACCOUNTS
# ========================================

Username: admin
Email: admin@pergunu.com
Password: admin123
Role: Admin
Status: ✅ Active
Notes: Akun admin utama

Username: fairuz
Email: fairuz.fuadi04@gmail.com  
Password: fairuz123
Role: Admin
Status: ✅ Active
Notes: Admin secondary

# ========================================
# 👤 USER ACCOUNTS
# ========================================

Username: adi
Email: adi@pergunu.com
Password: adi123
Role: User
Status: ✅ Active
Notes: Guru Agama

Username: akbar
Email: akbar@gmail.com
Password: akbar123
Role: User
Status: ✅ Active

Username: joko_699
Email: dwad@gmail.com
Password: joko123
Role: User
Status: ✅ Active

Username: muhammad rizky fajar nugraha
Email: muhammad.rizky@gmail.com
Password: rizky123
Role: User
Status: ✅ Active

# ========================================
# 📝 CARA RESET PASSWORD
# ========================================

Jika ingin ganti password, jalankan di terminal:

```powershell
cd C:\Users\fairu\campus\KP\backend
node -e "import bcrypt from 'bcryptjs'; const hash = await bcrypt.hash('YOUR_NEW_PASSWORD', 10); console.log('Hash:', hash);"
```

Lalu copy hash tersebut dan update di db.json

# ========================================
# 🔐 PASSWORD HASHES (untuk reference)
# ========================================

admin123 hash: $2b$10$c3O0Qp3CNrr4EOfTTqXpE.sd2.TkYjkqCoEoyetIHbqokMOHKPGnG
adi123 hash: $2b$10$DwaCujaHhNeqQIdI6gauV.JfspES7PGltLb/6uEkv.28u0eUa7eUq
akbar123 hash: $2b$12$eY.Y/iSdyfKGQx6VRQNWBeMH8bKg8SLwVlPy0wpRfTJ6hN/Yr/TDC
fairuz123 hash: $2b$10$6pE1WctiTVHxUnEqMjZ8ceGPT.fKqpzYaHYqnq7xZmQGqYqDqJ8fi
joko123 hash: $2b$10$R7uviqJIkZFjl9LxG3h6IukVYqMJKnZB6xjPX7SLqvqCh0kMH7vqm
rizky123 hash: $2b$12$Bqosep7m3z5sZgGqx9aLL.IslbPwTIkxWkrQaaBY4f2HcNF17I/.W

# ========================================
# 🧪 TEST LOGIN
# ========================================

1. Buka browser: http://localhost:5173/login
2. Gunakan salah satu kredensial di atas
3. Jika gagal, cek console browser (F12) untuk error

# ========================================
# ⚠️ TROUBLESHOOTING
# ========================================

Jika masih tidak bisa login:

1. Cek backend running: http://localhost:3001/api/health
2. Cek users di API: http://localhost:3001/api/users
3. Test login via curl:
   ```powershell
   Invoke-RestMethod -Uri http://localhost:3001/api/auth/login -Method POST -Headers @{'Content-Type'='application/json'} -Body '{"username":"admin","password":"admin123"}' | ConvertTo-Json
   ```

4. Jika ada error "Invalid credentials", berarti password hash tidak cocok
   - Solusi: Generate hash baru dan update di db.json
