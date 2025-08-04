// File Upload Service - Service untuk mengelola upload file sertifikat
// Menyediakan fungsi untuk menyimpan, memvalidasi, dan mengelola file
import fs from 'fs';  // File system untuk operasi file
import path from 'path';  // Path utilities untuk manipulasi path
import { fileURLToPath } from 'url';  // Untuk mendapatkan __filename di ES modules

// Dapatkan path file saat ini untuk ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class FileUploadService {
  constructor() {
    // Tentukan direktori upload untuk sertifikat
    this.uploadsDir = path.join(__dirname, '..', 'uploads', 'certificates');
    
    // Pastikan direktori upload sudah ada
    this.ensureUploadDir();
  }

  // Method untuk memastikan direktori upload ada, buat jika belum ada
  ensureUploadDir() {
    if (!fs.existsSync(this.uploadsDir)) {
      // Buat direktori secara rekursif (termasuk parent directories)
      fs.mkdirSync(this.uploadsDir, { recursive: true });
      console.log('📁 Created uploads directory:', this.uploadsDir);
    }
  }

  // Generate nama file unik untuk menghindari konflik nama
  generateFileName(originalName, userId) {
    const timestamp = Date.now();  // Timestamp saat ini
    const randomId = Math.random().toString(36).substring(2);  // Random string
    const extension = path.extname(originalName);  // Ekstensi file (.pdf, .jpg, dll)
    const baseName = path.basename(originalName, extension);  // Nama file tanpa ekstensi
    
    // Sanitasi nama file: hapus karakter yang tidak aman untuk file system
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-\_]/g, '_');
    
    // Format: userId_timestamp_randomId_namafile.ext
    return `${userId}_${timestamp}_${randomId}_${sanitizedName}${extension}`;
  }

  // Simpan file dari base64 string ke file system
  async saveFileFromBase64(base64Data, originalName, userId, metadata = {}) {
    try {
      // Hapus prefix data URL jika ada (contoh: data:application/pdf;base64,)
      const cleanBase64 = base64Data.replace(/^data:[^;]+;base64,/, '');
      
      // Generate nama file unik
      const fileName = this.generateFileName(originalName, userId);
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Convert base64 string ke buffer dan simpan ke file
      const buffer = Buffer.from(cleanBase64, 'base64');
      fs.writeFileSync(filePath, buffer);
      
      // Hitung ukuran file untuk logging dan validasi
      const fileSizeBytes = buffer.length;
      const fileSizeMB = (fileSizeBytes / (1024 * 1024)).toFixed(2);  // Convert ke MB
      
      console.log(`✅ File saved: ${fileName} (${fileSizeMB} MB)`);
      
      // Return informasi file untuk disimpan ke database
      return {
        id: `cert_${Date.now()}_${Math.random().toString(36).substring(2)}`,  // ID unik untuk tracking
        fileName: fileName,                    // Nama file yang disimpan di server
        originalName: originalName,            // Nama asli file yang diupload user
        filePath: `/uploads/certificates/${fileName}`,  // Path relatif untuk akses web
        fileSize: fileSizeBytes,              // Ukuran file dalam bytes
        fileSizeMB: parseFloat(fileSizeMB),   // Ukuran file dalam MB
        mimeType: 'application/pdf',          // Tipe MIME (default PDF untuk sertifikat)
        uploadedAt: new Date().toISOString(), // Timestamp upload dalam format ISO
        uploadedBy: userId,                   // ID user yang mengupload
        ...metadata                           // Metadata tambahan yang diberikan
      };
      
    } catch (error) {
      console.error('❌ Error saving file:', error);
      throw new Error(`Failed to save file: ${error.message}`);
    }
  }

  // Dapatkan file stream untuk download
  getFileStream(fileName) {
    const filePath = path.join(this.uploadsDir, fileName);
    
    // Cek apakah file ada di server
    if (!fs.existsSync(filePath)) {
      throw new Error('File not found');
    }
    
    // Return stream dan informasi file
    return {
      stream: fs.createReadStream(filePath),  // Stream untuk membaca file
      path: filePath,                         // Path absolut file
      exists: true                            // Flag bahwa file ditemukan
    };
  }

  // Hapus file dari server
  deleteFile(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Cek apakah file ada sebelum menghapus
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);  // Hapus file secara synchronous
        console.log(`🗑️ File deleted: ${fileName}`);
        return true;  // Return true jika berhasil dihapus
      } else {
        console.warn(`⚠️ File not found for deletion: ${fileName}`);
        return false;  // Return false jika file tidak ditemukan
      }
    } catch (error) {
      console.error('❌ Error deleting file:', error);
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Dapatkan informasi detail file
  getFileInfo(fileName) {
    try {
      const filePath = path.join(this.uploadsDir, fileName);
      
      // Cek apakah file ada di server
      if (!fs.existsSync(filePath)) {
        return null;  // Return null jika file tidak ditemukan
      }
      
      // Dapatkan statistik file dari file system
      const stats = fs.statSync(filePath);
      
      // Return informasi lengkap tentang file
      return {
        fileName: fileName,                                      // Nama file
        filePath: filePath,                                     // Path absolut file
        fileSize: stats.size,                                   // Ukuran dalam bytes
        fileSizeMB: (stats.size / (1024 * 1024)).toFixed(2),  // Ukuran dalam MB
        createdAt: stats.birthtime,                            // Tanggal dibuat
        modifiedAt: stats.mtime,                               // Tanggal dimodifikasi terakhir
        exists: true                                           // Flag bahwa file ada
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

  // Dapatkan statistik direktori upload
  getUploadStats() {
    try {
      // Baca semua file di direktori upload
      const files = fs.readdirSync(this.uploadsDir);
      let totalSize = 0;
      let fileCount = 0;
      
      // Hitung total ukuran dan jumlah file
      files.forEach(file => {
        const filePath = path.join(this.uploadsDir, file);
        const stats = fs.statSync(filePath);
        
        // Hanya hitung file, bukan direktori
        if (stats.isFile()) {
          totalSize += stats.size;
          fileCount++;
        }
      });
      
      // Return statistik upload
      return {
        fileCount,                                              // Jumlah file
        totalSizeBytes: totalSize,                              // Total ukuran dalam bytes
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2),  // Total ukuran dalam MB
        directory: this.uploadsDir                              // Path direktori upload
      };
    } catch (error) {
      console.error('❌ Error getting upload stats:', error);
      // Return data kosong jika error
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
