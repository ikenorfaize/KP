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

// NOTE: Password hashing dilakukan di BACKEND untuk security
// Frontend hanya mengirim plain password via HTTPS

class ApiService {
  constructor() {
    // Konfigurasi service dengan Express.js backend
    this.USE_JSON_SERVER = false;                   // Using Express.js instead of json-server
    
    // Environment-based configuration with secure defaults
    const isDevelopment = import.meta.env.DEV || false;
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const fileServerUrl = import.meta.env.VITE_FILE_SERVER_URL;
    
    // CRITICAL: Use environment variables ONLY - no hardcoded fallbacks
    // This ensures the same code works in development, staging, and production
    if (!apiBaseUrl) {
      console.error('❌ VITE_API_BASE_URL is not defined! Check your .env file.');
    }
    if (!fileServerUrl) {
      console.error('❌ VITE_FILE_SERVER_URL is not defined! Check your .env file.');
    }
    
    this.API_URL = apiBaseUrl;
    this.FILE_SERVER_URL = fileServerUrl;
    
    this.initialized = false;                       // Initialization status
    this._initializingPromise = null;               // Promise to guard concurrent init
    this.isServerAvailable = false;                 // Server availability status
    this.retryCount = 3;                           // Retry attempts untuk failed requests
    this.timeout = 10000;                          // Request timeout (10 seconds)
    this.version = '2.0.0-secure-' + Date.now();      // Force cache refresh
    
    // Log version to verify we're using latest code
    console.log('🆕 ApiService version:', this.version);
    console.log('📡 API_URL:', this.API_URL);
    console.log('📁 FILE_SERVER_URL:', this.FILE_SERVER_URL);
    console.log('🔧 Environment:', isDevelopment ? 'development' : 'production');
    
    // Security configuration dari environment variables
    this.saltRounds = parseInt(import.meta.env.VITE_BCRYPT_SALT_ROUNDS) || 12;
    this.maxLoginAttempts = parseInt(import.meta.env.VITE_MAX_LOGIN_ATTEMPTS) || 5;
    this.sessionTimeout = parseInt(import.meta.env.VITE_SESSION_TIMEOUT) || 3600000;
  }

  // === PASSWORD SECURITY UTILITIES ===
  
  // Password hashing dan verification dilakukan di BACKEND
  // Frontend hanya mengirim plain password via HTTPS ke backend
  // Backend akan handle bcrypt hashing dengan proper security

  // === SERVICE INITIALIZATION ===
  
  // Inisialisasi service dengan health check dan fallback strategy
  async init() {
    if (this.initialized) return;
    if (this._initializingPromise) {
      // Wait for ongoing initialization
      await this._initializingPromise;
      return;
    }
    
    const isDevelopment = import.meta.env.DEV || false;
    
    if (isDevelopment) {
      console.log('🔧 Initializing ApiService...');
    }
    
    // Health check untuk Express.js API availability
    this._initializingPromise = (async () => {
      try {
      const response = await fetch(`${this.API_URL}/health`, {
        method: 'GET',
        timeout: 2000 // Timeout 2 detik
      });
      
      if (response.ok) {
        this.USE_JSON_SERVER = true;
        this.isServerAvailable = true;
        if (isDevelopment) {
          console.log('✅ API Service diinisialisasi dalam mode Express.js API');
        }
      } else {
        this.USE_JSON_SERVER = false;
        this.isServerAvailable = false;
        if (isDevelopment) {
          console.log('⚠️ API Service diinisialisasi dalam mode localStorage');
        }
      }
    } catch (error) {
      this.USE_JSON_SERVER = false;
      this.isServerAvailable = false;
      if (isDevelopment) {
        console.log('⚠️ API Service diinisialisasi dalam mode localStorage (Express.js API tidak ditemukan)');
        console.error('❌ Health check error:', error);
      }
  } finally {
      this.initialized = true;
      this._initializingPromise = null;
  }
  })();
    await this._initializingPromise;
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
      // Gunakan endpoint Express.js yang sudah ada: /auth/register
      const response = await fetch(`${this.API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Kirim data asli; backend akan melakukan validasi & hashing
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: 'Registration failed' }));
        throw new Error(err.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      // === FALLBACK STRATEGY ===
      console.warn('Express API not available, switching to localStorage for registration');
      this.USE_JSON_SERVER = false;
      return this.registerWithLocalStorage(userData);
    }
  }

  // Login implementation untuk Express.js backend
  async loginWithServer(credentials) {
    try {
      const isDevelopment = import.meta.env.DEV || false;
      
      if (isDevelopment) {
        console.log('🔄 Attempting login with Express.js API...');
      }
      
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
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      const result = await response.json();
      
      // Extract user data from response.data
      const userData = result.data || result;
      
      if (isDevelopment) {
        console.log('✅ Login successful:', result.message);
        console.log('👤 User data:', userData);
        console.log('👤 User role:', userData.role);
      }
      
      // Store user session
      const userSession = {
        ...userData,
        timestamp: Date.now(),
        loginTime: new Date().toISOString()
      };
      
      // Store session data
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      
      // Store token if provided by backend (for future JWT implementation)
      if (result.token) {
        localStorage.setItem('token', result.token);
        if (isDevelopment) {
          console.log('🔑 Token stored:', result.token.substring(0, 20) + '...');
        }
      } else {
        // For now, create a session identifier as fallback
        const sessionId = `session_${userData.id}_${Date.now()}`;
        localStorage.setItem('token', sessionId);
        if (isDevelopment) {
          console.log('🔑 Session ID stored (no JWT from backend):', sessionId);
        }
      }
      
      return {
        success: true,
        user: userData,
        message: 'Login successful'
      };
    } catch (error) {
      const isDevelopment = import.meta.env.DEV || false;
      
      if (isDevelopment) {
        console.error('❌ Login error:', error.message);
      }
      
      // === SMART FALLBACK STRATEGY ===
      // HANYA switch ke localStorage jika ada SERVER ERROR
      // JANGAN switch jika hanya AUTHENTICATION ERROR (password salah)
      if (error.message.includes('Invalid credentials') || 
          error.message.includes('401') ||
          error.message.includes('Unauthorized')) {
        // Authentication error - TETAP gunakan Express.js, jangan switch!
        if (isDevelopment) {
          console.log('🔐 Authentication failed, but keeping Express.js mode');
        }
        throw error; // Re-throw authentication error
      } else {
        // Server error - baru switch ke localStorage
        if (isDevelopment) {
          console.warn('⚠️ Server error detected, switching to localStorage mode...');
        }
        this.USE_JSON_SERVER = false;
        return this.loginWithLocalStorage(credentials);
      }
    }
  }

  // === LOCALSTORAGE IMPLEMENTATIONS (FALLBACK METHODS) ===
  
  // Registration implementation untuk localStorage fallback
  async registerWithLocalStorage(userData) {
    try {
      // Get existing users dari localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // === DUPLICATE CHECK ===
      // Check apakah user sudah exist berdasarkan email atau username
      const userExists = users.find(user => 
        user.email === userData.email || user.username === userData.username
      );
      
      if (userExists) {
        throw new Error('User already exists');
      }
      
      // === CREATE USER RECORD ===
      // Add new user dengan metadata
      // NOTE: In localStorage fallback, password stored as-is (demo only)
      // In production, backend handles all password hashing
      const newUser = {
        id: Date.now(),                          // Generate unique ID
        ...userData,                             // Spread user data
        password: userData.password,             // Password (backend handles hashing)
        createdAt: new Date().toISOString(),     // Timestamp creation
        role: 'user'                            // Default role
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      return newUser; // Return created user
    } catch (error) {
      throw error;
    }
  }

  // Login implementation untuk localStorage fallback
  async loginWithLocalStorage(credentials) {
    try {
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
        throw new Error('User tidak ditemukan');
      }

      // === PASSWORD VERIFICATION ===
      console.log('🔐 Verifying password...');
      // Simple password check for localStorage fallback (demo only)
      // In production, backend handles secure password verification
      const isPasswordValid = (credentials.password === user.password);
      
      console.log('✅ Password valid:', isPasswordValid);
      
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }
      
      // === SESSION CREATION ===
      // Save current session ke localStorage
      localStorage.setItem('currentUser', JSON.stringify({
        ...user,
        password: undefined // NEVER store password dalam session
      }));
      
      // Return user data + session token
      return {
        user: { ...user, password: undefined }, // Remove password dari response
        session: `localStorage_session_${Date.now()}` // Generate session token
      };
    } catch (error) {
      throw error;
    }
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
