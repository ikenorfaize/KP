// EmailService.js - Service untuk auto email
import emailTemplates from './EmailTemplates.js';

class EmailService {
  constructor() {
    // Konfigurasi email EmailJS - Production Ready
    this.emailConfig = {
      serviceId: 'service_ublbpnp', // ✅ Sudah benar dari EmailJS Anda
      templateId: 'template_qnuud6d', // Ganti dengan Template ID untuk admin notification
      publicKey: 'AIgbwO-ayq2i-I0ou', // Ganti dengan Public Key dari dashboard
      adminEmail: 'fairuzo1dyck@gmail.com', // ✅ Email admin yang baru
      isDemoMode: false // Set ke production untuk real email
    };
  }

  // Initialize EmailJS (atau service email lainnya)
  async initEmailService() {
    try {
      if (this.emailConfig.isDemoMode) {
        console.log('📧 Demo Mode: Email service simulation enabled');
        return {
          send: this.mockEmailSend.bind(this),
          init: () => console.log('📧 Mock EmailJS initialized')
        };
      }
      
      // Cek apakah EmailJS sudah tersedia di window (dari CDN)
      if (window.emailjs) {
        console.log('✅ Using EmailJS from window (CDN)');
        
        // ALWAYS re-initialize untuk memastikan public key ter-set
        window.emailjs.init(this.emailConfig.publicKey);
        console.log('🔧 EmailJS re-initialized dengan public key');
        
        // Tambah delay kecil untuk memastikan init selesai
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return window.emailjs;
      }
      
      // Fallback: coba import EmailJS
      try {
        const emailjs = await import('@emailjs/browser');
        emailjs.init(this.emailConfig.publicKey);
        console.log('✅ Using EmailJS from import');
        
        // Tambah delay kecil untuk memastikan init selesai
        await new Promise(resolve => setTimeout(resolve, 100));
        
        return emailjs;
      } catch (importError) {
        console.warn('⚠️ Failed to import EmailJS:', importError.message);
        console.log('📧 Falling back to demo mode');
        return {
          send: this.mockEmailSend.bind(this),
          init: () => console.log('📧 Mock EmailJS initialized (fallback)')
        };
      }
      
    } catch (error) {
      console.error('❌ Failed to initialize email service:', error);
      console.log('📧 Falling back to demo mode');
      return {
        send: this.mockEmailSend.bind(this),
        init: () => console.log('📧 Mock EmailJS initialized (fallback)')
      };
    }
  }

  // Mock email send untuk demo
  async mockEmailSend(serviceId, templateId, emailParams) {
    console.log('📧 DEMO EMAIL SENT:');
    console.log('-------------------');
    console.log('📤 To:', emailParams.to_email);
    console.log('📧 Subject:', emailParams.subject);
    console.log('👤 To Name:', emailParams.to_name);
    console.log('📄 Template ID:', templateId);
    console.log('-------------------');
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
      status: 200,
      text: 'Demo email sent successfully'
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
    console.log('🔄 Starting sendAdminNotification for:', userData.fullName);
    console.log('🔄 Full userData received:', userData);
    
    try {
      // 1. Validasi data penting
      if (!userData.fullName || !userData.email) {
        throw new Error('❌ Data user tidak lengkap: fullName atau email kosong');
      }

      // 2. Validasi konfigurasi email
      console.log('🔧 Admin email target:', this.emailConfig.adminEmail);
      if (!this.emailConfig.adminEmail || this.emailConfig.adminEmail === '') {
        throw new Error('❌ Admin email tidak dikonfigurasi!');
      }

      const emailjs = await this.initEmailService();
      console.log('✅ EmailJS service initialized');
      
      const template = emailTemplates.adminNotification(userData);
      console.log('✅ Email template generated');
      console.log('📧 Template subject:', template.subject);
      console.log('📧 Template HTML length:', template.html ? template.html.length : 0);
      
      const emailParams = {
        to_email: this.emailConfig.adminEmail,
        name: 'Admin PERGUNU',
        applicant_name: userData.fullName,
        applicant_email: userData.email,
        applicant_phone: userData.phone || 'Tidak diisi',
        applicant_position: userData.position || 'Tidak diisi',
        applicant_school: userData.school || 'Tidak diisi',
        applicant_pw: userData.pw || 'Tidak diisi',
        applicant_pc: userData.pc || 'Tidak diisi',
        applicant_education: userData.education || 'Tidak diisi',
        applicant_experience: userData.experience || 'Tidak diisi',
        application_date: new Date().toLocaleDateString('id-ID'),
        reply_to: userData.email
      };

      // 3. Logging detail untuk debugging
      console.log('📧 === EMAIL SENDING DETAILS ===');
      console.log('🎯 Target Email:', emailParams.to_email);
      console.log('🔧 Service ID:', this.emailConfig.serviceId);
      console.log('🔧 Template ID:', this.emailConfig.templateId);
      console.log('🔧 Public Key:', this.emailConfig.publicKey.substring(0, 10) + '...');
      console.log('📧 Subject:', emailParams.subject);
      console.log('📧 Has message_html:', !!emailParams.message_html);
      console.log('📧 Reply to:', emailParams.reply_to);

      // 4. Kirim email
      console.log('📤 Sending email to EmailJS...');
      const result = await emailjs.send(
        this.emailConfig.serviceId,
        this.emailConfig.templateId,
        emailParams
      );

      console.log('✅ === EMAIL SENT SUCCESSFULLY ===');
      console.log('📧 EmailJS Response:', result);
      console.log('📧 Status:', result.status);
      console.log('📧 Response Text:', result.text);
      console.log('🎯 Email should arrive at:', emailParams.to_email);
      
      return { success: true, result, targetEmail: emailParams.to_email };
      
    } catch (error) {
      console.error('❌ === EMAIL SENDING FAILED ===');
      console.error('❌ Error type:', error.name);
      console.error('❌ Error message:', error.message);
      console.error('❌ Error details:', error.text || 'No additional details');
      console.error('❌ Full error object:', error);
      
      return { 
        success: false, 
        error: error.message,
        errorType: error.name,
        fullError: error
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
