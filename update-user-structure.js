// Script untuk memperbarui struktur user dengan field certificates yang hilang
import fs from 'fs';

// Baca file db.json
const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Update setiap user untuk memastikan memiliki field yang diperlukan
db.users = db.users.map(user => {
  return {
    ...user,
    certificates: user.certificates || [],
    downloads: user.downloads || 0,
    lastDownload: user.lastDownload || null,
    downloadHistory: user.downloadHistory || [],
    profileImage: user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=0F7536&color=fff`
  };
});

// Tulis kembali ke file
fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('✅ Database berhasil diperbarui dengan field certificates yang lengkap!');
console.log(`📊 Total users diperbarui: ${db.users.length}`);
