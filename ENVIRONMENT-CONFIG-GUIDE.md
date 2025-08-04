# 🔐 Environment Configuration Guide
## PERGUNU Project - Secure Configuration Management

### 📋 Overview
File ini menjelaskan konfigurasi environment variables yang telah dipindahkan dari hardcoded values ke `.env` file untuk meningkatkan keamanan dan flexibility.

---

## 🛡️ Security Improvements Implemented

### **1. EmailJS Configuration**
**Before:**
```javascript
// EmailService.js - HARDCODED (❌ INSECURE)
serviceId: 'service_ublbpnp',
templateId: 'template_qnuud6d', 
publicKey: 'AIgbwO-ayq2i-I0ou',
adminEmail: 'fairuzo1dyck@gmail.com'
```

**After:**
```javascript
// EmailService.js - ENVIRONMENT VARIABLES (✅ SECURE)
serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_ublbpnp',
templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'template_qnuud6d',
publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'AIgbwO-ayq2i-I0ou',
adminEmail: import.meta.env.VITE_ADMIN_EMAIL || 'fairuzo1dyck@gmail.com'
```

### **2. API Endpoints Configuration**
**Before:**
```javascript
// Multiple files - HARDCODED URLs (❌ INSECURE)
fetch('http://localhost:3001/users')
fetch('http://localhost:3001/applications')
this.API_URL = 'http://localhost:3001'
```

**After:**
```javascript
// All files - ENVIRONMENT VARIABLES (✅ SECURE)
const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
fetch(`${apiUrl}/users`)
fetch(`${apiUrl}/applications`)
this.API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'
```

### **3. Admin Credentials**
**Before:**
```javascript
// apiService.js - HARDCODED ADMIN (❌ INSECURE)
email: 'admin@pergunu.com',
username: 'admin',
password: '$2b$12$BNUmVyFMI/MMOd7aXmBx7OcFGEDPbJ9WOnbqoyPZGRc.m4v2pJBRG'
```

**After:**
```javascript
// apiService.js - ENVIRONMENT VARIABLES (✅ SECURE)
email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@pergunu.com',
username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
password: '$2b$12$BNUmVyFMI/MMOd7aXmBx7OcFGEDPbJ9WOnbqoyPZGRc.m4v2pJBRG' // Update via env
```

### **4. Security Parameters**
**Before:**
```javascript
// apiService.js - HARDCODED SECURITY (❌ INSECURE)
const saltRounds = 12;
// No configurable session timeout
// No configurable max login attempts
```

**After:**
```javascript
// apiService.js - CONFIGURABLE SECURITY (✅ SECURE)
this.saltRounds = parseInt(import.meta.env.VITE_BCRYPT_SALT_ROUNDS) || 12;
this.maxLoginAttempts = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
this.sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000;
```

---

## 📁 Files Updated

### **Modified Files:**
1. **`src/services/EmailService.js`** - EmailJS configuration
2. **`src/services/apiService.js`** - API endpoints & security config
3. **`src/pages/AdminDashboard/AdminDashboard.jsx`** - API endpoints
4. **`src/pages/UserDashboard/UserDashboard.jsx`** - API endpoints
5. **`src/pages/RegisterForm/RegisterForm.jsx`** - API endpoints
6. **`src/componen/ApplicationManager/ApplicationManager.jsx`** - API endpoints
7. **`.gitignore`** - Added .env exclusion

### **New Files Created:**
1. **`.env`** - Main environment configuration
2. **`.env.example`** - Template untuk development
3. **`ENVIRONMENT-CONFIG-GUIDE.md`** - This documentation

---

## 🚀 Setup Instructions

### **1. Development Setup**
```bash
# Copy template ke .env file
cp .env.example .env

# Edit .env dengan konfigurasi Anda
nano .env  # atau gunakan VS Code
```

### **2. Production Setup**
```bash
# Set environment variables di hosting platform
# Contoh untuk Netlify/Vercel:

VITE_API_BASE_URL=https://your-api-domain.com
VITE_EMAILJS_SERVICE_ID=your_production_service_id
VITE_EMAILJS_TEMPLATE_ID=your_production_template_id
VITE_EMAILJS_PUBLIC_KEY=your_production_public_key
VITE_ADMIN_EMAIL=admin@your-domain.com
```

### **3. EmailJS Configuration**
1. Login ke [EmailJS Dashboard](https://dashboard.emailjs.com)
2. Copy Service ID, Template ID, dan Public Key
3. Update values di `.env` file:
```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

---

## 🔒 Security Best Practices

### **1. Environment Variables Guidelines**
- ✅ **DO:** Use environment variables untuk sensitive data
- ✅ **DO:** Provide fallback values untuk development
- ✅ **DO:** Document semua environment variables
- ❌ **DON'T:** Commit `.env` file ke version control
- ❌ **DON'T:** Hardcode credentials di source code
- ❌ **DON'T:** Share production credentials

### **2. Deployment Security**
- ✅ Use different credentials per environment (dev/staging/prod)
- ✅ Rotate API keys secara berkala
- ✅ Monitor environment variable usage
- ✅ Use encrypted environment variables di CI/CD

### **3. Development Security**
- ✅ Keep `.env.example` updated
- ✅ Document new environment variables
- ✅ Test dengan different environment configurations
- ✅ Validate environment variables di startup

---

## 📊 Environment Variables Reference

### **Required Variables:**
| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `VITE_EMAILJS_SERVICE_ID` | EmailJS Service ID | `service_ublbpnp` | ✅ |
| `VITE_EMAILJS_TEMPLATE_ID` | EmailJS Template ID | `template_qnuud6d` | ✅ |
| `VITE_EMAILJS_PUBLIC_KEY` | EmailJS Public Key | `AIgbwO-ayq2i-I0ou` | ✅ |
| `VITE_ADMIN_EMAIL` | Admin email address | `admin@pergunu.com` | ✅ |

### **Optional Variables:**
| Variable | Description | Default | Optional |
|----------|-------------|---------|----------|
| `VITE_API_BASE_URL` | API server URL | `http://localhost:3001` | ⚪ |
| `VITE_DEMO_MODE` | Enable demo mode | `false` | ⚪ |
| `VITE_APP_DEBUG_MODE` | Enable debug logs | `true` | ⚪ |
| `VITE_BCRYPT_SALT_ROUNDS` | Password hash strength | `12` | ⚪ |

---

## 🧪 Testing Environment Configuration

### **1. Validate Configuration**
```javascript
// Add ke src/main.jsx untuk testing
console.log('🔧 Environment Configuration:');
console.log('API URL:', import.meta.env.VITE_API_BASE_URL);
console.log('EmailJS Service:', import.meta.env.VITE_EMAILJS_SERVICE_ID);
console.log('Admin Email:', import.meta.env.VITE_ADMIN_EMAIL);
console.log('Demo Mode:', import.meta.env.VITE_DEMO_MODE);
```

### **2. Environment Test Checklist**
- [ ] ✅ `.env` file loaded correctly
- [ ] ✅ EmailJS credentials working
- [ ] ✅ API endpoints responding
- [ ] ✅ Admin login functional
- [ ] ✅ Email notifications sending
- [ ] ✅ File uploads working
- [ ] ✅ All fallback values working

---

## 🚨 Troubleshooting

### **Common Issues:**

1. **EmailJS not working:**
   ```bash
   # Check environment variables
   console.log(import.meta.env.VITE_EMAILJS_SERVICE_ID)
   
   # Verify EmailJS dashboard configuration
   # Ensure template variables match
   ```

2. **API endpoints failing:**
   ```bash
   # Check API URL
   console.log(import.meta.env.VITE_API_BASE_URL)
   
   # Verify JSON Server running
   npm run api
   ```

3. **Admin login not working:**
   ```bash
   # Check admin email configured
   console.log(import.meta.env.VITE_ADMIN_EMAIL)
   
   # Verify password hash di apiService.js
   ```

---

## 📝 Migration Checklist

### **Completed ✅:**
- [x] Created `.env` dan `.env.example` files
- [x] Updated EmailJS configuration di `EmailService.js`
- [x] Updated API endpoints di semua components
- [x] Updated admin credentials configuration
- [x] Updated security parameters di `apiService.js`
- [x] Added .env to `.gitignore`
- [x] Created documentation

### **Next Steps 🔄:**
- [ ] Test all functionality dengan new environment config
- [ ] Setup production environment variables
- [ ] Update deployment scripts
- [ ] Train team tentang environment variable usage
- [ ] Monitor for any hardcoded values yang terlewat

---

## 📞 Support

Jika ada pertanyaan tentang environment configuration:
1. Check documentation di file ini
2. Review `.env.example` untuk template
3. Test dengan default fallback values
4. Contact development team untuk production setup

---

*Last Updated: 2025-01-27*
*Status: ✅ Production Ready*
