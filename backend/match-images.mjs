import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'src', 'db.json');
const UPLOADS_DIR = join(__dirname, 'src', 'uploads', 'images');

console.log('📂 Reading available images...');
const availableImages = readdirSync(UPLOADS_DIR).filter(f => f.match(/\.(png|jpg|jpeg|gif)$/i));
console.log(`Found ${availableImages.length} images`);

console.log('\n📄 Reading database...');
const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

let updated = 0;

// Map news IDs to available images (by timestamp matching)
console.log('\n🔄 Matching news with available images...');
data.news.forEach(news => {
  // Current image
  const currentImage = news.image;
  
  // If using placeholder, try to find real image
  if (currentImage && currentImage.includes('placeholder')) {
    // Try to find image by ID timestamp
    const newsTimestamp = news.id.toString();
    const matchingImage = availableImages.find(img => img.includes(newsTimestamp));
    
    if (matchingImage) {
      news.image = `/uploads/images/${matchingImage}`;
      console.log(`  ✅ ID ${news.id}: Found ${matchingImage}`);
      updated++;
    } else {
      console.log(`  ⚠️  ID ${news.id}: No match, keeping placeholder`);
    }
  } else if (currentImage && currentImage.includes('/uploads/images/')) {
    // Already has image path, verify it exists
    const filename = currentImage.split('/').pop();
    if (availableImages.includes(filename)) {
      console.log(`  ✅ ID ${news.id}: Image exists (${filename})`);
    } else {
      console.log(`  ❌ ID ${news.id}: Image missing (${filename}), setting placeholder`);
      news.image = '/uploads/images/placeholder-news.png';
      updated++;
    }
  }
});

if (updated > 0) {
  console.log(`\n💾 Saving database (${updated} changes)...`);
  writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
  console.log('✅ Database updated!');
} else {
  console.log('\n✅ No changes needed.');
}

console.log('\n📊 Summary:');
console.log(`   Total news: ${data.news.length}`);
console.log(`   With images: ${data.news.filter(n => n.image && !n.image.includes('placeholder')).length}`);
console.log(`   Placeholders: ${data.news.filter(n => n.image && n.image.includes('placeholder')).length}`);
