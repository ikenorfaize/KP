# 🧪 LANGKAH DEBUG YANG HARUS DILAKUKAN

## 1. Buka Browser yang Benar
```
http://localhost:5173
```

## 2. Buka Developer Console
- Tekan `F12`
- Pilih tab `Console`
- Pastikan tidak ada error merah

## 3. Copy-Paste Test Code
Copy dan paste kode berikut ke console:

```javascript
console.clear();
console.log('🧪 QUICK EMAIL TEST');

(async function quickTest() {
  try {
    // Import EmailJS
    const emailjs = await import('@emailjs/browser');
    console.log('✅ EmailJS imported');
    
    // Init
    emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Send test email dengan variable names PERSIS seperti template
    const result = await emailjs.send(
      'service_ublbpnp', 
      'template_qnuud6d', 
      {
        to_email: 'fairuzo1dyck@gmail.com',
        name: 'Admin PERGUNU',
        applicant_name: 'Test User Console',
        applicant_email: 'test@example.com',
        applicant_phone: '08123456789',
        applicant_position: 'Tester',
        application_date: new Date().toLocaleDateString('id-ID')
      }
    );
    
    console.log('✅ EMAIL SENT:', result);
    alert('✅ Test berhasil! Cek Gmail: fairuzo1dyck@gmail.com');
    
  } catch (error) {
    console.error('❌ TEST FAILED:', error);
    alert('❌ Test gagal: ' + error.message);
  }
})();
```

## 4. Hasil yang Diharapkan

### ✅ Jika Berhasil:
```
🧪 QUICK EMAIL TEST
✅ EmailJS imported
✅ EmailJS initialized
✅ EMAIL SENT: {status: 200, text: "OK"}
```

### ❌ Jika Gagal:
Akan muncul error message yang spesifik.

## 5. Cek Gmail
- Login ke `fairuzo1dyck@gmail.com`
- Cek folder **Inbox**
- Cek folder **Spam**
- Cek folder **Promotions**

## 6. Jika Masih Gagal
Beri tahu error message yang muncul di console!
