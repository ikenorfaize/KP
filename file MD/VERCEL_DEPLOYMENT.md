# Vercel Deployment Guide

## 🚀 Quick Deployment Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy to Vercel**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Set up and deploy? **Y**
   - Which scope? Choose your account
   - Link to existing project? **N** (for new project)
   - What's your project's name? **kp-project** or your preferred name
   - In which directory is your code located? **./** (current directory)

## 📋 Environment Variables for Vercel

After deployment, add these environment variables in Vercel dashboard:

1. Go to your project dashboard on Vercel
2. Navigate to Settings → Environment Variables
3. Add these variables:

```
NODE_ENV=production
VITE_API_BASE_URL=https://your-project-name.vercel.app/api
```

## 🔧 Frontend Configuration

Update your frontend API calls to use:
- **Development**: `http://localhost:3001/api`
- **Production**: `https://your-project-name.vercel.app/api`

## 📡 API Endpoints Available

- `GET /api/health` - Health check
- `GET /api/users` - Get all users  
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/news` - Get news
- `POST /api/news` - Create news
- `GET /api/applications` - Get applications
- `POST /api/applications` - Submit application
- `GET /api/statistics` - Get statistics

## 🗄️ Database

The API uses `db.json` file for data storage. In production, consider upgrading to:
- MongoDB Atlas (cloud database)
- Supabase (PostgreSQL)
- PlanetScale (MySQL)

## 🔐 Security Notes

- Passwords are hashed with bcrypt
- CORS is configured for your domains
- Add proper authentication middleware for production
- Consider rate limiting for API endpoints
