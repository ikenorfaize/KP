# ☁️ Cloudinary Setup Guide

## Step 1: Create Cloudinary Account

1. Go to https://cloudinary.com/users/register_free
2. Sign up with your email or GitHub
3. After verification, you'll be taken to the Dashboard

## Step 2: Get Your Credentials

On the Cloudinary Dashboard, you'll see:
```
Cloud Name: your_cloud_name
API Key: 123456789012345
API Secret: abcdefghijklmnopqrstuvwxyz123
```

**⚠️ Keep API Secret private! Never commit it to GitHub.**

## Step 3: Install Cloudinary SDK

Open terminal in your project:

```bash
# Install Cloudinary for backend
npm install cloudinary

# Install multer-storage-cloudinary for file uploads
npm install multer-storage-cloudinary

# Install dotenv if not already installed
npm install dotenv
```

## Step 4: Add Cloudinary Config to .env

Add to your `.env` file:

```env
# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123

# For frontend (if needed)
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

## Step 5: Create Cloudinary Config File

Create `backend/config/cloudinary.js`:

```javascript
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'pergunu', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }], // Auto-resize
    public_id: (req, file) => {
      // Generate unique filename
      return `${Date.now()}_${Math.random().toString(36).substring(7)}`;
    }
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

module.exports = { cloudinary, upload };
```

## Step 6: Test Cloudinary Connection

Create `backend/test-cloudinary.js`:

```javascript
require('dotenv').config();
const { cloudinary } = require('./config/cloudinary');

async function testCloudinary() {
  try {
    const result = await cloudinary.api.ping();
    console.log('✅ Cloudinary connection successful!');
    console.log('Cloud name:', process.env.CLOUDINARY_CLOUD_NAME);
    return true;
  } catch (error) {
    console.error('❌ Cloudinary connection failed:', error.message);
    return false;
  }
}

testCloudinary();
```

Run the test:
```bash
node backend/test-cloudinary.js
```

## Step 7: Folder Structure in Cloudinary

Recommended folder structure:
```
pergunu/
├── news/          (news images)
├── profiles/      (user profile pictures)
├── documents/     (PDF files, certificates)
└── misc/          (other uploads)
```

You can specify folder in the upload params.

## Benefits of Cloudinary

✅ **Free Tier:** 25GB storage, 25GB bandwidth/month
✅ **Auto CDN:** Fast image delivery worldwide
✅ **Auto Optimization:** Automatic image compression
✅ **Transformations:** Resize, crop, format conversion on-the-fly
✅ **No Server Storage:** Images stored in cloud, not your server
✅ **HTTPS:** All images served over secure connection

## Next Step

After setup, you need to:
1. Update backend upload endpoints (Step 2)
2. Update frontend image URLs (Step 3)
