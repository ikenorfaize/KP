// === COPY PASTE TEST FUNCTION ===
// Buka browser console (F12) dan paste kode ini:

(async function testEmailNow() {
  console.log('🧪 === EMAIL TEST STARTED ===');
  
  try {
    // Import EmailJS
    const emailjs = await import('@emailjs/browser');
    emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Simple test email
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      {
        to_email: 'fairuzo1dyck@gmail.com',
        to_name: 'Test Admin',
        subject: 'Test Email Simple',
        message_html: '<h1>Test berhasil!</h1><p>Email ini dikirim dari console test.</p>',
        applicant_name: 'Test User',
        applicant_email: 'test@test.com'
      }
    );
    
    console.log('✅ SUCCESS!', result);
    alert('✅ Email test berhasil! Cek Gmail: fairuzo1dyck@gmail.com');
    
  } catch (error) {
    console.error('❌ FAILED:', error);
    alert('❌ Email test gagal: ' + error.message);
  }
})();
