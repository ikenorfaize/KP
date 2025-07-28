// DEBUG TOOL: Test EmailJS secara langsung
console.log('🔧 === EMAILJS DEBUG TEST ===');

// 1. Test EmailJS CDN loading
console.log('🔍 Testing EmailJS CDN...');
if (window.emailjs) {
  console.log('✅ EmailJS loaded from CDN');
  console.log('📧 EmailJS methods:', Object.keys(window.emailjs));
} else {
  console.error('❌ EmailJS not loaded');
}

// 2. Test EmailJS configuration
const testConfig = {
  serviceId: 'service_ublbpnp',
  templateId: 'template_qnuud6d',
  publicKey: 'AIgbwO-ayq2i-I0ou',
  adminEmail: 'fairuzo1dyck@gmail.com'
};

console.log('🔧 Test config:', testConfig);

// 3. Test EmailJS initialization
async function testEmailJS() {
  try {
    console.log('🚀 === STARTING EMAILJS TEST ===');
    
    // Initialize EmailJS
    window.emailjs.init(testConfig.publicKey);
    console.log('✅ EmailJS initialized');
    
    // Test parameters
    const testParams = {
      to_email: testConfig.adminEmail,
      admin_name: 'Admin PERGUNU',
      applicant_name: 'Test User',
      applicant_email: 'test@example.com',
      applicant_phone: '081234567890',
      applicant_position: 'guru',
      applicant_school: 'Test School',
      application_date: new Date().toLocaleDateString('id-ID'),
      reply_to: 'test@example.com',
      email_subject: '🔔 Test Email PERGUNU',
      email_content: 'This is a test email.',
      full_html_content: '<h1>Test Email</h1><p>This is a test.</p>'
    };
    
    console.log('📧 Test parameters:', testParams);
    
    // Send test email
    console.log('📤 Sending test email...');
    const result = await window.emailjs.send(
      testConfig.serviceId,
      testConfig.templateId,
      testParams
    );
    
    console.log('✅ === EMAIL SENT SUCCESSFULLY ===');
    console.log('📊 Status:', result.status);
    console.log('📝 Text:', result.text);
    console.log('📧 Full result:', result);
    
    alert('✅ EMAIL TEST BERHASIL!\n\nStatus: ' + result.status + '\nText: ' + result.text + '\n\nCek Gmail: fairuzo1dyck@gmail.com');
    
  } catch (error) {
    console.error('❌ === EMAIL TEST FAILED ===');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Full error:', error);
    
    alert('❌ EMAIL TEST GAGAL!\n\nError: ' + error.message + '\nType: ' + error.name + '\n\nCek console untuk detail.');
  }
}

// 4. Auto-run test setelah halaman load
window.addEventListener('load', () => {
  console.log('🌐 Page loaded, starting EmailJS test in 2 seconds...');
  setTimeout(testEmailJS, 2000);
});

// 5. Manual test function
window.testEmailJS = testEmailJS;
console.log('💡 You can also run manual test with: testEmailJS()');
