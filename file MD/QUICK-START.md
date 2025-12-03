# 🎯 Quick Start Guide - Multi-Repo Structure

Your project has been successfully restructured! Here's how to get started:

## 📂 New Structure

```
KP/
├── backend/          ✅ Backend API (Express.js + MongoDB)
├── frontend/         ✅ Frontend App (React + Vite)
└── [old files]       ⚠️  Can be removed after testing
```

## 🚀 Getting Started

### Step 1: Setup Backend

```powershell
cd backend
npm install
```

**Configure `.env` file:**
```env
MONGODB_URI=your_mongodb_uri
PORT=3001
FILE_PORT=3002
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:5173
```

**Start backend:**
```powershell
npm start
```
✅ Backend will run on http://localhost:3001

---

### Step 2: Setup Frontend

Open a **new terminal window**, then:

```powershell
cd frontend
npm install
```

**Configure `.env` file:**
```env
VITE_API_URL=http://localhost:3001
VITE_FILE_SERVER_URL=http://localhost:3002
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_TEMPLATE_ID=your_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key
```

**Start frontend:**
```powershell
npm run dev
```
✅ Frontend will run on http://localhost:5173

---

## 🎯 Development Workflow

**You'll need TWO terminal windows:**

### Terminal 1 - Backend
```powershell
cd backend
npm start
```

### Terminal 2 - Frontend
```powershell
cd frontend
npm run dev
```

---

## 🔧 Available Commands

### Backend Commands
```powershell
cd backend
npm start              # Start API server
npm run dev            # Start API server (development)
npm run file-server    # Start file upload server
```

### Frontend Commands
```powershell
cd frontend
npm run dev            # Start development server
npm run build          # Build for production
npm run preview        # Preview production build
npm run lint           # Lint code
```

---

## ✅ Benefits of Multi-Repo

✅ **Clear Separation** - Backend and frontend are independent
✅ **Easy to Understand** - No more confusing scripts like `concurrently`
✅ **Better Organization** - Each has its own dependencies
✅ **Easier Deployment** - Deploy backend and frontend separately
✅ **Simpler Development** - Work on one part without affecting the other

---

## 🗑️ Cleanup (Optional)

After testing that everything works, you can delete these old files from root:

- `api/` folder
- `src/` folder
- `public/` folder
- `uploads/` folder
- `index.html`
- `vite.config.js`
- `tailwind.config.js`
- `postcss.config.js`
- `eslint.config.js`
- `file-server.js`
- Old scripts: `*.ps1`, `*.sh`

**⚠️ Keep these:**
- `.git/` folder
- `.gitignore`
- `node_modules/` (will be regenerated)
- `backend/` folder
- `frontend/` folder

---

## 🆘 Troubleshooting

### Backend won't start?
1. Check if `.env` file exists in `backend/` folder
2. Verify MongoDB connection string
3. Make sure port 3001 is not in use

### Frontend can't connect to API?
1. Make sure backend is running on port 3001
2. Check `.env` file in `frontend/` folder
3. Verify `VITE_API_URL=http://localhost:3001`

### Port already in use?
```powershell
# Find what's using the port
netstat -ano | findstr :3001

# Kill the process
taskkill /PID <process_id> /F
```

### CORS errors?
Make sure backend `.env` has:
```env
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

---

## 📚 Documentation

- **Backend:** See `backend/README.md`
- **Frontend:** See `frontend/README.md`
- **Full Guide:** See `README-MULTIREPO.md`

---

## 🎉 You're All Set!

Your project is now properly structured. Happy coding! 🚀
