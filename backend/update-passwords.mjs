import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'src', 'db.json');

// Read database
const db = JSON.parse(readFileSync(dbPath, 'utf8'));

// New password hashes
const passwordHashes = {
  'admin': '$2b$10$KpER5M1zqSbH/fGVuDUdLOdHVv95U1T5cgxBTQ.RZirX7REAiij.C',  // admin123
  'adi': '$2b$10$HP9l7ezmoRNZtGOJVt5qHu9yfFjXNpPwvWHvuRJNZUxYI283jyPNW',     // adi123
  'akbar': '$2b$10$HwGQ26/0c9a/XToqelsUS.wcxT6mh1u8RVK7Fk4mJT2aUu5iQCG3W',   // akbar123
  'fairuz': '$2b$10$x5fG1JShf7JnA6Zq0A89/OCpekEnv7cvX.2rxMU..8A9JL4L3hVzG', // fairuz123
  'joko_699': '$2b$10$g/X8SnZSLPpuFjnOhnGcm.Pl.7Osy4.yscMr8PHHg.a14ilUhlff6', // joko123
  'muhammad rizky fajar nugraha': '$2b$10$500E.hkeKcFisIsKywHZxO6NvE.HlgjtE1MmYh6f3ebD3bYNk3oEG' // rizky123
};

// Update passwords
let updatedCount = 0;
db.users.forEach(user => {
  if (passwordHashes[user.username]) {
    user.password = passwordHashes[user.username];
    console.log(`✅ Updated password for: ${user.username}`);
    updatedCount++;
  }
});

// Save database
writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log(`\n🎉 Updated ${updatedCount} user passwords!`);
console.log('\n📝 Login credentials:');
console.log('  admin / admin123');
console.log('  adi / adi123');
console.log('  akbar / akbar123');
console.log('  fairuz / fairuz123');
console.log('  joko_699 / joko123');
console.log('  muhammad rizky fajar nugraha / rizky123');
