# 🚀 NPM Scripts Explained
## Understanding Development vs Production Environments

### 📋 **Overview**
NPM scripts are automation commands that help developers manage different aspects of application development, testing, and deployment. Each script serves a specific purpose and environment.

---

## 🎯 **The 3 Main Commands Explained**

### 1. **`npm run demo`** 🏃‍♂️
**Purpose:** Basic development environment for frontend development and testing  
**What it runs:** Frontend (Vite) + API Backend (JSON Server)

```bash
npm run demo
# Equivalent to running:
# Terminal 1: npm run dev     (Frontend on port 5173)
# Terminal 2: npm run api     (Backend on port 3001)
```

**Use Cases:**
- ✅ **Daily development work** - Building React components
- ✅ **Frontend testing** - Testing UI/UX changes
- ✅ **API integration testing** - Testing form submissions, data fetching
- ✅ **Basic registration testing** - Testing user registration flow
- ✅ **Quick debugging** - When you need to test core functionality

**What's Running:**
- 🌐 **Frontend (Vite Dev Server):** `http://localhost:5173`
- 🗄️ **JSON Server API:** `http://localhost:3001`
- ❌ **No file uploads** - Certificate upload won't work
- ❌ **No webhook handlers** - No external integrations

---

### 2. **`npm run full-demo`** 🎭
**Purpose:** Complete development environment with file handling capabilities  
**What it runs:** Frontend + API Backend + File Upload Server

```bash
npm run full-demo
# Equivalent to running:
# Terminal 1: npm run dev          (Frontend on port 5173)
# Terminal 2: npm run api          (Backend on port 3001)  
# Terminal 3: npm run file-server  (File server on port 3002)
```

**Use Cases:**
- ✅ **Complete feature testing** - Testing registration with certificate uploads
- ✅ **File upload testing** - When users need to upload documents
- ✅ **Integration testing** - Testing complete user workflows
- ✅ **Pre-production testing** - Testing all features before deployment
- ✅ **Demo presentations** - Showing complete functionality to stakeholders

**What's Running:**
- 🌐 **Frontend (Vite Dev Server):** `http://localhost:5173`
- 🗄️ **JSON Server API:** `http://localhost:3001`
- 📁 **File Upload Server:** `http://localhost:3002`
- ❌ **No webhook handlers** - Limited external integrations

**⚠️ Current Status:** Requires `file-server.js` to exist (currently missing)

---

### 3. **`npm run production`** 🏭
**Purpose:** Full production-like environment with all services and integrations  
**What it runs:** Frontend + API Backend + File Server + Webhook Server

```bash
npm run production
# Equivalent to running:
# Terminal 1: npm run dev             (Frontend on port 5173)
# Terminal 2: npm run api             (Backend on port 3001)
# Terminal 3: npm run file-server     (File server on port 3002)
# Terminal 4: npm run webhook-server  (Webhook server on port 3003)
```

**Use Cases:**
- ✅ **Production simulation** - Testing how app behaves in real environment
- ✅ **External integrations** - Testing webhooks, third-party APIs
- ✅ **Load testing** - Testing with multiple services running
- ✅ **Deployment preparation** - Final testing before going live
- ✅ **Full system testing** - Testing all components working together

**What's Running:**
- 🌐 **Frontend (Vite Dev Server):** `http://localhost:5173`
- 🗄️ **JSON Server API:** `http://localhost:3001`
- 📁 **File Upload Server:** `http://localhost:3002`
- 🔗 **Webhook Handler:** `http://localhost:3003`

---

## 🤔 **Why Not Run Everything All The Time?**

### **Resource Management** 💻
```
npm run demo:          ~200MB RAM,  2 processes
npm run full-demo:     ~400MB RAM,  3 processes  
npm run production:    ~600MB RAM,  4 processes
```

### **Development Speed** ⚡
- **Faster startup time** - Less services = quicker boot
- **Faster hot reloading** - Less processes competing for resources
- **Easier debugging** - Fewer moving parts = simpler troubleshooting

### **Error Isolation** 🔍
- **Targeted testing** - Test specific features without interference
- **Cleaner logs** - Less noise from unused services
- **Simpler debugging** - Identify which service has issues

---

## 🎯 **When To Use Each Command**

### **Daily Development: `npm run demo`** 📅
```bash
# Use when:
- Building React components
- Styling with TailwindCSS
- Testing basic user interactions
- Working on navigation/routing
- Testing form validation (without file uploads)
```

### **Feature Development: `npm run full-demo`** 🔧
```bash
# Use when:
- Testing complete registration flow
- Working on file upload features
- Testing certificate upload functionality
- Preparing for user acceptance testing
- Demonstrating features to clients
```

### **Pre-Production: `npm run production`** 🚀
```bash
# Use when:
- Final testing before deployment
- Testing external API integrations
- Load testing with multiple users
- Testing webhook endpoints
- Simulating production environment
```

---

## 🏗️ **Architecture Comparison**

### **Development Phases**
```
Phase 1: Basic Development
├── npm run demo
├── Frontend Development
├── API Integration
└── Basic Testing

Phase 2: Feature Completion  
├── npm run full-demo
├── File Upload Testing
├── Complete User Flows
└── Integration Testing

Phase 3: Production Ready
├── npm run production
├── Full System Testing
├── External Integrations
└── Performance Testing
```

---

## 🎪 **Real-World Scenario Example**

### **Monday Morning: Starting New Feature** 🌅
```bash
npm run demo
# You're building a new "News" component
# You only need frontend + basic API
# No need for file uploads or webhooks
```

### **Wednesday Afternoon: Testing Registration** 🕐
```bash
npm run full-demo  
# User reported issues with certificate upload
# You need to test the complete registration flow
# File server is required for upload testing
```

### **Friday Before Deployment: Final Check** 🎯
```bash
npm run production
# Testing everything works together
# Checking webhook integrations
# Simulating real user environment
```

---

## 💡 **Best Practices**

### **Development Workflow** 🔄
1. **Start Small:** Use `npm run demo` for daily work
2. **Scale Up:** Use `npm run full-demo` when testing features
3. **Go Full:** Use `npm run production` before major releases

### **Debugging Strategy** 🐛
1. **Problem in UI?** → Test with `npm run demo`
2. **File upload issues?** → Test with `npm run full-demo`  
3. **External API problems?** → Test with `npm run production`

### **Team Collaboration** 👥
- **Frontend developers:** Mostly use `npm run demo`
- **Full-stack developers:** Use `npm run full-demo`
- **DevOps/Testing team:** Use `npm run production`

---

## 🔧 **How Concurrently Works**

### **The Magic Behind Multiple Services**
```javascript
// package.json
"scripts": {
  "demo": "concurrently \"npm run dev\" \"npm run api\"",
  "full-demo": "concurrently \"npm run dev\" \"npm run api\" \"npm run file-server\"",
  "production": "concurrently \"npm run dev\" \"npm run api\" \"npm run file-server\" \"npm run webhook-server\""
}
```

**Concurrently Benefits:**
- ✅ **Single command** starts multiple services
- ✅ **Color-coded output** distinguishes different services
- ✅ **Automatic cleanup** stops all services with Ctrl+C
- ✅ **Parallel execution** all services start simultaneously

---

## 🎨 **Visual Service Architecture**

### **npm run demo**
```
┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   JSON Server   │
│   (Port 5173)   │◄──►│   (Port 3001)   │
│   React + Vite  │    │   API Endpoints │
└─────────────────┘    └─────────────────┘
```

### **npm run full-demo**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   JSON Server   │    │   File Server   │
│   (Port 5173)   │◄──►│   (Port 3001)   │    │   (Port 3002)   │
│   React + Vite  │    │   API Endpoints │    │   File Uploads  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **npm run production**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   JSON Server   │    │   File Server   │    │ Webhook Server  │
│   (Port 5173)   │◄──►│   (Port 3001)   │    │   (Port 3002)   │    │   (Port 3003)   │
│   React + Vite  │    │   API Endpoints │    │   File Uploads  │    │ External APIs   │
└─────────────────┘    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🚨 **Common Issues & Solutions**

### **Port Conflicts** 🔴
```bash
# Problem: Port 5173 already in use
# Solution: Vite will automatically use 5174

# Problem: Port 3001 already in use  
# Solution: Kill existing process or change port
netstat -ano | findstr ":3001"
taskkill /F /PID <process_id>
```

### **Service Dependencies** 🔗
```bash
# Problem: Registration form "ignored"
# Cause: API backend not running
# Solution: Ensure npm run demo (or higher) is running

# Problem: File upload fails
# Cause: File server not running  
# Solution: Use npm run full-demo instead of npm run demo
```

### **Memory Issues** 💾
```bash
# Problem: Computer running slow with npm run production
# Cause: Too many services for development machine
# Solution: Use npm run demo for daily work

# Problem: Hot reload becomes slow
# Cause: Multiple services competing for resources
# Solution: Close unnecessary browser tabs, use appropriate script
```

---

## 🎯 **Summary: Choose Your Command**

| Scenario | Command | Reason |
|----------|---------|---------|
| **Daily coding** | `npm run demo` | Lightweight, fast, covers 90% of development needs |
| **Testing uploads** | `npm run full-demo` | Includes file handling for complete feature testing |
| **Pre-deployment** | `npm run production` | Full simulation of production environment |
| **Quick bug fix** | `npm run demo` | Minimal setup for focused debugging |
| **Client demo** | `npm run full-demo` | Shows complete functionality without overhead |
| **Load testing** | `npm run production` | All services running for realistic testing |

---

## 💪 **Key Takeaway**

**Different phases of development require different levels of complexity:**

- 🏃‍♂️ **Sprint (npm run demo):** Fast, focused, efficient
- 🚴‍♂️ **Marathon (npm run full-demo):** Comprehensive, feature-complete
- 🏎️ **Race Car (npm run production):** Full power, all systems go

**Choose the right tool for the job!** 🎯

---

*NPM Scripts Documentation - Last Updated: 2025-01-27*  
*PERGUNU Development Environment Guide*
