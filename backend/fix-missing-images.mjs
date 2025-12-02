import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'src', 'db.json');

console.log('📄 Reading database...');
const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

let updatedCount = 0;

console.log('\n🔍 Checking news images...');
data.news.forEach(news => {
  if (news.image && news.image.includes('/uploads/images/') && !news.image.includes('placeholder')) {
    console.log(`  ❌ Missing image: ${news.image} (ID: ${news.id})`);
    news.image = '/uploads/images/placeholder-news.png';
    updatedCount++;
  }
});

console.log('\n🔍 Checking beasiswa images...');
data.beasiswa.forEach(item => {
  if (item.image && item.image.includes('/uploads/images/') && !item.image.includes('placeholder')) {
    console.log(`  ❌ Missing image: ${item.image} (ID: ${item.id})`);
    item.image = '/uploads/images/placeholder-beasiswa.png';
    updatedCount++;
  }
});

if (updatedCount > 0) {
  console.log(`\n💾 Updating ${updatedCount} image paths to placeholder...`);
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ Database updated successfully!');
} else {
  console.log('\n✅ All images are OK, no updates needed.');
}
