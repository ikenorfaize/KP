// Test login menggunakan metode yang sama seperti aplikasi
import bcrypt from 'bcryptjs';

class TestAPIService {
  constructor() {
    this.API_URL = 'http://localhost:3001';
    this.USE_JSON_SERVER = true;
  }

  async hashPassword(plainPassword) {
    try {
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('Error hashing password:', error);
      throw new Error('Password hashing failed');
    }
  }

  async verifyPassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      return isMatch;
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  }

  async loginWithServer(credentials) {
    try {
      console.log('🔄 Attempting to fetch users from JSON Server...');
      console.log('🌐 API URL:', this.API_URL);
      
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const users = await response.json();
      console.log('✅ Successfully fetched users:', users.length, 'users found');
      
      const user = users.find(u => {
        const emailMatch = u.email === credentials.username;
        const usernameMatch = u.username === credentials.username;
        console.log(`🔍 Checking user ${u.username}: email=${emailMatch}, username=${usernameMatch}`);
        return emailMatch || usernameMatch;
      });

      console.log('🔍 User search result:', user ? `Found: ${user.fullName} (${user.role})` : 'Not found');

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      console.log('🔐 Starting password verification...');
      console.log('🔑 Input password:', credentials.password);
      
      // Password verification dengan bcrypt
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
      console.log('✅ Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }

      console.log('🎉 Login successful for:', user.fullName);
      
      return {
        user: { ...user, password: undefined }, // Don't return password
        success: true
      };
    } catch (error) {
      console.error('❌ JSON Server login error:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async login(credentials) {
    // Trim whitespace from credentials
    const cleanCredentials = {
      username: credentials.username?.trim() || '',
      password: credentials.password?.trim() || ''
    };
    
    console.log('🧹 Cleaned credentials:', {
      username: cleanCredentials.username,
      password: '***' // Don't log actual password
    });
    
    return this.loginWithServer(cleanCredentials);
  }
}

async function testApplicationLogin() {
  console.log('🚀 TESTING APPLICATION LOGIN FLOW');
  console.log('=================================');
  
  const apiService = new TestAPIService();
  
  const testCredentials = [
    { username: 'admin', password: 'admin123' },
    { username: 'demo', password: 'demo123' },
    { username: 'adi', password: 'adi123' },
    { username: 'akbar', password: 'akbar123' },
    { username: 'admin@pergunu.com', password: 'admin123' }, // Test email login
    { username: 'demo@pergunu.com', password: 'demo123' } // Test email login
  ];
  
  for (const cred of testCredentials) {
    console.log(`\n🧪 Testing login: ${cred.username} / ${cred.password}`);
    console.log('─'.repeat(50));
    
    const result = await apiService.login(cred);
    
    if (result.success) {
      console.log(`✅ LOGIN SUCCESS!`);
      console.log(`   User: ${result.user.fullName}`);
      console.log(`   Role: ${result.user.role}`);
      console.log(`   ID: ${result.user.id}`);
    } else {
      console.log(`❌ LOGIN FAILED: ${result.error}`);
    }
  }
}

testApplicationLogin();
