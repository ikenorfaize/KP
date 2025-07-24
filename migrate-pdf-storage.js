// Migration script dari base64 ke file system storage
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class PDFMigrationService {
  constructor() {
    this.dbPath = path.join(__dirname, 'db.json');
    this.uploadsDir = path.join(__dirname, 'uploads', 'certificates');
    this.backupDir = path.join(__dirname, 'backups');
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    [this.uploadsDir, this.backupDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`📁 Created directory: ${dir}`);
      }
    });
  }

  // Create backup before migration
  createBackup() {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = path.join(this.backupDir, `db_backup_${timestamp}.json`);
    
    fs.copyFileSync(this.dbPath, backupPath);
    console.log(`💾 Backup created: ${backupPath}`);
    return backupPath;
  }

  // Generate unique filename
  generateFileName(originalName, userId) {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2);
    const extension = path.extname(originalName) || '.pdf';
    const baseName = path.basename(originalName, extension);
    const sanitizedName = baseName.replace(/[^a-zA-Z0-9\-\_]/g, '_');
    
    return `${userId}_${timestamp}_${randomId}_${sanitizedName}${extension}`;
  }

  // Save base64 data as file
  saveBase64AsFile(base64Data, originalName, userId) {
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
      
      console.log(`✅ Saved: ${fileName} (${fileSizeMB} MB)`);
      
      return {
        fileName: fileName,
        filePath: `/uploads/certificates/${fileName}`,
        fileSize: fileSizeBytes,
        fileSizeMB: parseFloat(fileSizeMB),
        savedAt: new Date().toISOString()
      };
      
    } catch (error) {
      console.error(`❌ Error saving ${originalName}:`, error.message);
      return null;
    }
  }

  // Migrate single user's certificates
  migrateUserCertificates(user) {
    let migratedCount = 0;
    let totalSavedMB = 0;
    
    if (!user.certificates || !Array.isArray(user.certificates)) {
      return { migratedCount, totalSavedMB };
    }

    console.log(`\n👤 Migrating certificates for: ${user.fullName} (${user.certificates.length} certificates)`);
    
    user.certificates = user.certificates.map(cert => {
      if (cert.base64Data) {
        console.log(`  🔄 Migrating: ${cert.name || 'Unnamed'}`);
        
        const fileInfo = this.saveBase64AsFile(
          cert.base64Data,
          cert.name || `certificate_${Date.now()}.pdf`,
          user.id
        );
        
        if (fileInfo) {
          migratedCount++;
          totalSavedMB += fileInfo.fileSizeMB;
          
          // Create new certificate object without base64
          const migratedCert = {
            id: cert.id,
            name: cert.name,
            title: cert.title || cert.name,
            description: cert.description || '',
            category: cert.category || 'certificate',
            fileName: fileInfo.fileName,
            filePath: fileInfo.filePath,
            fileSize: fileInfo.fileSize,
            fileSizeMB: fileInfo.fileSizeMB,
            mimeType: 'application/pdf',
            uploadedAt: cert.uploadedAt || new Date().toISOString(),
            uploadedBy: user.id,
            migratedAt: fileInfo.savedAt
          };
          
          console.log(`    ✅ ${cert.name} → ${fileInfo.fileName} (${fileInfo.fileSizeMB} MB)`);
          return migratedCert;
        } else {
          console.log(`    ❌ Failed to migrate ${cert.name}`);
          return cert; // Keep original if migration fails
        }
      } else {
        // Certificate already migrated or doesn't have base64
        return cert;
      }
    });
    
    return { migratedCount, totalSavedMB };
  }

  // Main migration function
  async migratePDFStorage() {
    console.log('🚀 STARTING PDF STORAGE MIGRATION');
    console.log('=====================================');
    
    try {
      // Create backup first
      const backupPath = this.createBackup();
      
      // Read current database
      const dbData = JSON.parse(fs.readFileSync(this.dbPath, 'utf8'));
      
      console.log(`📊 Found ${dbData.users.length} users in database`);
      
      // Check current db.json size
      const dbStats = fs.statSync(this.dbPath);
      const dbSizeMB = (dbStats.size / (1024 * 1024)).toFixed(2);
      console.log(`📁 Current db.json size: ${dbSizeMB} MB`);
      
      let totalMigrated = 0;
      let totalSavedMB = 0;
      let usersWithCertificates = 0;
      
      // Migrate each user's certificates
      dbData.users.forEach(user => {
        if (user.certificates && user.certificates.length > 0) {
          const hasBase64 = user.certificates.some(cert => cert.base64Data);
          if (hasBase64) {
            usersWithCertificates++;
            const result = this.migrateUserCertificates(user);
            totalMigrated += result.migratedCount;
            totalSavedMB += result.totalSavedMB;
          }
        }
      });
      
      // Save updated database
      fs.writeFileSync(this.dbPath, JSON.stringify(dbData, null, 2));
      
      // Check new db.json size
      const newDbStats = fs.statSync(this.dbPath);
      const newDbSizeMB = (newDbStats.size / (1024 * 1024)).toFixed(2);
      const savedSpaceMB = (dbSizeMB - newDbSizeMB).toFixed(2);
      
      console.log('\n🎯 MIGRATION SUMMARY:');
      console.log('====================');
      console.log(`✅ Users migrated: ${usersWithCertificates}`);
      console.log(`✅ Certificates migrated: ${totalMigrated}`);
      console.log(`✅ Total files saved: ${totalSavedMB.toFixed(2)} MB`);
      console.log(`✅ Database size: ${dbSizeMB} MB → ${newDbSizeMB} MB`);
      console.log(`✅ Space saved: ${savedSpaceMB} MB (${((savedSpaceMB/dbSizeMB)*100).toFixed(1)}%)`);
      console.log(`📁 Files location: ${this.uploadsDir}`);
      console.log(`💾 Backup location: ${backupPath}`);
      
      // Upload directory stats
      const uploadStats = this.getUploadStats();
      console.log(`\n📊 Upload Directory Stats:`);
      console.log(`   Files: ${uploadStats.fileCount}`);
      console.log(`   Total Size: ${uploadStats.totalSizeMB} MB`);
      
      return {
        success: true,
        migratedUsers: usersWithCertificates,
        migratedCertificates: totalMigrated,
        dbSizeBefore: parseFloat(dbSizeMB),
        dbSizeAfter: parseFloat(newDbSizeMB),
        spaceSaved: parseFloat(savedSpaceMB),
        backupPath: backupPath
      };
      
    } catch (error) {
      console.error('❌ Migration failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
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
        if (stats.isFile() && path.extname(file).toLowerCase() === '.pdf') {
          totalSize += stats.size;
          fileCount++;
        }
      });
      
      return {
        fileCount,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / (1024 * 1024)).toFixed(2)
      };
    } catch (error) {
      return {
        fileCount: 0,
        totalSizeBytes: 0,
        totalSizeMB: '0.00'
      };
    }
  }
}

// Run migration
const migrationService = new PDFMigrationService();
migrationService.migratePDFStorage();
