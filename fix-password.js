const bcrypt = require('bcrypt');
const fs = require('fs');
const path = require('path');

async function fixAdminPassword() {
  console.log('🔐 Fixing admin password...');
  
  // Read database
  const dbPath = path.join(__dirname, 'api', 'db.json');
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  
  // Test current admin password
  const admin = db.users.find(u => u.username === 'admin');
  if (!admin) {
    console.log('❌ Admin user not found');
    return;
  }
  
  console.log('🧪 Testing current password...');
  const currentHash = admin.password;
  
  // Test common passwords
  const passwords = ['admin123', 'admin', '123456', 'password'];
  let foundPassword = null;
  
  for (const pwd of passwords) {
    const match = await bcrypt.compare(pwd, currentHash);
    console.log(`Testing "${pwd}": ${match ? '✅' : '❌'}`);
    if (match) {
      foundPassword = pwd;
      break;
    }
  }
  
  if (foundPassword) {
    console.log(`✅ Current password is: "${foundPassword}"`);
    console.log('No need to update password');
  } else {
    console.log('❌ Password not found, updating to "admin123"');
    
    // Generate new hash for admin123
    const newHash = await bcrypt.hash('admin123', 10);
    admin.password = newHash;
    
    // Save database
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    console.log('✅ Password updated to "admin123"');
  }
  
  // Also check other users
  console.log('\n👥 Checking other users...');
  for (const user of db.users) {
    if (user.username !== 'admin') {
      console.log(`User: ${user.username} (${user.email})`);
    }
  }
}

fixAdminPassword().catch(console.error);
