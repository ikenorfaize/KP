// File Upload Service - Service untuk mengelola upload file sertifikat
// Menyediakan fungsi untuk menyimpan, memvalidasi, dan mengelola file
// Note: Node.js modules like fs, path are server-side only
// This service would need API endpoints for actual file operations

class FileUploadService {
  constructor() {
    // Note: This service is designed for Node.js server environments
    // In browser environments, file operations would go through API endpoints
    this.uploadsDir = '/uploads/certificates'; // Conceptual path
    console.log('📁 FileUploadService initialized (browser mode)');
  }

  // Method for server-side directory creation (not available in browser)
  ensureUploadDir() {
    // Browser implementation would use API calls
    console.log('📁 Directory operations handled by server');
  }

  // Generate nama file unik untuk menghindari konflik nama
  generateFileName(originalName, userId) {
    const timestamp = Date.now();  // Timestamp saat ini
    const randomId = Math.random().toString(36).substring(2);  // Random string
    
    // Browser-compatible path extraction
    const lastDot = originalName.lastIndexOf('.');
    const extension = lastDot > 0 ? originalName.substring(lastDot) : '';
    const baseName = lastDot > 0 ? originalName.substring(0, lastDot) : originalName;
    
    // Sanitasi nama file: hapus karakter yang tidak aman untuk file system
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-\_]/g, '_');
    
    // Format: userId_timestamp_randomId_namafile.ext
    return `${userId}_${timestamp}_${randomId}_${sanitizedName}${extension}`;
  }

  // Browser-compatible file handling (would use API in real implementation)
  async saveFileFromBase64(base64Data, originalName, userId, metadata = {}) {
    try {
      // Hapus prefix data URL jika ada (contoh: data:application/pdf;base64,)
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      
      // Generate nama file unik
      const fileName = this.generateFileName(originalName, userId);
      
      // Browser-compatible size calculation
      const fileSizeBytes = Math.floor(cleanBase64.length * 0.75); // Approximate base64 to bytes
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);
      
      console.log(`📁 File prepared for upload: ${fileName} (${fileSizeMB} MB)`);
      
      // Return informasi file untuk disimpan ke database
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
      console.error('❌ Error preparing file:', error);
      throw new Error(`Failed to prepare file: ${error.message}`);
    }
  }

  // Browser-compatible file access (would use API endpoints)
  getFileStream(fileName) {
    // Browser implementation would make API request
    console.log(`🔗 File access requested: ${fileName}`);
    
    return {
      url: `${this.uploadsDir}/${fileName}`,
      path: `${this.uploadsDir}/${fileName}`,
      exists: true // Would be determined by API response
    };
  }

  // Browser-compatible file deletion (would use API call)
  deleteFile(fileName) {
    try {
      // Browser implementation would make DELETE API request
      console.log(`🗑️ File deletion requested: ${fileName}`);
      return true; // Would return actual result from API
    } catch (error) {
      console.error('❌ Error requesting file deletion:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Browser-compatible file info (would use API call)
  getFileInfo(fileName) {
    try {
      // Browser implementation would make API request for file info
      console.log(`📊 File info requested: ${fileName}`);
      
      // Mock file info - would come from API
      return {
        fileName: fileName,
        filePath: `${this.uploadsDir}/${fileName}`,
        fileSize: 0, // Would come from API
        fileSizeMB: '0.00',
        createdAt: new Date(),
        modifiedAt: new Date(),
        exists: true
      };
    } catch (error) {
      console.error('❌ Error getting file info:', error);
      return null;
    }
  }

  // Migrasi data base64 lama ke sistem file (untuk compatibility)
  async migrateBase64ToFiles(certificates, userId) {
    const migratedCertificates = [];
    
    // Loop melalui semua sertifikat yang perlu dimigrasi
    for (const cert of certificates) {
      try {
        // Cek apakah sertifikat masih menggunakan base64
        if (cert.base64Data) {
          console.log(`🔄 Migrating certificate: ${cert.name}`);
          
          // Simpan base64 sebagai file di server
          const fileInfo = await this.saveFileFromBase64(
            cert.base64Data,    // Data base64
            cert.name,          // Nama file asli
            userId,             // ID user pemilik
            {
              title: cert.title || cert.name,           // Judul sertifikat
              description: cert.description || '',      // Deskripsi
              category: cert.category || 'certificate'  // Kategori file
            }
          );
          
          // Buat object sertifikat baru tanpa base64 data
          const migratedCert = {
            ...cert,      // Copy semua property yang ada
            ...fileInfo,  // Tambahkan info file baru
            base64Data: undefined // Hapus base64Data
          };
          
          // Hapus property base64Data dari object
          delete migratedCert.base64Data;
          migratedCertificates.push(migratedCert);
          
          console.log(`✅ Migrated: ${cert.name} → ${fileInfo.fileName}`);
          
        } else {
          // Sertifikat sudah dimigrasi atau tidak menggunakan base64
          migratedCertificates.push(cert);
        }
      } catch (error) {
        console.error(`❌ Failed to migrate certificate ${cert.name}:`, error);
        // Tetap gunakan data asli jika migrasi gagal
        migratedCertificates.push(cert);
      }
    }
    
    return migratedCertificates;
  }

  // Browser-compatible upload stats (would use API call)
  getUploadStats() {
    try {
      // Browser implementation would make API request for stats
      console.log('📊 Upload stats requested');
      
      // Mock stats - would come from API
      return {
        fileCount: 0,
        totalSizeBytes: 0,
        totalSizeMB: '0.00',
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

// Export class sebagai default export untuk digunakan di file lain
export default FileUploadService;
