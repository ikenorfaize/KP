import bcrypt from 'bcryptjs';
import fs from 'fs';

// Script untuk meng-encrypt password yang sudah ada di db.json
async function migratePasswordsToHash() {
  try {
    // Read current db.json
    const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    // Hash existing passwords
    for (let user of dbData.users) {
      if (user.password && !user.password.startsWith('$2b$')) {
        // Jika password belum di-hash (tidak dimulai dengan $2b$)
        console.log(`Hashing password for user: ${user.username}`);
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
    
    // Write back to db.json
    fs.writeFileSync('./db.json', JSON.stringify(dbData, null, 2));
    console.log('✅ Password migration completed!');
    
    // Show result
    console.log('\n📊 Users with encrypted passwords:');
    dbData.users.forEach(user => {
      console.log(`- ${user.username}: ${user.password.substring(0, 20)}...`);
    });
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  }
}

// Run migration
migratePasswordsToHash();
