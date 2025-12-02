# 🏗️ PERGUNU Project Structure
## Complete Project Architecture & Organization

### 📋 **Project Overview**
**Project Name:** PERGUNU (Indonesian Teacher Organization Website)  
**Technology Stack:** React.js 19.1.0 + Vite 7.0.5 + TailwindCSS 4.1.11  
**Purpose:** Member registration system dengan admin management dan email notifications  
**Architecture:** SPA (Single Page Application) dengan JSON Server backend

---

## 📁 **Root Level Structure**

```
PERGUNU-KP/
├── 🔧 Configuration Files
├── 📚 Documentation 
├── 🏗️ Build System
├── 📦 Dependencies
├── 🎨 Frontend Source
├── 🌐 Public Assets
└── 💾 Database & Uploads
```

---

## 🔧 **Configuration Files**

### **Environment & Security**
- **`.env`** - Environment variables (EmailJS credentials, API endpoints)
- **`.env.example`** - Template untuk development setup
- **`.gitignore`** - Git exclusions (node_modules, .env, uploads)

### **Build & Development Tools**
- **`package.json`** - Dependencies & scripts (dev, build, api, preview)
- **`package-lock.json`** - Dependency lock file
- **`vite.config.js`** - Vite bundler configuration
- **`tailwind.config.js`** - TailwindCSS utility framework config
- **`postcss.config.js`** - CSS processing configuration
- **`eslint.config.js`** - Code quality & linting rules

### **Database & API**
- **`db.json`** - JSON Server database (users, applications, news, sessions)

---

## 📚 **Documentation Folder (`file MD/`)**

### **Project Documentation**
- **`DOKUMENTASI-PROYEK.md`** - Main project documentation
- **`README_NEW.md`** - Updated project README
- **`HUBUNGAN-KOMPONEN.md`** - Component relationships & architecture
- **`PENJELASAN-KOMPONEN.md`** - Detailed component explanations
- **`PENJELASAN-PACKAGE.md`** - Package.json analysis
- **`PENJELASAN-DATABASE.md`** - Database schema & structure
- **`PENJELASAN-EMAIL-SERVICE.md`** - EmailJS service documentation

### **Development Guides**
- **`EMAILJS-SETUP-GUIDE.md`** - EmailJS configuration guide
- **`DEBUG-GUIDE.md`** - Debugging procedures
- **`TEST-STEPS.md`** - Testing workflows
- **`PERBAIKAN-COMPLETE.md`** - Bug fixes & improvements
- **`BROWSER-TEST-SIMPLE.md`** - Browser testing procedures

### **Progress Tracking**
- **`UPDATE-PROGRESS-HARI-INI.md`** - Daily progress updates
- **`STATUS-KOMENTAR-KODE.md`** - Code commenting status

---

## 🎨 **Frontend Source (`src/`)**

### **🚀 Application Core**
```
src/
├── main.jsx                 # Application entry point
├── App.jsx                  # Main app component & routing
├── App.css                  # Global app styling
└── index.css               # Base CSS & TailwindCSS imports
```

### **🖼️ Assets (`src/assets/`)**
```
assets/
├── logo.png                # PERGUNU organization logo
├── hero.png                # Homepage hero image
├── about.png               # About section image
├── Berita1-3.png          # News article images
├── BeritaUtama.png        # Main news image
├── design-references.png   # Design reference materials
└── andrew.png, delwyn.png, sergio.png, jago.png  # Team/member photos
```

### **🧩 Components (`src/componen/`)**
```
componen/
├── 🏠 Layout Components
│   ├── Navbar/            # Navigation bar with routing
│   ├── Footer/            # Site footer with links
│   └── Hero/              # Homepage hero section
│
├── 📄 Content Components  
│   ├── Berita/            # News display component
│   ├── Tentang/           # About organization section
│   ├── Layanan/           # Services offered section
│   ├── Anggota/           # Members showcase
│   ├── Sponsor/           # Sponsors display
│   └── Stats/             # Statistics section
│
├── 🔧 Functional Components
│   ├── StatusTracker/     # Application status tracking
│   ├── ApplicationManager/ # Admin approval/rejection system
│   └── Beasiswa/          # Scholarship information
```

### **📱 Pages (`src/pages/`)**
```
pages/
├── 🔐 Authentication
│   ├── Login/             # User & admin login
│   ├── RegisterForm/      # New member registration  
│   
├── 👥 User Management
│   ├── UserDashboard/     # Member profile & data
│   ├── AdminDashboard/    # Admin control panel
│   
├── 📰 Content Pages
│   ├── Berita/           # News article pages (Berita1-3, BeritaUtama)
│   ├── SponsorPage/      # Sponsor showcase page
│   └── Beasiswa/         # Scholarship information page
```

### **⚙️ Services (`src/services/`)**
```
services/
├── apiService.js          # Core API communication layer
├── EmailService.js        # EmailJS integration & notifications
├── EmailTemplates.js     # Email template management
└── FileUploadService.js  # File upload handling
```

### **🪝 Hooks (`src/hooks/`)**
```
hooks/
└── useScrollAnimation.js  # Custom scroll animation hook
```

---

## 🌐 **Public Assets (`public/`)**

### **Static Files**
```
public/
├── index.html             # Main HTML template
├── register-debug.html    # Registration form debug tool
└── uploads/
    └── certificates/      # User uploaded certificate files
```

---

## 📦 **Dependencies (`node_modules/` & `package.json`)**

### **🏗️ Core Framework**
- **React 19.1.0** - Frontend library
- **React Router DOM 7.0.2** - Client-side routing
- **Vite 7.0.5** - Build tool & dev server

### **🎨 Styling & UI**
- **TailwindCSS 4.1.11** - Utility-first CSS framework  
- **React Icons 5.4.0** - Icon components
- **PostCSS 8.5.1** - CSS processing

### **🔐 Authentication & Security**
- **bcryptjs 3.0.2** - Password hashing
- **EmailJS Browser 4.5.0** - Email service

### **🛠️ Development Tools**
- **ESLint 9.18.0** - Code linting
- **JSON Server 1.0.0** - Mock API backend
- **Concurrently 9.1.0** - Run multiple commands

---

## 💾 **Database & Storage**

### **JSON Server Database (`db.json`)**
```json
{
  "users": [],           // Registered users & admins
  "applications": [],    // Pending registration applications  
  "news": [],           // News articles & announcements
  "sessions": [],       // User session management
  "statistics": []      // Application & user statistics
}
```

### **File Uploads (`uploads/`)**
```
uploads/
└── certificates/      # User uploaded qualification certificates
```

---

## 🚀 **Available Scripts**

### **Development Commands**
```bash
npm run dev           # Start Vite development server (port 5173/5174)
npm run api           # Start JSON Server API backend (port 3001)
npm run build         # Build production bundle
npm run preview       # Preview production build
npm run lint          # Run ESLint code quality checks
```

### **Concurrent Development**
```bash
npm run demo          # ✅ RECOMMENDED: Run frontend + API backend
npm run full-demo     # Run frontend + API + file server (if file-server.js exists)
npm run production    # Run all services including webhook server
```

---

## 🌐 **Server Ports & Endpoints**

### **Development Servers**
- **Frontend (Vite):** `http://localhost:5173` atau `5174`
- **API Backend (JSON Server):** `http://localhost:3001`
- **File Upload Server:** `http://localhost:3002` (if implemented)

### **API Endpoints**
```
GET/POST /users          # User management
GET/POST /applications   # Registration applications  
GET/POST /news          # News articles
GET/POST /sessions      # Session management
GET      /statistics    # App statistics
```

---

## 🔄 **Application Flow**

### **User Registration Flow**
1. **RegisterForm** → Input validation → **apiService** → **db.json**
2. **EmailService** → Send notification → Admin email
3. **ApplicationManager** → Admin review → Approve/Reject
4. **EmailService** → Send credentials → User email

### **Admin Management Flow**
1. **Login** → Authentication → **AdminDashboard**
2. **ApplicationManager** → Review applications
3. **User Management** → CRUD operations
4. **Statistics** → Monitor system usage

### **User Experience Flow**
1. **Homepage** → Information browsing
2. **RegisterForm** → New member registration
3. **Login** → Access **UserDashboard**
4. **Profile Management** → Update information

---

## 🛡️ **Security Features**

### **Environment Variables**
- **EmailJS credentials** protected in `.env`
- **API endpoints** configurable per environment
- **Admin credentials** with bcrypt hashing

### **Input Validation**
- **Client-side validation** di RegisterForm
- **Email format validation** dengan regex
- **Password hashing** dengan bcrypt salt rounds 12

### **File Management**
- **Upload restrictions** untuk certificate files
- **Gitignore protection** untuk sensitive files
- **Environment-based configuration**

---

## 📊 **Project Statistics**

- **📁 Total Files:** 1000+ (including node_modules)
- **📝 React Components:** 25+ custom components
- **📄 Documentation Files:** 15 comprehensive MD files
- **🎨 CSS Files:** Component-specific styling
- **⚙️ Configuration Files:** 8 config files
- **📦 Dependencies:** 50+ npm packages
- **🗃️ Database Tables:** 5 JSON collections

---

## 🎯 **Key Features**

### **✅ Implemented Features**
- ✅ Responsive React.js application
- ✅ User registration with email notifications
- ✅ Admin dashboard dengan user management
- ✅ Application approval/rejection workflow
- ✅ Secure authentication dengan bcrypt
- ✅ File upload untuk certificates
- ✅ Environment-based configuration
- ✅ Comprehensive Indonesian code comments

### **🔄 Extensible Architecture**
- 🔄 Modular component structure
- 🔄 Service-based API layer
- 🔄 Configurable email templates
- 🔄 Scalable database schema
- 🔄 Environment-specific deployment

---

## 🚀 **Getting Started**

### **1. Environment Setup**
```bash
# Clone project
git clone <repository-url>
cd KP

# Install dependencies  
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan your EmailJS credentials
```

### **2. Development Server**
```bash
# ✅ RECOMMENDED: Start both frontend and API backend
npm run demo

# Alternative: Start services separately
npm run api          # Terminal 1: Start API backend
npm run dev          # Terminal 2: Start frontend

# Visit: http://localhost:5173
```

### **3. Testing Registration**
```bash
# Visit debug tool
http://localhost:5173/register-debug.html

# Test registration form  
http://localhost:5173/register
```

---

*Project Structure Documentation - Last Updated: 2025-01-27*  
*PERGUNU Teacher Organization Website - Production Ready*
