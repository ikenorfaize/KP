# 📧 Panduan Setup EmailJS Template

## 🔧 Langkah Setup di Dashboard EmailJS

### 1. Login ke EmailJS Dashboard
- Buka: https://dashboard.emailjs.com/
- Login dengan akun Anda

### 2. Edit Template `template_qnuud6d`
- Pergi ke: Email Templates > `template_qnuud6d`
- Pastikan Subject berisi: `{{subject}}`

### 3. Atur Email Body (HTML) dengan HANYA ini:
```html
{{message_html}}
```

**PENTING**: 
- ❌ JANGAN tambahkan HTML lain di Body
- ❌ JANGAN gunakan {{applicant_name}} di Body
- ✅ HANYA gunakan `{{message_html}}`

### 4. Atur Reply-To (Optional)
- Di bagian Settings template
- Reply-To: `{{reply_to}}`
- Ini memungkinkan admin balas langsung ke email pendaftar

### 5. Test Template
- Save template
- Gunakan Test button dengan sample data
- Pastikan HTML template muncul dengan baik

---

## 🧪 Variables yang Dikirim ke EmailJS

Template akan menerima variable berikut:

| Variable | Nilai | Keterangan |
|----------|-------|------------|
| `to_email` | fairuzo1dyck@gmail.com | Email admin |
| `to_name` | Admin PERGUNU | Nama penerima |
| `subject` | 🔔 Pendaftaran Baru PERGUNU - [Nama] | Subject email |
| `message_html` | [Full HTML Template] | **Template HTML lengkap** |
| `applicant_name` | [Nama Pendaftar] | Backup jika dibutuhkan |
| `applicant_email` | [Email Pendaftar] | Backup jika dibutuhkan |
| `reply_to` | [Email Pendaftar] | Untuk reply langsung |

---

## ✅ Hasil yang Diharapkan

Setelah setup benar:
1. ✅ Email sampai ke `fairuzo1dyck@gmail.com`
2. ✅ HTML template tampil rapi dengan styling
3. ✅ Data pendaftar lengkap (nama, email, phone, sekolah, dll)
4. ✅ Tombol "Review & Approve" berfungsi
5. ✅ Admin bisa reply langsung ke pendaftar

---

## 🐛 Troubleshooting

### Email tidak sampai?
- Cek Spam/Junk folder
- Cek Service ID dan Template ID di `EmailService.js`
- Cek Public Key di EmailJS dashboard

### HTML tidak tampil?
- Pastikan Body template HANYA berisi: `{{message_html}}`
- Jangan tambahkan HTML manual lainnya

### Console error?
- Lihat browser console (F12 → Console)
- Cek log detail di `RegisterForm` saat submit

---

## 🎯 Next Steps

1. **Setup EmailJS template** sesuai panduan di atas
2. **Test form registration** di `http://localhost:5173/daftar`
3. **Cek email masuk** di Gmail admin
4. **Verify console logs** untuk debugging

**Jika masih ada masalah, share screenshot EmailJS template setup dan console logs!**
