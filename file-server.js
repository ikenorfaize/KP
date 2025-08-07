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
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174', 
    'http://localhost:3000',
    'https://your-frontend-domain.vercel.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));

// ===== UPLOAD CONFIGURATION =====
const uploadDir = join(__dirname, 'uploads', 'certificates');

// Ensure upload directory exists
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Created upload directory:', uploadDir);
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

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'File server is running',
    uploadDir: uploadDir,
    timestamp: new Date().toISOString()
  });
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

    const certificateData = {
      id: Date.now(),
      originalName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      downloadUrl: `/download-certificate/${Date.now()}`,
      path: req.file.path,
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
    const db = readDB();
    
    // Find certificate in any user's certificates
    let certificate = null;
    let user = null;

    for (const u of db.users) {
      if (u.certificates) {
        certificate = u.certificates.find(c => c.id.toString() === certificateId);
        if (certificate) {
          user = u;
          break;
        }
      }
    }

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (!existsSync(certificate.filePath)) {
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
      
      db.users[userIndex].downloadHistory.push({
        id: Date.now(),
        certificateTitle: certificate.fileName,
        downloadDate: new Date().toISOString(),
        fileName: certificate.fileName
      });

      writeDB(db);
    }

    res.download(certificate.filePath, certificate.fileName);
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
    let user = null;
    let userIndex = -1;
    let certIndex = -1;

    for (let i = 0; i < db.users.length; i++) {
      const u = db.users[i];
      if (u.certificates) {
        for (let j = 0; j < u.certificates.length; j++) {
          if (u.certificates[j].id && u.certificates[j].id.toString() === certificateId) {
            certificate = u.certificates[j];
            user = u;
            userIndex = i;
            certIndex = j;
            break;
          }
        }
        if (certificate) break;
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
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('File server error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

// ===== SERVER STARTUP =====
app.listen(PORT, () => {
  console.log('📁 === PERGUNU FILE SERVER ===');
  console.log(`🌐 File server running on: http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${uploadDir}`);
  console.log('📋 Available endpoints:');
  console.log('  GET    /health - Health check');
  console.log('  POST   /upload-certificate - Upload certificate');
  console.log('  GET    /download-certificate/:id - Download certificate');
  console.log('  DELETE /delete-certificate/:id - Delete certificate');
  console.log('  GET    /user-certificates/:userId - Get user certificates');
  console.log('\n✨ File server ready!\n');
});

export default app;
