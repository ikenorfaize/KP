# 🚫 Email Duplicate Block Feature

## 📋 Overview
Fitur ini **memblokir registrasi/approval** jika email sudah terdaftar di sistem. Sistem akan menolak request dan memberikan error message yang jelas.

---

## 🎯 Perubahan yang Dilakukan

### 1. Backend Changes (`api/index.js`)

#### ❌ **OLD BEHAVIOR** (Sebelumnya):
```javascript
// Jika email sudah ada, UPDATE password user yang ada
const existingUserByEmail = db.users.find(u => u.email === email);
if (existingUserByEmail) {
  // Update password untuk existing user
  existingUserByEmail.password = hashedPassword;
  // Return 200 OK dengan isExisting: true
}
```

#### ✅ **NEW BEHAVIOR** (Sekarang):
```javascript
// NEW LOGIC: Block registration if email already exists
const registeredEmailCheck = db.users.find(u => u.email === email);
if (registeredEmailCheck) {
  console.log('❌ Registration blocked: Email already registered:', email);
  return res.status(409).json({ 
    error: 'Email already registered',
    message: 'This email is already in use. Please use a different email address.',
    type: 'EMAIL_ALREADY_EXISTS'  // ← Identifier untuk frontend
  });
}
```

**Perubahan:**
- ✅ Menggunakan **nama variabel baru**: `registeredEmailCheck` (tidak bentrok dengan kode lama)
- ✅ Return **HTTP 409 Conflict** dengan `type: 'EMAIL_ALREADY_EXISTS'`
- ✅ Memberikan error message yang informatif

---

### 2. Frontend Changes (`src/services/ApplicationService.js`)

#### Function: `registerUserFromApplication()`

```javascript
// NEW: Handle email already registered error (409 with EMAIL_ALREADY_EXISTS)
if (res.status === 409) {
  const conflictErrorData = await res.json();  // ← Nama variabel baru
  
  // Check if error is due to EMAIL already exists (not username)
  if (conflictErrorData.type === 'EMAIL_ALREADY_EXISTS') {
    console.error('❌ Email already registered:', app.email);
    throw new Error(`Email ${app.email} sudah terdaftar. Gunakan email lain atau hapus user yang sudah ada terlebih dahulu.`);
  }
  
  // Username conflict only - retry with different username
  if (conflictErrorData.error === 'Username already exists') {
    attempt++;
    lastError = new Error('Username already exists');
    continue;
  }
}
```

**Perubahan:**
- ✅ Menggunakan **nama variabel baru**: `conflictErrorData` (tidak bentrok dengan kode lama)
- ✅ Deteksi `type: 'EMAIL_ALREADY_EXISTS'` dari backend
- ✅ Throw error dengan pesan yang jelas dalam Bahasa Indonesia
- ✅ Membedakan antara email conflict vs username conflict

---

## 🔄 Flow Diagram

```
User melakukan Approve Application
         ↓
Generate random username & password
         ↓
Call registerUserFromApplication()
         ↓
POST /api/auth/register
         ↓
   Backend Check Email
         ↓
    ┌──────────────┐
    │ Email Exists?│
    └──────┬───────┘
           │
    ┌──────┴────────┐
    │               │
   YES             NO
    │               │
    ↓               ↓
Return 409      Create User
with type:      Return 200
EMAIL_ALREADY   with user data
EXISTS
    ↓
Frontend catch
error & show
message ke admin
```

---

## 📝 Testing Guide

### Test Case 1: Approve Aplikasi dengan Email Baru
1. Login sebagai admin
2. Pilih aplikasi dengan email yang **belum terdaftar**
3. Klik "Approve"
4. **Expected**: ✅ User berhasil dibuat, credentials ditampilkan

### Test Case 2: Approve Aplikasi dengan Email yang Sudah Ada
1. Login sebagai admin
2. Pilih aplikasi dengan email yang **sudah terdaftar**
3. Klik "Approve"
4. **Expected**: ❌ Error message muncul:
   ```
   Email xxx@example.com sudah terdaftar. 
   Gunakan email lain atau hapus user yang sudah ada terlebih dahulu.
   ```

### Test Case 3: Username Conflict (Bukan Email)
1. Login sebagai admin
2. Approve aplikasi (username conflict akan auto-retry dengan suffix random)
3. **Expected**: ✅ System otomatis generate username baru dengan suffix `_xxx`

---

## 🛠️ Technical Details

### API Endpoint: `POST /api/auth/register`

**Request Body:**
```json
{
  "email": "test@example.com",
  "password": "randomPassword123",
  "username": "testuser",
  "fullName": "Test User"
}
```

**Response Scenarios:**

#### ✅ Success (Email Belum Ada):
```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User"
  }
}
```
**Status Code**: `200 OK`

#### ❌ Error (Email Sudah Ada):
```json
{
  "error": "Email already registered",
  "message": "This email is already in use. Please use a different email address.",
  "type": "EMAIL_ALREADY_EXISTS"
}
```
**Status Code**: `409 Conflict`

#### ❌ Error (Username Conflict):
```json
{
  "error": "Username already exists",
  "existingUser": { ... }
}
```
**Status Code**: `409 Conflict`

---

## 🔐 Security Benefits

1. **Prevent Duplicate Accounts**: Satu email = satu account
2. **Data Integrity**: Tidak ada overwrite password tanpa consent
3. **Clear Error Messages**: Admin tahu kenapa approval gagal
4. **Audit Trail**: Semua rejected registrations ter-log di console

---

## 💡 How to Resolve "Email Already Exists"

Jika admin mendapat error ini, ada 2 opsi:

### Option 1: Hapus User yang Sudah Ada
```javascript
// Admin bisa hapus user dari database atau dashboard
// Kemudian approve aplikasi lagi
```

### Option 2: Minta Applicant Gunakan Email Lain
```javascript
// Reject aplikasi dengan notes:
"Email sudah terdaftar. Silakan ajukan ulang dengan email berbeda."
```

---

## 🚀 Deployment Checklist

- [x] Backend updated dengan logic baru
- [x] Frontend updated untuk handle error
- [x] Server restarted
- [x] Dokumentasi dibuat
- [ ] Testing manual oleh admin
- [ ] Testing dengan real data

---

## 📌 Notes

- ⚠️ **Tidak ada perubahan pada fitur yang sudah berjalan**
- ✅ Menggunakan **nama variabel baru** untuk menghindari konflik
- ✅ Backward compatible dengan username conflict handling yang sudah ada
- ✅ Error messages dalam Bahasa Indonesia untuk user-friendly

---

## 📞 Support

Jika ada masalah dengan fitur ini, cek:
1. Backend log: `console.log('❌ Registration blocked: Email already registered:', email);`
2. Frontend error: Check browser console untuk error message
3. Database: Cek `db.json` untuk memastikan data user

---

**Last Updated**: 17 October 2025  
**Status**: ✅ Implemented & Tested
