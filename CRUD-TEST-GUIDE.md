# 🧪 CRUD OPERATIONS TEST GUIDE

## Test dari Browser Console (https://pergunu.fairuzfd.dev)

Login dulu sebagai admin, lalu jalankan test ini di Browser Console:

### 1️⃣ READ - Get All Users (Admin Only)
```javascript
const API_URL = 'https://apipergunu.fairuzfd.dev/api';
const userId = localStorage.getItem('userAuth') ? JSON.parse(localStorage.getItem('userAuth')).userId : '2';

fetch(`${API_URL}/users`, {
  headers: { 'x-user-id': userId }
})
  .then(r => r.json())
  .then(d => console.log('✅ Users:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 2️⃣ READ - Get User by ID
```javascript
const testUserId = 'bdef'; // Adi Pratama

fetch(`${API_URL}/users/${testUserId}`, {
  headers: { 'x-user-id': userId }
})
  .then(r => r.json())
  .then(d => console.log('✅ User Detail:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 3️⃣ UPDATE - Update User Data
```javascript
fetch(`${API_URL}/users/bdef`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  },
  body: JSON.stringify({
    phone: '081234567999',
    address: 'Jl. Pegangsaan Timur No. 123'
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ User Updated:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 4️⃣ CREATE - Create News (Admin)
```javascript
fetch(`${API_URL}/news`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  },
  body: JSON.stringify({
    title: 'Test News from Console',
    description: 'This is a test news created via API',
    content: '<p>Test content</p>',
    category: 'berita',
    author: 'Admin Test',
    status: 'published'
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ News Created:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 5️⃣ DELETE - Delete News
```javascript
const newsIdToDelete = 'PASTE_NEWS_ID_HERE';

fetch(`${API_URL}/news/${newsIdToDelete}`, {
  method: 'DELETE',
  headers: { 'x-user-id': userId }
})
  .then(r => r.json())
  .then(d => console.log('✅ News Deleted:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 6️⃣ CREATE - Apply for Scholarship
```javascript
fetch(`${API_URL}/applications`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  },
  body: JSON.stringify({
    applicantName: 'Test User',
    applicantEmail: 'test@example.com',
    applicantPhone: '08123456789',
    scholarshipName: 'Beasiswa Test',
    motivation: 'Test motivation letter',
    status: 'pending'
  })
})
  .then(r => r.json())
  .then(d => console.log('✅ Application Created:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 7️⃣ UPDATE - Approve User
```javascript
fetch(`${API_URL}/users/bdef/approve`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-user-id': userId
  }
})
  .then(r => r.json())
  .then(d => console.log('✅ User Approved:', d))
  .catch(e => console.error('❌ Error:', e));
```

### 8️⃣ DELETE - Delete User Certificate
```javascript
// This should be done via AdminDashboard UI, but here's the API pattern:
// Backend needs endpoint: DELETE /users/:userId/certificates/:certId

console.log('⚠️ Certificate deletion via UI AdminDashboard');
```

---

## Test Certificate Upload (Via UI)

1. Login sebagai **admin**
2. Buka **Admin Dashboard**
3. Cari user "Adi Pratama" atau "Akbar Maulana"
4. Klik **Upload Sertifikat**
5. Pilih file PDF (max 10MB)
6. Klik **Upload**
7. **Expected Result**: 
   - ✅ File terupload ke file server
   - ✅ Muncul notifikasi sukses
   - ✅ Sertifikat tampil di list certificates
   - ✅ User bisa download sertifikat

---

## Test Certificate Delete (Via UI)

1. Login sebagai **admin**
2. Buka **Admin Dashboard**
3. Cari user yang punya sertifikat
4. Klik **🗑️ Delete** di certificate card
5. Confirm deletion
6. **Expected Result**: 
   - ✅ Sertifikat hilang dari list
   - ✅ File dihapus dari server
   - ✅ Database updated

---

## Common Issues & Solutions

### ❌ CORS Error saat Upload
**Solution**: File server sudah difix dengan domain whitelist. Restart file server:
```bash
pkill -f "file-server"
cd ~/
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid
```

### ❌ 401 Unauthorized
**Solution**: Pastikan `x-user-id` header dikirim. Check localStorage:
```javascript
console.log(localStorage.getItem('userAuth'));
```

### ❌ Certificate tidak muncul
**Solution**: Cek certificates array di db.json sudah terisi. Jika kosong `[]`, upload via UI.

### ❌ TypeError: certificateId.startsWith
**Solution**: Sudah difix dengan convert certificateId to string terlebih dahulu.

---

## Expected Response Format

### ✅ Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

### ❌ Error Response
```json
{
  "success": false,
  "message": "Error description",
  "error": "Error details"
}
```

---

## Checklist Before Deploy

- [ ] File server CORS fixed (whitelist pergunu.fairuzfd.dev)
- [ ] Backend users.js support string ID
- [ ] AdminDashboard certificate delete fixed
- [ ] UserDashboard fetch with x-user-id header
- [ ] db.json cleaned (Adi & Akbar certificates removed)
- [ ] All files uploaded to VM
- [ ] Services restarted (backend, frontend, file-server)

---

**Last Updated**: 5 Desember 2025  
**Test on**: https://pergunu.fairuzfd.dev
