// 🔧 COMPREHENSIVE DEBUG TOOL untuk PERGUNU Form
console.log('🔧 === PERGUNU DEBUG TOOL LOADED ===');

// 1. Check stored errors
window.checkStoredErrors = function() {
  console.log('🔍 === CHECKING STORED ERRORS ===');
  
  const formError = localStorage.getItem('last_form_error');
  const promiseError = localStorage.getItem('last_promise_error');
  const debugData = localStorage.getItem('pergunu_form_debug');
  
  if (formError) {
    console.log('🚨 FORM ERROR FOUND:');
    console.log(JSON.parse(formError));
  }
  
  if (promiseError) {
    console.log('🚨 PROMISE ERROR FOUND:');
    console.log(JSON.parse(promiseError));
  }
  
  if (debugData) {
    console.log('📊 DEBUG DATA FOUND:');
    console.log(JSON.parse(debugData));
  }
  
  if (!formError && !promiseError && !debugData) {
    console.log('✅ No stored errors found');
  }
};

// 2. Clear all debug data
window.clearDebugData = function() {
  localStorage.removeItem('last_form_error');
  localStorage.removeItem('last_promise_error');
  localStorage.removeItem('pergunu_form_debug');
  localStorage.removeItem('pergunu_debug_active');
  localStorage.removeItem('pergunu_debug_timestamp');
  console.log('🧹 All debug data cleared');
};

// 3. Quick EmailJS test
window.quickEmailTest = async function() {
  console.log('📧 === QUICK EMAILJS TEST ===');
  
  if (!window.emailjs) {
    console.error('❌ EmailJS not available in window');
    return false;
  }
  
  try {
    // Initialize
    window.emailjs.init('AIgbwO-ayq2i-I0ou');
    console.log('✅ EmailJS initialized');
    
    // Test parameters
    const params = {
      to_email: 'fairuzo1dyck@gmail.com',
      admin_name: 'Admin PERGUNU',
      applicant_name: 'Debug Test User',
      applicant_email: 'debug@test.com',
      applicant_phone: '08123456789',
      applicant_position: 'guru',
      applicant_school: 'Debug Test School',
      application_date: new Date().toLocaleDateString('id-ID'),
      reply_to: 'debug@test.com'
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
    console.log('Full result:', result);
    
    alert('✅ EMAIL TEST BERHASIL!\n\nStatus: ' + result.status + '\nText: ' + result.text + '\n\nCek Gmail: fairuzo1dyck@gmail.com');
    return true;
    
  } catch (error) {
    console.error('❌ QUICK TEST FAILED');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    
    alert('❌ EMAIL TEST GAGAL!\n\nError: ' + error.message + '\nType: ' + error.name + '\n\nDetail lengkap di console');
    return false;
  }
};

// 4. Monitor network requests
window.monitorNetworkRequests = function() {
  console.log('🌐 === MONITORING NETWORK REQUESTS ===');
  
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    console.log('🌐 FETCH REQUEST:', args[0]);
    
    return originalFetch.apply(this, args)
      .then(response => {
        console.log('🌐 FETCH RESPONSE:', response.status, response.statusText);
        return response;
      })
      .catch(error => {
        console.error('🌐 FETCH ERROR:', error);
        throw error;
      });
  };
  
  console.log('✅ Network monitoring enabled');
};

// 5. Enable preserve log reminder
window.enablePreserveLog = function() {
  console.log('%c🔧 === ENABLE PRESERVE LOG ===', 'font-size: 16px; color: #0F7536; font-weight: bold;');
  console.log('%c1. Open DevTools (F12)', 'color: #007bff;');
  console.log('%c2. Go to Console Tab', 'color: #007bff;');
  console.log('%c3. Check "Preserve log" checkbox', 'color: #007bff;');
  console.log('%c4. Go to Network Tab', 'color: #007bff;');
  console.log('%c5. Check "Preserve log" checkbox', 'color: #007bff;');
  console.log('%c✅ Now console will NOT clear on refresh!', 'color: #28a745; font-weight: bold;');
};

// 6. Auto-check for errors on load
window.addEventListener('load', () => {
  console.log('🔧 Debug tool ready! Available functions:');
  console.log('📋 checkStoredErrors() - Check stored errors');
  console.log('🧹 clearDebugData() - Clear all debug data');
  console.log('📧 quickEmailTest() - Test EmailJS directly');
  console.log('🌐 monitorNetworkRequests() - Monitor fetch requests');
  console.log('🔧 enablePreserveLog() - Show preserve log instructions');
  
  // Auto-check for stored errors
  setTimeout(() => {
    checkStoredErrors();
  }, 1000);
});

// 7. Global error catcher untuk development
window.addEventListener('error', (event) => {
  console.error('🚨 GLOBAL ERROR CAUGHT BY DEBUG TOOL:');
  console.error('Message:', event.message);
  console.error('Source:', event.filename);
  console.error('Line:', event.lineno);
  console.error('Column:', event.colno);
  console.error('Error object:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('🚨 UNHANDLED PROMISE REJECTION BY DEBUG TOOL:');
  console.error('Reason:', event.reason);
});

console.log('✅ PERGUNU Debug Tool ready! Type enablePreserveLog() for setup instructions.');
