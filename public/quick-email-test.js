console.log('🔧 === SIMPLE EMAILJS TEST ===');

// Simple test function yang bisa dipanggil di console
window.testEmailJSQuick = async function() {
  try {
    console.log('🚀 Starting quick EmailJS test...');
    
    // Check EmailJS availability
    if (!window.emailjs) {
      console.error('❌ EmailJS not available in window');
      return false;
    }
    
    // Initialize
    window.emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Simple test parameters
    const params = {
      to_email: 'fairuzo1dyck@gmail.com',
      admin_name: 'Admin PERGUNU',
      applicant_name: 'Quick Test User',
      applicant_email: 'quicktest@example.com',
      applicant_phone: '08123456789',
      applicant_position: 'guru',
      applicant_school: 'Quick Test School',
      application_date: new Date().toLocaleDateString('id-ID'),
      reply_to: 'quicktest@example.com'
    };
    
    console.log('📤 Sending test email...');
    const result = await window.emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      params
    );
    
    console.log('✅ QUICK TEST SUCCESS!');
    console.log('Status:', result.status);
    console.log('Text:', result.text);
    
    alert('✅ QUICK EMAIL TEST BERHASIL!\n\nStatus: ' + result.status + '\nCek Gmail: fairuzo1dyck@gmail.com');
    return true;
    
  } catch (error) {
    console.error('❌ QUICK TEST FAILED');
    console.error('Error:', error.message);
    console.error('Type:', error.name);
    
    alert('❌ QUICK TEST GAGAL!\n\nError: ' + error.message);
    return false;
  }
};

console.log('💡 Quick test ready! Run: testEmailJSQuick()');

// Auto-run jika diminta
if (window.location.search.includes('autotest=true')) {
  setTimeout(() => {
    console.log('🔄 Auto-running quick test...');
    testEmailJSQuick();
  }, 2000);
}
