import React, { useState } from 'react';
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    console.log('🚀 Form submit started');
    e.preventDefault();
    setIsSubmitting(true);
    
    console.log('📋 Form data:', formData);
    
    try {
      // 1. Simpan data ke database (JSON Server)
      const applicationData = {
        id: Date.now().toString(),
        ...formData,
        status: 'pending',
        submittedAt: new Date().toISOString(),
        processedAt: null,
        credentials: null
      };

      console.log('📤 Sending to database:', applicationData);

      const response = await fetch('http://localhost:3001/applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      console.log('📥 Database response status:', response.status);

      if (response.ok) {
        console.log('✅ Data berhasil disimpan ke database');
        
        // 2. Kirim email notifikasi ke admin
        console.log('📧 === STARTING EMAIL NOTIFICATION ===');
        console.log('📧 Form data untuk email:', formData);
        
        try {
          const emailResult = await emailService.sendAdminNotification(formData);
          console.log('📧 === EMAIL NOTIFICATION RESULT ===');
          console.log('✅ Success:', emailResult.success);
          console.log('📧 Result:', emailResult);
          
          if (emailResult.success) {
            console.log('🎯 Email berhasil dikirim ke:', emailResult.targetEmail);
            console.log('📂 Cek inbox/spam di Gmail:', emailResult.targetEmail);
            
            // Tampilkan alert untuk konfirmasi
            alert(`✅ Email berhasil dikirim ke ${emailResult.targetEmail}! Cek Gmail Anda.`);
          } else {
            console.error('❌ Email gagal:', emailResult.error);
            alert(`❌ Email gagal dikirim: ${emailResult.error}`);
          }
        } catch (emailError) {
          console.error('❌ Email error exception:', emailError);
          console.warn('⚠️ Email gagal dikirim tapi data tersimpan:', emailError);
          alert(`❌ Email error: ${emailError.message}`);
        }
        
        setSubmitStatus('success');
        
        // DISABLED auto-redirect untuk debugging
        console.log('🚫 Auto-redirect disabled untuk debugging');
        console.log('💡 Manual navigate: klik Back atau refresh halaman');
        
        // Uncomment line below untuk enable auto-redirect
        // setTimeout(() => { navigate('/'); }, 5000);
      } else {
        const errorData = await response.text();
        console.error('❌ Error response:', errorData);
        throw new Error(`Server error: ${response.status} - ${errorData}`);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
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
          <p style={{color: '#666', fontSize: '14px'}}>
            Debug Mode: Auto-redirect disabled. Buka console (F12) untuk lihat log detail.
          </p>
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
    </div>
  );
};

export default RegisterForm;
