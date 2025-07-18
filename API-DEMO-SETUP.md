# API Demo Setup untuk Presentasi Client

## Langkah Setup API GRATIS untuk Demo:

### 1. Install JSON Server (Mock API)
```bash
npm install -g json-server
```

### 2. Jalankan Mock API Server  
```bash
# Di terminal terpisah, jalankan:
json-server --watch db.json --port 3001

# API endpoints akan tersedia di:
# http://localhost:3001/users      (GET, POST, PUT, DELETE)
# http://localhost:3001/news       (GET, POST, PUT, DELETE) 
# http://localhost:3001/sessions   (GET, POST, PUT, DELETE)
```

### 3. Test API dengan Browser
- GET users: http://localhost:3001/users
- GET single user: http://localhost:3001/users/1

## Demo Credentials (Passwords Now Encrypted):
⚠️ **IMPORTANT**: All passwords are now encrypted with bcrypt!
Original passwords untuk login:

- **Admin Login:**
  - Username: `admin` atau Email: `admin@pergunu.com`
  - Password: `admin123`
  - Role: admin
  
- **Demo User Login:**
  - Username: `demo` atau Email: `demo@pergunu.com`
  - Password: `demo123`
  - Role: user

- **Test User Login:**
  - Username: `fajar123` atau Email: `fajar@example.com`
  - Password: `fajar123`
  - Role: user

- **Luwak User Login:**
  - Username: `luwakwhitecoffe` atau Email: `luwakwhitecoffe@gmail.com`
  - Password: `luwak123`
  - Role: user

- **Irwan User Login:**
  - Username: `irwan` atau Email: `irwan@gmail.com`
  - Password: `irwan`
  - Role: user

🔐 **Security Features:**
- ✅ Password di-encrypt dengan bcrypt (salt rounds: 12)
- ✅ Admin/Developer tidak bisa melihat password asli
- ✅ Password verification menggunakan hash comparison
- ✅ Session management untuk keamanan login

## Cara Presentasi ke Client:
1. Jalankan `npm run dev` (port 5173)
2. Jalankan `json-server --watch db.json --port 3001` (port 3001)
3. Demo register user baru
4. Demo login dengan user yang sudah register
5. Show data tersimpan di API (buka http://localhost:3001/users)

## Alternative: LocalStorage Demo
Jika tidak mau install JSON Server, gunakan localStorage browser untuk demo sederhana.

## Production Nanti:
- Firebase Authentication (FREE tier)
- Supabase (FREE tier)  
- Atau custom backend Node.js + MongoDB/PostgreSQL
