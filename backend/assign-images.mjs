import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'src', 'db.json');
const UPLOADS_DIR = join(__dirname, 'src', 'uploads', 'images');

console.log('📄 Reading database...');
const data = JSON.parse(readFileSync(DB_PATH, 'utf-8'));

// Get non-placeholder images
const availableImages = readdirSync(UPLOADS_DIR)
  .filter(f => f.match(/\.(png|jpg|jpeg|gif)$/i) && !f.includes('placeholder'))
  .sort();

console.log(`\n📂 Found ${availableImages.length} real images`);

// Assign images to news (skip first news, assign others)
let assigned = 0;
data.news.forEach((news, index) => {
  // Skip first news (keep placeholder for main article)
  if (index === 0) {
    news.image = '/uploads/images/placeholder-news.png';
    return;
  }
  
  // Assign image if available
  if (index - 1 < availableImages.length) {
    const imageName = availableImages[index - 1];
    news.image = `/uploads/images/${imageName}`;
    console.log(`  ✅ News ${index}: "${news.title.substring(0, 40)}" → ${imageName}`);
    assigned++;
  } else {
    news.image = '/uploads/images/placeholder-news.png';
  }
});

console.log(`\n💾 Saving database...`);
writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
console.log(`✅ Assigned ${assigned} images to news`);
