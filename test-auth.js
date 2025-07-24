// Test koneksi dan autentikasi real-time
async function testAuthentication() {
  try {
    console.log('🚀 TESTING REAL-TIME AUTHENTICATION');
    console.log('===================================');
    
    const testCredentials = [
      { username: 'admin', password: 'admin123', expectedRole: 'admin' },
      { username: 'demo', password: 'demo123', expectedRole: 'user' },
      { username: 'adi', password: 'adi123', expectedRole: 'user' },
      { username: 'akbar', password: 'akbar123', expectedRole: 'user' }
    ];
    
    for (const cred of testCredentials) {
      console.log(`\n🧪 Testing login: ${cred.username} / ${cred.password}`);
      
      try {
        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: cred.username,
            password: cred.password
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          console.log(`✅ Login successful!`);
          console.log(`   User: ${data.user.fullName}`);
          console.log(`   Role: ${data.user.role}`);
          console.log(`   Expected Role: ${cred.expectedRole}`);
          console.log(`   Role Match: ${data.user.role === cred.expectedRole ? '✅' : '❌'}`);
        } else {
          console.log(`❌ Login failed: ${data.message || 'Unknown error'}`);
        }
        
      } catch (error) {
        console.log(`❌ Connection error: ${error.message}`);
      }
    }
    
    // Test server endpoint availability
    console.log('\n🌐 TESTING SERVER ENDPOINTS:');
    
    const endpoints = [
      { path: '/users', method: 'GET' },
      { path: '/api/login', method: 'POST' }
    ];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(`http://localhost:3001${endpoint.path}`, {
          method: endpoint.method === 'POST' ? 'POST' : 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          ...(endpoint.method === 'POST' ? {
            body: JSON.stringify({ test: true })
          } : {})
        });
        
        console.log(`${response.ok ? '✅' : '❌'} ${endpoint.method} ${endpoint.path} - Status: ${response.status}`);
        
      } catch (error) {
        console.log(`❌ ${endpoint.method} ${endpoint.path} - Error: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthentication();
