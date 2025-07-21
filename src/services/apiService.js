// API service untuk demo - bisa switch antara localStorage dan JSON Server
import bcrypt from 'bcryptjs';

class ApiService {
  constructor() {
    // Set API URL - ganti ke localStorage jika JSON Server tidak available
    this.USE_JSON_SERVER = true;
    this.API_URL = 'http://localhost:3001';
    this.initialized = false;
  }

  // Password utilities
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

  // Initialize and check server status
  async init() {
    if (this.initialized) return;
    
    // Check if JSON Server is available
    try {
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'GET',
        timeout: 2000
      });
      
      if (response.ok) {
        this.USE_JSON_SERVER = true;
        console.log('API Service initialized in JSON Server mode');
      } else {
        this.USE_JSON_SERVER = false;
        console.log('API Service initialized in localStorage mode');
      }
    } catch (error) {
      this.USE_JSON_SERVER = false;
      console.log('API Service initialized in localStorage mode (JSON Server not found)');
    }
    
    this.initialized = true;
  }

  // Switch mode API
  setMode(useJsonServer = true) {
    this.USE_JSON_SERVER = useJsonServer;
  }

  // Register user
  async register(userData) {
    await this.init(); // Ensure initialized
    
    // Trim whitespace from user data
    const cleanUserData = {
      ...userData,
      fullName: userData.fullName?.trim() || '',
      email: userData.email?.trim() || '',
      username: userData.username?.trim() || '',
      password: userData.password?.trim() || ''
    };
    
    console.log('🧹 Cleaned user data for registration:', {
      fullName: cleanUserData.fullName,
      email: cleanUserData.email,
      username: cleanUserData.username,
      password: '***' // Don't log actual password
    });
    
    if (this.USE_JSON_SERVER) {
      return this.registerWithServer(cleanUserData);
    } else {
      return this.registerWithLocalStorage(cleanUserData);
    }
  }

  // Login user  
  async login(credentials) {
    await this.init(); // Ensure initialized
    
    // Trim whitespace from credentials
    const cleanCredentials = {
      username: credentials.username?.trim() || '',
      password: credentials.password?.trim() || ''
    };
    
    console.log('🧹 Cleaned credentials:', {
      username: cleanCredentials.username,
      password: '***' // Don't log actual password
    });
    
    if (this.USE_JSON_SERVER) {
      return this.loginWithServer(cleanCredentials);
    } else {
      return this.loginWithLocalStorage(cleanCredentials);
    }
  }

  // JSON Server Methods
  async registerWithServer(userData) {
    try {
      // Check if user exists
      const existingUsers = await fetch(`${this.API_URL}/users?email=${userData.email}`);
      const users = await existingUsers.json();
      
      if (users.length > 0) {
        throw new Error('Email already registered');
      }

      // Hash password sebelum disimpan
      const hashedPassword = await this.hashPassword(userData.password);

      // Create new user
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,
          id: Date.now(),
          password: hashedPassword, // Password yang sudah di-hash
          createdAt: new Date().toISOString(),
          role: 'user'
        })
      });

      if (!response.ok) throw new Error('Registration failed');
      
      return await response.json();
    } catch (error) {
      console.warn('JSON Server not available, switching to localStorage');
      this.USE_JSON_SERVER = false;
      return this.registerWithLocalStorage(userData);
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
      console.log('👥 Users list:', users.map(u => `${u.username} (${u.role})`));
      console.log('📝 Looking for username:', credentials.username);
      
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
      console.log('🔒 Stored hash:', user.password);
      
      // Password verification dengan bcrypt
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
      console.log('✅ Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }

      console.log('🎫 Creating session...');
      // Create session
      const sessionResponse = await fetch(`${this.API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          token: `session_${Date.now()}`,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        })
      });

      const session = await sessionResponse.json();
      console.log('🎉 Login successful for:', user.fullName);
      
      return {
        user: { ...user, password: undefined }, // Don't return password
        session: session.token
      };
    } catch (error) {
      console.error('❌ JSON Server login error:', error.message);
      console.error('📝 Full error details:', error);
      console.warn('⚠️ Switching to localStorage mode...');
      this.USE_JSON_SERVER = false;
      return this.loginWithLocalStorage(credentials);
    }
  }

  // LocalStorage Methods (Fallback)
  registerWithLocalStorage(userData) {
    return new Promise(async (resolve, reject) => {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if user exists
      const userExists = users.find(user => 
        user.email === userData.email || user.username === userData.username
      );
      
      if (userExists) {
        reject(new Error('User already exists'));
        return;
      }
      
      // Hash password untuk localStorage juga
      const hashedPassword = await this.hashPassword(userData.password);
      
      // Add new user
      const newUser = {
        id: Date.now(),
        ...userData,
        password: hashedPassword, // Password yang sudah di-hash
        createdAt: new Date().toISOString(),
        role: 'user'
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      resolve(newUser);
    });
  }

  loginWithLocalStorage(credentials) {
    return new Promise(async (resolve, reject) => {
      console.log('📦 Using localStorage mode...');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('💾 LocalStorage users found:', users.length);
      
      // If no users in localStorage, create default users
      if (users.length === 0) {
        console.log('⚠️ No users in localStorage, creating default users...');
        const defaultUsers = [
          {
            id: '1',
            fullName: 'Demo User',
            email: 'demo@pergunu.com',
            username: 'demo',
            password: '$2b$12$M5h98irDfJH7EZqlv3AjceSCrbx4yCatuEX/KHLumWnnSLS9d/AX.',
            role: 'user',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            fullName: 'Admin Pergunu',
            email: 'admin@pergunu.com',
            username: 'admin',
            password: '$2b$12$BNUmVyFMI/MMOd7aXmBx7OcFGEDPbJ9WOnbqoyPZGRc.m4v2pJBRG',
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            fullName: 'Akun1 User',
            email: 'akun1@example.com',
            username: 'akun1',
            password: '$2b$12$A1CfbogXUJSNQqGcd4NKq.2wUwAT1e6WNZC4pLicRfy5yIN2xJHse',
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        users.push(...defaultUsers);
        console.log('✅ Default users created in localStorage');
      }
      
      console.log('🔍 Looking for user:', credentials.username);
      const user = users.find(u => 
        (u.email === credentials.username || u.username === credentials.username)
      );
      
      console.log('👤 User found:', user ? `${user.fullName} (${user.role})` : 'Not found');
      
      if (!user) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      console.log('🔐 Verifying password...');
      // Password verification dengan bcrypt
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
      console.log('✅ Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        reject(new Error('Password salah'));
        return;
      }
      
      // Save current session
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        password: undefined
      }));
      
      resolve({
        user: { ...user, password: undefined },
        session: `localStorage_session_${Date.now()}`
      });
    });
  }

  // Get current user
  getCurrentUser() {
    if (this.USE_JSON_SERVER) {
      // In real app, verify session token with server
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } else {
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
  }

  // Logout
  logout() {
    localStorage.removeItem('currentUser');
    if (this.USE_JSON_SERVER) {
      // In real app, invalidate session on server
      console.log('Session invalidated');
    }
  }
}

// Export singleton instance
export const apiService = new ApiService();

// Export class for custom usage
export default ApiService;
