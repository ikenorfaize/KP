// File Upload Service - Improved version with file system storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadService {
  constructor() {
    this.uploadsDir = path.join(__dirname, '..', 'uploads', 'certificates');
    this.ensureUploadDir();
  }

  ensureUploadDir() {
    if (!fs.existsSync(this.uploadsDir)) {
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory:', this.uploadsDir);
    }
  }

  // Generate unique filename
  generateFileName(originalName, userId) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = path.extname(originalName);
    const baseName = path.basename(originalName, extension);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-\_]/g, '_');
    
    return `${userId}_${timestamp}_${randomId}_${sanitizedName}${extension}`;
  }

  // Save file from base64 to file system
  async saveFileFromBase64(base64Data, originalName, userId, metadata = {}) {
    try {
      // Remove data:application/pdf;base64, prefix if exists
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      
      // Generate unique filename
      const fileName = this.generateFileName(originalName, userId);
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Convert base64 to buffer and save
      const buffer = Buffer.from(cleanBase64, 'base64');
      fs.writeFileSync(filePath, buffer);
      
      // Calculate file size
      const fileSizeBytes = buffer.length;
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
      
      console.log(`✅ File saved: ${fileName} (${fileSizeMB} MB)`);
      
      // Return file info for database
      return {
        id: `cert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        fileName: fileName,
        originalName: originalName,
        filePath: `/uploads/certificates/${fileName}`,
        fileSize: fileSizeBytes,
        fileSizeMB: parseFloat(fileSizeMB),
        mimeType: 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId,
        ...metadata
      };
      
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  // Get file stream for download
  getFileStream(fileName) {
    const filePath = path.join(this.uploadsDir, fileName);
    
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    return {
      stream: fs.createReadStream(filePath),
      path: filePath,
      exists: true
    };
  }

  // Delete file
  deleteFile(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        console.log(`🗑️ File deleted: ${fileName}`);
        return true;
      } else {
        console.warn(`⚠️ File not found for deletion: ${fileName}`);
        return false;
      }
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Get file info
  getFileInfo(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      
      if (!fs.existsSync(filePath)) {
        return null;
      }
      
      const stats = fs.statSync(filePath);
      
      return {
        fileName: fileName,
        filePath: filePath,
        fileSize: stats.size,
        fileSizeMB: (stats.size / (1024 * 1024)).toFixed(2),
        createdAt: stats.birthtime,
        modifiedAt: stats.mtime,
        exists: true
      };
    } catch (error) {
      console.error('❌ Error getting file info:', error);
      return null;
    }
  }

  // Migrate existing base64 data to file system
  async migrateBase64ToFiles(certificates, userId) {
    const migratedCertificates = [];
    
    for (const cert of certificates) {
      try {
        if (cert.base64Data) {
          console.log(`🔄 Migrating certificate: ${cert.name}`);
          
          // Save base64 as file
          const fileInfo = await this.saveFileFromBase64(
            cert.base64Data,
            cert.name,
            userId,
            {
              title: cert.title || cert.name,
              description: cert.description || '',
              category: cert.category || 'certificate'
            }
          );
          
          // Create new certificate object without base64
          const migratedCert = {
            ...cert,
            ...fileInfo,
            base64Data: undefined // Remove base64 data
          };
          
          delete migratedCert.base64Data;
          migratedCertificates.push(migratedCert);
          
          console.log(`✅ Migrated: ${cert.name} → ${fileInfo.fileName}`);
          
        } else {
          // Certificate already migrated or doesn't have base64
          migratedCertificates.push(cert);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate certificate ${cert.name}:`, error);
        // Keep original if migration fails
        migratedCertificates.push(cert);
      }
    }
    
    return migratedCertificates;
  }

  // Get upload directory stats
  getUploadStats() {
    try {
      const files = fs.readdirSync(this.uploadsDir);
      let totalSize = 0;
      let fileCount = 0;
      
      files.forEach(file => {
        const filePath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      });
      
      return {
        fileCount,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),
        directory: this.uploadsDir
      };
    } catch (error) {
      console.error('❌ Error getting upload stats:', error);
      return {
        fileCount: 0,
        totalSizeBytes: 0,
        totalSizeMB: '0.00',
        directory: this.uploadsDir,
        error: error.message
      };
    }
  }
}

export default FileUploadService;
