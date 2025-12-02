# 🚀 KP Project - Multi-Repo Structure

This project has been restructured from a monorepo to a multi-repo structure with separate backend and frontend folders for easier development and maintenance.

## 📂 Project Structure

```
KP/
├── backend/          # Backend API server
│   ├── src/
│   ├── uploads/
│   ├── package.json
│   └── README.md
│
├── frontend/         # Frontend React application
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── README.md
│
└── restructure-project.ps1  # Migration script
```

## 🎯 Benefits of Multi-Repo Structure

✅ **Clear Separation** - Backend and frontend are completely separated
✅ **Independent Development** - Work on backend or frontend without interference
✅ **Easier Deployment** - Deploy backend and frontend independently
✅ **Better Organization** - Each part has its own dependencies and configuration
✅ **Simpler Scripts** - No more confusing concurrent scripts

## 🚀 Getting Started

### 1️⃣ Run the Migration Script (First Time Only)

```powershell
.\restructure-project.ps1
```

This will copy all files to the appropriate folders (backend or frontend).

### 2️⃣ Setup Backend

```bash
cd backend
npm install
```

Create `.env` file in `backend/` with your configuration:
```env
MONGODB_URI=your_mongodb_uri
PORT=3001
# ... other variables
```

Start backend server:
```bash
npm start
```

### 3️⃣ Setup Frontend

```bash
cd frontend
npm install
```

Create `.env` file in `frontend/` with your configuration:
```env
VITE_API_URL=http://localhost:3001
# ... other variables
```

Start frontend development server:
```bash
npm run dev
```

## 🔧 Development Workflow

### Running Backend
```bash
cd backend
npm run dev        # Start API server (port 3001)
npm run file-server  # Start file server (port 3002)
```

### Running Frontend
```bash
cd frontend
npm run dev        # Start Vite dev server (port 5173)
npm run build      # Build for production
npm run preview    # Preview production build
```

## 📝 What Changed?

### Before (Monorepo)
```json
{
  "scripts": {
    "demo": "concurrently \"npm run dev\" \"npm run api\"",
    "production": "concurrently \"npm run dev\" \"npm run api\" \"npm run file-server\" \"npm run webhook-server\""
  }
}
```
❌ Confusing mixed scripts
❌ All dependencies in one package.json
❌ Hard to maintain and deploy

### After (Multi-Repo)
**Backend:**
```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node src/index.js"
  }
}
```

**Frontend:**
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build"
  }
}
```
✅ Clear, simple scripts
✅ Separated dependencies
✅ Easy to understand and maintain

## 🌐 API Communication

The frontend communicates with the backend via REST API:

- Backend runs on: `http://localhost:3001`
- Frontend runs on: `http://localhost:5173`
- Configure API URL in frontend `.env`: `VITE_API_URL=http://localhost:3001`

## 📦 Deployment

### Backend Deployment (Vercel)
```bash
cd backend
vercel
```

### Frontend Deployment (Vercel)
```bash
cd frontend
vercel
```

Or deploy to separate hosting services:
- Backend → Vercel, Railway, Render
- Frontend → Vercel, Netlify, GitHub Pages

## 🔄 Migration Notes

After running the migration script:
1. ✅ Backend files are in `backend/`
2. ✅ Frontend files are in `frontend/`
3. ⚠️ Original files remain in root directory
4. 📋 Review and test both applications
5. 🗑️ Clean up root directory when ready

## 🆘 Troubleshooting

### CORS Issues
Make sure backend `.env` has correct frontend URL:
```env
FRONTEND_URL=http://localhost:5173
ALLOWED_ORIGINS=http://localhost:5173
```

### API Connection Failed
1. Check if backend is running on port 3001
2. Verify frontend `.env` has correct API URL
3. Check CORS configuration in backend

### Port Already in Use
```bash
# Find process using port
netstat -ano | findstr :3001

# Kill process
taskkill /PID <process_id> /F
```

## 📚 Documentation

- [Backend Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
- Additional docs in `file MD/` folder

## 💡 Tips

- Always start backend before frontend
- Use separate terminal windows for backend and frontend
- Check both README files for detailed setup instructions
- Update environment variables for production deployment

## 🤝 Contributing

1. Work on backend: `cd backend`
2. Work on frontend: `cd frontend`
3. Each has independent git tracking (if needed)
4. Keep environment files private

---

Made with ❤️ for easier development
