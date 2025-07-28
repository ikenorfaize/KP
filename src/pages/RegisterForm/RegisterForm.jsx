import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '../../services/EmailService';
import { emailConfigChecker } from '../../services/EmailConfigChecker';
import './RegisterForm.css';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    position: '',
    school: '',
    pw: '', // Pengurus Wilayah
    pc: '', // Pengurus Cabang
    experience: '',
    education: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [debugMode, setDebugMode] = useState(true);
  const [lastError, setLastError] = useState(null);
  const [configCheck, setConfigCheck] = useState(null);

  // Improved error handling and debug system
  useEffect(() => {
    console.log('🛡️ === IMPROVED DEBUG SYSTEM ACTIVE ===');
    
    // Enhanced global error handler dengan better persistence
    const originalConsoleError = console.error;
    console.error = (...args) => {
      // Call original console.error
      originalConsoleError.apply(console, args);
      
      // Save to localStorage with timestamp
      const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'console_error',
        args: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ),
        formData: formData,
        isSubmitting: isSubmitting,
        url: window.location.href
      };
      
      // Append to existing errors instead of overwriting
      const existingErrors = JSON.parse(localStorage.getItem('pergunu_error_log') || '[]');
      existingErrors.push(errorLog);
      
      // Keep only last 50 errors to prevent storage overflow
      if (existingErrors.length > 50) {
        existingErrors.splice(0, existingErrors.length - 50);
      }
      
      localStorage.setItem('pergunu_error_log', JSON.stringify(existingErrors));
      setLastError(errorLog);
    };

    // Enhanced unhandled promise rejection handler
    const handleUnhandledRejection = (event) => {
      const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'unhandled_promise_rejection',
        reason: String(event.reason),
        stack: event.reason?.stack,
        formData: formData,
        isSubmitting: isSubmitting,
        url: window.location.href
      };
      
      const existingErrors = JSON.parse(localStorage.getItem('pergunu_error_log') || '[]');
      existingErrors.push(errorLog);
      localStorage.setItem('pergunu_error_log', JSON.stringify(existingErrors));
      
      console.error('🚨 Unhandled Promise Rejection:', errorLog);
      setLastError(errorLog);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Smart beforeunload - ONLY prevent if actively submitting
    const handleBeforeUnload = (e) => {
      if (isSubmitting) {
        console.log('⚠️ PREVENTING REFRESH: Form submission in progress');
        e.preventDefault();
        e.returnValue = '🚨 Form sedang diproses. Yakin mau keluar?';
        return e.returnValue;
      }
      // Allow navigation if not submitting
      console.log('✅ ALLOWING NAVIGATION: No active submission');
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      console.error = originalConsoleError; // Restore original console.error
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      console.log('🧹 Debug system cleaned up');
    };
  }, [isSubmitting, formData]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 === FORM SUBMISSION STARTED ===');
    console.log('📋 Form data:', formData);
    
    // Save initial debug state
    const debugSession = {
      sessionId: Date.now(),
      startTime: new Date().toISOString(),
      formData: formData,
      step: 'validation',
      logs: []
    };
    
    localStorage.setItem('pergunu_debug_session', JSON.stringify(debugSession));
    
    // Set submitting state FIRST to activate anti-refresh
    setIsSubmitting(true);
    
    try {
      // Enhanced validation
      console.log('🔍 === VALIDATION STEP ===');
      debugSession.logs.push({ time: new Date().toISOString(), step: 'validation_start' });
      
      if (!formData.fullName?.trim()) {
        throw new Error('Nama Lengkap wajib diisi');
      }
      
      if (!formData.email?.trim()) {
        throw new Error('Email wajib diisi');
      }
      
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Format email tidak valid');
      }
      
      console.log('✅ Validation passed');
      debugSession.step = 'database_save';
      debugSession.logs.push({ time: new Date().toISOString(), step: 'validation_passed' });
      localStorage.setItem('pergunu_debug_session', JSON.stringify(debugSession));
      
      // Database save with enhanced error handling
      console.log('📡 === DATABASE SAVE STEP ===');
      
      const applicationData = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        processedAt: null,
        credentials: null
      };

      console.log('📤 Saving to database...');
      debugSession.logs.push({ time: new Date().toISOString(), step: 'database_request_start' });
      
      const dbResponse = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });
      
      debugSession.logs.push({ 
        time: new Date().toISOString(), 
        step: 'database_response', 
        status: dbResponse.status,
        ok: dbResponse.ok 
      });
      
      if (!dbResponse.ok) {
        const errorText = await dbResponse.text().catch(() => 'Unknown error');
        throw new Error(`Database error: ${dbResponse.status} - ${errorText}`);
      }
      
      const dbResult = await dbResponse.json();
      console.log('✅ Database save successful, ID:', dbResult.id);
      
      debugSession.step = 'email_sending';
      debugSession.dbResult = { id: dbResult.id, success: true };
      debugSession.logs.push({ time: new Date().toISOString(), step: 'database_save_success', id: dbResult.id });
      localStorage.setItem('pergunu_debug_session', JSON.stringify(debugSession));
      
      // Email sending with comprehensive error handling
      console.log('📧 === EMAIL SENDING STEP ===');
      
      let emailResult = { success: false, error: 'Not attempted' };
      
      try {
        console.log('📤 Attempting to send admin notification...');
        debugSession.logs.push({ time: new Date().toISOString(), step: 'email_request_start' });
        
        // Add timeout to email sending
        const emailPromise = emailService.sendAdminNotification(formData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout after 45 seconds')), 45000)
        );
        
        emailResult = await Promise.race([emailPromise, timeoutPromise]);
        
        debugSession.emailResult = emailResult;
        debugSession.logs.push({ 
          time: new Date().toISOString(), 
          step: 'email_result', 
          success: emailResult.success,
          error: emailResult.error || null 
        });
        
        console.log('📧 Email result:', emailResult);
        
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        emailResult = {
          success: false,
          error: emailError.message,
          errorType: emailError.name,
          stack: emailError.stack
        };
        
        debugSession.emailResult = emailResult;
        debugSession.logs.push({ 
          time: new Date().toISOString(), 
          step: 'email_error', 
          error: emailError.message,
          type: emailError.name 
        });
      }
      
      // Final success handling
      debugSession.step = 'completed';
      debugSession.endTime = new Date().toISOString();
      localStorage.setItem('pergunu_debug_session', JSON.stringify(debugSession));
      
      console.log('🎉 === SUBMISSION COMPLETED ===');
      console.log('💾 Database saved:', dbResult.id);
      console.log('📧 Email result:', emailResult.success ? 'Success' : `Failed: ${emailResult.error}`);
      
      // Show comprehensive result
      if (emailResult.success) {
        alert(`✅ PENDAFTARAN BERHASIL LENGKAP!

📊 Database: ✅ Tersimpan (ID: ${dbResult.id})
📧 Email Admin: ✅ Terkirim ke fairuzo1dyck@gmail.com
📱 Status EmailJS: ${emailResult.result?.status || 'OK'}

🎉 Admin akan segera memproses pendaftaran Anda!
💌 Cek email Anda untuk konfirmasi.`);
      } else {
        alert(`⚠️ PENDAFTARAN TERSIMPAN, EMAIL GAGAL

✅ Database: Tersimpan dengan ID ${dbResult.id}
❌ Email Admin: GAGAL TERKIRIM

Error: ${emailResult.error}
Type: ${emailResult.errorType || 'Unknown'}

💡 Data Anda sudah aman tersimpan.
🔧 Kami akan mengirim ulang notifikasi email secara manual.`);
      }
      
      setSubmitStatus('success');
      
    } catch (mainError) {
      console.error('❌ === MAIN SUBMISSION ERROR ===', mainError);
      
      debugSession.step = 'main_error';
      debugSession.mainError = {
        name: mainError.name,
        message: mainError.message,
        stack: mainError.stack
      };
      debugSession.endTime = new Date().toISOString();
      localStorage.setItem('pergunu_debug_session', JSON.stringify(debugSession));
      
      setLastError({
        timestamp: new Date().toISOString(),
        type: 'main_submission_error',
        name: mainError.name,
        message: mainError.message,
        stack: mainError.stack,
        formData: formData
      });
      
      alert(`❌ PENDAFTARAN GAGAL!

Error: ${mainError.message}
Type: ${mainError.name}

🔍 Detail error tersimpan untuk analisis
💡 Silakan coba lagi atau hubungi admin`);
      
      setSubmitStatus('error');
      
    } finally {
      // Delay before releasing submit state untuk memastikan proses selesai
      setTimeout(() => {
        setIsSubmitting(false);
        console.log('✅ Form submission state released');
      }, 2000);
    }
  };

  // Add config check function
  const checkEmailConfig = async () => {
    console.log('🔍 === CHECKING EMAIL CONFIGURATION ===');
    setConfigCheck({ status: 'checking', message: 'Checking EmailJS configuration...' });
    
    try {
      // Get current config
      const config = emailService.emailConfig;
      
      // Validate configuration
      const validation = emailConfigChecker.validateConfig(config);
      console.log('📋 Config validation:', validation);
      
      // Check service accessibility
      const serviceCheck = await emailConfigChecker.checkEmailJSService(
        config.serviceId, 
        config.publicKey
      );
      console.log('🔧 Service check:', serviceCheck);
      
      // Generate report
      const report = {
        validation,
        serviceCheck,
        config: {
          serviceId: config.serviceId,
          templateId: config.templateId,
          adminEmail: config.adminEmail,
          publicKey: config.publicKey?.substring(0, 8) + '...'
        }
      };
      
      console.log('📊 Complete config check report:', report);
      
      if (validation.valid && serviceCheck.accessible) {
        setConfigCheck({ 
          status: 'success', 
          message: '✅ EmailJS configuration looks good!',
          report 
        });
      } else {
        setConfigCheck({ 
          status: 'warning', 
          message: '⚠️ Configuration issues found - check console',
          report 
        });
      }
      
    } catch (error) {
      console.error('❌ Config check failed:', error);
      setConfigCheck({ 
        status: 'error', 
        message: `❌ Config check failed: ${error.message}`,
        error: error.message 
      });
    }
  };

  if (submitStatus === 'success') {
    return (
      <div className="register-form-container">
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h2>Pendaftaran Berhasil!</h2>
          <p>Terima kasih telah mendaftar di PERGUNU.</p>
          <p>Tim admin akan meninjau pendaftaran Anda dan mengirimkan email konfirmasi dalam 1-2 hari kerja.</p>
          <p><strong>📧 Email notification telah dikirim ke admin.</strong></p>
          <button 
            onClick={() => navigate('/')}
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0F7536',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            🏠 Kembali ke Homepage
          </button>
        </div>
      </div>
    );
  }

  if (submitStatus === 'error') {
    return (
      <div className="register-form-container">
        <div className="error-message">
          <div className="error-icon">❌</div>
          <h2>Terjadi Kesalahan</h2>
          <p>Maaf, terjadi kesalahan saat mengirim pendaftaran Anda.</p>
          <button onClick={() => setSubmitStatus(null)} className="retry-button">
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="register-form-container">
      {/* Enhanced Debug Panel */}
      {debugMode && (
        <div style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          background: '#1a1a1a',
          color: '#00ff00',
          padding: '12px',
          borderRadius: '8px',
          fontSize: '12px',
          fontFamily: 'Consolas, monospace',
          zIndex: 9999,
          maxWidth: '350px',
          border: '2px solid #0F7536',
          maxHeight: '500px',
          overflowY: 'auto'
        }}>
          <div style={{color: '#00ff00', fontWeight: 'bold', marginBottom: '8px'}}>
            🔧 ENHANCED DEBUG MODE
          </div>
          <div>📊 Submitting: {isSubmitting ? '🔄 ACTIVE' : '✅ READY'}</div>
          <div>📋 Form Fields: {Object.keys(formData).filter(k => formData[k]).length}/9 filled</div>
          <div>🕒 Time: {new Date().toLocaleTimeString()}</div>
          
          {/* Email Config Status */}
          {configCheck && (
            <div style={{
              margin: '8px 0',
              padding: '6px',
              border: '1px solid #333',
              borderRadius: '4px',
              background: configCheck.status === 'success' ? '#1a4a1a' : 
                         configCheck.status === 'warning' ? '#4a4a1a' : '#4a1a1a'
            }}>
              <div style={{fontSize: '11px', fontWeight: 'bold'}}>
                📧 EmailJS Status:
              </div>
              <div style={{fontSize: '10px'}}>{configCheck.message}</div>
            </div>
          )}
          
          <div style={{margin: '8px 0', borderTop: '1px solid #333', paddingTop: '8px'}}>
            <button 
              onClick={checkEmailConfig}
              style={{
                background: '#7c3aed',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4px',
                marginBottom: '4px'
              }}
            >
              🔍 Check EmailJS Config
            </button>
            
            <button 
              onClick={() => {
                const session = localStorage.getItem('pergunu_debug_session');
                const errors = localStorage.getItem('pergunu_error_log');
                
                console.log('=== DEBUG SESSION DATA ===');
                if (session) {
                  const sessionData = JSON.parse(session);
                  console.log('📊 Session:', sessionData);
                  console.log('📋 Steps completed:', sessionData.logs?.length || 0);
                  console.log('⏱️ Duration:', sessionData.endTime ? 
                    ((new Date(sessionData.endTime) - new Date(sessionData.startTime)) / 1000) + 's' : 'In progress');
                }
                
                console.log('=== ERROR LOG ===');
                if (errors) {
                  const errorData = JSON.parse(errors);
                  console.log('🚨 Total errors:', errorData.length);
                  errorData.forEach((error, index) => {
                    console.log(`Error ${index + 1}:`, error);
                  });
                }
                
                console.log('=== CONFIG CHECK ===');
                if (configCheck) {
                  console.log('📧 Config check result:', configCheck);
                }
                
                alert(`Debug data logged to console!\n\nSession: ${session ? 'Found' : 'None'}\nErrors: ${errors ? JSON.parse(errors).length : 0} logged\nConfig: ${configCheck ? configCheck.status : 'Not checked'}`);
              }}
              style={{
                background: '#0F7536',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4px',
                marginBottom: '4px'
              }}
            >
              📊 Show All Debug
            </button>
            
            <button 
              onClick={async () => {
                if (!formData.fullName || !formData.email) {
                  alert('❌ Please fill Name and Email first for manual test');
                  return;
                }
                
                console.log('🧪 === MANUAL EMAIL TEST WITH FULL DEBUG ===');
                try {
                  // First check config
                  await checkEmailConfig();
                  
                  // Then try sending
                  const result = await emailService.sendAdminNotification(formData);
                  console.log('📧 Manual test result:', result);
                  
                  // Generate troubleshooting report
                  const report = emailConfigChecker.generateTroubleshootingReport(
                    result, 
                    emailService.emailConfig
                  );
                  console.log('📋 Troubleshooting report:', report);
                  
                  const message = result.success ? 
                    `✅ Email Test SUCCESSFUL!\n\nSent to: fairuzo1dyck@gmail.com\nEmailJS Status: ${result.result?.status}\nDuration: ${result.duration}ms\n\n📧 Check your Gmail inbox and spam folder!` :
                    `❌ Email Test FAILED!\n\nError: ${result.error}\nCategory: ${result.errorCategory}\nStatus: ${result.errorStatus}\n\nTroubleshooting tips:\n${report.recommendations.slice(0, 3).join('\n')}\n\nCheck console for full details.`;
                  
                  alert(message);
                } catch (error) {
                  console.error('❌ Manual test failed:', error);
                  alert(`❌ Manual Test Exception!\n\nError: ${error.message}\nType: ${error.name}\n\nCheck console for details.`);
                }
              }}
              style={{
                background: '#007bff',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '4px',
                marginBottom: '4px'
              }}
            >
              🧪 Full Email Test
            </button>
            
            <button 
              onClick={() => {
                localStorage.removeItem('pergunu_debug_session');
                localStorage.removeItem('pergunu_error_log');
                setLastError(null);
                setConfigCheck(null);
                alert('🧹 Debug data cleared!');
              }}
              style={{
                background: '#ffc107',
                color: 'black',
                border: 'none',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginBottom: '4px'
              }}
            >
              🧹 Clear All
            </button>
            
            <br />
            
            <button 
              onClick={() => setDebugMode(false)}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '4px 8px',
                fontSize: '10px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ Hide Debug
            </button>
          </div>
          
          {/* Quick EmailJS Info */}
          <div style={{
            marginTop: '8px',
            paddingTop: '8px',
            borderTop: '1px solid #333',
            fontSize: '10px',
            color: '#888'
          }}>
            📧 EmailJS Quick Check:<br/>
            Service: service_ublbpnp<br/>
            Template: template_qnuud6d<br/>
            Target: fairuzo1dyck@gmail.com
          </div>
        </div>
      )}

      <div className="register-form-header">
        <h1>📝 Form Pendaftaran PERGUNU</h1>
        <p>Silakan lengkapi form di bawah ini untuk bergabung dengan keluarga besar PERGUNU</p>
        {!debugMode && (
          <button 
            onClick={() => setDebugMode(true)}
            style={{
              background: '#6c757d',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              fontSize: '12px',
              borderRadius: '3px',
              cursor: 'pointer',
              marginTop: '10px'
            }}
          >
            🔧 Enable Debug Mode
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-section">
          <h3>📋 Data Pribadi</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="fullName">Nama Lengkap *</label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Contoh: Dr. Ahmad Suharto, S.Pd., M.Pd."
                autoComplete="name"
              />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contoh@email.com"
                autoComplete="email"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="08123456789"
                autoComplete="tel"
              />
            </div>
            <div className="form-group">
              <label htmlFor="position">Jabatan/Posisi *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                autoComplete="organization-title"
              >
                <option value="">Pilih Jabatan</option>
                <option value="guru">Guru</option>
                <option value="kepala-sekolah">Kepala Sekolah</option>
                <option value="wakil-kepala">Wakil Kepala Sekolah</option>
                <option value="dosen">Dosen</option>
                <option value="ustad">Ustad/Ustadzah</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🏫 Data Institusi</h3>
          <div className="form-group">
            <label htmlFor="school">Nama Sekolah/Institusi *</label>
            <input
              type="text"
              id="school"
              name="school"
              value={formData.school}
              onChange={handleChange}
              required
              placeholder="Contoh: SMA Al-Hikmah Surabaya"
              autoComplete="organization"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="pw">PW (Pengurus Wilayah) *</label>
              <select
                id="pw"
                name="pw"
                value={formData.pw}
                onChange={handleChange}
                required
                autoComplete="off"
              >
                <option value="">Pilih PW</option>
                <option value="PW PERGUNU Jawa Timur">PW PERGUNU Jawa Timur</option>
                <option value="PW PERGUNU Jawa Tengah">PW PERGUNU Jawa Tengah</option>
                <option value="PW PERGUNU Jawa Barat">PW PERGUNU Jawa Barat</option>
                <option value="PW PERGUNU DKI Jakarta">PW PERGUNU DKI Jakarta</option>
                <option value="PW PERGUNU Banten">PW PERGUNU Banten</option>
                <option value="PW PERGUNU Sumatra Utara">PW PERGUNU Sumatra Utara</option>
                <option value="PW PERGUNU Sumatra Barat">PW PERGUNU Sumatra Barat</option>
                <option value="PW PERGUNU Lampung">PW PERGUNU Lampung</option>
                <option value="PW PERGUNU Kalimantan Selatan">PW PERGUNU Kalimantan Selatan</option>
                <option value="PW PERGUNU Sulawesi Selatan">PW PERGUNU Sulawesi Selatan</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="pc">PC (Pengurus Cabang) *</label>
              <input
                type="text"
                id="pc"
                name="pc"
                value={formData.pc}
                onChange={handleChange}
                required
                placeholder="Contoh: PC PERGUNU Kab. Situbondo"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3>🎓 Data Pendidikan & Pengalaman</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="education">Pendidikan Terakhir *</label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                autoComplete="off"
              >
                <option value="">Pilih Pendidikan</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="S2">S2 (Magister)</option>
                <option value="S3">S3 (Doktor)</option>
                <option value="Diploma">Diploma</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="experience">Pengalaman Mengajar (Tahun) *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                autoComplete="off"
              >
                <option value="">Pilih Pengalaman</option>
                <option value="< 1 tahun">Kurang dari 1 tahun</option>
                <option value="1-3 tahun">1-3 tahun</option>
                <option value="4-7 tahun">4-7 tahun</option>
                <option value="8-15 tahun">8-15 tahun</option>
                <option value="> 15 tahun">Lebih dari 15 tahun</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Mengirim...
              </>
            ) : (
              '📤 Kirim Pendaftaran'
            )}
          </button>
          
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/')}
          >
            ❌ Batal
          </button>
        </div>
      </form>

      {/* Error Display Area */}
      {lastError && (
        <div style={{ 
          marginTop: '20px', 
          backgroundColor: '#fff8f8', 
          padding: '20px', 
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          maxWidth: '800px'
        }}>
          <h4 style={{color: '#dc3545', margin: '0 0 15px 0'}}>🐛 Error Details</h4>
          <div style={{marginBottom: '15px'}}>
            <strong>Time:</strong> {lastError.timestamp}<br/>
            <strong>Type:</strong> {lastError.type}<br/>
            <strong>Error Name:</strong> {lastError.name}<br/>
            <strong>Message:</strong> {lastError.message}
          </div>
          
          <details>
            <summary style={{cursor: 'pointer', fontWeight: 'bold', color: '#0F7536'}}>
              📋 Full Error Details (Click to expand)
            </summary>
            <textarea
              readOnly
              value={JSON.stringify(lastError, null, 2)}
              style={{ 
                width: '100%', 
                height: '200px', 
                fontFamily: 'Consolas, monospace',
                fontSize: '11px',
                background: '#f8f9fa',
                border: '1px solid #dee2e6',
                borderRadius: '4px',
                padding: '10px',
                marginTop: '10px'
              }}
            />
          </details>
          
          <div style={{marginTop: '15px'}}>
            <button 
              onClick={() => {
                const errorText = `PERGUNU Registration Error Report
Time: ${lastError.timestamp}
Type: ${lastError.type}
Error: ${lastError.name} - ${lastError.message}

Full Details:
${JSON.stringify(lastError, null, 2)}`;
                
                navigator.clipboard.writeText(errorText).then(() => {
                  alert('📋 Error report copied to clipboard! You can send this to developer.');
                });
              }}
              style={{
                background: '#28a745',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '10px'
              }}
            >
              📋 Copy Error Report
            </button>
            <button 
              onClick={() => setLastError(null)}
              style={{
                background: '#dc3545',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              ❌ Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
