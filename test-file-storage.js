// Test script untuk file storage system
import fs from 'fs';
import path from 'path';

async function testFileStorageSystem() {
  console.log('🧪 TESTING FILE STORAGE SYSTEM');
  console.log('==============================');
  
  try {
    // 1. Check directories
    console.log('\n📁 CHECKING DIRECTORIES:');
    const directories = [
      'uploads/certificates',
      'backups'
    ];
    
    directories.forEach(dir => {
      const exists = fs.existsSync(dir);
      console.log(`   ${exists ? '✅' : '❌'} ${dir}`);
    });
    
    // 2. Check database size after migration
    console.log('\n📊 DATABASE SIZE CHECK:');
    const dbStats = fs.statSync('db.json');
    const dbSizeMB = (dbStats.size / 1024 / 1024).toFixed(2);
    console.log(`   📁 db.json size: ${dbSizeMB} MB`);
    
    // 3. Check upload directory
    console.log('\n📂 UPLOAD DIRECTORY:');
    const uploadDir = 'uploads/certificates';
    let totalSize = 0; // Initialize totalSize here
    
    if (fs.existsSync(uploadDir)) {
      const files = fs.readdirSync(uploadDir);
      const pdfFiles = files.filter(file => path.extname(file).toLowerCase() === '.pdf');
      
      console.log(`   📄 PDF files: ${pdfFiles.length}`);
      
      pdfFiles.forEach(file => {
        const filePath = path.join(uploadDir, file);
        const stats = fs.statSync(filePath);
        totalSize += stats.size;
        console.log(`   📋 ${file} - ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
      });
      
      console.log(`   💾 Total files size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
    } else {
      console.log('   ❌ Upload directory not found');
    }
    
    // 4. Check database structure
    console.log('\n🗄️ DATABASE STRUCTURE CHECK:');
    const dbData = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    
    let usersWithCertificates = 0;
    let totalCertificates = 0;
    let certificatesWithFiles = 0;
    let certificatesWithBase64 = 0;
    
    dbData.users.forEach(user => {
      if (user.certificates && user.certificates.length > 0) {
        usersWithCertificates++;
        totalCertificates += user.certificates.length;
        
        user.certificates.forEach(cert => {
          if (cert.filePath && !cert.base64Data) {
            certificatesWithFiles++;
          } else if (cert.base64Data) {
            certificatesWithBase64++;
          }
        });
      }
    });
    
    console.log(`   👥 Users with certificates: ${usersWithCertificates}`);
    console.log(`   📄 Total certificates: ${totalCertificates}`);
    console.log(`   🗃️ Certificates with file storage: ${certificatesWithFiles}`);
    console.log(`   📦 Certificates with base64: ${certificatesWithBase64}`);
    
    // 5. Migration success rate
    console.log('\n📈 MIGRATION ANALYSIS:');
    const migrationSuccess = totalCertificates > 0 ? (certificatesWithFiles / totalCertificates * 100).toFixed(1) : 0;
    console.log(`   ✅ Migration success rate: ${migrationSuccess}%`);
    
    if (certificatesWithBase64 > 0) {
      console.log(`   ⚠️ ${certificatesWithBase64} certificates still use base64`);
      console.log(`   💡 Recommendation: Run migration again if needed`);
    } else {
      console.log(`   🎉 All certificates migrated to file storage!`);
    }
    
    // 6. Performance comparison
    console.log('\n⚡ PERFORMANCE COMPARISON:');
    const estimatedBase64Size = certificatesWithFiles * 6.5; // Average PDF size in base64
    const actualFileSize = totalSize / 1024 / 1024;
    const spaceSaved = estimatedBase64Size - actualFileSize;
    
    console.log(`   📊 Estimated base64 size: ${estimatedBase64Size.toFixed(2)} MB`);
    console.log(`   📁 Actual file size: ${actualFileSize.toFixed(2)} MB`);
    console.log(`   💾 Space saved: ${spaceSaved.toFixed(2)} MB`);
    console.log(`   📉 Size reduction: ${spaceSaved > 0 ? ((spaceSaved / estimatedBase64Size) * 100).toFixed(1) : 0}%`);
    
    // 7. Recommendations
    console.log('\n💡 RECOMMENDATIONS:');
    
    if (parseFloat(dbSizeMB) > 1) {
      console.log('   ⚠️ Database still large - consider running migration again');
    } else {
      console.log('   ✅ Database size optimized');
    }
    
    if (certificatesWithFiles > 0) {
      console.log('   ✅ File storage system working');
    } else {
      console.log('   ❌ No files in file storage - migration may have failed');
    }
    
    console.log('\n🎯 NEXT STEPS:');
    console.log('1. Start file server: npm run file-server');
    console.log('2. Start JSON server: npm run api');
    console.log('3. Start React app: npm run dev');
    console.log('4. Or run all: npm run full-demo');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testFileStorageSystem();
