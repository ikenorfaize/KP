console.clear();
console.log('🚨 === EMERGENCY DEBUG REGISTER FORM ===');
console.log('🔧 Advanced debugging untuk register form issue');

// Function untuk test email manual tanpa form
window.testEmailManual = async function() {
  console.log('📧 === MANUAL EMAIL TEST ===');
  
  const testData = {
    fullName: 'Debug Test User',
    email: 'debug@test.com',
    phone: '081234567890',
    position: 'Debug Tester',
    school: 'Debug School',
    pw: 'Debug PW',
    pc: 'Debug PC',
    education: 'Debug Education',
    experience: 'Debug Experience'
  };
  
  try {
    // Import EmailService dari aplikasi
    const { emailService } = await import('../src/services/EmailService.js');
    console.log('✅ EmailService imported');
    
    const result = await emailService.sendAdminNotification(testData);
    console.log('📧 Manual test result:', result);
    
    if (result.success) {
      alert('✅ Manual email test BERHASIL!');
    } else {
      alert('❌ Manual email test GAGAL: ' + result.error);
    }
    
  } catch (error) {
    console.error('❌ Manual test error:', error);
    alert('❌ Manual test exception: ' + error.message);
  }
};

// Function untuk test database save
window.testDatabaseSave = async function() {
  console.log('💾 === DATABASE SAVE TEST ===');
  
  const testData = {
    id: 'debug_' + Date.now(),
    fullName: 'Debug Database User',
    email: 'debug-db@test.com',
    phone: '081234567890',
    position: 'Database Tester',
    status: 'pending',
    submittedAt: new Date().toISOString()
  };
  
  try {
    console.log('📤 Sending to database...');
    
    const response = await fetch('http://localhost:3001/applications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📥 Response status:', response.status);
    console.log('📥 Response ok:', response.ok);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Database save successful:', result);
      alert('✅ Database test BERHASIL!');
    } else {
      const error = await response.text();
      console.error('❌ Database error:', error);
      alert('❌ Database test GAGAL: ' + error);
    }
    
  } catch (error) {
    console.error('❌ Database test exception:', error);
    alert('❌ Database exception: ' + error.message);
  }
};

// Function untuk test EmailJS direct
window.testEmailJSDirect = async function() {
  console.log('🔧 === EMAILJS DIRECT TEST ===');
  
  try {
    // Test 1: Cek apakah EmailJS available
    console.log('1️⃣ Checking EmailJS availability...');
    if (window.emailjs) {
      console.log('✅ EmailJS available in window');
    } else {
      console.log('❌ EmailJS NOT available in window');
      try {
        const emailjs = await import('@emailjs/browser');
        console.log('✅ EmailJS imported via import()');
        window.emailjs = emailjs;
      } catch (importError) {
        console.error('❌ Failed to import EmailJS:', importError);
        alert('❌ EmailJS tidak tersedia sama sekali!');
        return;
      }
    }
    
    // Test 2: Initialize
    console.log('2️⃣ Initializing EmailJS...');
    window.emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Test 3: Send test email
    console.log('3️⃣ Sending test email...');
    const result = await window.emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      {
        to_email: 'fairuzo1dyck@gmail.com',
        name: 'Admin PERGUNU',
        applicant_name: 'Emergency Debug Test',
        applicant_email: 'emergency@debug.com',
        applicant_phone: '08123456789',
        applicant_position: 'Emergency Debugger',
        application_date: new Date().toLocaleDateString('id-ID')
      }
    );
    
    console.log('✅ EmailJS direct test successful:', result);
    alert('✅ EmailJS direct test BERHASIL! Status: ' + result.status);
    
  } catch (error) {
    console.error('❌ EmailJS direct test failed:', error);
    alert('❌ EmailJS direct test GAGAL: ' + error.message);
  }
};

// Function untuk test komprehensif
window.testKomprehensif = async function() {
  console.log('🔬 === TEST KOMPREHENSIF ===');
  
  console.log('📋 Testing database connection...');
  await testDatabaseSave();
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('📧 Testing EmailJS direct...');
  await testEmailJSDirect();
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  console.log('🔧 Testing EmailService...');
  await testEmailManual();
  
  console.log('✅ Komprehensif test completed!');
};

// Auto-run basic checks
console.log('🔍 === AUTO BASIC CHECKS ===');

// Check 1: Database server
fetch('http://localhost:3001/applications')
  .then(response => {
    if (response.ok) {
      console.log('✅ Database server (port 3001) OK');
    } else {
      console.log('⚠️ Database server response:', response.status);
    }
  })
  .catch(error => {
    console.error('❌ Database server (port 3001) ERROR:', error.message);
  });

// Check 2: EmailJS availability
if (window.emailjs) {
  console.log('✅ EmailJS tersedia di window');
  console.log('🔧 EmailJS methods:', Object.keys(window.emailjs));
} else {
  console.log('❌ EmailJS TIDAK tersedia di window');
}

// Check 3: Console info
console.log('📋 === DEBUGGING COMMANDS ===');
console.log('🔧 testEmailJSDirect() - Test EmailJS langsung');
console.log('💾 testDatabaseSave() - Test save ke database');  
console.log('📧 testEmailManual() - Test EmailService manual');
console.log('🔬 testKomprehensif() - Test semua komponen');
console.log('');
console.log('💡 CARA PAKAI: Ketik salah satu command di atas di console ini');
console.log('💡 Atau buka form register dan submit - error detail akan muncul');
