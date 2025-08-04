# 📧 PENJELASAN EMAIL SERVICE

## 🎯 Fungsi Utama EmailService.js

EmailService adalah class yang mengelola semua pengiriman email otomatis dalam aplikasi PERGUNU menggunakan EmailJS. Service ini bertanggung jawab untuk:

1. **Mengirim email approval** ketika pendaftaran disetujui
2. **Mengirim email rejection** ketika pendaftaran ditolak  
3. **Mengirim notifikasi ke admin** ketika ada pendaftaran baru
4. **Mengelola retry** jika pengiriman email gagal
5. **Menyediakan demo mode** untuk testing

## ⚙️ Konfigurasi EmailJS

### Konfigurasi Utama:
```javascript
this.emailConfig = {
  serviceId: 'service_ublbpnp',         // ID service dari EmailJS dashboard
  templateId: 'template_qnuud6d',       // ID template email yang akan digunakan
  publicKey: 'AIgbwO-ayq2i-I0ou',       // Public key untuk autentikasi EmailJS
  adminEmail: 'fairuzo1dyck@gmail.com', // Email admin yang menerima notifikasi
  isDemoMode: false                     // Set true untuk testing tanpa mengirim email sungguhan
};
```

### Konfigurasi Retry:
```javascript
this.retryConfig = {
  maxRetries: 3,      // Maksimal 3 kali percobaan
  retryDelay: 2000,   // Jeda 2 detik antar percobaan
  timeoutMs: 30000    // Timeout 30 detik per percobaan
};
```

## 🔧 Method Utama

### 1. initEmailService()
**Fungsi:** Inisialisasi EmailJS dan verifikasi konfigurasi
- Mengecek ketersediaan EmailJS di window (CDN)
- Memverifikasi konfigurasi yang diperlukan
- Menyediakan fallback ke mock service jika demo mode aktif

### 2. sendApprovalEmail(userData)
**Fungsi:** Mengirim email pemberitahuan persetujuan
- Input: userData (object berisi data user yang disetujui)
- Menggunakan template `approvalEmail` dari EmailTemplates
- Mengirim ke email pendaftar dengan credentials login

### 3. sendRejectionEmail(userData, reason)
**Fungsi:** Mengirim email pemberitahuan penolakan
- Input: userData dan reason (alasan penolakan)
- Menggunakan template `rejectionEmail` dari EmailTemplates
- Memberikan feedback dan panduan untuk daftar ulang

### 4. sendAdminNotification(userData)
**Fungsi:** Mengirim notifikasi ke admin untuk pendaftaran baru
- Input: userData (data pendaftar baru)
- Menggunakan template `adminNotification` dari EmailTemplates
- Mengirim ke email admin dengan data lengkap pendaftar

### 5. sendEmailWithRetry(emailData, retryCount = 0)
**Fungsi:** Mengirim email dengan sistem retry otomatis
- Mengulang pengiriman hingga maxRetries jika gagal
- Memberikan delay antar percobaan
- Logging detail untuk debugging

## 📝 Template Email

Service ini menggunakan 3 template utama:

### 1. Approval Email Template
- **Subject:** "🎉 Selamat! Akun PERGUNU Anda Telah Disetujui"
- **Content:** Ucapan selamat, credentials login, panduan login
- **Variables:** fullName, username, password, loginUrl

### 2. Rejection Email Template  
- **Subject:** "📝 Pendaftaran PERGUNU - Perlu Perbaikan Data"
- **Content:** Alasan penolakan, panduan perbaikan, link daftar ulang
- **Variables:** fullName, reason, registerUrl

### 3. Admin Notification Template
- **Subject:** "🔔 Pendaftaran Baru PERGUNU - [Nama Pendaftar]"
- **Content:** Data lengkap pendaftar, tombol approve/reject, panduan review
- **Variables:** Semua data dari form pendaftaran

## 🔄 Flow Pengiriman Email

### Skenario 1: Pendaftaran Baru
```
1. User submit RegisterForm
2. Data tersimpan di applications table (status: pending)
3. EmailService.sendAdminNotification() dipanggil
4. Email terkirim ke admin dengan data pendaftar
5. Admin dapat review dan ambil tindakan
```

### Skenario 2: Approval
```
1. Admin approve pendaftaran di AdminDashboard
2. Data dipindah dari applications ke users table
3. EmailService.sendApprovalEmail() dipanggil
4. Email terkirim ke pendaftar dengan credentials
5. User dapat login dengan username/password yang diberikan
```

### Skenario 3: Rejection
```
1. Admin reject pendaftaran dengan alasan
2. Status di applications diubah ke 'rejected'
3. EmailService.sendRejectionEmail() dipanggil
4. Email terkirim dengan alasan dan panduan perbaikan
5. User dapat daftar ulang setelah perbaikan
```

## 🛡️ Error Handling

### Retry Mechanism:
- Automatic retry hingga 3 kali jika gagal
- Exponential backoff delay
- Logging setiap percobaan

### Fallback Strategies:
- Demo mode untuk testing
- Mock email service untuk development
- Graceful degradation jika EmailJS tidak tersedia

### Error Logging:
```javascript
// Contoh log error
console.error('❌ Email sending failed:', {
  attempt: retryCount + 1,
  maxRetries: this.retryConfig.maxRetries,
  error: error.message,
  emailData: { to: emailData.to_email, subject: emailData.subject }
});
```

## 🔧 Debugging & Testing

### Debug Mode:
Set `debugMode: true` untuk verbose logging:
- Request/response details
- Template variables
- Retry attempts
- Timing information

### Demo Mode:
Set `isDemoMode: true` untuk testing:
- Email tidak benar-benar terkirim
- Simulate success/failure scenarios
- Log semua data tanpa side effects

### Mock Service:
Method `mockEmailSend()` menyediakan:
- Fake delay untuk simulasi network
- Random success/failure untuk testing error handling
- Console logging untuk verifikasi

## 🚀 Setup EmailJS Dashboard

### 1. Buat Service:
- Login ke EmailJS dashboard
- Buat service baru (Gmail/Outlook/dll)
- Catat serviceId yang diberikan

### 2. Buat Template:
- Buat template email dengan variabel yang diperlukan
- Gunakan variabel seperti {{to_name}}, {{message}}, dll
- Catat templateId yang diberikan

### 3. Dapatkan Public Key:
- Buka Account settings
- Copy public key untuk autentikasi
- Jangan share public key di repository publik

### 4. Test Integration:
- Gunakan tools seperti Postman atau test form
- Verifikasi email masuk ke inbox
- Check spam folder jika tidak masuk ke inbox

## 🔐 Security Considerations

### Environment Variables:
Untuk production, gunakan environment variables:
```javascript
this.emailConfig = {
  serviceId: process.env.VITE_EMAILJS_SERVICE_ID,
  templateId: process.env.VITE_EMAILJS_TEMPLATE_ID, 
  publicKey: process.env.VITE_EMAILJS_PUBLIC_KEY,
  adminEmail: process.env.VITE_ADMIN_EMAIL
};
```

### Rate Limiting:
EmailJS memiliki rate limits:
- Free plan: 200 emails/bulan
- Paid plans: unlimited tergantung paket
- Implement client-side rate limiting jika perlu

### Data Privacy:
- Jangan log sensitive data (passwords, personal info)
- Encrypt data jika disimpan di localStorage
- Follow GDPR compliance untuk user data

Dengan dokumentasi ini, semua aspek EmailService sudah dijelaskan secara detail dalam bahasa Indonesia.
