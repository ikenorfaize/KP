// EmailConfigChecker.js - Service untuk validasi konfigurasi EmailJS
class EmailConfigChecker {
  
  // Validasi konfigurasi EmailJS
  validateConfig(config) {
    console.log('🔍 === VALIDATING EMAILJS CONFIG ===');
    
    const validation = {
      valid: true,
      errors: [],
      warnings: []
    };
    
    // Check required fields
    if (!config.serviceId) {
      validation.errors.push('Service ID is missing');
      validation.valid = false;
    } else if (!config.serviceId.startsWith('service_')) {
      validation.warnings.push('Service ID should start with "service_"');
    }
    
    if (!config.templateId) {
      validation.errors.push('Template ID is missing');
      validation.valid = false;
    } else if (!config.templateId.startsWith('template_')) {
      validation.warnings.push('Template ID should start with "template_"');
    }
    
    if (!config.publicKey) {
      validation.errors.push('Public Key is missing');
      validation.valid = false;
    } else if (config.publicKey.length < 10) {
      validation.warnings.push('Public Key seems too short');
    }
    
    if (!config.adminEmail) {
      validation.errors.push('Admin email is missing');
      validation.valid = false;
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(config.adminEmail)) {
        validation.errors.push('Admin email format is invalid');
        validation.valid = false;
      }
    }
    
    console.log('📋 Config validation result:', validation);
    return validation;
  }
  
  // Test EmailJS service accessibility
  async checkEmailJSService(serviceId, publicKey) {
    console.log('🔧 === CHECKING EMAILJS SERVICE ACCESSIBILITY ===');
    
    try {
      // Check if EmailJS is available
      if (typeof window === 'undefined' || !window.emailjs) {
        return {
          accessible: false,
          error: 'EmailJS not loaded in window',
          suggestion: 'Check if EmailJS CDN is loaded'
        };
      }
      
      // Check if required methods exist
      if (typeof window.emailjs.send !== 'function') {
        return {
          accessible: false,
          error: 'EmailJS send method not available',
          suggestion: 'EmailJS might not be properly initialized'
        };
      }
      
      if (typeof window.emailjs.init !== 'function') {
        return {
          accessible: false,
          error: 'EmailJS init method not available',
          suggestion: 'Wrong EmailJS version or CDN issue'
        };
      }
      
      // Try to initialize (this is safe to call multiple times)
      try {
        window.emailjs.init(publicKey);
      } catch (initError) {
        return {
          accessible: false,
          error: `EmailJS initialization failed: ${initError.message}`,
          suggestion: 'Check if public key is correct'
        };
      }
      
      console.log('✅ EmailJS service appears accessible');
      return {
        accessible: true,
        message: 'EmailJS service is accessible',
        methods: Object.keys(window.emailjs)
      };
      
    } catch (error) {
      console.error('❌ Service check failed:', error);
      return {
        accessible: false,
        error: error.message,
        suggestion: 'Check console for detailed error'
      };
    }
  }
  
  // Generate troubleshooting report
  generateTroubleshootingReport(emailResult, config) {
    console.log('📋 === GENERATING TROUBLESHOOTING REPORT ===');
    
    const report = {
      timestamp: new Date().toISOString(),
      success: emailResult.success,
      recommendations: []
    };
    
    if (emailResult.success) {
      report.recommendations.push('✅ Email sent successfully - no issues detected');
      return report;
    }
    
    // Analyze error and provide specific recommendations
    const error = emailResult.error || '';
    const errorType = emailResult.errorType || '';
    const errorCategory = emailResult.errorCategory || '';
    
    // Network issues
    if (errorCategory === 'network' || error.includes('fetch') || error.includes('network')) {
      report.recommendations.push('🌐 Check your internet connection');
      report.recommendations.push('🔥 Disable firewall/antivirus temporarily to test');
      report.recommendations.push('🚫 Check if domain "api.emailjs.com" is blocked');
      report.recommendations.push('📱 Try from different network (mobile hotspot)');
    }
    
    // Timeout issues
    if (errorCategory === 'timeout' || error.includes('timeout')) {
      report.recommendations.push('⏰ EmailJS service might be slow - try again later');
      report.recommendations.push('🔄 Increase timeout value in email service');
      report.recommendations.push('📡 Check EmailJS service status at https://status.emailjs.com');
    }
    
    // Authentication issues
    if (errorCategory === 'authentication' || errorType === 'Unauthorized') {
      report.recommendations.push('🔑 Verify Public Key in EmailJS dashboard');
      report.recommendations.push('🆔 Verify Service ID is correct');
      report.recommendations.push('✅ Ensure EmailJS service is active');
      report.recommendations.push('🔄 Try regenerating Public Key');
    }
    
    // Template issues
    if (errorCategory === 'bad_request' || error.includes('template')) {
      report.recommendations.push('📋 Check if template exists in EmailJS dashboard');
      report.recommendations.push('📝 Verify template ID is correct');
      report.recommendations.push('🔄 Ensure template is published/active');
      report.recommendations.push('📧 Check template variables match parameters');
    }
    
    // Rate limiting
    if (errorCategory === 'rate_limit') {
      report.recommendations.push('⏳ Wait a few minutes before sending again');
      report.recommendations.push('📊 Check EmailJS usage limits in dashboard');
      report.recommendations.push('💳 Consider upgrading EmailJS plan if needed');
    }
    
    // General recommendations if no specific category
    if (report.recommendations.length === 0) {
      report.recommendations.push('🔧 Check EmailJS dashboard for service status');
      report.recommendations.push('📋 Verify all configuration values');
      report.recommendations.push('🔄 Try manual test from EmailJS dashboard');
      report.recommendations.push('📧 Contact EmailJS support if issue persists');
    }
    
    // Always add config verification
    report.recommendations.push('⚙️ Current config: Service=' + config.serviceId + ', Template=' + config.templateId);
    
    console.log('📊 Troubleshooting report generated:', report);
    return report;
  }
  
  // Quick config summary
  getConfigSummary(config) {
    return {
      serviceId: config.serviceId || 'NOT SET',
      templateId: config.templateId || 'NOT SET',
      adminEmail: config.adminEmail || 'NOT SET',
      publicKeyPresent: !!config.publicKey,
      demoMode: config.isDemoMode || false
    };
  }
}

// Export singleton instance
export const emailConfigChecker = new EmailConfigChecker();
export default EmailConfigChecker;
