import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'src', 'db.json');
const BACKUP_PATH = join(__dirname, 'db.json.backup-original');

console.log('📄 Reading current database...');
const currentData = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

console.log('📄 Reading backup database...');
const backupData = JSON.parse(readFileSync(BACKUP_PATH, 'utf-8'));

// Restore original image paths from backup
let restored = 0;

console.log('\n🔄 Restoring news images from backup...');
backupData.news.forEach((backupNews, index) => {
  const currentNews = currentData.news.find(n => n.id === backupNews.id);
  if (currentNews && backupNews.image && backupNews.image !== currentNews.image) {
    console.log(`  ✅ ID ${backupNews.id}: ${currentNews.image} → ${backupNews.image}`);
    currentNews.image = backupNews.image;
    restored++;
  }
});

console.log('\n🔄 Restoring beasiswa images from backup...');
backupData.beasiswa.forEach((backupItem) => {
  const currentItem = currentData.beasiswa.find(b => b.id === backupItem.id);
  if (currentItem && backupItem.image && backupItem.image !== currentItem.image) {
    console.log(`  ✅ ID ${backupItem.id}: ${currentItem.image} → ${backupItem.image}`);
    currentItem.image = backupItem.image;
    restored++;
  }
});

if (restored > 0) {
  console.log(`\n💾 Saving restored database (${restored} images)...`);
  writeFileSync(DB_PATH, JSON.stringify(currentData, null, 2), 'utf-8');
  console.log('✅ Database restored successfully!');
} else {
  console.log('\n✅ No changes needed.');
}
