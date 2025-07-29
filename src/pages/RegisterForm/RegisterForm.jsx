import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { emailService } from '../../services/EmailService';
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
  const [lastError, setLastError] = useState(null);
  const [alertData, setAlertData] = useState(null);

  // Custom Modal Alert System - Beautiful centered modal
  const showCustomAlert = (type, title, message, dbId = null) => {
    setAlertData({
      type,
      title,
      message,
      dbId,
      timestamp: new Date().toISOString()
    });
  };

  // Improved error handling and debug system
  useEffect(() => {
    console.log('🛡️ === REGISTRATION SYSTEM ACTIVE ===');
    
    // Enhanced global error handler
    const originalConsoleError = console.error;
    console.error = (...args) => {
      originalConsoleError.apply(console, args);
      
      const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'console_error',
        args: args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ),
        url: window.location.href
      };
      
      setLastError(errorLog);
    };

    // Enhanced unhandled promise rejection handler
    const handleUnhandledRejection = (event) => {
      const errorLog = {
        timestamp: new Date().toISOString(),
        type: 'unhandled_promise_rejection',
        reason: String(event.reason),
        stack: event.reason?.stack,
        url: window.location.href
      };
      
      console.error('🚨 Unhandled Promise Rejection:', errorLog);
      setLastError(errorLog);
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    
    // Simple beforeunload - standard browser dialog saat form sedang submit
    const handleBeforeUnload = (e) => {
      if (isSubmitting) {
        console.log('⚠️ PREVENTING REFRESH: Form submission in progress');
        e.preventDefault();
        e.returnValue = 'Form sedang diproses. Yakin mau keluar?';
        return e.returnValue;
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    // Cleanup function
    return () => {
      console.error = originalConsoleError;
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, [isSubmitting]);

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
    
    // Set submitting state FIRST to activate anti-refresh
    setIsSubmitting(true);
    
    try {
      // Enhanced validation
      console.log('🔍 === VALIDATION STEP ===');
      
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
      
      const dbResponse = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });
      
      if (!dbResponse.ok) {
        const errorText = await dbResponse.text().catch(() => 'Unknown error');
        throw new Error(`Database error: ${dbResponse.status} - ${errorText}`);
      }
      
      const dbResult = await dbResponse.json();
      console.log('✅ Database save successful, ID:', dbResult.id);
      
      // Email sending with comprehensive error handling
      console.log('📧 === EMAIL SENDING STEP ===');
      
      let emailResult = { success: false, error: 'Not attempted' };
      
      try {
        console.log('📤 Attempting to send admin notification...');
        console.log('📧 EmailService config check:', emailService.emailConfig);
        console.log('📋 Form data being sent:', formData);
        
        // Add timeout to email sending
        const emailPromise = emailService.sendAdminNotification(formData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout after 45 seconds')), 45000)
        );
        
        console.log('⏳ Racing email promise vs timeout...');
        emailResult = await Promise.race([emailPromise, timeoutPromise]);
        
        console.log('📧 Email result received:', emailResult);
        console.log('📧 Email success:', emailResult.success);
        if (!emailResult.success) {
          console.log('📧 Email error details:', emailResult.error);
          console.log('📧 Email error type:', emailResult.errorType);
        }
        
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError);
        emailResult = {
          success: false,
          error: emailError.message,
          errorType: emailError.name,
          stack: emailError.stack
        };
      }
      
      // Final success handling
      console.log('🎉 === SUBMISSION COMPLETED ===');
      console.log('💾 Database saved:', dbResult.id);
      console.log('📧 Email result:', emailResult.success ? 'Success' : `Failed: ${emailResult.error}`);
      
      // Show comprehensive result with beautiful Indonesian alerts
      if (emailResult.success) {
        // Show success alert with DB ID
        showCustomAlert('success', 'Pendaftaran Berhasil!', `✅ Data berhasil tersimpan dengan ID: ${dbResult.id}
📧 Notifikasi email telah dikirim ke admin

Admin akan segera memproses pendaftaran Anda dalam 1-2 hari kerja.
Terima kasih telah bergabung dengan PERGUNU!`, dbResult.id);
        
      } else {
        // Show warning alert with DB ID
        showCustomAlert('warning', 'Pendaftaran Tersimpan', `✅ Data Anda berhasil tersimpan dengan ID: ${dbResult.id}
⚠️ Notifikasi email gagal dikirim ke admin

Error: ${emailResult.error}

Jangan khawatir, data Anda sudah aman.
Admin akan memproses secara manual.`, dbResult.id);
      }
      
    } catch (mainError) {
      console.error('❌ === MAIN SUBMISSION ERROR ===', mainError);
      
      setLastError({
        timestamp: new Date().toISOString(),
        type: 'main_submission_error',
        name: mainError.name,
        message: mainError.message,
        stack: mainError.stack,
        formData: formData
      });
      
      showCustomAlert('error', 'Pendaftaran Gagal!', `❌ Terjadi kesalahan saat memproses pendaftaran Anda.

Error: ${mainError.message}

Silakan coba lagi atau hubungi admin jika masalah berlanjut.`);
      
    } finally {
      // Keep console log persistent
      console.log('🏁 === FORM SUBMISSION COMPLETE ===');
      console.log('📊 Final status:', {
        isSubmitting: true, // Still true at this point
        alertShown: 'beautiful-modal-alert',
        hasModalData: !!alertData,
        timestamp: new Date().toISOString()
      });
      
      // Delay before releasing submit state untuk memastikan proses selesai
      setTimeout(() => {
        setIsSubmitting(false);
        console.log('✅ Form submission state released - Ready for next submission');
      }, 3000); // Increased delay to see console logs
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
      <div className="register-form-header">
        <h1>📝 Form Pendaftaran PERGUNU</h1>
        <p>Silakan lengkapi form di bawah ini untuk bergabung dengan keluarga besar PERGUNU</p>
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

      {/* Beautiful Centered Modal Alert */}
      {alertData && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={(e) => {
            // Close modal when clicking backdrop
            if (e.target === e.currentTarget) {
              setAlertData(null);
              if (alertData.type === 'success' || alertData.type === 'warning') {
                navigate('/');
              }
            }
          }}
        >
          <div 
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',
              maxWidth: '500px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: 'rgba(0, 0, 0, 0.3) 0px 10px 30px',
              border: `3px solid ${
                alertData.type === 'success' ? '#0F7536' : 
                alertData.type === 'warning' ? '#f59e0b' : 
                '#dc2626'
              }`
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon */}
            <div style={{
              textAlign: 'center',
              fontSize: '48px',
              marginBottom: '20px'
            }}>
              {alertData.type === 'success' ? '✅' : 
               alertData.type === 'warning' ? '⚠️' : 
               '❌'}
            </div>

            {/* Title */}
            <h2 style={{
              textAlign: 'center',
              margin: '0 0 20px 0',
              color: alertData.type === 'success' ? '#0F7536' : 
                     alertData.type === 'warning' ? '#f59e0b' : 
                     '#dc2626'
            }}>
              {alertData.title}
            </h2>

            {/* Message */}
            <div style={{
              lineHeight: '1.6',
              marginBottom: '30px',
              whiteSpace: 'pre-line',
              textAlign: 'center'
            }}>
              {alertData.message}
            </div>

            {/* Action Buttons */}
            <div style={{ textAlign: 'center' }}>
              {alertData.type === 'success' || alertData.type === 'warning' ? (
                <div>
                  <button
                    onClick={() => {
                      setAlertData(null);
                      navigate('/');
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#065f2a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0F7536'}
                    style={{
                      background: '#0F7536',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    🏠 Kembali ke Beranda
                  </button>
                  
                  <button
                    onClick={() => setAlertData(null)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAlertData(null)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}
                  style={{
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s'
                  }}
                >
                  Tutup dan Coba Lagi
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterForm;
