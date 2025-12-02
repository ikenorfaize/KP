# 🔗 HUBUNGAN ANTAR KOMPONEN & ALUR DATA PERGUNU

## 🎯 PENJELASAN SINGKAT PROYEK

**PERGUNU** adalah website organisasi guru yang menyediakan platform digital untuk:
- **Pendaftaran anggota** dengan sistem approval
- **Manajemen beasiswa** dan program
- **Publikasi berita** organisasi
- **Dashboard admin** untuk kelola data
- **Dashboard user** untuk manage profile
- **Email otomatis** untuk notifikasi

---

## 🏗️ ARSITEKTUR SISTEM

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
├─────────────────────────────────────────────────────────────┤
│  Homepage    │  Register  │  Login  │  Admin  │  User       │
│  (sections)  │  Form      │  Page   │  Panel  │  Dashboard  │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                   SERVICE LAYER                             │
├─────────────────────────────────────────────────────────────┤
│  ApiService  │  EmailService  │  FileUpload  │  Templates   │
│  (CRUD ops)  │  (EmailJS)     │  (Multer)    │  (Email)     │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  BACKEND SERVICES                           │
├─────────────────────────────────────────────────────────────┤
│  JSON Server   │  File Server   │  EmailJS API             │
│  (Port 3001)   │  (Port 3002)   │  (External)              │
│  Database      │  File Upload   │  Email Service           │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 ALUR DATA UTAMA

### 1. 🏠 HOMEPAGE FLOW
```
User visits / → App.jsx loads → Renders all sections:
│
├─ Navbar (navigation)
├─ Hero (banner + CTA)
├─ Tentang (about organization)
├─ StatsSection (statistics)
├─ Anggota (membership info)
├─ Berita (news preview)
├─ Beasiswa (scholarship info)
├─ Layanan (services)
├─ StatusTracker (check application)
├─ Sponsor (partners)
└─ Footer (contact info)
```

### 2. 📝 REGISTRATION FLOW
```
User clicks "Daftar" → RegisterForm.jsx
│
├─ Form validation (client-side)
├─ File upload (photo + certificates)
├─ Submit to ApiService
│   │
│   ├─ POST /applications (JSON Server)
│   ├─ Generate unique application ID
│   └─ Save to db.json
│
├─ Trigger EmailService
│   │
│   ├─ Send welcome email to user
│   └─ Send notification to admin
│
└─ Show success message + tracking ID
```

### 3. 🔐 LOGIN & AUTHENTICATION
```
User enters credentials → Login.jsx
│
├─ ApiService.login()
│   │
│   ├─ Fetch user from /users
│   ├─ Verify password with bcrypt
│   └─ Create session data
│
├─ Store auth in localStorage
│   │
│   ├─ userAuth (for regular users)
│   └─ adminAuth (for admin users)
│
└─ Redirect based on role
    │
    ├─ admin → /admin (AdminDashboard)
    └─ user → /user-dashboard (UserDashboard)
```

### 4. 👑 ADMIN WORKFLOW
```
Admin Dashboard → AdminDashboard.jsx
│
├─ Tab: Dashboard
│   └─ Display statistics (total users, downloads, etc)
│
├─ Tab: User Management
│   │
│   ├─ View all users
│   ├─ Add new user
│   ├─ Edit user data
│   └─ Delete user
│
├─ Tab: Applications Review
│   │
│   ├─ View pending applications
│   ├─ Review documents
│   ├─ Approve/Reject decision
│   │   │
│   │   ├─ Update application status
│   │   ├─ Create user account (if approved)
│   │   ├─ Generate certificate
│   │   └─ Send email notification
│   │
│   └─ Application history
│
└─ Tab: Certificate Management
    │
    ├─ Generate certificates
    ├─ Bulk certificate creation
    └─ Download/email certificates
```

### 5. 👤 USER DASHBOARD FLOW
```
User Dashboard → UserDashboard.jsx
│
├─ Profile Section
│   │
│   ├─ View personal info
│   ├─ Edit profile data
│   └─ Upload new profile photo
│
├─ Certificates Section
│   │
│   ├─ View available certificates
│   ├─ Download PDF certificates
│   └─ Track download history
│
├─ Statistics Section
│   │
│   ├─ Total downloads
│   ├─ Account creation date
│   └─ Last login activity
│
└─ Settings Section
    │
    ├─ Change password
    ├─ Update contact info
    └─ Account preferences
```

---

## 🔄 KOMUNIKASI ANTAR KOMPONEN

### Parent-Child Communication
```
App.jsx (Parent)
│
├─ Navbar → receives user state from localStorage
├─ Hero → receives CTA action handlers
├─ StatusTracker → receives search functionality
└─ All Sections → receive scroll behavior from useEffect
```

### Service Layer Communication
```
Components → Services → Backend

RegisterForm → ApiService → JSON Server (/applications)
             → EmailService → EmailJS API
             → FileUpload → File Server

Login → ApiService → JSON Server (/users)
      → bcrypt verification
      → localStorage session

AdminDashboard → ApiService → JSON Server (CRUD)
               → EmailService → Bulk notifications
               → FileUpload → Certificate generation
```

### State Management
```
Authentication State:
localStorage.userAuth → Global user session
localStorage.adminAuth → Global admin session

Form State:
useState hooks → Local component state
Controlled inputs → Real-time validation

Data Fetching:
useEffect + fetch → API calls
Loading states → UI feedback
Error handling → User notifications
```

---

## 📧 EMAIL AUTOMATION FLOW

### EmailJS Integration
```
EmailService.js (Client)
│
├─ Configuration
│   │
│   ├─ serviceId: 'service_ublbpnp'
│   ├─ templateId: 'template_qnuud6d'
│   ├─ publicKey: 'AIgbwO-ayq2i-I0ou'
│   └─ adminEmail: 'fairuzo1dyck@gmail.com'
│
├─ Email Templates (EmailTemplates.js)
│   │
│   ├─ welcomeEmail() → New registration
│   ├─ approvalEmail() → Application approved
│   ├─ rejectionEmail() → Application rejected
│   └─ adminNotification() → Notify admin
│
└─ Trigger Points
    │
    ├─ RegisterForm submit → welcomeEmail + adminNotification
    ├─ Admin approve → approvalEmail
    ├─ Admin reject → rejectionEmail
    └─ Bulk actions → Multiple emails
```

---

## 🗄️ DATABASE RELATIONSHIPS

### JSON Server Structure (db.json)
```json
{
  "users": [
    {
      "id": "user_1",
      "applications": ["app_1"] // Reference to applications
    }
  ],
  "applications": [
    {
      "id": "app_1", 
      "userId": "user_1", // Reference to users
      "status": "pending|approved|rejected"
    }
  ]
}
```

### Data Flow Relationships
```
Registration → applications table → Admin review
                    ↓
              Approved status → Create user record
                    ↓
              Generate certificate → Update user.certificates
                    ↓
              Send email → Log to user.emailHistory
```

---

## 🎨 UI/UX PATTERN

### Responsive Design Flow
```
Mobile First Approach:
Base styles → Mobile (< 768px)
     ↓
Tablet responsive → 768px - 1024px
     ↓ 
Desktop responsive → > 1024px

TailwindCSS Classes:
sm: → Small screens
md: → Medium screens  
lg: → Large screens
xl: → Extra large screens
```

### Component Styling Pattern
```
Each Component Folder:
ComponentName/
├─ ComponentName.jsx → React logic
├─ ComponentName.css → Component-specific styles
└─ index.js → Export (optional)

Global Styles:
App.css → Global app styles
index.css → Base/reset styles
```

---

## 🔧 DEVELOPMENT WORKFLOW

### Local Development Setup
```bash
# Terminal 1: Frontend
npm run dev → React dev server (port 5173)

# Terminal 2: Backend API  
npm run api → JSON Server (port 3001)

# Terminal 3: File Server
npm run file-server → Express upload server (port 3002)

# OR run all together:
npm run full-demo → Concurrent all services
```

### File Structure Pattern
```
New Feature Development:
1. Create component in src/componen/ or src/pages/
2. Add styles in same folder
3. Create service functions if needed
4. Add routes in App.jsx
5. Test with all services running
```

---

## 🚀 PRODUCTION DEPLOYMENT

### Build Process
```
npm run build → Vite builds static files
     ↓
dist/ folder → Production assets
     ↓
Deploy to hosting → Serve static files
     ↓
Update API URLs → Production backend
```

### Environment Configuration
```
Development:
- JSON Server (localhost:3001)
- File Server (localhost:3002)
- EmailJS (development keys)

Production:
- Real database (PostgreSQL/MongoDB)
- Cloud file storage (AWS S3/Cloudinary)  
- EmailJS (production keys)
- Environment variables for secrets
```

---

Dokumentasi ini menjelaskan hubungan lengkap antar semua komponen dalam aplikasi PERGUNU, dari frontend components hingga backend services dan database relationships.
