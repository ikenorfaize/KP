// RegisterForm Component - Form Pendaftaran Anggota PERGUNU
// Komponen ini menangani seluruh proses pendaftaran anggota baru dengan fitur:
// - Form multi-step validation
// - Upload file (foto profil, sertifikat pendidikan)
// - Email notification otomatis ke admin dan pendaftar
// - Simpan data ke JSON database melalui API
// - Real-time validation dan feedback
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';           // Hook untuk navigasi
import { emailService } from '../../services/EmailService'; // Service untuk kirim email
import './RegisterForm.css';

// KOMPONEN FORM PENDAFTARAN ANGGOTA PERGUNU
// Halaman ini adalah core functionality untuk recruitment system
const RegisterForm = () => {
  // Hook untuk navigasi programmatic setelah submit berhasil
  const navigate = useNavigate();
  
  // State untuk menyimpan semua data form pendaftaran
  const [formData, setFormData] = useState({
    fullName: '',          // Nama lengkap sesuai KTP
    email: '',             // Email aktif untuk komunikasi
    phone: '',             // Nomor telepon/WhatsApp
    position: '',          // Posisi/jabatan yang diinginkan di PERGUNU
    school: '',            // Nama sekolah/institusi tempat mengajar
    pw: '',                // Pengurus Wilayah (struktur organisasi)
    pc: '',                // Pengurus Cabang (struktur organisasi)
    experience: '',        // Pengalaman mengajar/berorganisasi
    education: ''          // Pendidikan terakhir (S1, S2, dll)
  });
  
  // State untuk mengontrol proses submit dan feedback
  const [isSubmitting, setIsSubmitting] = useState(false);  // Loading state
  const [submitStatus, setSubmitStatus] = useState(null);   // Status hasil submit
  const [alertData, setAlertData] = useState(null);         // Data untuk custom alert

  // Fungsi untuk menampilkan alert/notifikasi custom dengan styling
  const showCustomAlert = (type, title, message, dbId = null) => {
    setAlertData({
      type,      // success, error, warning (menentukan warna dan icon)
      title,     // Judul alert yang ditampilkan
      message,   // Pesan detail untuk user
      dbId,      // ID dari database jika submission berhasil
      timestamp: new Date().toISOString()  // Timestamp untuk tracking
    });
  };

  // Effect untuk mencegah user keluar saat form sedang disubmit
  // Mencegah data loss jika user tidak sengaja close browser/tab
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isSubmitting) {
        e.preventDefault();  // Cegah browser close
        e.returnValue = 'Form sedang diproses. Yakin mau keluar?';
        return e.returnValue;
      }
    };
    
    // Tambahkan event listener
    window.addEventListener('beforeunload', handleBeforeUnload);
    // Cleanup saat component unmount
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isSubmitting]);

  // Fungsi untuk menangani perubahan input form
  // Setiap kali user mengetik di input field, state akan diupdate secara real-time
  const handleChange = (e) => {
    setFormData({
      ...formData,                    // Spread existing data
      [e.target.name]: e.target.value // Update field yang berubah
    });
  };

  // FUNGSI UTAMA SUBMIT FORM - Core Business Logic
  // Proses lengkap: validation → database save → email notification → feedback
  const handleSubmit = async (e) => {
    e.preventDefault();  // Mencegah page reload default form submit
    
    console.log('🚀 === FORM SUBMISSION STARTED ===');
    setIsSubmitting(true);  // Set loading state untuk UI feedback
    
    try {
      // === STEP 1: CLIENT-SIDE VALIDATION ===
      // Validasi field wajib untuk mencegah submit data kosong
      if (!formData.fullName?.trim()) {
        throw new Error('Nama Lengkap wajib diisi');
      }
      
      if (!formData.email?.trim()) {
        throw new Error('Email wajib diisi');
      }
      
      // Validasi format email dengan regex pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        throw new Error('Format email tidak valid');
      }
      
      console.log('✅ Validation passed');
      
      // === STEP 2: DATABASE SAVE OPERATION ===
      // Simpan data aplikasi ke JSON server untuk review admin
      console.log('📡 === DATABASE SAVE STEP ===');
      
      // Prepare data dengan metadata untuk tracking dan processing
      const applicationData = {
        id: Date.now().toString(),  // Unique ID berdasarkan timestamp
        ...formData,                           // Spread semua input user 
        status: 'pending',                     // Status awal menunggu review admin
        submittedAt: new Date().toISOString(), // Timestamp submission
        processedAt: null,                     // Akan diisi saat admin review
        credentials: null                      // Akan diisi saat approved
      };

      // HTTP POST request ke JSON server database
      const apiUrl = import.meta.env.VITE_API_BASE_URL || 'https://kp-mocha.vercel.app/api';
      const dbResponse = await fetch(`${apiUrl}/applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Set JSON content type
        },
        body: JSON.stringify(applicationData)  // Convert object ke JSON string
      });
      
      // Error handling untuk database operation
      if (!dbResponse.ok) {
        const errorText = await dbResponse.text().catch(() => 'Unknown error');
        throw new Error(`Database error: ${dbResponse.status} - ${errorText}`);
      }
      
      // Parse response data dari server
      const dbResult = await dbResponse.json();
      console.log('✅ Database save successful, ID:', dbResult.id);
      
      // === STEP 3: EMAIL NOTIFICATION SYSTEM ===
      // Kirim notifikasi ke admin bahwa ada pendaftar baru
      console.log('📧 === EMAIL SENDING STEP ===');
      
      // Initialize email result dengan default failure
      let emailResult = { success: false, error: 'Not attempted' };
      
      try {
        console.log('📤 Attempting to send admin notification...');
        console.log('📧 EmailService config check:', emailService.emailConfig);
        
        // Send email dengan timeout protection (max 30 detik)
        const emailPromise = emailService.sendAdminNotification(formData);
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Email timeout after 30 seconds')), 30000)
        );
        
        // Race between email send dan timeout
        emailResult = await Promise.race([emailPromise, timeoutPromise]);
        console.log('📧 Email result:', emailResult);
        
      } catch (emailError) {
        // Handle email errors tanpa mengganggu database save
        console.error('❌ Email sending failed:', emailError);
        emailResult = {
          success: false,
          error: emailError.message,
          errorType: emailError.name
        };
      }
      
      // === STEP 4: USER FEEDBACK & RESULT DISPLAY ===
      // Show hasil akhir ke user dengan alert yang sesuai
      console.log('🎉 === SUBMISSION COMPLETED ===');
      console.log('💾 Database saved:', dbResult.id);
      console.log('📧 Email result:', emailResult.success ? 'Success' : `Failed: ${emailResult.error}`);
      
      // Success case: database + email berhasil
      if (emailResult.success) {
        showCustomAlert('success', 'Pendaftaran Berhasil!', `✅ Data berhasil tersimpan dengan ID: ${dbResult.id}
📧 Notifikasi email telah dikirim ke admin

Admin akan segera memproses pendaftaran Anda dalam 1-2 hari kerja.
Terima kasih telah bergabung dengan PERGUNU!`, dbResult.id);
      } else {
        // Partial success: database berhasil, email gagal
        showCustomAlert('warning', 'Pendaftaran Tersimpan', `✅ Data Anda berhasil tersimpan dengan ID: ${dbResult.id}
⚠️ Notifikasi email gagal dikirim ke admin

Error: ${emailResult.error}

Jangan khawatir, data Anda sudah aman.
Admin akan memproses secara manual.`, dbResult.id);
      }
      
    } catch (mainError) {
      // === ERROR HANDLING ===
      // Tangani semua error yang mungkin terjadi selama proses submit
      console.error('❌ === MAIN SUBMISSION ERROR ===', mainError);
      showCustomAlert('error', 'Pendaftaran Gagal!', `❌ Terjadi kesalahan saat memproses pendaftaran Anda.

Error: ${mainError.message}

Silakan coba lagi atau hubungi admin jika masalah berlanjut.`);
      
    } finally {
      // === CLEANUP ===
      // Reset loading state dengan delay untuk better UX
      setTimeout(() => {
        setIsSubmitting(false);
      }, 2000);
    }
  };

  // === SUCCESS STATE COMPONENT ===
  // Tampilan khusus saat pendaftaran berhasil (legacy - sekarang pakai modal)
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
            onClick={() => navigate('/')}   // Navigate back to homepage
            style={{
              marginTop: '20px',
              padding: '10px 20px',
              background: '#0F7536',         // PERGUNU green brand color
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

  // === ERROR STATE COMPONENT ===
  // Tampilan khusus saat terjadi error (legacy - sekarang pakai modal)
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

  // === MAIN FORM RENDER ===
  // Template utama form pendaftaran dengan semua input fields
  return (
    <div className="register-form-container">
      {/* Header section dengan informasi form */}
      <div className="register-form-header">
        <h1>📝 Form Pendaftaran PERGUNU</h1>
        <p>Silakan lengkapi form di bawah ini untuk bergabung dengan keluarga besar PERGUNU</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        {/* === SECTION 1: DATA PRIBADI === */}
        <div className="form-section">
          <h3>📋 Data Pribadi</h3>
          <div className="form-row">
            {/* Input nama lengkap dengan validation required */}
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
                autoComplete="name"              // Browser autofill hint
              />
            </div>
            {/* Input email dengan validation format dan required */}
            <div className="form-group">
              <label htmlFor="email">Email *</label>
              <input
                type="email"                     // HTML5 email validation
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="contoh@email.com"
                autoComplete="email"             // Browser autofill hint
              />
            </div>
          </div>

          <div className="form-row">
            {/* Input nomor telepon untuk komunikasi */}
            <div className="form-group">
              <label htmlFor="phone">Nomor Telepon *</label>
              <input
                type="tel"                       // HTML5 telephone input
                id="phone"  
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="08123456789"
                autoComplete="tel"               // Browser autofill hint
              />
            </div>
            {/* Dropdown select untuk jabatan/posisi di institusi */}
            <div className="form-group">
              <label htmlFor="position">Jabatan/Posisi *</label>
              <select
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                autoComplete="organization-title"  // Browser autofill hint
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

        {/* === SECTION 2: DATA INSTITUSI === */}
        <div className="form-section">
          <h3>🏫 Data Institusi</h3>
          {/* Input nama sekolah/institusi tempat mengajar */}
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
              autoComplete="organization"        // Browser autofill hint
            />
          </div>

          <div className="form-row">
            {/* Dropdown PW (Pengurus Wilayah) - Struktur organisasi tingkat provinsi */}
            <div className="form-group">
              <label htmlFor="pw">PW (Pengurus Wilayah) *</label>
              <select
                id="pw"
                name="pw"
                value={formData.pw}
                onChange={handleChange}
                required
                autoComplete="off"               // Disable autofill untuk data spesifik
              >
                <option value="">Pilih PW</option>
                {/* Daftar PW PERGUNU se-Indonesia berdasarkan provinsi */}
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
            {/* Input PC (Pengurus Cabang) - Struktur organisasi tingkat kabupaten/kota */}
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
                autoComplete="off"               // Disable autofill untuk data spesifik
              />
            </div>
          </div>
        </div>

        {/* === SECTION 3: DATA PENDIDIKAN & PENGALAMAN === */}
        <div className="form-section">
          <h3>🎓 Data Pendidikan & Pengalaman</h3>
          <div className="form-row">
            {/* Dropdown pendidikan terakhir untuk kualifikasi */}
            <div className="form-group">
              <label htmlFor="education">Pendidikan Terakhir *</label>
              <select
                id="education"
                name="education"
                value={formData.education}
                onChange={handleChange}
                required
                autoComplete="off"               // Disable autofill
              >
                <option value="">Pilih Pendidikan</option>
                <option value="S1">S1 (Sarjana)</option>
                <option value="S2">S2 (Magister)</option>
                <option value="S3">S3 (Doktor)</option>
                <option value="Diploma">Diploma</option>
                <option value="Lainnya">Lainnya</option>
              </select>
            </div>
            {/* Dropdown pengalaman mengajar untuk assessment capability */}
            <div className="form-group">
              <label htmlFor="experience">Pengalaman Mengajar (Tahun) *</label>
              <select
                id="experience"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                required
                autoComplete="off"               // Disable autofill
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

        {/* === FORM ACTION BUTTONS === */}
        <div className="form-actions">
          {/* Submit button dengan loading state */}
          <button 
            type="submit" 
            className="submit-button"
            disabled={isSubmitting}              // Disable saat loading
          >
            {isSubmitting ? (
              <>
                <span className="loading-spinner"></span>
                Mengirim...                      {/* Loading text */}
              </>
            ) : (
              '📤 Kirim Pendaftaran'             // Normal text
            )}
          </button>
          
          {/* Cancel button untuk kembali ke homepage */}
          <button 
            type="button" 
            className="cancel-button"
            onClick={() => navigate('/')}       // Navigate to homepage
          >
            ❌ Batal
          </button>
        </div>
      </form>

      {/* === CUSTOM MODAL ALERT SYSTEM === */}
      {/* Modal overlay untuk menampilkan hasil submit dengan styling yang cantik */}
      {alertData && (
        <div 
          style={{
            position: 'fixed',                  // Fixed positioning untuk overlay
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent backdrop
            display: 'flex',
            alignItems: 'center',               // Center vertical
            justifyContent: 'center',           // Center horizontal  
            zIndex: 9999,                       // Highest z-index
            padding: '20px'                     // Padding untuk mobile
          }}
          onClick={(e) => {
            // Close modal saat click backdrop (bukan modal content)
            if (e.target === e.currentTarget) {
              setAlertData(null);
              // Navigate to homepage jika success/warning
              if (alertData.type === 'success' || alertData.type === 'warning') {
                navigate('/');
              }
            }
          }}
        >
          {/* Modal content box */}
          <div 
            style={{
              background: 'white',
              padding: '30px',
              borderRadius: '12px',              // Rounded corners
              maxWidth: '500px',
              width: '90%',                      // Responsive width
              maxHeight: '80vh',                 // Max height untuk mobile
              overflowY: 'auto',                 // Scroll jika content terlalu panjang
              boxShadow: 'rgba(0, 0, 0, 0.3) 0px 10px 30px', // Drop shadow
              border: `3px solid ${
                alertData.type === 'success' ? '#0F7536' :    // Green border for success
                alertData.type === 'warning' ? '#f59e0b' :    // Yellow border for warning
                '#dc2626'                                      // Red border for error
              }`
            }}
            onClick={(e) => e.stopPropagation()} // Prevent event bubbling
          >
            {/* Icon section dengan emoji berdasarkan alert type */}
            <div style={{
              textAlign: 'center',
              fontSize: '48px',                  // Large icon size
              marginBottom: '20px'
            }}>
              {alertData.type === 'success' ? '✅' : 
               alertData.type === 'warning' ? '⚠️' : 
               '❌'}
            </div>

            {/* Title section dengan warna sesuai alert type */}
            <h2 style={{
              textAlign: 'center',
              margin: '0 0 20px 0',
              color: alertData.type === 'success' ? '#0F7536' : 
                     alertData.type === 'warning' ? '#f59e0b' : 
                     '#dc2626'
            }}>
              {alertData.title}
            </h2>

            {/* Message content dengan line breaks dan center alignment */}
            <div style={{
              lineHeight: '1.6',
              marginBottom: '30px',
              whiteSpace: 'pre-line',            // Preserve line breaks dari \n
              textAlign: 'center'
            }}>
              {alertData.message}
            </div>

            {/* Action buttons section dengan conditional rendering */}
            <div style={{ textAlign: 'center' }}>
              {alertData.type === 'success' || alertData.type === 'warning' ? (
                <div>
                  {/* Success/Warning: Show homepage + close buttons */}
                  <button
                    onClick={() => {
                      setAlertData(null);
                      navigate('/');             // Navigate to homepage
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#065f2a'} // Hover effect
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#0F7536'}  // Reset hover
                    style={{
                      background: '#0F7536',    // PERGUNU green
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      marginRight: '10px',
                      transition: 'background-color 0.2s' // Smooth hover transition
                    }}
                  >
                    🏠 Kembali ke Beranda
                  </button>
                  
                  {/* Close button untuk tutup modal saja */}
                  <button
                    onClick={() => setAlertData(null)}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#4b5563'} // Hover effect
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#6b7280'}  // Reset hover
                    style={{
                      background: '#6b7280',    // Gray color
                      color: 'white',
                      border: 'none',
                      padding: '12px 30px',
                      borderRadius: '6px',
                      fontSize: '16px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s' // Smooth hover transition
                    }}
                  >
                    Tutup
                  </button>
                </div>
              ) : (
                // Error: Show only close button untuk retry
                <button
                  onClick={() => setAlertData(null)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#b91c1c'} // Hover effect
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#dc2626'}  // Reset hover
                  style={{
                    background: '#dc2626',      // Red color for error
                    color: 'white',
                    border: 'none',
                    padding: '12px 30px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s' // Smooth hover transition
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
