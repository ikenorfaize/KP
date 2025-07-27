console.clear();
console.log('🧪 Test EmailJS Direct - Fixed');

// STEP 1: Initialize EmailJS terlebih dahulu
console.log('📧 Initializing EmailJS...');
window.emailjs.init('AIgbwO-ayq2i-I0ou');
console.log('✅ EmailJS initialized');

// STEP 2: Test dengan data yang sama persis seperti RegisterForm
console.log('📤 Sending test email...');

window.emailjs.send(
  'service_ublbpnp',
  'template_qnuud6d',
  {
    to_email: 'fairuzo1dyck@gmail.com',
    name: 'Admin PERGUNU',
    applicant_name: 'Test Console Fix Init',
    applicant_email: 'test@fixinit.com',
    applicant_phone: '08123456789',
    applicant_position: 'Console Tester Fixed',
    application_date: new Date().toLocaleDateString('id-ID')
  }
).then(function(result) {
  console.log('✅ Console test BERHASIL:', result);
  alert('✅ Console test BERHASIL! Status: ' + result.status);
}).catch(function(error) {
  console.error('❌ Console test GAGAL:', error);
  alert('❌ Console test GAGAL: ' + error.message);
});
