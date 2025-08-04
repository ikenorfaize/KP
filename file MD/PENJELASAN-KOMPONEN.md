# 🔧 PENJELASAN DETAIL SETIAP KOMPONEN PERGUNU

## 📁 STRUKTUR FOLDER & FUNGSINYA

### `src/` - Source Code Utama
```
src/
├── main.jsx                 # Entry point aplikasi React
├── App.jsx                  # Router utama + layout management
├── App.css                  # Style global aplikasi
├── index.css                # Style dasar (reset, typography)
├── componen/               # Komponen reusable untuk homepage
├── pages/                  # Halaman lengkap dengan routing
├── services/               # Service layer (API, Email, File)
├── hooks/                  # Custom React hooks
└── assets/                # File statis (gambar, icon)
```

---

## 🏠 KOMPONEN HOMEPAGE (`src/componen/`)

### `Navbar/Navbar.jsx`
**Fungsi:** Menu navigasi utama dengan scroll behavior
**Fitur:**
- Navigation links dengan smooth scroll ke section
- Conditional rendering (scroll vs route navigation)
- Mobile responsive hamburger menu
- Logo dan branding

### `Hero/Hero.jsx`
**Fungsi:** Banner utama homepage dengan call-to-action
**Fitur:**
- Hero image/banner
- Tagline organisasi
- Tombol CTA "Daftar Sekarang"
- Background styling dengan overlay

### `Tentang/Tentang.jsx`
**Fungsi:** Section informasi tentang organisasi PERGUNU
**Fitur:**
- Sejarah dan visi misi organisasi
- Informasi struktur organisasi
- Cards dengan informasi detail
- Scroll animation

### `StatsSection/StatsSection.jsx`
**Fungsi:** Menampilkan statistik organisasi
**Fitur:**
- Counter animasi untuk angka statistik
- Total anggota, cabang, achievements
- Visual indicators dan icons
- Responsive grid layout

### `Anggota/Anggota.jsx`
**Fungsi:** Section informasi keanggotaan
**Fitur:**
- Syarat dan ketentuan anggota
- Benefit menjadi anggota
- Call-to-action pendaftaran
- Profile cards untuk sample anggota

### `Berita/Berita.jsx`
**Fungsi:** Section berita terbaru organisasi
**Fitur:**
- Grid layout berita
- Preview artikel dengan thumbnail
- Link ke halaman berita lengkap
- Pagination atau "Load More"

### `Beasiswa/Beasiswa.jsx`
**Fungsi:** Section program beasiswa
**Fitur:**
- Cards program beasiswa tersedia
- Informasi syarat dan benefit
- CTA untuk apply beasiswa
- Testimonial atau success stories

### `Layanan/Layanan.jsx`
**Fungsi:** Section layanan yang ditawarkan organisasi
**Fitur:**
- Grid services dengan icon
- Deskripsi setiap layanan
- Pricing atau contact info
- Interactive hover effects

### `StatusTracker/StatusTracker.jsx`
**Fungsi:** Tool untuk cek status pendaftaran
**Fitur:**
- Input field untuk ID atau email
- Real-time status check
- Progress indicator
- Status history

### `Sponsor/Sponsor.jsx`
**Fungsi:** Section sponsor dan mitra organisasi
**Fitur:**
- Logo carousel sponsors
- Auto-scroll atau manual navigation
- Link ke website sponsor
- Partnership information

### `Footer/Footer.jsx`
**Fungsi:** Footer dengan informasi kontak dan links
**Fitur:**
- Contact information
- Social media links
- Quick navigation links
- Copyright dan legal info

---

## 📄 HALAMAN TERPISAH (`src/pages/`)

### `Login/Login.jsx`
**Fungsi:** Halaman autentikasi pengguna
**Workflow:**
1. User input username/email + password
2. Validasi format input
3. API call ke backend untuk verifikasi
4. Hash password comparison
5. Generate session/token
6. Redirect ke dashboard sesuai role

**Kode Penting:**
```jsx
// Login process
const handleLogin = async (credentials) => {
  const response = await apiService.login(credentials);
  if (response.success) {
    localStorage.setItem('currentUser', JSON.stringify(response.user));
    navigate(response.user.role === 'admin' ? '/admin' : '/user-dashboard');
  }
};
```

### `RegisterForm/RegisterForm.jsx`
**Fungsi:** Form pendaftaran anggota lengkap
**Workflow:**
1. User mengisi form biodata lengkap
2. Upload foto profil dan sertifikat
3. Client-side validation
4. Submit data ke JSON Server
5. Trigger email notifikasi otomatis
6. Generate application ID
7. Redirect ke status tracking

**Data yang dikumpulkan:**
- Personal info (nama, email, phone)
- Professional info (posisi, sekolah, pengalaman)
- Geographic info (wilayah, cabang)
- Documents (foto, sertifikat)

### `AdminDashboard/AdminDashboard.jsx`
**Fungsi:** Dashboard admin untuk manajemen data
**Tabs yang tersedia:**
1. **Dashboard** - Statistik dan overview
2. **User Management** - CRUD operations pengguna
3. **Application Review** - Approve/reject pendaftaran
4. **Certificate Manager** - Generate dan manage sertifikat
5. **Email Notifications** - Send bulk emails

**Key Functions:**
```jsx
// Approve application
const approveApplication = async (applicationId) => {
  await apiService.updateApplication(applicationId, { status: 'approved' });
  await emailService.sendApprovalEmail(applicantData);
  await generateCertificate(applicantData);
};
```

### `UserDashboard/UserDashboard.jsx`
**Fungsi:** Dashboard pengguna untuk manage profile
**Fitur:**
1. Profile management
2. Download sertifikat
3. Update personal information
4. View application history
5. Track download statistics

### `Berita/` (BeritaUtama, Berita1, Berita2, Berita3)
**Fungsi:** Halaman artikel berita lengkap
**Structure:**
- Hero section dengan featured image
- Article content dengan typography
- Related articles
- Social sharing buttons
- Comments section (optional)

---

## 🔧 SERVICES (`src/services/`)

### `apiService.js` - Core API Layer
**Fungsi:** Abstraksi komunikasi dengan backend
**Mode Operation:**
1. **JSON Server Mode** - Development dengan db.json
2. **LocalStorage Mode** - Fallback tanpa server

**Key Methods:**
```javascript
// User operations
register(userData)     // Daftar user baru
login(credentials)     // Login user
getCurrentUser()       // Get user session
logout()              // Clear session

// Password utilities
hashPassword(plain)    // Hash password
verifyPassword()       // Verify hash
```

### `EmailService.js` - Email Automation
**Fungsi:** Mengirim email otomatis menggunakan EmailJS
**Email Types:**
1. **Welcome Email** - Setelah registrasi berhasil
2. **Approval Email** - Saat aplikasi disetujui
3. **Rejection Email** - Saat aplikasi ditolak
4. **Admin Notification** - Notifikasi ke admin

**Configuration:**
```javascript
emailConfig = {
  serviceId: 'service_ublbpnp',
  templateId: 'template_qnuud6d', 
  publicKey: 'AIgbwO-ayq2i-I0ou',
  adminEmail: 'fairuzo1dyck@gmail.com'
}
```

### `EmailTemplates.js` - Email Content Templates
**Fungsi:** Template HTML untuk berbagai jenis email
**Templates Available:**
- `approvalEmail(userData)` - Email persetujuan
- `rejectionEmail(userData, reason)` - Email penolakan
- `adminNotification(userData)` - Notifikasi admin
- `welcomeEmail(userData)` - Email selamat datang

### `FileUploadService.js` - File Handling
**Fungsi:** Upload dan manage file (foto, sertifikat)
**Features:**
- Multiple file upload
- File type validation
- Size limit checking
- Progress tracking
- Error handling

---

## 🎯 WORKFLOW LENGKAP APLIKASI

### 1. USER REGISTRATION FLOW
```
Landing Page → Click "Daftar" → RegisterForm
    ↓
Fill form + Upload files → Client validation
    ↓  
Submit to JSON Server → Generate application ID
    ↓
Trigger email notification → Admin gets notification
    ↓
User gets confirmation → Can track status
```

### 2. APPLICATION REVIEW FLOW  
```
Admin Login → AdminDashboard → Application Review Tab
    ↓
View pending applications → Review documents
    ↓
Approve/Reject decision → Update database
    ↓
Send email notification → Generate certificate (if approved)
    ↓
Update application status → User notified
```

### 3. USER LOGIN & DASHBOARD FLOW
```
User Login → Credential verification → Role-based redirect
    ↓
User Dashboard → View profile → Download certificates
    ↓
Update information → Track statistics → Logout
```

---

## 💾 DATABASE STRUCTURE (db.json)

### `users` Table
```json
{
  "id": "unique_id",
  "fullName": "Nama Lengkap",
  "email": "email@example.com",
  "username": "username", 
  "password": "hashed_password",
  "phone": "08123456789",
  "position": "Guru/Staff/etc",
  "address": "Alamat lengkap",
  "pw": "Pengurus Wilayah",
  "pc": "Pengurus Cabang", 
  "role": "user|admin",
  "status": "active|inactive",
  "certificates": ["cert1.pdf", "cert2.pdf"],
  "downloads": 5,
  "lastDownload": "2025-01-20T10:00:00Z",
  "profileImage": "profile.jpg",
  "createdAt": "2025-01-18T10:00:00Z"
}
```

### `applications` Table  
```json
{
  "id": "app_unique_id",
  "fullName": "Nama Lengkap",
  "email": "email@example.com", 
  "phone": "08123456789",
  "position": "Posisi yang dilamar",
  "school": "Nama sekolah",
  "pw": "Pengurus Wilayah",
  "pc": "Pengurus Cabang",
  "experience": "Pengalaman kerja",
  "education": "Pendidikan terakhir",
  "status": "pending|approved|rejected",
  "submittedAt": "2025-01-18T10:00:00Z",
  "reviewedAt": "2025-01-19T10:00:00Z",
  "reviewedBy": "admin_id",
  "documents": {
    "photo": "photo.jpg",
    "certificate": "cert.pdf"
  }
}
```

---

## 🚀 DEVELOPMENT SETUP

### Required Services
1. **Frontend** - React App (Port 5173)
2. **JSON Server** - Mock API (Port 3001) 
3. **File Server** - Upload Handler (Port 3002)
4. **EmailJS** - Email Service (External)

### NPM Scripts
```bash
npm run dev          # Start React dev server
npm run api          # Start JSON Server  
npm run file-server  # Start file upload server
npm run demo         # Start frontend + API
npm run full-demo    # Start all services
```

### Environment Variables
```javascript
// EmailJS Configuration
SERVICE_ID=service_ublbpnp
TEMPLATE_ID=template_qnuud6d  
PUBLIC_KEY=AIgbwO-ayq2i-I0ou
ADMIN_EMAIL=fairuzo1dyck@gmail.com

// API Configuration
API_URL=http://localhost:3001
FILE_SERVER_URL=http://localhost:3002
```

---

## 🔐 SECURITY FEATURES

### Password Security
- bcryptjs hashing dengan salt rounds 12
- No plain text password storage
- Secure password comparison

### File Upload Security  
- File type validation (images, PDFs only)
- File size limits
- Sanitized file names
- Secure storage location

### Session Management
- localStorage untuk session data
- Role-based access control
- Automatic logout pada close browser

---

## 📱 RESPONSIVE DESIGN

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px  
- Desktop: > 1024px

### CSS Framework
- TailwindCSS untuk utility classes
- Custom CSS untuk component-specific styling
- CSS Grid dan Flexbox untuk layouts
- CSS animations untuk smooth transitions

---

## 🧪 TESTING & DEBUGGING

### Email Testing
File: `BROWSER-TEST-SIMPLE.md` berisi panduan test EmailJS

### Debug Tools
- Console.log extensive di semua services
- Error boundaries untuk crash handling
- Network request monitoring
- LocalStorage inspection tools

---

Dokumentasi ini memberikan gambaran lengkap tentang cara kerja setiap bagian aplikasi PERGUNU, dari frontend components hingga backend services dan database structure.
