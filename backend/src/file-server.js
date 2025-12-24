// ===================================
// 📁 PERGUNU FILE SERVER
// ===================================
// Handles file uploads and downloads for certificates

import express from 'express';
import multer from 'multer';
import cors from 'cors';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.FILE_PORT || 3002;

// ===== MIDDLEWARE =====
// Secure CORS configuration with environment-based origins
const corsOptions = {
  origin: (origin, callback) => {
    // Get allowed origins from environment
    const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean);
    
    // Allow same-origin requests (no origin header)
    if (!origin) return callback(null, true);
    
    try {
      const url = new URL(origin);
      
      // Build dynamic allow list
      const allowList = new Set([
        ...allowedOrigins,
        process.env.FRONTEND_URL,
        'https://pergunu.fairuzfd.site',
        'https://apipergunu.fairuzfd.site'
      ].filter(Boolean));
      
      // In development, allow localhost origins
      if (process.env.NODE_ENV !== 'production') {
        const isLocalhost = url.hostname === 'localhost' || url.hostname === '127.0.0.1';
        if (isLocalhost) {
          allowList.add(`http://localhost:5173`);
          allowList.add(`http://localhost:3000`);
          return callback(null, true);
        }
      }
      
      if (allowList.has(origin)) {
        return callback(null, true);
      }
      
      // Log rejected origins in development for debugging
      if (process.env.NODE_ENV !== 'production') {
        console.warn(`CORS: Rejected origin ${origin}`);
      }
      
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Invalid origin URL:', error.message);
      }
    }
    
    return callback(new Error('Not allowed by CORS'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200, // Support legacy browsers
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  maxAge: 86400 // Cache preflight for 24 hours
};
app.use(cors(corsOptions));

app.use(express.json({ limit: '50mb' }));

// ===== UPLOAD CONFIGURATION =====
const uploadDir = join(__dirname, 'uploads', 'certificates');
const imageUploadDir = join(__dirname, 'uploads', 'images');

// Ensure upload directories exist
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created upload directory:', uploadDir);
}

if (!existsSync(imageUploadDir)) {
  mkdirSync(imageUploadDir, { recursive: true });
  console.log('📁 Created image upload directory:', imageUploadDir);
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = extname(file.originalname);
    const filename = `${timestamp}_${randomString}${extension}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Image upload configuration
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, imageUploadDir);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = extname(file.originalname);
    const filename = `${timestamp}_${randomString}${extension}`;
    cb(null, filename);
  }
});

const imageUpload = multer({
  storage: imageStorage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, GIF, WebP) are allowed'), false);
    }
  }
});

// ===== DATABASE FUNCTIONS =====
const DB_PATH = join(__dirname, 'db.json');

const readDB = () => {
  try {
    if (!existsSync(DB_PATH)) {
      return { users: [], news: [], sessions: [], applications: [], statistics: {} };
    }
    const data = readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { users: [], news: [], sessions: [], applications: [], statistics: {} };
  }
};

const writeDB = (data) => {
  try {
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing database:', error);
    return false;
  }
};

// ===== FILE ROUTES =====

// Static files serving
app.use('/uploads/images', express.static(imageUploadDir));
app.use('/uploads/certificates', express.static(uploadDir));

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'File server is running',
    uploadDir: uploadDir,
    imageUploadDir: imageUploadDir,
    timestamp: new Date().toISOString()
  });
});

// Upload image for news
app.post('/upload-image', imageUpload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    res.json({
      success: true,
      filename: req.file.filename,
      originalName: req.file.originalname,
      size: req.file.size,
      url: `/uploads/images/${req.file.filename}`
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Upload certificate
app.post('/upload-certificate', upload.single('certificate'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Update user's certificates in database
    const db = readDB();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    const certificateId = Date.now();
    const certificateData = {
      id: certificateId,
      originalName: req.file.originalname,
      fileName: req.file.originalname, // keep a stable name used by download/history
      filename: req.file.filename,     // unique saved filename on disk
      filePath: req.file.path,
      downloadUrl: `/download-certificate/${certificateId}`,
      uploadDate: new Date().toISOString(),
      size: req.file.size
    };

    if (!db.users[userIndex].certificates) {
      db.users[userIndex].certificates = [];
    }

    db.users[userIndex].certificates.push(certificateData);
    const success = writeDB(db);

    if (!success) {
      return res.status(500).json({ error: 'Failed to save certificate data' });
    }

    res.json({
      message: 'Certificate uploaded successfully',
      certificate: certificateData
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed' });
  }
});

// Download certificate
app.get('/download-certificate/:certificateId', (req, res) => {
  try {
    const { certificateId } = req.params;
    console.log('🔍 Download request for certificate ID:', certificateId);
    
    const db = readDB();
    
    // Find certificate in any user's certificates
    let certificate = null;
    let user = null;

    for (const u of db.users) {
      if (u.certificates) {
        certificate = u.certificates.find(c => c.id && c.id.toString() === certificateId.toString());
        if (certificate) {
          user = u;
          console.log('✅ Found certificate:', certificate.fileName || certificate.originalName);
          break;
        }
      }
    }

    if (!certificate) {
      console.log('❌ Certificate not found for ID:', certificateId);
      return res.status(404).json({ error: 'Certificate not found' });
    }

    console.log('📄 Certificate file path:', certificate.filePath);
    if (!existsSync(certificate.filePath)) {
      console.log('❌ File does not exist:', certificate.filePath);
      return res.status(404).json({ error: 'Certificate file not found' });
    }

  // Update download statistics
    const userIndex = db.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      db.users[userIndex].downloads = (db.users[userIndex].downloads || 0) + 1;
      db.users[userIndex].lastDownload = new Date().toISOString();
      
      if (!db.users[userIndex].downloadHistory) {
        db.users[userIndex].downloadHistory = [];
      }
      
      const fileName = certificate.fileName || certificate.originalName || certificate.filename;
      db.users[userIndex].downloadHistory.push({
        id: Date.now(),
        fileName: fileName,
        downloadDate: new Date().toISOString()
      });

      writeDB(db);
    }

  const downloadName = certificate.fileName || certificate.originalName || certificate.filename || 'certificate.pdf';
  res.setHeader('Content-Disposition', `attachment; filename="${downloadName}"`);
  res.setHeader('Content-Type', 'application/pdf');
  return res.sendFile(certificate.filePath);
  } catch (error) {
    console.error('Download error:', error);
    res.status(500).json({ error: 'Download failed' });
  }
});

// Get user certificates
app.get('/user-certificates/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const db = readDB();
    
    const user = db.users.find(u => u.id === userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.certificates || []);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Delete certificate file
app.delete('/delete-certificate/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const db = readDB();
    
    // Find certificate in any user's certificates
    let certificate = null;
    let userIndex = -1;
    let certIndex = -1;

    for (let i = 0; i < db.users.length; i++) {
      const u = db.users[i];
      if (u.certificates) {
        const j = u.certificates.findIndex(c => c.id && c.id.toString() === certificateId);
        if (j !== -1) {
          certificate = u.certificates[j];
          userIndex = i;
          certIndex = j;
          break;
        }
      }
    }

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Delete physical file
    if (certificate.filePath && existsSync(certificate.filePath)) {
      try {
        const fs = await import('fs/promises');
        await fs.unlink(certificate.filePath);
        console.log('✅ Physical file deleted:', certificate.filePath);
      } catch (fileError) {
        console.warn('⚠️ Could not delete physical file:', fileError);
        // Continue with database cleanup
      }
    }

    // Remove from database
    db.users[userIndex].certificates.splice(certIndex, 1);
    const success = writeDB(db);

    if (!success) {
      return res.status(500).json({ error: 'Failed to update database' });
    }

    res.json({
      message: 'Certificate deleted successfully',
      deletedCertificate: {
        id: certificate.id,
        fileName: certificate.fileName
      }
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Delete failed' });
  }
});

// ===== ERROR HANDLING =====
app.use((error, req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('File server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== SERVER STARTUP =====
app.listen(PORT, '0.0.0.0', (err) => {
  if (err) {
    console.error('❌ Failed to start file server:', err);
    process.exit(1);
  }
  
  console.log('📁 === PERGUNU FILE SERVER ===');
  console.log(`🌐 File server running on: http://0.0.0.0:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log('📋 Available endpoints:');
  console.log('  GET    /health - Health check');
  console.log('  POST   /upload-certificate - Upload certificate');
  console.log('  GET    /download-certificate/:id - Download certificate');
  console.log('  DELETE /delete-certificate/:id - Delete certificate');
  console.log('  GET    /user-certificates/:userId - Get user certificates');
  console.log('\n✨ File server ready!\n');
  
  // Test the server is reachable
  setTimeout(() => {
    import('http').then(http => {
      const req = http.get(`http://localhost:${PORT}/health`, (_res) => {
        console.log('✅ Self-test successful: Server is reachable');
      });
      req.on('error', (err) => {
        console.error('❌ Self-test failed:', err.message);
      });
      req.setTimeout(10000, () => {
        req.destroy();
        console.error('❌ Self-test timeout');
      });
    }).catch(err => {
      console.error('❌ Self-test module error:', err.message);
    });
  }, 2000);
});

export default app;
