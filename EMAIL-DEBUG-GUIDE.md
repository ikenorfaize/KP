# 🔍 Email Debugging Guide - Checklist Lengkap

## 🚀 Langkah Testing Segera

### 1. Test Form Registration (Browser Console)
```bash
# Buka browser
http://localhost:5173/daftar

# Buka Console (F12 → Console)
# Isi form dan submit, perhatikan log:
✅ "Email berhasil dikirim ke: fairuz.fuadi04@gmail.com"
❌ "Email gagal: [error message]"
```

### 2. Test Direct EmailJS (Browser Console)
```javascript
// Load test script
const script = document.createElement('script');
script.src = '/email-test.js';
document.head.appendChild(script);

// Setelah loaded, jalankan:
testEmail()
```

### 3. Check Gmail
- **Inbox**: Cari subject "PERGUNU"
- **Spam**: Cari subject "PERGUNU" 
- **Promotions**: Tab Promotions di Gmail
- **All Mail**: Search "from:noreply"

---

## 🔧 Diagnostic Checklist

### EmailJS Configuration
- [ ] Service ID: `service_ublbpnp` ✅
- [ ] Template ID: `template_qnuud6d` ✅  
- [ ] Public Key: `AIgbwO-ayq2i-I0ou` ✅
- [ ] Admin Email: `fairuzo1dyck@gmail.com` ✅

### Template Variables (EmailJS Dashboard)
- [ ] Subject: `{{subject}}`
- [ ] Body: `{{{message_html}}}` (3 kurung!)
- [ ] Reply-To: `{{reply_to}}`

### Common Issues & Solutions

#### 1. Email ke Spam/Promotions
**Symptom**: Console sukses, tapi email tidak di Inbox
**Solution**: 
- Cek folder Spam & Promotions
- Add sender ke whitelist
- Gunakan domain email sendiri (bukan noreply@emailjs.com)

#### 2. HTML tidak render
**Symptom**: Email masuk tapi isinya plain text
**Solution**:
- Pastikan EmailJS template pakai `{{{message_html}}}` (3 kurung)
- Jangan pakai `{{message_html}}` (2 kurung)

#### 3. Quota EmailJS habis
**Symptom**: Test manual OK, tapi API gagal
**Solution**:
- Cek dashboard EmailJS quota
- Upgrade plan atau tunggu reset bulanan

#### 4. Invalid email address
**Symptom**: Error "invalid email"
**Solution**:
- Pastikan `fairuzo1dyck@gmail.com` (bukan `fairuz.fuadi004@gmail.com`)
- Cek typo di emailConfig

---

## 📊 Expected Console Output

### Success Case:
```
🔄 Starting sendAdminNotification for: [Nama User]
✅ EmailJS service initialized
✅ Email template generated
📧 === EMAIL SENDING DETAILS ===
🎯 Target Email: fairuzo1dyck@gmail.com
✅ === EMAIL SENT SUCCESSFULLY ===
📧 Status: 200
🎯 Email should arrive at: fairuzo1dyck@gmail.com
```

### Error Case:
```
❌ === EMAIL SENDING FAILED ===
❌ Error type: [Error Type]
❌ Error message: [Specific Error]
```

---

## 🎯 Quick Fixes

### Fix 1: Force email to your Gmail
```javascript
// Temporary fix - edit EmailService.js
adminEmail: 'fairuzo1dyck@gmail.com' // ✅ sudah benar
```

### Fix 2: Add email whitelist
1. Login Gmail → Settings → Filters
2. Create filter: `from:noreply@emailjs.com`
3. Action: Never send to Spam

### Fix 3: Test with simple template
```html
<!-- EmailJS Template Body -->
<h1>Test Email</h1>
<p>Applicant: {{applicant_name}}</p>
<p>Email: {{applicant_email}}</p>
{{{message_html}}}
```

---

## 📧 EmailJS Template Setup (Final Check)

### Subject:
```
{{subject}}
```

### Body (HTML):
```html
{{{message_html}}}
```

### Settings:
- **To Email**: `{{to_email}}`
- **To Name**: `{{to_name}}`
- **Reply To**: `{{reply_to}}`

---

## 🆘 If Still Not Working

### Last Resort Options:
1. **Ganti EmailJS service** (buat service baru)
2. **Pakai Gmail SMTP** langsung (butuh setup server)
3. **Temporary fallback**: Console.log data + manual email ke admin

### Debug Commands:
```bash
# Test all services
npm run dev
# Check JSON server
curl http://localhost:3001/applications
# Check file server  
curl http://localhost:3002
```

---

## ✅ Success Indicators

Jika berhasil, Anda akan melihat:
- [ ] Console: "EMAIL SENT SUCCESSFULLY"
- [ ] Gmail: Email masuk dengan HTML styling
- [ ] Data: Semua field pendaftar tampil lengkap
- [ ] Action: Tombol admin panel berfungsi
- [ ] Reply: Bisa reply langsung ke pendaftar

**Target: Email masuk ke `fairuzo1dyck@gmail.com` dalam 1-2 menit setelah form submit!**
