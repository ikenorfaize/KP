// === TEST EMAIL YANG BENAR ===
// Buka http://localhost:5173 (BUKAN 5174!)
// Tekan F12 → Console, lalu paste kode ini:

console.log('🧪 === DEBUGGING EMAIL SYSTEM ===');
console.log('🌐 Current URL:', window.location.href);
console.log('🌐 Expected URL: http://localhost:5173');

// Test 1: Cek apakah EmailJS bisa diimport
(async function testEmailSystem() {
  try {
    console.log('1️⃣ Testing EmailJS import...');
    const emailjs = await import('@emailjs/browser');
    console.log('✅ EmailJS imported:', emailjs);
    
    console.log('2️⃣ Testing EmailJS init...');
    emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    console.log('3️⃣ Testing simple email send...');
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      {
        to_email: 'fairuzo1dyck@gmail.com',
        to_name: 'Debug Test',
        subject: 'Debug Test Email',
        message_html: '<h1>🧪 Debug Test</h1><p>Jika email ini masuk, berarti EmailJS bekerja dengan baik!</p>',
        applicant_name: 'Debug User',
        applicant_email: 'debug@test.com',
        reply_to: 'debug@test.com'
      }
    );
    
    console.log('✅ === EMAIL DEBUG SUCCESS ===');
    console.log('📧 Result:', result);
    console.log('📧 Status:', result.status);
    console.log('📧 Text:', result.text);
    
    alert(`✅ Email debug berhasil!\nStatus: ${result.status}\nCek Gmail: fairuzo1dyck@gmail.com`);
    
  } catch (error) {
    console.error('❌ === EMAIL DEBUG FAILED ===');
    console.error('❌ Error:', error);
    alert(`❌ Email debug gagal!\nError: ${error.message}`);
  }
})();

// Test 2: Cek EmailService dari aplikasi
console.log('🔍 Testing app EmailService...');
try {
  // Import EmailService dari aplikasi
  import('./src/services/EmailService.js').then(module => {
    console.log('✅ EmailService module loaded:', module);
    const emailService = module.emailService;
    console.log('✅ EmailService instance:', emailService);
    console.log('🔧 EmailService config:', emailService.emailConfig);
    
    // Test dengan data dummy
    const testData = {
      fullName: 'Test User App',
      email: 'test@app.com',
      phone: '08123456789',
      position: 'guru',
      school: 'Test School',
      pw: 'PW Test',
      pc: 'PC Test',
      education: 'S1',
      experience: '1-3 tahun'
    };
    
    console.log('📧 Testing sendAdminNotification...');
    emailService.sendAdminNotification(testData).then(result => {
      console.log('✅ App EmailService result:', result);
    }).catch(err => {
      console.error('❌ App EmailService error:', err);
    });
    
  }).catch(err => {
    console.error('❌ Failed to import EmailService:', err);
  });
} catch (error) {
  console.error('❌ EmailService test failed:', error);
}
