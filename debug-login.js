// Debug script untuk mengatasi masalah login
import bcrypt from 'bcryptjs';
import fs from 'fs';

async function debugLoginIssue() {
  try {
    console.log('🔍 DEBUGGING LOGIN ISSUE');
    console.log('========================');
    
    // Read database
    const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    console.log(`📊 Total users in database: ${dbData.users.length}`);
    
    // Check each user structure
    console.log('\n👥 USER ANALYSIS:');
    dbData.users.forEach((user, index) => {
      console.log(`\n${index + 1}. User: ${user.fullName || 'NO NAME'}`);
      console.log(`   - ID: ${user.id || 'NO ID'}`);
      console.log(`   - Username: ${user.username || 'NO USERNAME'}`);
      console.log(`   - Email: ${user.email || 'NO EMAIL'}`);
      console.log(`   - Role: ${user.role || 'NO ROLE'}`);
      console.log(`   - Password: ${user.password ? 'EXISTS' : 'MISSING'}`);
      
      // Check for missing essential fields
      const missingFields = [];
      if (!user.id) missingFields.push('id');
      if (!user.username) missingFields.push('username');
      if (!user.email) missingFields.push('email');
      if (!user.password) missingFields.push('password');
      if (!user.role) missingFields.push('role');
      
      if (missingFields.length > 0) {
        console.log(`   ❌ MISSING FIELDS: ${missingFields.join(', ')}`);
      } else {
        console.log(`   ✅ All essential fields present`);
      }
    });
    
    // Test specific login credentials
    console.log('\n🔐 TESTING LOGIN CREDENTIALS:');
    
    const testCredentials = [
      { username: 'demo', password: 'demo123' },
      { username: 'admin', password: 'admin123' },
      { username: 'adi', password: 'adi123' },
      { username: 'akbar', password: 'akbar123' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n🧪 Testing: ${cred.username} / ${cred.password}`);
      
      // Find user
      const user = dbData.users.find(u => 
        u.username === cred.username || u.email === cred.username
      );
      
      if (!user) {
        console.log(`   ❌ User "${cred.username}" not found in database`);
        continue;
      }
      
      console.log(`   ✅ User found: ${user.fullName} (${user.role})`);
      
      // Test password
      try {
        const isValid = await bcrypt.compare(cred.password, user.password);
        console.log(`   🔑 Password test: ${isValid ? '✅ VALID' : '❌ INVALID'}`);
        
        if (!isValid) {
          // Try with different password patterns
          const testPasswords = [
            cred.password,
            `${cred.username}123`,
            `${cred.username}`,
            'password123',
            'admin123',
            'demo123'
          ];
          
          console.log(`   🔍 Testing alternative passwords...`);
          for (const testPwd of testPasswords) {
            const altValid = await bcrypt.compare(testPwd, user.password);
            if (altValid) {
              console.log(`   ✅ FOUND WORKING PASSWORD: "${testPwd}"`);
              break;
            }
          }
        }
      } catch (error) {
        console.log(`   ❌ Password verification error: ${error.message}`);
      }
    }
    
    // Check for duplicate users
    console.log('\n🔍 CHECKING FOR DUPLICATE USERS:');
    const usernames = dbData.users.map(u => u.username);
    const emails = dbData.users.map(u => u.email);
    
    const duplicateUsernames = usernames.filter((item, index) => usernames.indexOf(item) !== index);
    const duplicateEmails = emails.filter((item, index) => emails.indexOf(item) !== index);
    
    if (duplicateUsernames.length > 0) {
      console.log(`❌ Duplicate usernames found: ${duplicateUsernames.join(', ')}`);
    }
    
    if (duplicateEmails.length > 0) {
      console.log(`❌ Duplicate emails found: ${duplicateEmails.join(', ')}`);
    }
    
    if (duplicateUsernames.length === 0 && duplicateEmails.length === 0) {
      console.log(`✅ No duplicate users found`);
    }
    
    console.log('\n🔧 FIXING COMMON ISSUES...');
    
    // Fix users without proper structure
    let fixedCount = 0;
    dbData.users = dbData.users.map(user => {
      const fixed = {
        ...user,
        certificates: user.certificates || [],
        downloads: user.downloads || 0,
        lastDownload: user.lastDownload || null,
        downloadHistory: user.downloadHistory || [],
        profileImage: user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=0F7536&color=fff`
      };
      
      if (JSON.stringify(fixed) !== JSON.stringify(user)) {
        fixedCount++;
      }
      
      return fixed;
    });
    
    if (fixedCount > 0) {
      fs.writeFileSync('./db.json', JSON.stringify(dbData, null, 2));
      console.log(`✅ Fixed ${fixedCount} users with missing fields`);
    } else {
      console.log(`✅ All users have proper structure`);
    }
    
    console.log('\n🎯 SUMMARY:');
    console.log(`- Total users: ${dbData.users.length}`);
    console.log(`- Users fixed: ${fixedCount}`);
    console.log(`- Database status: ${fixedCount > 0 ? 'UPDATED' : 'NO CHANGES NEEDED'}`);
    
  } catch (error) {
    console.error('❌ Debug script failed:', error);
  }
}

debugLoginIssue();
