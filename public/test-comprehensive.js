// === DEBUG COMPREHENSIVE ===
// Buka http://localhost:5173, tekan F12 → Console
// Copy paste SEMUA kode ini sekaligus dan tekan Enter:

console.clear();
console.log('🧪 === COMPREHENSIVE EMAIL DEBUG ===');

// Step 1: Test koneksi dasar
console.log('1️⃣ Testing basic connection...');
console.log('Current URL:', window.location.href);
console.log('Expected URL: http://localhost:5173');

// Step 2: Test EmailJS import dan init
async function testEmailJSBasic() {
  console.log('\n2️⃣ Testing EmailJS basic...');
  try {
    const emailjs = await import('@emailjs/browser');
    console.log('✅ EmailJS import success');
    
    emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS init success');
    
    return emailjs;
  } catch (error) {
    console.error('❌ EmailJS basic test failed:', error);
    throw error;
  }
}

// Step 3: Test minimal email send
async function testMinimalEmail(emailjs) {
  console.log('\n3️⃣ Testing minimal email send...');
  try {
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      {
        to_email: 'fairuzo1dyck@gmail.com',
        subject: 'Minimal Test',
        message_html: '<h1>Minimal Test</h1><p>Test basic EmailJS</p>'
      }
    );
    
    console.log('✅ Minimal email success:', result);
    return result;
  } catch (error) {
    console.error('❌ Minimal email failed:', error);
    throw error;
  }
}

// Step 4: Test with full parameters
async function testFullEmail(emailjs) {
  console.log('\n4️⃣ Testing full email parameters...');
  try {
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      {
        to_email: 'fairuzo1dyck@gmail.com',
        to_name: 'Admin PERGUNU',
        subject: '🔔 Test Full Parameters',
        message_html: `
          <div style="font-family: Arial; padding: 20px; background: #f9f9f9;">
            <h2 style="color: #0F7536;">📥 Test Full Parameters</h2>
            <div style="background: white; padding: 15px; border-radius: 8px;">
              <h3>👤 Data Test:</h3>
              <p><strong>Nama:</strong> Test User Full</p>
              <p><strong>Email:</strong> test@full.com</p>
              <p><strong>Sekolah:</strong> Test School Full</p>
            </div>
          </div>
        `,
        applicant_name: 'Test User Full',
        applicant_email: 'test@full.com',
        applicant_phone: '08123456789',
        applicant_position: 'guru',
        applicant_school: 'Test School Full',
        applicant_pw: 'PW Test',
        applicant_pc: 'PC Test',
        applicant_education: 'S1',
        applicant_experience: '1-3 tahun',
        application_date: new Date().toLocaleDateString('id-ID'),
        reply_to: 'test@full.com'
      }
    );
    
    console.log('✅ Full email success:', result);
    return result;
  } catch (error) {
    console.error('❌ Full email failed:', error);
    throw error;
  }
}

// Step 5: Test app EmailService
async function testAppEmailService() {
  console.log('\n5️⃣ Testing app EmailService...');
  try {
    // Import EmailService dari app
    const module = await import('/src/services/EmailService.js');
    const emailService = module.emailService;
    console.log('✅ EmailService imported:', emailService);
    
    // Test data
    const testData = {
      fullName: 'Test App User',
      email: 'testapp@test.com',
      phone: '08123456789',
      position: 'guru',
      school: 'Test App School',
      pw: 'PW App Test',
      pc: 'PC App Test',
      education: 'S1',
      experience: '1-3 tahun'
    };
    
    console.log('📧 Calling sendAdminNotification...');
    const result = await emailService.sendAdminNotification(testData);
    console.log('✅ App EmailService result:', result);
    
    return result;
  } catch (error) {
    console.error('❌ App EmailService failed:', error);
    throw error;
  }
}

// Run all tests
(async function runAllTests() {
  try {
    const emailjs = await testEmailJSBasic();
    
    console.log('\n🚀 Starting email tests...');
    
    // Test 1: Minimal
    await testMinimalEmail(emailjs);
    
    // Test 2: Full parameters
    await testFullEmail(emailjs);
    
    // Test 3: App EmailService
    await testAppEmailService();
    
    console.log('\n✅ === ALL TESTS COMPLETED ===');
    alert('✅ Semua test selesai! Cek console untuk detail dan Gmail untuk email.');
    
  } catch (error) {
    console.error('\n❌ === TEST FAILED ===');
    console.error('Error:', error);
    alert('❌ Test gagal! Error: ' + error.message);
  }
})();

console.log('\n📧 Test started... Watch console output...');
