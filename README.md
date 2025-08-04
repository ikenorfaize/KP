# 🎓 SISTEM PERGUNU - Platform Manajemen Sertifikat Digital

Sistem manajemen sertifikat digital untuk Persatuan Guru Nahdlatul Ulama (PERGUNU) dengan workflow otomatis untuk pendaftaran, approval, dan distribusi sertifikat.

## 🚀 **Features**

### **User Features:**
- 📝 **Form Pendaftaran Online** - Pendaftaran mudah dengan validasi lengkap
- 📊 **Status Tracker Real-time** - Cek status pendaftaran kapan saja
- 🎯 **User Dashboard** - Akses sertifikat dan kelola profil
- 📱 **Responsive Design** - Optimal di desktop dan mobile

### **Admin Features:**
- 👥 **User Management** - Kelola semua pengguna sistem
- ✅ **Application Approval** - Review dan proses pendaftaran
- 📧 **Auto Email Notifications** - Email otomatis untuk semua status
- 📈 **Analytics Dashboard** - Statistik lengkap sistem

## 🏗️ **Tech Stack**

- **Frontend:** React 19.1.0 + Vite + Tailwind CSS
- **Backend:** JSON Server + Express.js
- **Email Service:** EmailJS integration
- **Authentication:** bcryptjs dengan role-based access
- **File Management:** Multer untuk upload sertifikat

## 📋 **Installation & Setup**

### **1. Clone Repository**
```bash
git clone [repository-url]
cd KP
```

### **2. Install Dependencies**
```bash
npm install
```

### **3. Setup Email Service (EmailJS)**

#### **Daftar EmailJS (Gratis):**
1. Buka [emailjs.com](https://www.emailjs.com/)
2. Daftar dengan Gmail Anda (`fairuz.fuadi004@gmail.com`)
3. Buat service baru dengan Gmail
4. Buat 3 templates email:
   - **Template Approval:** Email konfirmasi untuk user yang disetujui
   - **Template Rejection:** Email untuk user yang ditolak
   - **Template Admin Notification:** Notifikasi pendaftar baru ke admin

#### **Update Konfigurasi Email:**
Edit file `src/services/EmailService.js`:
```javascript
this.emailConfig = {
  serviceId: 'YOUR_SERVICE_ID',        // Dari EmailJS Dashboard
  templateId: 'YOUR_TEMPLATE_ID',      // Template ID untuk notification
  publicKey: 'YOUR_PUBLIC_KEY',        // Public Key dari EmailJS
  adminEmail: 'fairuz.fuadi004@gmail.com',
  isDemoMode: false                    // Set false untuk production
};
```

### **4. Jalankan Aplikasi**
```bash
# Development mode (dengan semua server)
npm run full-demo

# Production mode (dengan webhook server)
npm run production
```

## 🎯 **Workflow Sistem**

### **1. User Registration Flow:**
```
User mengisi form → Data masuk database → Email notifikasi ke admin → Admin review → Approve/Reject → Email hasil ke user
```

### **2. Admin Approval Flow:**
```
Login admin → Lihat pending applications → Review data → Approve/Reject → Auto-generate credentials → Email dikirim otomatis
```

## 🧪 **Testing Manual**

### **1. Test Form Pendaftaran:**
1. Buka website: `http://localhost:5173/`
2. Klik tombol **"Daftarkan diri anda"** di Hero section
3. Isi form pendaftaran lengkap:
   - **Data Pribadi:** Nama, email, telepon, jabatan
   - **Data Institusi:** Sekolah, PW, PC
   - **Pendidikan:** Pendidikan terakhir, pengalaman mengajar
4. Submit form
5. **Expected Result:** 
   - Data masuk ke admin dashboard
   - Email notifikasi terkirim ke `fairuz.fuadi004@gmail.com`
   - User melihat halaman konfirmasi

### **2. Test Admin Approval:**
1. Login sebagai admin:
   - **Username:** `admin`
   - **Password:** `admin123`
2. Masuk tab **"📝 Applications"**
3. Lihat pendaftar baru dengan status **"⏳ Pending"**
4. Klik **"✅ Approve"** atau **"❌ Reject"**
5. **Expected Result:**
   - Credentials auto-generated (untuk approval)
   - Email hasil dikirim ke user
   - Status terupdate di database

### **3. Test Status Tracker:**
1. Buka homepage
2. Scroll ke section **"Cek Status Pendaftaran"**
3. Masukkan email pendaftar yang sudah disubmit
4. **Expected Result:** Menampilkan status real-time pendaftaran

### **4. Test User Login:**
1. Gunakan credentials yang di-generate admin
2. Login melalui halaman login
3. **Expected Result:** Masuk ke User Dashboard dengan akses sertifikat

## 📧 **Setup Email Production**

### **EmailJS Templates yang Diperlukan:**

#### **Template 1: Admin Notification (template_admin_notif)**
```html
Subject: 🔔 Pendaftaran Baru PERGUNU - {{fullName}}

Content:
Pendaftar baru: {{fullName}}
Email: {{email}}
Posisi: {{position}}
Waktu: {{submittedAt}}

Review di: https://your-domain.com/admin
```

#### **Template 2: User Approval (template_user_approval)**
```html
Subject: ✅ Akun PERGUNU Anda Telah Disetujui

Content:
Selamat {{fullName}}!
Username: {{username}}
Password: {{password}}
Login di: https://your-domain.com/login
```

#### **Template 3: User Rejection (template_user_rejection)**
```html
Subject: 📋 Update Pendaftaran PERGUNU

Content:
Halo {{fullName}},
Pendaftaran perlu diperbaiki.
Alasan: {{rejectionReason}}
Daftar ulang di: https://your-domain.com/daftar
```

## 🔧 **Configuration**

### **Database Structure (db.json):**
```json
{
  "users": [
    {
      "id": "1",
      "username": "admin",
      "password": "$2a$10$...",
      "role": "admin",
      "fullName": "Administrator",
      "email": "fairuz.fuadi004@gmail.com"
    }
  ],
  "applications": [
    {
      "id": "timestamp",
      "fullName": "User Name",
      "email": "user@email.com",
      "phone": "08123456789",
      "position": "Guru",
      "school": "School Name",
      "pw": "PW PERGUNU Jawa Timur",
      "pc": "PC PERGUNU Kab. Situbondo",
      "education": "S1",
      "experience": "5-10 tahun",
      "status": "pending|approved|rejected",
      "submittedAt": "2025-01-20T10:00:00Z",
      "processedAt": null,
      "credentials": null,
      "rejectionReason": null
    }
  ]
}
```

### **Server Ports:**
- **Frontend (Vite):** `http://localhost:5173`
- **API Server (JSON Server):** `http://localhost:3001`
- **File Upload Server:** `http://localhost:3002`
- **Webhook Server:** `http://localhost:3003` (untuk integrasi Google Forms)

## 🎨 **UI/UX Features**

### **Responsive Design:**
- Mobile-first approach
- Optimized untuk tablet dan desktop
- Touch-friendly buttons dan form

### **User Experience:**
- Loading states untuk semua operasi
- Error handling yang user-friendly
- Success/failure notifications
- Professional email templates

### **Admin Interface:**
- Dashboard dengan statistik real-time
- Batch operations untuk multiple approvals
- Advanced filtering dan search
- Export data capabilities

## 🚀 **Production Deployment**

### **Checklist Pre-Production:**
- [ ] Setup EmailJS dengan domain yang benar
- [ ] Update `isDemoMode: false` di EmailService.js
- [ ] Setup database production (MySQL/PostgreSQL)
- [ ] Configure domain dan SSL certificate
- [ ] Test email delivery
- [ ] Setup monitoring dan logging

### **Environment Variables:**
```env
VITE_API_URL=https://your-api-domain.com
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

## 🆘 **Troubleshooting**

### **Common Issues:**

#### **Port Already in Use:**
```bash
# Windows
taskkill /f /im node.exe

# Then restart
npm run full-demo
```

#### **Email Not Sending:**
1. Check EmailJS configuration
2. Verify template IDs
3. Check console for error messages
4. Ensure `isDemoMode: false` for production

#### **Form Submission Failed:**
1. Check API server is running on port 3001
2. Verify CORS settings
3. Check network tab in browser developer tools

## 📞 **Support & Contact**

- **Developer:** GitHub Copilot
- **Admin Email:** fa@gmail.com
- **Project:** KP PERGUNU Digital Certificate System

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

**🎉 Selamat menggunakan Sistem PERGUNU! Untuk pertanyaan teknis, silakan hubungi tim development.**
