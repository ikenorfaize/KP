// Server middleware untuk file upload/download dengan Express dan Multer
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cors from 'cors';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3002; // Different port from JSON Server

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'certificates');
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generate unique filename
    const userId = req.body.userId || 'unknown';
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, extension);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-\_]/g, '_');
    
    const fileName = `${userId}_${timestamp}_${randomId}_${sanitizedName}${extension}`;
    cb(null, fileName);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Only PDF files are allowed!'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Serve static files (for downloads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ ROUTES ============

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'File upload server is running',
    timestamp: new Date().toISOString()
  });
});

// Upload PDF file
app.post('/api/upload', upload.single('file'), async (req, res) => {
  try {
    console.log('📤 File upload request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded'
      });
    }

    const { userId } = req.body;
    const metadata = JSON.parse(req.body.metadata || '{}');
    
    console.log('📁 File uploaded:', {
      originalName: req.file.originalname,
      fileName: req.file.filename,
      size: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
      userId: userId
    });

    // Create certificate object
    const certificate = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
      name: req.file.originalname,
      title: metadata.title || req.file.originalname,
      description: metadata.description || '',
      category: metadata.category || 'certificate',
      fileName: req.file.filename,
      filePath: `/uploads/certificates/${req.file.filename}`,
      fileSize: req.file.size,
      fileSizeMB: parseFloat((req.file.size / 1024 / 1024).toFixed(2)),
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userId
    };

    // Update user in JSON Server
    try {
      const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
      if (userResponse.ok) {
        const user = await userResponse.json();
        const updatedCertificates = [...(user.certificates || []), certificate];

        await fetch(`http://localhost:3001/users/${userId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            certificates: updatedCertificates
          })
        });

        console.log('✅ Certificate added to user database');
      }
    } catch (dbError) {
      console.warn('⚠️ Failed to update user database:', dbError.message);
    }

    res.json({
      success: true,
      certificate: certificate,
      message: 'File uploaded successfully'
    });

  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({
      success: false,
      message: `Upload failed: ${error.message}`
    });
  }
});

// Get file info
app.get('/api/file/:fileName', (req, res) => {
  try {
    const { fileName } = req.params;
    const filePath = path.join(__dirname, 'uploads', 'certificates', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const stats = fs.statSync(filePath);
    
    res.json({
      success: true,
      fileInfo: {
        fileName: fileName,
        fileSize: stats.size,
        fileSizeMB: (stats.size / 1024 / 1024).toFixed(2),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime
      }
    });

  } catch (error) {
    console.error('❌ File info error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to get file info: ${error.message}`
    });
  }
});

// Download file with tracking
app.get('/api/download/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const { userId } = req.query;
    
    const filePath = path.join(__dirname, 'uploads', 'certificates', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    console.log('📥 File download:', {
      fileName: fileName,
      userId: userId,
      ip: req.ip
    });

    // Update download statistics if userId provided
    if (userId) {
      try {
        const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
        if (userResponse.ok) {
          const user = await userResponse.json();
          
          const downloadHistory = user.downloadHistory || [];
          downloadHistory.push({
            fileName: fileName,
            downloadedAt: new Date().toISOString(),
            ip: req.ip
          });

          await fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              downloads: (user.downloads || 0) + 1,
              lastDownload: new Date().toISOString(),
              downloadHistory: downloadHistory
            })
          });

          console.log('📊 Download statistics updated');
        }
      } catch (dbError) {
        console.warn('⚠️ Failed to update download statistics:', dbError.message);
      }
    }

    // Set download headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    
    // Stream file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({
      success: false,
      message: `Download failed: ${error.message}`
    });
  }
});

// Delete file
app.delete('/api/file/:fileName', async (req, res) => {
  try {
    const { fileName } = req.params;
    const { userId } = req.body;
    
    const filePath = path.join(__dirname, 'uploads', 'certificates', fileName);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Delete file
    fs.unlinkSync(filePath);
    console.log('🗑️ File deleted:', fileName);

    // Update user in database to remove certificate
    if (userId) {
      try {
        const userResponse = await fetch(`http://localhost:3001/users/${userId}`);
        if (userResponse.ok) {
          const user = await userResponse.json();
          const updatedCertificates = user.certificates?.filter(cert => cert.fileName !== fileName) || [];

          await fetch(`http://localhost:3001/users/${userId}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              certificates: updatedCertificates
            })
          });

          console.log('✅ Certificate removed from user database');
        }
      } catch (dbError) {
        console.warn('⚠️ Failed to update user database:', dbError.message);
      }
    }

    res.json({
      success: true,
      message: 'File deleted successfully'
    });

  } catch (error) {
    console.error('❌ Delete error:', error);
    res.status(500).json({
      success: false,
      message: `Delete failed: ${error.message}`
    });
  }
});

// Get upload statistics
app.get('/api/stats', (req, res) => {
  try {
    const uploadDir = path.join(__dirname, 'uploads', 'certificates');
    
    if (!fs.existsSync(uploadDir)) {
      return res.json({
        success: true,
        stats: {
          fileCount: 0,
          totalSizeBytes: 0,
          totalSizeMB: '0.00'
        }
      });
    }

    const files = fs.readdirSync(uploadDir);
    let totalSize = 0;
    let fileCount = 0;

    files.forEach(file => {
      const filePath = path.join(uploadDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isFile() && path.extname(file).toLowerCase() === '.pdf') {
        totalSize += stats.size;
        fileCount++;
      }
    });

    res.json({
      success: true,
      stats: {
        fileCount,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        directory: uploadDir
      }
    });

  } catch (error) {
    console.error('❌ Stats error:', error);
    res.status(500).json({
      success: false,
      message: `Failed to get stats: ${error.message}`
    });
  }
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File too large. Maximum size is 10MB.'
      });
    }
  }
  
  console.error('❌ Server error:', error);
  res.status(500).json({
    success: false,
    message: `Server error: ${error.message}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 File upload server running on http://localhost:${PORT}`);
  console.log(`📁 Upload directory: ${path.join(__dirname, 'uploads', 'certificates')}`);
  console.log(`🌐 Static files served at: http://localhost:${PORT}/uploads`);
});

export default app;
