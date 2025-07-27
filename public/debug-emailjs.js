// Simple Debug Test - buka di browser console
window.debugEmailJS = async function() {
  console.log('🔍 === DEBUGGING EMAILJS ===');
  
  try {
    // Test 1: Import EmailJS
    console.log('1️⃣ Testing EmailJS import...');
    const emailjs = await import('@emailjs/browser');
    console.log('✅ EmailJS imported successfully:', emailjs);
    
    // Test 2: Initialize
    console.log('2️⃣ Testing EmailJS init...');
    emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Test 3: Send simple email
    console.log('3️⃣ Testing email send...');
    const testParams = {
      to_email: 'fairuzo1dyck@gmail.com',
      to_name: 'Test Admin',
      subject: 'Debug Test Email',
      message_html: '<h1>Debug Test</h1><p>This is a debug test email.</p>',
      applicant_name: 'Debug User',
      applicant_email: 'debug@test.com'
    };
    
    console.log('📧 Sending with params:', testParams);
    
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d',
      testParams
    );
    
    console.log('✅ === EMAIL DEBUG SUCCESS ===');
    console.log('📧 Result:', result);
    console.log('📧 Type of result:', typeof result);
    console.log('📧 Result status:', result.status);
    console.log('📧 Result text:', result.text);
    
    alert(`✅ Debug email berhasil!\nStatus: ${result.status}\nText: ${result.text}\nCek Gmail: fairuzo1dyck@gmail.com`);
    
    return result;
    
  } catch (error) {
    console.error('❌ === EMAIL DEBUG FAILED ===');
    console.error('❌ Error name:', error.name);
    console.error('❌ Error message:', error.message);
    console.error('❌ Error status:', error.status);
    console.error('❌ Error text:', error.text);
    console.error('❌ Full error:', error);
    
    alert(`❌ Debug email gagal!\nName: ${error.name}\nMessage: ${error.message}\nStatus: ${error.status}`);
    
    throw error;
  }
};

console.log('🔍 Debug function loaded! Jalankan: debugEmailJS()');
