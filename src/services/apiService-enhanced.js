// Enhanced API Service dengan file system storage support
import bcrypt from 'bcryptjs';

class APIService {
  constructor() {
    // Set API URL - ganti ke localStorage jika JSON Server tidak available
    this.USE_JSON_SERVER = true;
    this.API_URL = 'http://localhost:3001';
    this.UPLOAD_URL = 'http://localhost:3001'; // Same server for file uploads
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
    
    try {
      // Check if JSON Server is available
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
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

  // ============ FILE UPLOAD METHODS ============

  // Upload PDF file dengan file system storage
  async uploadPDF(file, userId, metadata = {}) {
    try {
      console.log('📤 Starting PDF upload...', {
        fileName: file.name,
        fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
        userId: userId
      });

      if (this.USE_JSON_SERVER) {
        return await this.uploadPDFToServer(file, userId, metadata);
      } else {
        return await this.uploadPDFToLocalStorage(file, userId, metadata);
      }
    } catch (error) {
      console.error('❌ PDF upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }
  }

  // Upload ke server dengan file system storage
  async uploadPDFToServer(file, userId, metadata = {}) {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('userId', userId);
      formData.append('metadata', JSON.stringify(metadata));

      console.log('🌐 Uploading to server...');

      // Upload file to server
      const uploadResponse = await fetch(`${this.UPLOAD_URL}/api/upload`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        // Fallback: Convert to base64 and save to database directly
        console.warn('⚠️ File upload endpoint not available, using direct database storage...');
        return await this.uploadPDFDirectToDatabase(file, userId, metadata);
      }

      const uploadResult = await uploadResponse.json();
      console.log('✅ File uploaded successfully:', uploadResult);

      return {
        success: true,
        certificate: uploadResult.certificate,
        message: 'File uploaded successfully'
      };

    } catch (error) {
      console.warn('⚠️ Server upload failed, trying direct database storage...', error.message);
      return await this.uploadPDFDirectToDatabase(file, userId, metadata);
    }
  }

  // Upload langsung ke database (updated untuk file storage)
  async uploadPDFDirectToDatabase(file, userId, metadata = {}) {
    try {
      // Convert file to base64 for temporary storage
      const base64Data = await this.fileToBase64(file);
      
      // Create certificate object
      const certificate = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        name: file.name,
        title: metadata.title || file.name,
        description: metadata.description || '',
        category: metadata.category || 'certificate',
        fileName: file.name,
        filePath: `/uploads/certificates/${file.name}`, // Will be updated after file save
        fileSize: file.size,
        fileSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
        mimeType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId,
        // Temporary base64 data (should be processed by server to save as file)
        base64Data: base64Data
      };

      console.log('📄 Certificate object created:', {
        id: certificate.id,
        name: certificate.name,
        size: `${certificate.fileSizeMB} MB`
      });

      // Get current user
      const userResponse = await fetch(`${this.API_URL}/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }

      const user = await userResponse.json();
      
      // Add certificate to user's certificates array
      const updatedCertificates = [...(user.certificates || []), certificate];

      // Update user with new certificate
      const updateResponse = await fetch(`${this.API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          certificates: updatedCertificates
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update user certificates');
      }

      console.log('✅ Certificate added to user database');

      return {
        success: true,
        certificate: certificate,
        message: 'Certificate uploaded successfully'
      };

    } catch (error) {
      console.error('❌ Direct database upload failed:', error);
      throw new Error(`Database upload failed: ${error.message}`);
    }
  }

  // Upload to localStorage (fallback)
  async uploadPDFToLocalStorage(file, userId, metadata = {}) {
    try {
      const base64Data = await this.fileToBase64(file);
      
      const certificate = {
        id: `cert_${Date.now()}_${Math.random().toString(36).substring(2)}`,
        name: file.name,
        title: metadata.title || file.name,
        description: metadata.description || '',
        category: metadata.category || 'certificate',
        base64Data: base64Data,
        fileSize: file.size,
        fileSizeMB: parseFloat((file.size / 1024 / 1024).toFixed(2)),
        mimeType: file.type || 'application/pdf',
        uploadedAt: new Date().toISOString(),
        uploadedBy: userId
      };

      // Get users from localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex(u => u.id == userId);
      
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Add certificate to user
      if (!users[userIndex].certificates) {
        users[userIndex].certificates = [];
      }
      
      users[userIndex].certificates.push(certificate);
      
      // Save back to localStorage
      localStorage.setItem('users', JSON.stringify(users));
      
      console.log('✅ Certificate saved to localStorage');

      return {
        success: true,
        certificate: certificate,
        message: 'Certificate uploaded successfully'
      };

    } catch (error) {
      console.error('❌ localStorage upload failed:', error);
      throw new Error(`localStorage upload failed: ${error.message}`);
    }
  }

  // ============ FILE DOWNLOAD METHODS ============

  // Download PDF file
  async downloadPDF(certificateId, userId) {
    try {
      console.log('📥 Starting PDF download...', { certificateId, userId });

      if (this.USE_JSON_SERVER) {
        return await this.downloadPDFFromServer(certificateId, userId);
      } else {
        return await this.downloadPDFFromLocalStorage(certificateId, userId);
      }
    } catch (error) {
      console.error('❌ PDF download failed:', error);
      throw new Error(`Download failed: ${error.message}`);
    }
  }

  // Download from server
  async downloadPDFFromServer(certificateId, userId) {
    try {
      // Get user data to find certificate
      const userResponse = await fetch(`${this.API_URL}/users/${userId}`);
      if (!userResponse.ok) {
        throw new Error('User not found');
      }

      const user = await userResponse.json();
      const certificate = user.certificates?.find(cert => cert.id === certificateId);

      if (!certificate) {
        throw new Error('Certificate not found');
      }

      console.log('📄 Certificate found:', certificate.name);

      // If certificate has filePath (new file storage), download from file system
      if (certificate.filePath && !certificate.base64Data) {
        console.log('🔗 Using file system download...');
        
        const downloadResponse = await fetch(`${this.UPLOAD_URL}${certificate.filePath}`);
        
        if (downloadResponse.ok) {
          const blob = await downloadResponse.blob();
          
          // Update download statistics
          await this.updateDownloadStats(userId, certificateId);
          
          return {
            success: true,
            blob: blob,
            fileName: certificate.fileName || certificate.name,
            mimeType: certificate.mimeType || 'application/pdf'
          };
        } else {
          console.warn('⚠️ File system download failed, trying base64 fallback...');
        }
      }

      // Fallback: Use base64 data if available
      if (certificate.base64Data) {
        console.log('📄 Using base64 download...');
        
        const blob = this.base64ToBlob(certificate.base64Data, certificate.mimeType || 'application/pdf');
        
        // Update download statistics
        await this.updateDownloadStats(userId, certificateId);
        
        return {
          success: true,
          blob: blob,
          fileName: certificate.name,
          mimeType: certificate.mimeType || 'application/pdf'
        };
      }

      throw new Error('No downloadable data found for certificate');

    } catch (error) {
      console.error('❌ Server download failed:', error);
      throw new Error(`Server download failed: ${error.message}`);
    }
  }

  // Download from localStorage
  async downloadPDFFromLocalStorage(certificateId, userId) {
    try {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => u.id == userId);
      
      if (!user) {
        throw new Error('User not found');
      }

      const certificate = user.certificates?.find(cert => cert.id === certificateId);
      
      if (!certificate) {
        throw new Error('Certificate not found');
      }

      if (!certificate.base64Data) {
        throw new Error('No downloadable data found');
      }

      const blob = this.base64ToBlob(certificate.base64Data, certificate.mimeType || 'application/pdf');
      
      // Update download statistics in localStorage
      this.updateDownloadStatsLocalStorage(users, userId, certificateId);
      
      return {
        success: true,
        blob: blob,
        fileName: certificate.name,
        mimeType: certificate.mimeType || 'application/pdf'
      };

    } catch (error) {
      console.error('❌ localStorage download failed:', error);
      throw new Error(`localStorage download failed: ${error.message}`);
    }
  }

  // ============ UTILITY METHODS ============

  // Convert file to base64
  fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }

  // Convert base64 to blob
  base64ToBlob(base64, mimeType = 'application/pdf') {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
  }

  // Update download statistics
  async updateDownloadStats(userId, certificateId) {
    try {
      const userResponse = await fetch(`${this.API_URL}/users/${userId}`);
      if (!userResponse.ok) return;

      const user = await userResponse.json();
      
      // Update user download stats
      const downloadHistory = user.downloadHistory || [];
      downloadHistory.push({
        certificateId: certificateId,
        downloadedAt: new Date().toISOString()
      });

      const updateData = {
        downloads: (user.downloads || 0) + 1,
        lastDownload: new Date().toISOString(),
        downloadHistory: downloadHistory
      };

      await fetch(`${this.API_URL}/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData)
      });

      console.log('📊 Download statistics updated');
    } catch (error) {
      console.warn('⚠️ Failed to update download statistics:', error);
    }
  }

  // Update download statistics for localStorage
  updateDownloadStatsLocalStorage(users, userId, certificateId) {
    try {
      const userIndex = users.findIndex(u => u.id == userId);
      if (userIndex === -1) return;

      const user = users[userIndex];
      const downloadHistory = user.downloadHistory || [];
      
      downloadHistory.push({
        certificateId: certificateId,
        downloadedAt: new Date().toISOString()
      });

      users[userIndex] = {
        ...user,
        downloads: (user.downloads || 0) + 1,
        lastDownload: new Date().toISOString(),
        downloadHistory: downloadHistory
      };

      localStorage.setItem('users', JSON.stringify(users));
      console.log('📊 Download statistics updated (localStorage)');
    } catch (error) {
      console.warn('⚠️ Failed to update download statistics (localStorage):', error);
    }
  }

  // ============ AUTHENTICATION METHODS (EXISTING) ============

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

  async loginWithServer(credentials) {
    try {
      console.log('🔄 Attempting to fetch users from JSON Server...');
      
      const response = await fetch(`${this.API_URL}/users`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const users = await response.json();
      console.log('✅ Successfully fetched users:', users.length, 'users found');
      
      const user = users.find(u => {
        return u.email === credentials.username || u.username === credentials.username;
      });

      if (!user) {
        throw new Error('User tidak ditemukan');
      }

      // Password verification dengan bcrypt
      const isPasswordValid = await this.verifyPassword(credentials.password, user.password);
      
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
      throw error;
    }
  }

  loginWithLocalStorage(credentials) {
    // Implementation for localStorage fallback
    // ... (existing implementation)
  }
}

// Create and export singleton instance
const apiService = new APIService();
export default apiService;
