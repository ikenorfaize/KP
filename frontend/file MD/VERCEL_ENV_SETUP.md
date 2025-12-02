# 🔧 Fix Vercel Environment Variables

## The Problem
Your app on Vercel is trying to fetch data from `localhost:3001` and `localhost:3002`, which don't exist in production.

**Error in console:**
```
localhost:3001/api/news:1 Failed to load resource: net::ERR_CONNECTION_REFUSED
Mixed Content: http://localhost:3002/uploads/images/...
```

## The Solution
Set environment variables on Vercel Dashboard.

---

## Step 1: Go to Vercel Dashboard

1. Open https://vercel.com
2. Log in to your account
3. Select your project: **kp-mocha** (or whatever your project is named)
4. Go to **Settings** → **Environment Variables**

---

## Step 2: Add These Environment Variables

Add the following variables **for Production, Preview, and Development**:

### Required Variables:

| Variable Name | Value |
|---------------|-------|
| `VITE_API_BASE_URL` | `https://kp-mocha.vercel.app/api` |
| `VITE_FILE_SERVER_URL` | `https://kp-mocha.vercel.app` |
| `NODE_ENV` | `production` |

### EmailJS Variables (from your .env):

| Variable Name | Value |
|---------------|-------|
| `VITE_EMAILJS_SERVICE_ID` | `service_ublbpnp` |
| `VITE_EMAILJS_TEMPLATE_ID` | `template_qnuud6d` |
| `VITE_EMAILJS_PUBLIC_KEY` | `yw1fbHGX168OMHldD` |

### Security Variables:

| Variable Name | Value |
|---------------|-------|
| `VITE_BCRYPT_SALT_ROUNDS` | `12` |
| `VITE_MAX_LOGIN_ATTEMPTS` | `5` |
| `VITE_SESSION_TIMEOUT` | `3600000` |
| `VITE_ADMIN_EMAIL` | `admin@pergunu.com` |
| `VITE_ADMIN_USERNAME` | `admin` |

---

## Step 3: Redeploy Your Application

After adding environment variables, you MUST redeploy:

### Option A: Trigger Redeploy from Dashboard
1. Go to **Deployments** tab
2. Click the **three dots (...)** on the latest deployment
3. Click **Redeploy**
4. Select **Use existing Build Cache: NO** (force fresh build)

### Option B: Redeploy via Git
```bash
git commit --allow-empty -m "Trigger redeploy with new env vars"
git push origin main
```

---

## Step 4: Verify the Fix

After redeployment completes:

1. Open your site: https://kp-mocha.vercel.app
2. Open browser console (F12)
3. Check the environment variables are loaded:
   ```javascript
   // Should show your production URLs, not localhost
   console.log('API:', import.meta.env.VITE_API_BASE_URL);
   console.log('Files:', import.meta.env.VITE_FILE_SERVER_URL);
   ```
4. Verify no more `localhost:3001` or `localhost:3002` errors

---

## Important Notes

### ⚠️ Why This Happens
- Vite only bundles environment variables **at build time**
- Variables starting with `VITE_` are exposed to the browser
- If not set on Vercel, they remain `undefined`
- Your code fallbacks to hardcoded URLs, but some parts still use localhost

### 🔒 Security
- Environment variables on Vercel are encrypted
- Variables starting with `VITE_` are public (exposed in browser)
- Never put sensitive secrets in `VITE_` variables

### 🎯 Backend Issue
Your app currently doesn't have a backend API on Vercel. The `/api` routes in `vercel.json` point to `/api/index.js`, but you need to:

1. **Option A**: Deploy your backend separately (Railway, Render, etc.)
2. **Option B**: Create Vercel serverless functions in `/api` directory
3. **Option C**: Use a cloud database + serverless API

For now, your app will run in **localStorage mode** on production, which means:
- ✅ Users can still use the frontend
- ✅ Login/registration works (in browser only)
- ❌ No persistent data across devices
- ❌ No real backend storage

---

## Quick Fix Commands

If you have Vercel CLI installed:

```bash
# Install Vercel CLI (if not installed)
npm install -g vercel

# Set environment variables via CLI
vercel env add VITE_API_BASE_URL production
# When prompted, enter: https://kp-mocha.vercel.app/api

vercel env add VITE_FILE_SERVER_URL production
# When prompted, enter: https://kp-mocha.vercel.app

# Add other variables the same way...

# Trigger redeploy
vercel --prod
```

---

## Expected Result

After fixing:
- ✅ No more `localhost` errors
- ✅ No more mixed content warnings
- ✅ EmailJS will work properly
- ⚠️ API calls will fallback to localStorage (until you deploy backend)
