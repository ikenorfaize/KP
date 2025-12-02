// EmailService.js - Service untuk mengirim email otomatis menggunakan EmailJS
// File ini mengatur semua fungsi pengiriman email dalam aplikasi PERGUNU
// Digunakan untuk notifikasi approval, rejection, dan pemberitahuan admin

// Import template email yang sudah didefinisikan
import emailTemplates from './EmailTemplates.js';

class EmailService {
  constructor() {
    // Konfigurasi EmailJS - MENGGUNAKAN ENVIRONMENT VARIABLES UNTUK KEAMANAN
    this.emailConfig = {
      serviceId: import.meta.env.VITE_EMAILJS_SERVICE_ID,         // ID service dari EmailJS dashboard
      templateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,       // ID template email yang akan digunakan
      publicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,       // Public key untuk autentikasi EmailJS
      adminEmail: import.meta.env.VITE_ADMIN_EMAIL, // Email admin yang menerima notifikasi
      isDemoMode: import.meta.env.VITE_DEMO_MODE === 'true' || false                     // Set true untuk testing tanpa mengirim email sungguhan
    };
    
    // Konfigurasi retry untuk mengulang pengiriman jika gagal
    this.retryConfig = {
      maxRetries: 3,      // Maksimal 3 kali percobaan
      retryDelay: 2000,   // Jeda 2 detik antar percobaan
      timeoutMs: 30000    // Timeout 30 detik per percobaan
    };
    
    // Flag untuk menampilkan log debugging di console
    this.debugMode = import.meta.env.VITE_APP_DEBUG_MODE === 'true' || true;
    
    // Validasi environment variables yang diperlukan
    this.validateEnvironmentVariables();
    
    // Additional template IDs untuk berbagai keperluan
    this.templates = {
      admin: import.meta.env.VITE_EMAILJS_ADMIN_TEMPLATE_ID,
      approval: import.meta.env.VITE_EMAILJS_APPROVAL_TEMPLATE_ID,
      rejection: import.meta.env.VITE_EMAILJS_REJECTION_TEMPLATE_ID
    };
  }

  // Validasi environment variables yang diperlukan
  validateEnvironmentVariables() {
    const required = {
      'VITE_EMAILJS_SERVICE_ID': this.emailConfig.serviceId,
      'VITE_EMAILJS_TEMPLATE_ID': this.emailConfig.templateId,
      'VITE_EMAILJS_PUBLIC_KEY': this.emailConfig.publicKey,
      'VITE_ADMIN_EMAIL': this.emailConfig.adminEmail
    };

    const missing = [];
    for (const [key, value] of Object.entries(required)) {
      if (!value || value.trim() === '') {
        missing.push(key);
      }
    }

    if (missing.length > 0) {
      console.error('❌ Missing required environment variables:', missing);
      console.error('⚠️ Please check your .env file and ensure these variables are set properly.');
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    console.log('✅ All required environment variables are present');
  }

  // Fungsi inisialisasi EmailJS dengan penanganan error yang lebih baik
  async initEmailService() {
    console.log('🔧 === MEMULAI INISIALISASI EMAILJS ===');
    
    // Log konfigurasi yang digunakan (sembunyikan sebagian public key untuk keamanan)
    console.log('🔧 Konfigurasi yang digunakan:', {
      serviceId: this.emailConfig.serviceId,
      templateId: this.emailConfig.templateId,
      publicKey: this.emailConfig.publicKey?.substring(0, 8) + '...', // Hide full key for security
      adminEmail: this.emailConfig.adminEmail
    });
    
    try {
      // Jika dalam demo mode, gunakan mock service
      if (this.emailConfig.isDemoMode) {
        console.log('📧 Demo Mode Active - Using mock email service');
        return { send: this.mockEmailSend.bind(this) };
      }
      
      // Check apakah EmailJS tersedia di window (CDN)
      if (typeof window !== 'undefined' && window.emailjs) {
        console.log('✅ EmailJS found in window (CDN)');
        console.log('📦 EmailJS methods available:', Object.keys(window.emailjs));
        
        // Verifikasi semua konfigurasi yang diperlukan sudah ada
        const missingConfig = [];
        if (!this.emailConfig.publicKey) missingConfig.push('publicKey');
        if (!this.emailConfig.serviceId) missingConfig.push('serviceId');
        if (!this.emailConfig.templateId) missingConfig.push('templateId');
        if (!this.emailConfig.adminEmail) missingConfig.push('adminEmail');
        
        if (missingConfig.length > 0) {
          throw new Error(`Missing EmailJS configuration: ${missingConfig.join(', ')}`);
        }
        
        // Initialize EmailJS with public key
        console.log('🔧 Initializing EmailJS with public key...');
        console.log('🔑 Public key:', this.emailConfig.publicKey);
        
        window.emailjs.init(this.emailConfig.publicKey);
        
        // Wait a moment for initialization
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Test EmailJS availability
        if (typeof window.emailjs.send !== 'function') {
          throw new Error('EmailJS send method not available after initialization');
        }
        
        console.log('✅ EmailJS initialized successfully');
        console.log('📧 Send method type:', typeof window.emailjs.send);
        
        return window.emailjs;
      }
      
      // Fallback: Try importing EmailJS
      console.log('📦 EmailJS not in window, attempting import...');
      const emailjs = await import('@emailjs/browser');
      
      if (!emailjs || !emailjs.send) {
        throw new Error('EmailJS import failed or send method not available');
      }
      
      emailjs.init(this.emailConfig.publicKey);
      console.log('✅ EmailJS imported and initialized');
      return emailjs;
      
    } catch (error) {
      console.error('❌ EmailJS initialization failed:', error);
      
      // Return mock service as fallback
      console.log('📧 Falling back to demo mode due to initialization failure');
      return { 
        send: this.mockEmailSend.bind(this),
        isFallback: true,
        initError: error.message
      };
    }
  }

  // Enhanced mock email dengan realistic behavior
  async mockEmailSend(serviceId, templateId, emailParams) {
    console.log('📧 === MOCK EMAIL SERVICE (DEMO MODE) ===');
    console.log('🎯 To:', emailParams.to_email);
    console.log('📧 Subject: New PERGUNU Registration');
    console.log('👤 Applicant:', emailParams.applicant_name);
    console.log('📱 Email:', emailParams.applicant_email);
    console.log('📞 Phone:', emailParams.applicant_phone);
    console.log('🏫 School:', emailParams.applicant_school);
    console.log('📋 Template ID:', templateId);
    console.log('🔧 Service ID:', serviceId);
    console.log('⚠️ NOTE: This is MOCK mode - no real email sent!');
    
    // Simulate realistic email delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
      status: 200,
      text: 'Mock email sent successfully - CHECK YOUR EMAILJS CONFIG!',
      timestamp: new Date().toISOString()
    };
  }

  // Kirim email approval ke user
  async sendApprovalEmail(userData) {
    try {
      const emailjs = await this.initEmailService();
      const template = emailTemplates.approvalEmail(userData);
      
      const emailParams = {
        to_email: userData.email,
        to_name: userData.fullName,
        subject: template.subject,
        message_html: template.html,
        username: userData.username,
        password: userData.password
      };

      const result = await emailjs.send(
        this.emailConfig.serviceId,
        this.emailConfig.templateId,
        emailParams
      );

      console.log('✅ Approval email sent successfully:', result);
      return { success: true, result };
      
    } catch (error) {
      console.error('❌ Failed to send approval email:', error);
      return { success: false, error: error.message };
    }
  }

  // Kirim email rejection ke user
  async sendRejectionEmail(userData, reason) {
    try {
      const emailjs = await this.initEmailService();
      const template = emailTemplates.rejectionEmail(userData, reason);
      
      const emailParams = {
        to_email: userData.email,
        to_name: userData.fullName,
        subject: template.subject,
        message_html: template.html,
        rejection_reason: reason
      };

      const result = await emailjs.send(
        this.emailConfig.serviceId,
        'rejection_template_id', // Template khusus untuk rejection
        emailParams
      );

      console.log('✅ Rejection email sent successfully:', result);
      return { success: true, result };
      
    } catch (error) {
      console.error('❌ Failed to send rejection email:', error);
      return { success: false, error: error.message };
    }
  }

  // Kirim notifikasi ke admin untuk pendaftaran baru
  async sendAdminNotification(userData) {
    console.log('📧 === ENHANCED ADMIN NOTIFICATION DEBUG ===');
    console.log('🎯 Target email:', this.emailConfig.adminEmail);
    console.log('👤 Applicant:', userData.fullName);
    console.log('📧 EmailJS Config Check:');
    console.log('   Service ID:', this.emailConfig.serviceId);
    console.log('   Template ID:', this.emailConfig.templateId);
    console.log('   Public Key:', this.emailConfig.publicKey?.substring(0, 12) + '...');
    console.log('   Demo Mode:', this.emailConfig.isDemoMode);
    
    const startTime = Date.now();
    
    try {
      // Validate input data
      if (!userData.fullName?.trim() || !userData.email?.trim()) {
        throw new Error('Required user data missing (fullName or email)');
      }
      
      // Validate email configuration
      if (!this.emailConfig.adminEmail) {
        throw new Error('Admin email not configured');
      }
      
      // Initialize EmailJS
      console.log('🔧 Initializing EmailJS service...');
      const emailjs = await this.initEmailService();
      
      if (emailjs.isFallback) {
        console.log('⚠️ Using fallback mock service due to:', emailjs.initError);
        console.log('❌ REAL EMAIL WILL NOT BE SENT!');
      } else {
        console.log('✅ EmailJS service initialized for REAL email sending');
      }
      
      // Prepare comprehensive email parameters
      const emailParams = {
        // REQUIRED: Template variables untuk EmailJS
        to_email: this.emailConfig.adminEmail,
        to_name: 'Admin PERGUNU',
        from_name: 'PERGUNU Registration System',
        reply_to: userData.email,
        
        // Applicant data dengan fallback
        applicant_name: userData.fullName || 'Tidak diisi',
        applicant_email: userData.email || 'Tidak diisi',
        applicant_phone: userData.phone || 'Tidak diisi',
        applicant_position: userData.position || 'Tidak diisi',
        applicant_school: userData.school || 'Tidak diisi',
        applicant_pw: userData.pw || 'Tidak diisi',
        applicant_pc: userData.pc || 'Tidak diisi',
        applicant_education: userData.education || 'Tidak diisi',
        applicant_experience: userData.experience || 'Tidak diisi',
        
        // System data
        application_date: new Date().toLocaleDateString('id-ID', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        submission_time: new Date().toISOString(),
        
        // Message content
        subject: `🔔 Pendaftaran Baru PERGUNU - ${userData.fullName}`,
        message: `Pendaftaran baru dari ${userData.fullName} (${userData.email}) memerlukan review Anda.`,
        
        // Additional debugging info
        debug_info: `Sent via EmailJS at ${new Date().toISOString()}`,
        system_info: 'PERGUNU Registration System v1.0'
      };
      
      console.log('📧 === EMAIL PARAMETERS PREPARED ===');
      console.log('📤 Parameters count:', Object.keys(emailParams).length);
      console.log('📧 Key parameters:');
      console.log('   To Email:', emailParams.to_email);
      console.log('   Applicant Name:', emailParams.applicant_name);
      console.log('   Applicant Email:', emailParams.applicant_email);
      console.log('   Subject:', emailParams.subject);
      
      // Send email with retry mechanism
      let lastError;
      for (let attempt = 1; attempt <= this.retryConfig.maxRetries; attempt++) {
        console.log(`📤 === EMAIL SEND ATTEMPT ${attempt}/${this.retryConfig.maxRetries} ===`);
        
        try {
          // Create timeout promise
          const timeoutPromise = new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`EmailJS timeout after ${this.retryConfig.timeoutMs}ms`)), 
              this.retryConfig.timeoutMs)
          );
          
          // Create send promise dengan debugging
          console.log('📤 Calling emailjs.send with:');
          console.log('   Service ID:', this.emailConfig.serviceId);
          console.log('   Template ID:', this.emailConfig.templateId);
          console.log('   Parameters keys:', Object.keys(emailParams));
          
          const sendPromise = emailjs.send(
            this.emailConfig.serviceId,
            this.emailConfig.templateId,
            emailParams
          );
          
          // Race between send and timeout
          const result = await Promise.race([sendPromise, timeoutPromise]);
          
          const duration = Date.now() - startTime;
          
          console.log('✅ === EMAIL SENT SUCCESSFULLY ===');
          console.log('📧 EmailJS Response:');
          console.log('   Status:', result.status);
          console.log('   Text:', result.text);
          console.log('   Duration:', duration + 'ms');
          console.log('   Attempt:', attempt);
          console.log('🎯 Email details:');
          console.log('   Sent to:', this.emailConfig.adminEmail);
          console.log('   About:', userData.fullName);
          console.log('   Service used:', this.emailConfig.serviceId);
          console.log('   Template used:', this.emailConfig.templateId);
          
          return {
            success: true,
            result: result,
            targetEmail: this.emailConfig.adminEmail,
            applicantName: userData.fullName,
            attempt: attempt,
            duration: duration,
            timestamp: new Date().toISOString(),
            emailParams: emailParams,
            serviceId: this.emailConfig.serviceId,
            templateId: this.emailConfig.templateId
          };
          
        } catch (attemptError) {
          console.error(`❌ Attempt ${attempt} failed:`, attemptError);
          console.error('❌ Error details:');
          console.error('   Name:', attemptError.name);
          console.error('   Message:', attemptError.message);
          console.error('   Status:', attemptError.status);
          console.error('   Text:', attemptError.text);
          
          lastError = attemptError;
          
          if (attempt < this.retryConfig.maxRetries) {
            const delay = this.retryConfig.retryDelay * attempt;
            console.log(`⏳ Waiting ${delay}ms before retry...`);
            await new Promise(resolve => setTimeout(resolve, delay));
          }
        }
      }
      
      // All attempts failed
      throw lastError;
      
    } catch (error) {
      const duration = Date.now() - startTime;
      
      console.error('❌ === EMAIL SENDING COMPLETELY FAILED ===');
      console.error('❌ Final error details:');
      console.error('   Type:', error.name);
      console.error('   Message:', error.message);
      console.error('   Duration:', duration + 'ms');
      console.error('   Stack:', error.stack);
      
      // Classify error for better debugging
      let errorCategory = 'unknown';
      let troubleshootTips = [];
      
      const errorMsg = error.message || error.text || '';
      
      if (errorMsg.includes('timeout')) {
        errorCategory = 'timeout';
        troubleshootTips = [
          'Check your internet connection',
          'EmailJS service might be slow',
          'Try increasing timeout value'
        ];
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
        errorCategory = 'network';
        troubleshootTips = [
          'Check internet connection',
          'Verify firewall/antivirus settings',
          'Check if EmailJS domain is blocked'
        ];
      } else if (error.status === 412) {
        errorCategory = 'gmail_reconnect';
        troubleshootTips = [
          '⚠️ URGENT: Gmail connection expired!',
          '1. Go to https://dashboard.emailjs.com/',
          '2. Click "Email Services"',
          '3. Select service: service_ublbpnp',
          '4. Click "Reconnect Gmail"',
          '5. Authorize EmailJS again',
          'Error: ' + (error.text || 'Invalid grant')
        ];
      } else if (error.status === 400) {
        errorCategory = 'bad_request';
        troubleshootTips = [
          'Check template parameters',
          'Verify template exists and is published',
          'Check service configuration'
        ];
      } else if (error.status === 401 || error.status === 403) {
        errorCategory = 'authentication';
        troubleshootTips = [
          'Verify public key is correct',
          'Check service ID is correct',
          'Ensure service is active in EmailJS dashboard'
        ];
      } else if (error.status === 429) {
        errorCategory = 'rate_limit';
        troubleshootTips = [
          'Too many emails sent',
          'Wait before sending again',
          'Check EmailJS usage limits'
        ];
      }
      
      console.error('📋 Troubleshooting tips:', troubleshootTips);
      
      return {
        success: false,
        error: error.message,
        errorType: error.name,
        errorCategory: errorCategory,
        errorStatus: error.status,
        duration: duration,
        timestamp: new Date().toISOString(),
        troubleshootTips: troubleshootTips,
        configUsed: {
          serviceId: this.emailConfig.serviceId,
          templateId: this.emailConfig.templateId,
          adminEmail: this.emailConfig.adminEmail,
          publicKey: this.emailConfig.publicKey?.substring(0, 8) + '...'
        },
        fullError: {
          name: error.name,
          message: error.message,
          stack: error.stack,
          status: error.status,
          text: error.text
        }
      };
    }
  }

  // Generate username otomatis
  generateUsername(fullName) {
    // Buat username dari nama lengkap
    const cleanName = fullName
      .toLowerCase()
      .replace(/[^a-z\s]/g, '') // Hapus karakter special
      .replace(/\s+/g, '_') // Ganti spasi dengan underscore
      .substring(0, 15); // Batasi panjang
    
    // Tambah random number untuk uniqueness
    const randomNum = Math.floor(Math.random() * 1000);
    return `${cleanName}_${randomNum}`;
  }

  // Generate password otomatis
  generatePassword() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < 8; i++) {
      password += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return password;
  }

  // Proses approval dengan auto-email
  async processApproval(userData, adminAction = 'approve') {
    try {
      if (adminAction === 'approve') {
        // Generate credentials
        const username = this.generateUsername(userData.fullName);
        const password = this.generatePassword();
        
        const userWithCredentials = {
          ...userData,
          username,
          password
        };

        // Kirim email approval
        const emailResult = await this.sendApprovalEmail(userWithCredentials);
        
        if (emailResult.success) {
          console.log('✅ User approved and email sent:', userWithCredentials);
          return {
            success: true,
            user: userWithCredentials,
            message: 'User berhasil disetujui dan email credentials telah dikirim'
          };
        } else {
          throw new Error('Failed to send approval email');
        }
      } else {
        // Process rejection
        const reason = userData.rejectionReason || 'Data tidak lengkap atau tidak sesuai kriteria';
        const emailResult = await this.sendRejectionEmail(userData, reason);
        
        return {
          success: true,
          message: 'User ditolak dan email pemberitahuan telah dikirim'
        };
      }
    } catch (error) {
      console.error('❌ Failed to process approval:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Export singleton instance
export const emailService = new EmailService();
export default EmailService;
