// ===================================
// FILE SERVER ROUTES
// ===================================
// Certificate upload/download/delete routes extracted from file-server.js

import express from 'express';
import multer from 'multer';
import { existsSync, mkdirSync, unlinkSync } from 'fs';
import { join } from 'path';
import { getCollection, updateDocument } from '../utils/database.js';

const router = express.Router();

// ===== MULTER STORAGE CONFIGURATION =====
const UPLOADS_DIR = join(process.cwd(), 'uploads', 'certificates');
if (!existsSync(UPLOADS_DIR)) {
  mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, UPLOADS_DIR);
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 12);
    const ext = file.originalname.slice(file.originalname.lastIndexOf('.'));
    const filename = `${timestamp}_${randomStr}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype !== 'application/pdf') {
      return cb(new Error('Only PDF files allowed'));
    }
    cb(null, true);
  }
});

// ===== UPLOAD CERTIFICATE =====
router.post('/upload-certificate', upload.single('certificate'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    // Find user and update certificates
    const users = getCollection('users');
    const user = users.find(u => u.id === userId || u.id === parseInt(userId));

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const certificateId = Date.now();
    const certificateData = {
      id: certificateId,
      originalName: req.file.originalname,
      fileName: req.file.originalname,
      filename: req.file.filename,
      filePath: req.file.path,
      downloadUrl: `/download-certificate/${certificateId}`,
      uploadDate: new Date().toISOString(),
      size: req.file.size
    };

    const currentCertificates = user.certificates || [];
    const updatedCertificates = [...currentCertificates, certificateData];

    const updatedUser = updateDocument('users', user.id, {
      certificates: updatedCertificates
    });

    if (!updatedUser) {
      return res.status(500).json({ error: 'Failed to update user' });
    }

    res.json({
      message: 'Certificate uploaded successfully',
      certificate: certificateData
    });
  } catch (error) {
    console.error('❌ Upload error:', error);
    res.status(500).json({ error: error.message || 'Upload failed' });
  }
});

// ===== DELETE CERTIFICATE =====
router.delete('/delete-certificate/:certificateId', async (req, res) => {
  try {
    const { certificateId } = req.params;
    const users = getCollection('users');
    
    // Find certificate in any user's certificates
    let certificate = null;
    let user = null;
    let certIndex = -1;

    for (const u of users) {
      if (u.certificates) {
        const j = u.certificates.findIndex(c => c.id && c.id.toString() === certificateId);
        if (j !== -1) {
          certificate = u.certificates[j];
          user = u;
          certIndex = j;
          break;
        }
      }
    }

    if (!certificate || !user) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    // Delete physical file
    if (certificate.filePath && existsSync(certificate.filePath)) {
      try {
        unlinkSync(certificate.filePath);
        console.log('✅ Physical file deleted:', certificate.filePath);
      } catch (fileError) {
        console.warn('⚠️ Could not delete physical file:', fileError);
      }
    }

    // Remove from database
    const updatedCertificates = user.certificates.filter((_, idx) => idx !== certIndex);
    const updatedUser = updateDocument('users', user.id, {
      certificates: updatedCertificates
    });

    if (!updatedUser) {
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
    console.error('❌ Delete error:', error);
    res.status(500).json({ error: error.message || 'Delete failed' });
  }
});

// ===== DOWNLOAD CERTIFICATE =====
router.get('/download-certificate/:certificateId', (req, res) => {
  try {
    const { certificateId } = req.params;
    const users = getCollection('users');
    
    // Find certificate
    let certificate = null;
    let user = null;

    for (const u of users) {
      if (u.certificates) {
        const c = u.certificates.find(cert => cert.id && cert.id.toString() === certificateId);
        if (c) {
          certificate = c;
          user = u;
          break;
        }
      }
    }

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    if (!existsSync(certificate.filePath)) {
      return res.status(404).json({ error: 'File not found on server' });
    }

    // Update download count
    const certIndex = user.certificates.findIndex(c => c.id === certificate.id);
    if (certIndex !== -1) {
      user.certificates[certIndex].downloadCount = (certificate.downloadCount || 0) + 1;
      updateDocument('users', user.id, { certificates: user.certificates });
    }

    // Send file
    res.download(certificate.filePath, certificate.originalName || certificate.fileName);
  } catch (error) {
    console.error('❌ Download error:', error);
    res.status(500).json({ error: error.message || 'Download failed' });
  }
});

export default router;
