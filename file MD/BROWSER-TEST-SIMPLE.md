# 🧪 TEST EMAILJS - CARA MUDAH

## Opsi 1: Test dari Register Form Langsung

### Langkah:
1. Buka `http://localhost:5173`
2. Klik "Daftarkan Diri Anda" 
3. Isi form dengan data test:
   - **Nama:** Test User Browser
   - **Email:** test@example.com  
   - **Phone:** 08123456789
   - **Posisi:** Tester
   - Isi field lainnya seadanya
4. Klik **Submit**
5. Lihat console (F12) untuk log
6. Cek email `fairuzo1dyck@gmail.com`

## Opsi 2: Test dengan Script yang Dimodifikasi

Buka console dan paste ini:

```javascript
console.clear();
console.log('🧪 EMAILJS TEST - Direct Method');

// Test jika EmailJS sudah tersedia globally
if (window.emailjs) {
  console.log('✅ EmailJS sudah tersedia');
  
  // Send test
  window.emailjs.send(
    'service_ublbpnp', 
    'template_qnuud6d', 
    {
      to_email: 'fairuzo1dyck@gmail.com',
      name: 'Admin PERGUNU',
      applicant_name: 'Test User Direct',
      applicant_email: 'test@example.com',
      applicant_phone: '08123456789',
      applicant_position: 'Tester',
      application_date: new Date().toLocaleDateString('id-ID')
    }
  ).then(function(result) {
    console.log('✅ EMAIL SENT:', result);
    alert('✅ Test berhasil! Cek Gmail');
  }).catch(function(error) {
    console.error('❌ TEST FAILED:', error);
    alert('❌ Test gagal: ' + error.message);
  });
  
} else {
  console.log('❌ EmailJS tidak tersedia di window');
  console.log('💡 Gunakan Opsi 1: Test via Register Form');
}
```

## Opsi 3: Test dengan CDN EmailJS

```html
<!-- Jika ingin test manual, tambahkan ini ke index.html: -->
<script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js"></script>
<script>
emailjs.init('AIgbwO-ayq2i-I0ou');
</script>
```

---

**REKOMENDASI: Pakai Opsi 1 dulu (test via form register) karena paling mudah!**
