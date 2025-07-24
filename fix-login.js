// Script untuk memperbaiki masalah login dan reset password user bermasalah
import bcrypt from 'bcryptjs';
import fs from 'fs';

async function fixLoginIssues() {
  try {
    console.log('🔧 FIXING LOGIN ISSUES');
    console.log('=====================');
    
    // Read database
    const dbData = JSON.parse(fs.readFileSync('./db.json', 'utf8'));
    
    // Fix specific users with password issues
    const passwordFixes = [
      { 
        identifier: 'adi', 
        newPassword: 'adi123',
        reason: 'Password was incorrectly set to admin123'
      },
      {
        identifier: 'demo',
        newPassword: 'demo123',
        reason: 'Ensure demo password is correct'
      },
      {
        identifier: 'admin',
        newPassword: 'admin123', 
        reason: 'Ensure admin password is correct'
      },
      {
        identifier: 'akbar',
        newPassword: 'akbar123',
        reason: 'Ensure akbar password is correct'
      }
    ];
    
    let fixedUsers = 0;
    
    for (const fix of passwordFixes) {
      const user = dbData.users.find(u => 
        u.username === fix.identifier || u.email === fix.identifier
      );
      
      if (user) {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(fix.newPassword, 10);
        user.password = hashedPassword;
        fixedUsers++;
        
        console.log(`✅ Fixed password for user: ${user.fullName} (${fix.identifier})`);
        console.log(`   Reason: ${fix.reason}`);
        console.log(`   New password: ${fix.newPassword}`);
      }
    }
    
    // Ensure all users have consistent structure
    dbData.users = dbData.users.map(user => ({
      ...user,
      certificates: user.certificates || [],
      downloads: user.downloads || 0,
      lastDownload: user.lastDownload || null,
      downloadHistory: user.downloadHistory || [],
      profileImage: user.profileImage || user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName || 'User')}&background=0F7536&color=fff`
    }));
    
    // Write back to database
    fs.writeFileSync('./db.json', JSON.stringify(dbData, null, 2));
    
    console.log(`\n🎯 SUMMARY:`);
    console.log(`- Fixed passwords for ${fixedUsers} users`);
    console.log(`- Database updated successfully`);
    console.log(`\n📋 UPDATED LOGIN CREDENTIALS:`);
    console.log(`- Admin: admin / admin123`);
    console.log(`- Demo User: demo / demo123`);
    console.log(`- Adi Pratama: adi / adi123`);
    console.log(`- Akbar: akbar / akbar123`);
    
    // Test login after fixes
    console.log(`\n🧪 TESTING FIXED CREDENTIALS:`);
    
    const testCreds = [
      { username: 'admin', password: 'admin123' },
      { username: 'demo', password: 'demo123' },
      { username: 'adi', password: 'adi123' },
      { username: 'akbar', password: 'akbar123' }
    ];
    
    for (const cred of testCreds) {
      const user = dbData.users.find(u => 
        u.username === cred.username || u.email === cred.username
      );
      
      if (user) {
        const isValid = await bcrypt.compare(cred.password, user.password);
        console.log(`${isValid ? '✅' : '❌'} ${cred.username} / ${cred.password} - ${user.role}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Fix script failed:', error);
  }
}

fixLoginIssues();
