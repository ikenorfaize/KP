// API service untuk demo - bisa switch antara localStorage dan JSON Server
import { apiStatusChecker } from '../utils/apiStatusChecker';
import PasswordUtils from '../utils/passwordUtils';

class ApiService {
  constructor() {
    // Set API URL - ganti ke localStorage jika JSON Server tidak available
    this.USE_JSON_SERVER = true;
    this.API_URL = 'http://localhost:3001';
    this.initialized = false;
  }

  // Initialize and check server status
  async init() {
    if (this.initialized) return;
    
    const status = await apiStatusChecker.init();
    this.USE_JSON_SERVER = status.isOnline;
    this.initialized = true;
    
    console.log(`API Service initialized in ${status.mode} mode`);
  }

  // Switch mode API
  setMode(useJsonServer = true) {
    this.USE_JSON_SERVER = useJsonServer;
  }

  // Register user
  async register(userData) {
    await this.init(); // Ensure initialized
    
    if (this.USE_JSON_SERVER) {
      return this.registerWithServer(userData);
    } else {
      return this.registerWithLocalStorage(userData);
    }
  }

  // Login user  
  async login(credentials) {
    await this.init(); // Ensure initialized
    
    if (this.USE_JSON_SERVER) {
      return this.loginWithServer(credentials);
    } else {
      return this.loginWithLocalStorage(credentials);
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
      const hashedPassword = await PasswordUtils.hashPassword(userData.password);

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
      const response = await fetch(`${this.API_URL}/users`);
      const users = await response.json();
      
      const user = users.find(u => 
        (u.email === credentials.username || u.username === credentials.username)
      );

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Password verification dengan bcrypt
      const isPasswordValid = await PasswordUtils.verifyPassword(credentials.password, user.password);
      
      if (!isPasswordValid) {
        throw new Error('Password salah');
      }

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
      
      return {
        user: { ...user, password: undefined }, // Don't return password
        session: session.token
      };
    } catch (error) {
      console.warn('JSON Server not available, switching to localStorage');
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
      const hashedPassword = await PasswordUtils.hashPassword(userData.password);
      
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
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        (u.email === credentials.username || u.username === credentials.username)
      );
      
      if (!user) {
        reject(new Error('User tidak ditemukan'));
        return;
      }

      // Password verification dengan bcrypt
      const isPasswordValid = await PasswordUtils.verifyPassword(credentials.password, user.password);
      
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
