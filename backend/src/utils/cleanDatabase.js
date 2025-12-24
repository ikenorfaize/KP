// ===================================
// DATABASE CLEANUP UTILITY
// ===================================
// Utility untuk membersihkan data tidak terpakai di database

import { readFileSync, writeFileSync, existsSync, unlinkSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { DB_PATH } from '../config/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Hapus file gambar yang tidak digunakan
 */
function cleanupUnusedImages(usedImages) {
  const uploadsPath = join(__dirname, '..', 'uploads', 'images');
  
  if (!existsSync(uploadsPath)) {
    console.log('⚠️  Folder uploads/images tidak ditemukan');
    return 0;
  }

  let deletedCount = 0;
  const files = readdirSync(uploadsPath);
  
  files.forEach(file => {
    const relativePath = `/uploads/images/${file}`;
    
    // Skip jika gambar masih digunakan
    if (usedImages.has(relativePath)) {
      return;
    }
    
    // Hapus file yang tidak terpakai
    const fullPath = join(uploadsPath, file);
    try {
      if (existsSync(fullPath)) {
        unlinkSync(fullPath);
        console.log(`🗑️  Menghapus gambar tidak terpakai: ${file}`);
        deletedCount++;
      }
    } catch (error) {
      console.error(`❌ Error menghapus ${file}:`, error.message);
    }
  });
  
  return deletedCount;
}

/**
 * Bersihkan database dari data tidak valid
 */
export function cleanDatabase() {
  try {
    console.log('🧹 Memulai pembersihan database...\n');
    
    const data = JSON.parse(readFileSync(DB_PATH, 'utf8'));
    const stats = {
      newsDeleted: 0,
      usersDeleted: 0,
      imagesDeleted: 0,
      beforeNews: data.news?.length || 0,
      beforeUsers: data.users?.length || 0
    };

    // ========================================
    // 1. BERSIHKAN DATA BERITA
    // ========================================
    console.log('📰 Membersihkan data berita...');
    
    const validNews = [];
    const seenNewsIds = new Set();
    
    (data.news || []).forEach(item => {
      // Skip berita tidak lengkap
      if (!item.title || !item.content || item.title.trim() === '' || item.content.trim() === '') {
        console.log(`❌ Menghapus berita tidak lengkap: ${item.id} - "${item.title || 'No Title'}"`);
        stats.newsDeleted++;
        return;
      }
      
      // Skip berita dengan konten terlalu pendek
      if (item.content.length < 10) {
        console.log(`❌ Menghapus berita kosong: ${item.id} - "${item.title}"`);
        stats.newsDeleted++;
        return;
      }
      
      // Skip duplikat ID
      if (seenNewsIds.has(item.id)) {
        console.log(`❌ Menghapus berita duplikat: ${item.id} - "${item.title}"`);
        stats.newsDeleted++;
        return;
      }
      
      seenNewsIds.add(item.id);
      validNews.push(item);
    });
    
    // ========================================
    // 2. BERSIHKAN DATA USER
    // ========================================
    console.log('\n👤 Membersihkan data user...');
    
    const validUsers = [];
    const seenUserIds = new Set();
    
    (data.users || []).forEach(user => {
      // Skip user tanpa email atau username
      if (!user.email || !user.username || !user.fullName) {
        console.log(`❌ Menghapus user tidak lengkap: ${user.id} - "${user.username || 'No Username'}"`);
        stats.usersDeleted++;
        return;
      }
      
      // Skip duplikat ID
      if (seenUserIds.has(user.id)) {
        console.log(`❌ Menghapus user duplikat: ${user.id} - "${user.username}"`);
        stats.usersDeleted++;
        return;
      }
      
      seenUserIds.add(user.id);
      validUsers.push(user);
    });
    
    // ========================================
    // 3. BERSIHKAN GAMBAR TIDAK TERPAKAI
    // ========================================
    console.log('\n🖼️  Membersihkan gambar tidak terpakai...');
    
    const usedImages = new Set();
    validNews.forEach(item => {
      if (item.image && item.image.startsWith('/uploads/')) {
        usedImages.add(item.image);
      }
    });
    
    stats.imagesDeleted = cleanupUnusedImages(usedImages);
    
    // ========================================
    // 4. SIMPAN DATABASE YANG SUDAH DIBERSIHKAN
    // ========================================
    data.news = validNews;
    data.users = validUsers;
    
    // Tambahkan metadata pembersihan
    if (!data.metadata) data.metadata = {};
    data.metadata.lastCleanup = new Date().toISOString();
    data.metadata.newsCount = validNews.length;
    data.metadata.usersCount = validUsers.length;
    
    writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
    
    // ========================================
    // 5. TAMPILKAN HASIL
    // ========================================
    console.log('\n✅ Pembersihan selesai!');
    console.log('\n📊 STATISTIK:');
    console.log('═'.repeat(50));
    console.log(`📰 Berita:`);
    console.log(`   - Sebelum: ${stats.beforeNews}`);
    console.log(`   - Sesudah: ${validNews.length}`);
    console.log(`   - Dihapus: ${stats.newsDeleted}`);
    console.log(`\n👤 User:`);
    console.log(`   - Sebelum: ${stats.beforeUsers}`);
    console.log(`   - Sesudah: ${validUsers.length}`);
    console.log(`   - Dihapus: ${stats.usersDeleted}`);
    console.log(`\n🖼️  Gambar tidak terpakai dihapus: ${stats.imagesDeleted}`);
    console.log('═'.repeat(50));
    
    return {
      success: true,
      stats
    };
    
  } catch (error) {
    console.error('❌ Error saat membersihkan database:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

/**
 * Jalankan pembersihan jika file dipanggil langsung
 */
if (import.meta.url === `file://${process.argv[1]}`) {
  cleanDatabase();
}

export default cleanDatabase;
