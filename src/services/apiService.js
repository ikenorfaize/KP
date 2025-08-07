// ApiService.js - Core Service Layer untuk Komunikasi Backend
// Service ini adalah jantung aplikasi yang mengelola semua operasi data:
// 1. Authentication & Authorization (login, session management)
// 2. User Management (CRUD operations)
// 3. Application Management (pendaftaran, approve/reject)
// 4. Database Operations dengan fallback strategy
// 5. Password Security (hashing, verification)
// 6. API Error Handling & Retry Logic
// 
// Backend Support:
// - Primary: JSON Server (development) - port 3001
// - Fallback: LocalStorage (offline/demo mode)

import bcrypt from 'bcryptjs'; // Library untuk secure password hashing

class ApiService {
  constructor() {
    // Konfigurasi service dengan Express.js backend
    this.USE_JSON_SERVER = false;                   // Using Express.js instead of json-server
    this.API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';     // Express.js API endpoint
    this.FILE_SERVER_URL = import.meta.env.VITE_FILE_SERVER_URL || 'http://localhost:3002'; // File server endpoint
    this.initialized = false;                       // Initialization status
    this.isServerAvailable = false;                 // Server availability status
    this.retryCount = 3;                           // Retry attempts untuk failed requests
    this.timeout = 10000;                          // Request timeout (10 seconds)
    this.version = '2.0.0-fix-' + Date.now();      // Force cache refresh
    
    console.log('🆕 NEW ApiService version:', this.version);
    
    // Security configuration dari environment variables
    this.saltRounds = parseInt(import.meta.env.VITE_BCRYPT_SALT_ROUNDS) || 12;
    this.maxLoginAttempts = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
    this.sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000;
  }

  // === PASSWORD SECURITY UTILITIES ===
  
  // Hash password menggunakan bcrypt dengan salt yang kuat dari environment config
  // Salt rounds dari environment variable untuk flexibility
  async hashPassword(plainPassword) {
    try {
      const saltRounds = this.saltRounds; // Tingkat kesulitan hash dari env config
      const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
      console.log('✅ Password berhasil di-hash dengan salt rounds:', saltRounds);
      return hashedPassword;
    } catch (error) {
      console.error('❌ Error saat hashing password:', error);
      throw new Error('Password hashing gagal');
    }
  }

  // Verifikasi password dengan comparing plain text vs stored hash
  // Menggunakan bcrypt compare yang secure terhadap timing attacks
  async verifyPassword(plainPassword, hashedPassword) {
    try {
      const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
      console.log(isMatch ? '✅ Password verified' : '❌ Password mismatch');
      return isMatch;
    } catch (error) {
      console.error('❌ Error saat verifikasi password:', error);
      return false;
    }
  }

  // === SERVICE INITIALIZATION ===
  
  // Inisialisasi service dengan health check dan fallback strategy
  async init() {
    if (this.initialized) return;
    
    console.log('🔧 Initializing ApiService...');
    console.log('🌐 API_URL:', this.API_URL); // DEBUG: Print API URL
    console.log('🔍 EXPECTED URL should contain /api path'); // DEBUG
    
    // Health check untuk Express.js API availability
    try {
      console.log('🔍 Health check URL:', `${this.API_URL}/health`); // DEBUG: Print full URL
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        timeout: 2000 // Timeout 2 detik
      });
      
      if (response.ok) {
        this.USE_JSON_SERVER = true;
        this.isServerAvailable = true;
        console.log('✅ API Service diinisialisasi dalam mode Express.js API');
      } else {
        this.USE_JSON_SERVER = false;
        this.isServerAvailable = false;
        console.log('⚠️ API Service diinisialisasi dalam mode localStorage');
      }
    } catch (error) {
      this.USE_JSON_SERVER = false;
      this.isServerAvailable = false;
      console.log('⚠️ API Service diinisialisasi dalam mode localStorage (Express.js API tidak ditemukan)');
      console.error('❌ Health check error:', error);
    }
    
    this.initialized = true;
  }

  // Switch mode API
  setMode(useJsonServer = true) {
    this.USE_JSON_SERVER = useJsonServer;
  }

  // === USER REGISTRATION METHODS ===
  
  // Register user baru dengan validation dan dual backend support
  async register(userData) {
    await this.init(); // Ensure service sudah diinisialisasi
    
    // Clean dan trim whitespace dari user input untuk consistency
    const cleanUserData = {
      ...userData,
      fullName: userData.fullName?.trim() || '',   // Nama lengkap tanpa leading/trailing spaces
      email: userData.email?.trim() || '',         // Email dalam format bersih
      username: userData.username?.trim() || '',   // Username tanpa spaces
      password: userData.password?.trim() || ''    // Password tanpa spaces
    };
    
    console.log('🧹 Cleaned user data for registration:', {
      fullName: cleanUserData.fullName,
      email: cleanUserData.email,
      username: cleanUserData.username,
      password: '***' // NEVER log actual password untuk security
    });
    
    // Route ke backend yang sesuai berdasarkan configuration
    if (this.USE_JSON_SERVER) {
      return this.registerWithServer(cleanUserData);   // Primary: JSON Server
    } else {
      return this.registerWithLocalStorage(cleanUserData); // Fallback: LocalStorage
    }
  }

  // === USER LOGIN METHODS ===
  
  // Login user dengan credential validation dan dual backend support  
  async login(credentials) {
    await this.init(); // Ensure service sudah diinisialisasi
    
    // === RESET MODE SETIAP LOGIN ATTEMPT ===
    // Pastikan selalu coba Express.js dulu, kecuali server benar-benar down
    if (this.isServerAvailable) {
      this.USE_JSON_SERVER = true;
      console.log('🔄 Reset to Express.js mode for new login attempt');
    }
    
    // Clean dan trim credentials untuk consistent comparison
    const cleanCredentials = {
      username: credentials.username?.trim() || '', // Username/email input
      password: credentials.password?.trim() || ''  // Password input
    };
    
    console.log('🧹 Cleaned credentials:', {
      username: cleanCredentials.username,
      password: '***' // NEVER log actual password untuk security
    });
    
    // Route ke backend yang sesuai berdasarkan configuration
    if (this.USE_JSON_SERVER) {
      return this.loginWithServer(cleanCredentials);      // Primary: JSON Server
    } else {
      return this.loginWithLocalStorage(cleanCredentials); // Fallback: LocalStorage
    }
  }

  // === JSON SERVER IMPLEMENTATIONS ===
  
  // Registration implementation untuk JSON Server backend
  async registerWithServer(userData) {
    try {
      // === STEP 1: CHECK DUPLICATE EMAIL ===
      // Cek apakah email sudah terdaftar untuk prevent duplicate accounts
      const existingUsers = await fetch(`${this.API_URL}/users?email=${userData.email}`);
      const users = await existingUsers.json();
      
      if (users.length > 0) {
        throw new Error('Email already registered');
      }
      // === STEP 2: PASSWORD HASHING ===
      // Hash password sebelum disimpan ke database untuk security
      const hashedPassword = await this.hashPassword(userData.password);

      // === STEP 3: CREATE USER RECORD ===
      // Create new user dengan metadata dan security measures
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userData,                              // Spread user data
          id: Date.now(),                          // Generate unique ID
          password: hashedPassword,                // Hashed password untuk security
          createdAt: new Date().toISOString(),     // Timestamp creation
          role: 'user'                            // Default role untuk new users
        })
      });

      if (!response.ok) throw new Error('Registration failed');
      
      return await response.json(); // Return created user data
    } catch (error) {
      // === FALLBACK STRATEGY ===
      // Jika JSON Server tidak available, switch ke localStorage
      console.warn('JSON Server not available, switching to localStorage');
      this.USE_JSON_SERVER = false;
      return this.registerWithLocalStorage(userData);
    }
  }

  // Login implementation untuk Express.js backend
  async loginWithServer(credentials) {
    try {
      console.log('🔄 Attempting login with Express.js API...');
      console.log('🌐 API URL:', this.API_URL);
      
      // === LOGIN WITH EXPRESS.JS API ===
      const response = await fetch(`${this.API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          username: credentials.username,
          password: credentials.password
        })
      });
      
      console.log('📡 Response status:', response.status, response.statusText);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log('✅ Login successful:', result.message);
      console.log('👤 User:', result.user.username, '(', result.user.role, ')');
      
      // Store user session
      const userSession = {
        user: result.user,
        token: result.token,
        timestamp: Date.now(),
        loginTime: new Date().toISOString()
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      
      return {
        success: true,
        user: result.user,
        message: result.message
      };
      console.log('📝 Looking for username:', credentials.username);
      
      // === STEP 2: USER LOOKUP ===
      // Cari user berdasarkan email atau username (flexible login)
      const user = users.find(u => {
        const emailMatch = u.email === credentials.username;    // Match dengan email
        const usernameMatch = u.username === credentials.username; // Match dengan username
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
      
      // === STEP 3: PASSWORD VERIFICATION ===
      // Verify password menggunakan bcrypt compare yang secure
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
      console.log('✅ Password verification result:', isPasswordValid);
      
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }

      console.log('🎫 Creating session...');
      
      // === STEP 4: SESSION CREATION ===
      // Create session token untuk maintain user state
      const sessionResponse = await fetch(`${this.API_URL}/sessions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,                                    // Link session ke user ID
          token: `session_${Date.now()}`,                    // Generate unique token
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours expiry
        })
      });

      const session = await sessionResponse.json();
      console.log('🎉 Login successful for:', user.fullName);
      
      // Return user data tanpa password + session token
      return {
        user: { ...user, password: undefined }, // NEVER return password untuk security
        session: session.token
      };
    } catch (error) {
      console.error('❌ JSON Server login error:', error.message);
      console.error('📝 Full error details:', error);
      
      // === SMART FALLBACK STRATEGY ===
      // HANYA switch ke localStorage jika ada SERVER ERROR
      // JANGAN switch jika hanya AUTHENTICATION ERROR (password salah)
      if (error.message.includes('Invalid credentials') || 
          error.message.includes('401') ||
          error.message.includes('Unauthorized')) {
        // Authentication error - TETAP gunakan Express.js, jangan switch!
        console.log('🔐 Authentication failed, but keeping Express.js mode');
        throw error; // Re-throw authentication error
      } else {
        // Server error - baru switch ke localStorage
        console.warn('⚠️ Server error detected, switching to localStorage mode...');
        this.USE_JSON_SERVER = false;
        return this.loginWithLocalStorage(credentials);
      }
    }
  }

  // === LOCALSTORAGE IMPLEMENTATIONS (FALLBACK METHODS) ===
  
  // Registration implementation untuk localStorage fallback
  registerWithLocalStorage(userData) {
    return new Promise(async (resolve, reject) => {
      // Get existing users dari localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // === DUPLICATE CHECK ===
      // Check apakah user sudah exist berdasarkan email atau username
      const userExists = users.find(user => 
        user.email === userData.email || user.username === userData.username
      );
      
      if (userExists) {
        reject(new Error('User already exists'));
        return;
      }
      
      // === PASSWORD HASHING ===
      // Hash password untuk localStorage juga (consistent security)
      const hashedPassword = await this.hashPassword(userData.password);
      
      // === CREATE USER RECORD ===
      // Add new user dengan metadata
      const newUser = {
        id: Date.now(),                          // Generate unique ID
        ...userData,                             // Spread user data
        password: hashedPassword,                // Hashed password untuk security
        createdAt: new Date().toISOString(),     // Timestamp creation
        role: 'user'                            // Default role
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      resolve(newUser); // Return created user
    });
  }

  // Login implementation untuk localStorage fallback
  loginWithLocalStorage(credentials) {
    return new Promise(async (resolve, reject) => {
      console.log('📦 Using localStorage mode...');
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      console.log('💾 LocalStorage users found:', users.length);
      
      // === DEFAULT USERS SEEDING ===
      // Jika tidak ada users di localStorage, create default users untuk demo
      if (users.length === 0) {
        console.log('⚠️ No users in localStorage, creating default users...');
        const defaultUsers = [
          {
            id: '1',
            fullName: 'Demo User',
            email: 'demo@pergunu.com',
            username: 'demo',
            password: '$2b$12$M5h98irDfJH7EZqlv3AjceSCrbx4yCatuEX/KHLumWnnSLS9d/AX.', // Hashed: 'demo123'
            role: 'user',
            createdAt: new Date().toISOString()
          },
          {
            id: '2',
            fullName: 'Admin Pergunu',
            email: import.meta.env.VITE_ADMIN_EMAIL || 'admin@pergunu.com',
            username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
            password: '$2b$12$BNUmVyFMI/MMOd7aXmBx7OcFGEDPbJ9WOnbqoyPZGRc.m4v2pJBRG', // Hashed default: 'admin123' - update via environment
            role: 'admin',
            createdAt: new Date().toISOString()
          },
          {
            id: '3',
            fullName: 'Akun1 User',
            email: 'akun1@example.com',
            username: 'akun1',
            password: '$2b$12$A1CfbogXUJSNQqGcd4NKq.2wUwAT1e6WNZC4pLicRfy5yIN2xJHse', // Hashed: 'akun123'
            role: 'user',
            createdAt: new Date().toISOString()
          }
        ];
        localStorage.setItem('users', JSON.stringify(defaultUsers));
        users.push(...defaultUsers);
        console.log('✅ Default users created in localStorage');
      }
      
      // === USER LOOKUP ===
      // Cari user berdasarkan email atau username (flexible login)
      console.log('🔍 Looking for user:', credentials.username);
      const user = users.find(u => 
        (u.email === credentials.username || u.username === credentials.username)
      );
      
      console.log('👤 User found:', user ? `${user.fullName} (${user.role})` : 'Not found');
      
      if (!user) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      // === PASSWORD VERIFICATION ===
      console.log('🔐 Verifying password...');
      // Password verification dengan bcrypt (consistent dengan JSON Server)
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
      console.log('✅ Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        reject(new Error('Password salah'));
        return;
      }
      
      // === SESSION CREATION ===
      // Save current session ke localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        password: undefined // NEVER store password dalam session
      }));
      
      // Return user data + session token
      resolve({
        user: { ...user, password: undefined }, // Remove password dari response
        session: `localStorage_session_${Date.now()}` // Generate session token
      });
    });
  }

  // === UTILITY METHODS ===
  
  // Get current logged in user dari session
  getCurrentUser() {
    if (this.USE_JSON_SERVER) {
      // In production app, verify session token dengan server
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    } else {
      // LocalStorage mode: get dari localStorage
      return JSON.parse(localStorage.getItem('currentUser') || 'null');
    }
  }

  // Logout user dan clear session data
  logout() {
    localStorage.removeItem('currentUser'); // Clear user session
    if (this.USE_JSON_SERVER) {
      // In production app, invalidate session pada server
      console.log('Session invalidated');
    }
  }
}

// === EXPORT STATEMENTS ===

// Export singleton instance untuk aplikasi umum
// Gunakan ini untuk konsistensi instance across aplikasi
export const apiService = new ApiService();

// Export class untuk custom usage atau testing
// Gunakan ini jika perlu create multiple instances atau testing
export default ApiService;
