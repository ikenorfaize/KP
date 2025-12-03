# MongoDB Setup Guide

## Step 1: Create MongoDB Atlas Account (FREE)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up with email or Google
3. Choose **FREE** M0 cluster (512MB)
4. Select region closest to your location (e.g., Singapore/AWS)

## Step 2: Create Database User

1. In Atlas dashboard, go to **Database Access**
2. Click **Add New Database User**
3. Username: `pergunu`
4. Password: Generate strong password (SAVE THIS!)
5. Database User Privileges: **Read and write to any database**
6. Click **Add User**

## Step 3: Allow Network Access

1. Go to **Network Access**
2. Click **Add IP Address**
3. Click **Allow Access from Anywhere** (0.0.0.0/0)
4. Click **Confirm**

## Step 4: Get Connection String

1. Go to **Database** (left sidebar)
2. Click **Connect** on your cluster
3. Choose **Connect your application**
4. Copy the connection string, it looks like:
   ```
   mongodb+srv://pergunu:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<password>` with your actual password

## Step 5: Create .env File Locally

Create `.env` file in project root:

```bash
MONGODB_URI=mongodb+srv://pergunu:YOUR_PASSWORD_HERE@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

## Step 6: Run Migration Script

```bash
node api/migrate-to-mongodb.js
```

This will copy all data from `db.json` to MongoDB.

## Step 7: Add to Vercel Environment Variables

1. Go to https://vercel.com (your project dashboard)
2. Go to **Settings** → **Environment Variables**
3. Add new variable:
   - Name: `MONGODB_URI`
   - Value: `mongodb+srv://pergunu:YOUR_PASSWORD@...`
   - Environment: Production, Preview, Development
4. Click **Save**

## Step 8: Redeploy

```bash
vercel --prod --force --yes
```

## Verification

After deployment, your data will persist even after:
- Cold starts
- Redeployments
- Server restarts
- Multiple logins/logouts

## Troubleshooting

- **Connection timeout**: Check Network Access allows 0.0.0.0/0
- **Authentication failed**: Check username/password in connection string
- **Database not found**: MongoDB creates it automatically on first write
