// Test script untuk debugging login user
import bcrypt from 'bcryptjs';
import fs from 'fs';

const users = ['adi', 'akbar', 'kihajar'];

async function testUserLogin() {
  try {
    // Read db.json
    const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    console.log('\n🔍 Testing login for users added via Admin Dashboard:\n');
    
    for (const username of users) {
      const user = dbData.users.find(u => u.username === username);
      
      if (user) {
        console.log(`\n👤 User: ${user.fullName} (${user.username})`);
        console.log(`📧 Email: ${user.email}`);
        console.log(`🔐 Password Hash: ${user.password}`);
        console.log(`📅 Created: ${user.createdAt}`);
        console.log(`🎭 Role: ${user.role}`);
        
        // Test common passwords
        const testPasswords = [
          username, // Same as username
          `${username}123`, // Username + 123
          'password', // Common password
          '123456', // Simple password
          'admin123', // Default admin password
        ];
        
        console.log(`\n🧪 Testing passwords for ${username}:`);
        
        for (const testPassword of testPasswords) {
          try {
            const isValid = await bcrypt.compare(testPassword, user.password);
            console.log(`  "${testPassword}": ${isValid ? '✅ MATCH' : '❌ NO MATCH'}`);
            
            if (isValid) {
              console.log(`\n🎉 FOUND CORRECT PASSWORD for ${username}: "${testPassword}"`);
              break;
            }
          } catch (error) {
            console.log(`  "${testPassword}": ❌ ERROR - ${error.message}`);
          }
        }
      } else {
        console.log(`\n❌ User "${username}" not found in database`);
      }
      
      console.log('-'.repeat(60));
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testUserLogin();
