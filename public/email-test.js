// Test Email Function - untuk debugging email delivery
// Buka di browser console dan jalankan: testEmail()

window.testEmail = async function() {
  console.log('🧪 === EMAIL DELIVERY TEST ===');
  
  // Import EmailJS
  const emailjs = (await import('https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js')).default;
  
  // Initialize
  emailjs.init('AIgbwO-ayq2i-I0ou');
  
  // Test data
  const testData = {
    to_email: 'fairuzo1dyck@gmail.com', // ✅ Email admin yang baru
    to_name: 'Admin PERGUNU',
    subject: '🧪 Test Email dari Browser Console',
    message_html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #0F7536;">🧪 Test Email Sukses!</h2>
        <p>Jika Anda menerima email ini, berarti konfigurasi EmailJS sudah benar.</p>
        <p><strong>Waktu test:</strong> ${new Date().toLocaleString('id-ID')}</p>
        <div style="background: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <h3>Data Test:</h3>
          <p><strong>Service ID:</strong> service_ublbpnp</p>
          <p><strong>Template ID:</strong> template_qnuud6d</p>
          <p><strong>Target:</strong> fairuzo1dyck@gmail.com</p>
        </div>
        <p style="color: #666;">Test dari browser console - KP PERGUNU Project</p>
      </div>
    `,
    applicant_name: 'Test User Console',
    applicant_email: 'test@console.com',
    reply_to: 'test@console.com'
  };
  
  try {
    console.log('📤 Sending test email...');
    console.log('📧 Test data:', testData);
    
    const result = await emailjs.send(
      'service_ublbpnp',
      'template_qnuud6d', 
      testData
    );
    
    console.log('✅ Test email sent successfully!');
    console.log('📧 Result:', result);
    console.log('🎯 Check Gmail inbox/spam:', testData.to_email);
    
    alert(`✅ Test email sent!\nStatus: ${result.status}\nCheck Gmail: ${testData.to_email}\n\nJika tidak masuk ke Inbox, cek folder SPAM/PROMOTIONS`);
    
    return result;
    
  } catch (error) {
    console.error('❌ Test email failed:', error);
    alert(`❌ Test email failed!\nError: ${error.message}`);
    throw error;
  }
};

console.log('🧪 Email test function loaded!');
console.log('📧 Jalankan: testEmail() untuk test kirim email');
