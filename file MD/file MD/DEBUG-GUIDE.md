# 🚨 PANDUAN DEBUGGING REGISTER FORM

## ✅ **Status Server**
- ✅ **Main App**: http://localhost:5173 (Vite server running)
- ✅ **Database**: http://localhost:3001 (JSON Server running)
- ✅ **Endpoints**: /applications tersedia

## 🔧 **Perbaikan yang Telah Dilakukan**

### **1. Anti-Refresh System**
- ✅ `e.preventDefault()` dan `e.stopPropagation()`
- ✅ Window history management
- ✅ Beforeunload event prevention
- ✅ Global error handlers
- ✅ Form keydown prevention

### **2. Enhanced Error Logging**
- ✅ Step-by-step logging untuk setiap tahap
- ✅ Detailed error information (name, message, stack)
- ✅ Email service initialization tracking
- ✅ Database response logging
- ✅ No auto-redirect pada success/error

### **3. Form Validation**
- ✅ Required field validation
- ✅ Email format check
- ✅ Error alerts dengan detail

## 📋 **Langkah Testing**

### **STEP 1: Cek Server Status**
Buka: `http://localhost:5173/test-server.html`
- Pastikan kedua server (5173 dan 3001) hijau ✅

### **STEP 2: Test Register Form**
1. Buka: `http://localhost:5173/register`
2. Isi form dengan data apapun:
   - **Nama**: Test User Debug
   - **Email**: test@debug.com
   - **Phone**: 081234567890
   - **Posisi**: Debug Tester
   - dst...

### **STEP 3: Submit & Monitor Console**
1. **SEBELUM** submit: Buka Developer Tools (F12) → Console tab
2. Klik **Submit** form
3. **JANGAN TUTUP** console - error tidak akan hilang lagi
4. Lihat log step-by-step:
   ```
   🚀 === FORM SUBMIT INTERCEPTED ===
   🔒 Preventing default form behavior...
   ✅ All form default behaviors prevented
   📋 Starting form processing...
   🔍 === FORM VALIDATION ===
   ✅ Basic validation passed
   📡 === STEP 1: DATABASE SAVE ===
   📤 Preparing database request...
   📥 Database response received
   ✅ Database save successful
   📧 === STEP 2: EMAIL NOTIFICATION ===
   📧 Starting email notification process...
   [... detail error atau success ...]
   ```

### **STEP 4: Analisis Error**
Jika ada error, lihat:
- **Error name**: `TypeError`, `NetworkError`, dll
- **Error message**: Detail apa yang salah
- **Error stack**: Di mana error terjadi
- **Email status**: Apakah EmailJS berhasil init atau gagal

## 🔍 **Common Error Patterns**

### **Database Error**
```
❌ DATABASE ERROR!
❌ Status: 500
❌ Error data: Internal Server Error
```
**Solusi**: Restart `npm run api`

### **EmailJS Not Available**
```
❌ EmailJS not found in window
❌ Failed to import @emailjs/browser
```
**Solusi**: Cek koneksi internet, EmailJS CDN

### **EmailJS Authentication Error**
```
❌ Error status: 401
❌ Unauthorized: Public key atau service ID salah
```
**Solusi**: Cek konfigurasi EmailJS di dashboard

### **Network Error**
```
❌ TypeError: Failed to fetch
🌐 Network Error: Mungkin tidak ada koneksi internet
```
**Solusi**: Cek koneksi internet

## 🛠️ **Tools Debugging Tambahan**

### **1. Quick Server Test**
- URL: `http://localhost:5173/test-server.html`
- Test konektivitas database dan main app

### **2. Emergency Debug Page**
- URL: `http://localhost:5173/debug-emergency.html`
- Test EmailJS, database, dan form submission terpisah

### **3. Console Debug Commands**
```javascript
// Load debug script
// Script src="/debug-emergency.js"

// Test commands:
testEmailJSDirect()    // Test EmailJS langsung
testDatabaseSave()     // Test database save
testKomprehensif()     // Test semua komponen
```

## 💡 **Tips Debugging**

1. **Buka Console SEBELUM submit** form
2. **Jangan tutup console** setelah submit
3. **Screenshot error** jika perlu
4. **Cek Network tab** untuk request/response detail
5. **Cek Gmail spam folder** untuk email yang mungkin terkirim

## 🎯 **Yang Harus Dilaporkan**

Jika masih ada masalah, copy-paste dari console:
1. **Full error message** beserta stack trace
2. **Step terakhir** yang berhasil (contoh: "Database save successful" tapi email gagal)
3. **Browser** yang digunakan
4. **Screenshot** console error

---

**FORM SEKARANG TIDAK AKAN REFRESH LAGI** - semua error akan tetap terlihat di console! 🕵️‍♂️
