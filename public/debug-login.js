// Script untuk debugging login dari browser
window.testLogin = async function(username, password) {
  console.log('🧪 Testing login from browser:', username);
  
  try {
    // Simulate form submission
    const usernameInput = document.querySelector('input[type="text"], input[type="email"], input[name*="username"], input[name*="email"]');
    const passwordInput = document.querySelector('input[type="password"]');
    const submitButton = document.querySelector('button[type="submit"], button:contains("Login"), button:contains("Masuk")');
    
    if (usernameInput && passwordInput) {
      // Clear and set values
      usernameInput.value = '';
      passwordInput.value = '';
      
      // Trigger events
      usernameInput.focus();
      usernameInput.value = username;
      usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
      usernameInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      passwordInput.focus();
      passwordInput.value = password;
      passwordInput.dispatchEvent(new Event('input', { bubbles: true }));
      passwordInput.dispatchEvent(new Event('change', { bubbles: true }));
      
      console.log('✅ Form filled with:', { username, password: '***' });
      
      // Submit form
      if (submitButton) {
        console.log('🔄 Clicking submit button...');
        submitButton.click();
      } else {
        console.log('⚠️ Submit button not found, trying form submit...');
        const form = document.querySelector('form');
        if (form) {
          form.dispatchEvent(new Event('submit', { bubbles: true }));
        }
      }
      
      return true;
    } else {
      console.error('❌ Login form elements not found');
      return false;
    }
  } catch (error) {
    console.error('❌ Error during test login:', error);
    return false;
  }
};

// Test login credentials
window.testAllLogins = async function() {
  const credentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'demo', password: 'demo123' },
    { username: 'adi', password: 'adi123' },
    { username: 'akbar', password: 'akbar123' }
  ];
  
  console.log('🚀 Starting automated login tests...');
  
  for (let i = 0; i < credentials.length; i++) {
    const cred = credentials[i];
    console.log(`\n🧪 Test ${i + 1}: ${cred.username} / ${cred.password}`);
    
    // Navigate to login page if not already there
    if (!window.location.pathname.includes('login') && !window.location.pathname.includes('/')) {
      window.location.href = '/';
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    // Wait for page to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Test login
    const success = await window.testLogin(cred.username, cred.password);
    
    if (success) {
      console.log('✅ Form submission attempted');
      
      // Wait for response
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Check current URL for redirect
      console.log('📍 Current URL:', window.location.href);
      
      if (window.location.pathname.includes('admin')) {
        console.log('✅ Successfully redirected to admin dashboard');
      } else if (window.location.pathname.includes('user-dashboard')) {
        console.log('✅ Successfully redirected to user dashboard');
      } else if (window.location.pathname === '/' || window.location.pathname.includes('login')) {
        console.log('❌ Still on login page - login failed');
      } else {
        console.log('⚠️ Redirected to unexpected page:', window.location.pathname);
      }
      
      // Check for error messages
      const errorElements = document.querySelectorAll('[class*="error"], [class*="alert"], .text-red-500, .text-danger');
      if (errorElements.length > 0) {
        console.log('❌ Error messages found:');
        errorElements.forEach(el => console.log('  -', el.textContent));
      }
      
      // Check localStorage for session
      const userSession = localStorage.getItem('user');
      const currentUser = localStorage.getItem('currentUser');
      console.log('💾 LocalStorage user:', userSession ? 'EXISTS' : 'NOT FOUND');
      console.log('💾 LocalStorage currentUser:', currentUser ? 'EXISTS' : 'NOT FOUND');
      
    } else {
      console.log('❌ Failed to find login form');
    }
    
    // Wait before next test
    if (i < credentials.length - 1) {
      console.log('⏳ Waiting before next test...');
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Logout if needed
      const logoutButton = document.querySelector('[onclick*="logout"], button:contains("Logout"), button:contains("Keluar")');
      if (logoutButton) {
        logoutButton.click();
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      
      // Navigate back to login
      window.location.href = '/';
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  console.log('🎯 All login tests completed!');
};

console.log('🔧 Login test utilities loaded! Run window.testAllLogins() to start testing.');
console.log('💡 Available functions:');
console.log('  - window.testLogin(username, password)');
console.log('  - window.testAllLogins()');
