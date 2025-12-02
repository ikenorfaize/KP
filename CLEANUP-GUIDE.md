# 🧹 Cleanup Guide - Remove Old Monorepo Files

## Summary

After restructuring to multi-repo, you have **duplicate files** in the root that are no longer needed.

---

## ❌ Files to DELETE

### 1. Old Structure (Moved to backend/frontend)

| File/Folder | Status | Reason |
|-------------|--------|--------|
| `api/` | ❌ DELETE | Moved to `backend/src/` |
| `src/` | ❌ DELETE | Moved to `frontend/src/` |
| `public/` | ❌ DELETE | Moved to `frontend/public/` |
| `uploads/` | ❌ DELETE | Moved to `backend/uploads/` |
| `node_modules/` | ❌ DELETE | Each project has its own |
| `dist/` | ❌ DELETE | Frontend build (regenerated) |

### 2. Old Package Management

| File | Status | Reason |
|------|--------|--------|
| `package.json` | ❌ DELETE | Replaced by backend/frontend versions |
| `package-lock.json` | ❌ DELETE | Replaced by backend/frontend versions |

### 3. Old Config Files (Moved to frontend/)

| File | Status | Reason |
|------|--------|--------|
| `index.html` | ❌ DELETE | Moved to `frontend/` |
| `vite.config.js` | ❌ DELETE | Moved to `frontend/` |
| `tailwind.config.js` | ❌ DELETE | Moved to `frontend/` |
| `postcss.config.js` | ❌ DELETE | Moved to `frontend/` |
| `eslint.config.js` | ❌ DELETE | Moved to `frontend/` |

### 4. Old Server Files (Moved to backend/)

| File | Status | Reason |
|------|--------|--------|
| `file-server.js` | ❌ DELETE | Moved to `backend/src/` |

### 5. Migration Scripts (One-time use)

| File | Status | Reason |
|------|--------|--------|
| `restructure-project.ps1` | ❌ DELETE | Migration complete |
| `restructure-project-v2.ps1` | ❌ DELETE | Migration complete |

---

## ✅ Files to KEEP

### Git & Version Control
- ✅ `.git/` - Git repository
- ✅ `.gitignore` - Git ignore rules
- ✅ `.vercel/` - Vercel deployment config
- ✅ `.vercelignore` - Vercel ignore rules

### Your New Structure
- ✅ `backend/` - Backend project
- ✅ `frontend/` - Frontend project

### Environment & Config
- ✅ `.env` (optional reference)
- ✅ `.env.example`
- ✅ `.env.production`
- ✅ `.env.vercel.template`
- ⚠️ `vercel.json` (needs update)

### Documentation
- ✅ All `.md` files
- ✅ `file MD/` folder

### Database & Scripts
- ✅ `mongodb-import/` folder
- ✅ All `.ps1` scripts (backup, migration, etc.)

### IDE
- ✅ `.vscode/` folder

### Other
- ✅ `fitur.docx`
- ✅ `laporanbab5.pdf`

---

## 🚀 How to Cleanup

### Option 1: Automated Script (Recommended)

```powershell
.\cleanup-old-files.ps1
```

This will safely remove all old files.

### Option 2: Manual Deletion

**Step 1: Delete folders**
```powershell
Remove-Item -Path api, src, public, uploads, node_modules, dist -Recurse -Force
```

**Step 2: Delete old config files**
```powershell
Remove-Item -Path package.json, package-lock.json, index.html, vite.config.js, tailwind.config.js, postcss.config.js, eslint.config.js, file-server.js -Force
```

**Step 3: Delete migration scripts**
```powershell
Remove-Item -Path restructure-project*.ps1 -Force
```

---

## ⚠️ Before Cleanup - VERIFY

Make sure these work:

1. **Backend runs:**
   ```powershell
   cd backend
   npm start
   ```
   ✅ Should start on port 3001

2. **Frontend runs:**
   ```powershell
   cd frontend
   npm run dev
   ```
   ✅ Should start on port 5173

3. **Frontend connects to backend:**
   - Login works
   - Data loads
   - No console errors

---

## 📊 After Cleanup

Your root directory will be clean:

```
KP/
├── backend/              # Backend project
├── frontend/             # Frontend project
├── mongodb-import/       # Database data
├── file MD/              # Documentation
├── .git/                 # Version control
├── .env files            # Environment configs
├── *.md                  # Documentation
├── *.ps1                 # Utility scripts
└── vercel.json           # Deployment config
```

**Clean, organized, professional!** ✨

---

## ⚠️ Important: vercel.json

The root `vercel.json` is configured for **monorepo deployment**. For multi-repo:

### Option A: Keep Root Deployment (Easier)
You can still deploy from root if you:
1. Update paths to point to `frontend/` and `backend/`
2. Keep it as-is (will still work but may need tweaks)

### Option B: Separate Deployments (Recommended)
- Deploy backend separately: `cd backend && vercel`
- Deploy frontend separately: `cd frontend && vercel`
- Delete root `vercel.json`

**Current vercel.json points to:**
- `buildCommand: "npm run build"` → needs `frontend/` context
- `outputDirectory: "dist"` → needs `frontend/dist`
- `api/*.js` → needs `backend/src/` or `api/` folder

---

## 🎯 Recommendation

**Do this in order:**

1. ✅ **Test** backend and frontend work independently
2. ✅ **Run** `cleanup-old-files.ps1`
3. ✅ **Verify** everything still works
4. ✅ **Decide** on deployment strategy (monorepo vs separate)
5. ✅ **Update** or remove `vercel.json` accordingly

---

## 🆘 If Something Breaks

All files are still in root until you run cleanup. If backend/frontend has issues:

1. Fix the issue in `backend/` or `frontend/`
2. Don't run cleanup yet
3. Test again
4. Only cleanup when 100% working

---

**Ready to cleanup?** Run: `.\cleanup-old-files.ps1`
