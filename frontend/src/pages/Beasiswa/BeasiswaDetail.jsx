import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import { formatRupiah } from "../../utils/formatCurrency";
import "./BeasiswaDetail.css";

const BeasiswaDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get beasiswa ID from URL
  const [beasiswaData, setBeasiswaData] = useState(null);
  const [relatedBeasiswa, setRelatedBeasiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  
  // State untuk form pendaftaran
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    education: '',
    gpa: '',
    motivation: '',
    documents: null
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://kp-mocha.vercel.app/api";

  // Fetch specific beasiswa data
  useEffect(() => {
    const fetchBeasiswaDetail = async () => {
      try {
        setLoading(true);
        setError('');
        
        const response = await fetch(`${API_BASE}/beasiswa/${id}`);
        if (response.ok) {
          const beasiswa = await response.json();
          setBeasiswaData(beasiswa);
          
          // Fetch related beasiswa (same category, exclude current)
          const relatedResponse = await fetch(`${API_BASE}/beasiswa/kategori/${beasiswa.kategori}`);
          if (relatedResponse.ok) {
            const relatedData = await relatedResponse.json();
            const filtered = relatedData.filter(b => String(b.id) !== String(id)).slice(0, 3);
            setRelatedBeasiswa(filtered);
          }
        } else if (response.status === 404) {
          setError('Beasiswa tidak ditemukan');
        } else {
          setError('Gagal memuat data beasiswa');
        }
      } catch (err) {
        console.error('Error fetching beasiswa detail:', err);
        setError('Error koneksi ke server');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchBeasiswaDetail();
    }
  }, [id]);

  // Function untuk handle input form change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Function untuk handle submit application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setSubmitMessage('');

    try {
      // Validasi form
      if (!formData.fullName || !formData.email || !formData.phone) {
        throw new Error('Nama lengkap, email, dan nomor telepon wajib diisi');
      }

      // Data yang akan dikirim ke backend
      const applicationData = {
        beasiswaId: beasiswaData.id,
        beasiswaTitle: beasiswaData.judul,
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        education: formData.education,
        gpa: formData.gpa,
        motivation: formData.motivation,
        status: 'pending',
        submittedAt: new Date().toISOString()
      };

      const response = await fetch(`${API_BASE}/beasiswa-applications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(applicationData)
      });

      if (!response.ok) {
        throw new Error('Gagal mengirim pendaftaran');
      }

      setSubmitMessage('✅ Pendaftaran berhasil dikirim! Tim kami akan menghubungi Anda dalam 1-3 hari kerja.');
      
      // Reset form setelah 3 detik
      setTimeout(() => {
        setShowApplicationForm(false);
        setFormData({
          fullName: '',
          email: '',
          phone: '',
          education: '',
          gpa: '',
          motivation: '',
          documents: null
        });
        setSubmitMessage('');
      }, 3000);

    } catch (err) {
      console.error('Error submitting application:', err);
      setSubmitMessage('❌ ' + err.message);
    } finally {
      setSubmitLoading(false);
    }
  };

  // Function untuk format tanggal
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Function untuk calculate days remaining
  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="beasiswa-detail-container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>⏳ Memuat detail beasiswa...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="beasiswa-detail-container">
          <div className="error-state">
            <h2>❌ {error}</h2>
            <p>Silakan coba lagi atau kembali ke halaman beasiswa.</p>
            <button 
              onClick={() => navigate('/beasiswa')} 
              className="btn-back"
            >
              ← Kembali ke Beasiswa
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!beasiswaData) {
    return (
      <div>
        <Navbar />
        <div className="beasiswa-detail-container">
          <div className="error-state">
            <h2>📋 Beasiswa tidak ditemukan</h2>
            <p>Beasiswa yang Anda cari mungkin sudah dihapus atau tidak tersedia.</p>
            <button 
              onClick={() => navigate('/beasiswa')} 
              className="btn-back"
            >
              ← Kembali ke Beasiswa
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const daysRemaining = getDaysRemaining(beasiswaData.deadline);

  return (
    <div>
      <Navbar />
      
      <main className="beasiswa-detail-container">
        {/* Breadcrumb */}
        <nav className="breadcrumb">
          <button onClick={() => navigate('/')} className="breadcrumb-link">
            Home
          </button>
          <span className="breadcrumb-separator">→</span>
          <button onClick={() => navigate('/beasiswa')} className="breadcrumb-link">
            Beasiswa
          </button>
          <span className="breadcrumb-separator">→</span>
          <span className="breadcrumb-current">{beasiswaData.judul}</span>
        </nav>

        <div className="beasiswa-detail-content">
          {/* Main Content */}
          <article className="beasiswa-main">
            {/* Header */}
            <div className="beasiswa-header">
              <div className="beasiswa-meta">
                <span className="kategori-badge">{beasiswaData.kategori}</span>
                <span className={`status-badge status-${beasiswaData.status.toLowerCase()}`}>
                  {beasiswaData.status}
                </span>
              </div>
              
              <h1 className="beasiswa-title">{beasiswaData.judul}</h1>
              
              <div className="beasiswa-info-grid">
                <div className="info-item">
                  <span className="info-label">💰 Dana Beasiswa</span>
                  <span className="info-value">{formatRupiah(beasiswaData.nominal)}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">📅 Periode Pendaftaran</span>
                  <span className="info-value">
                    {formatDate(beasiswaData.tanggal_mulai)} - {formatDate(beasiswaData.deadline)}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">⏰ Waktu Tersisa</span>
                  <span className={`info-value ${daysRemaining <= 7 ? 'urgent' : daysRemaining <= 30 ? 'warning' : ''}`}>
                    {daysRemaining > 0 ? `${daysRemaining} hari lagi` : 'Pendaftaran ditutup'}
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">🏷️ Kategori</span>
                  <span className="info-value">{beasiswaData.kategori}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <section className="beasiswa-section">
              <h2>📝 Deskripsi Program</h2>
              <p className="beasiswa-description">{beasiswaData.deskripsi}</p>
            </section>

            {/* Requirements */}
            <section className="beasiswa-section">
              <h2>📋 Persyaratan Pendaftaran</h2>
              <ul className="requirements-list">
                {beasiswaData.persyaratan.map((req, index) => (
                  <li key={index} className="requirement-item">
                    <span className="requirement-icon">✓</span>
                    {req}
                  </li>
                ))}
              </ul>
            </section>

            {/* Action Buttons */}
            <div className="beasiswa-actions">
              {beasiswaData.status === 'Buka' && daysRemaining > 0 ? (
                <>
                  <button 
                    className="btn-apply-main"
                    onClick={() => setShowApplicationForm(true)}
                  >
                    🚀 Daftar Sekarang
                  </button>
                  <button 
                    className="btn-share"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: beasiswaData.judul,
                          text: beasiswaData.deskripsi,
                          url: window.location.href
                        });
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Link berhasil disalin!');
                      }
                    }}
                  >
                    📤 Bagikan
                  </button>
                </>
              ) : (
                <div className="application-closed">
                  <p>
                    {beasiswaData.status === 'Segera' 
                      ? '⏳ Pendaftaran belum dibuka' 
                      : '🔒 Pendaftaran sudah ditutup'
                    }
                  </p>
                </div>
              )}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="beasiswa-sidebar">
            {/* Quick Info Card */}
            <div className="sidebar-card quick-info">
              <h3>ℹ️ Info Singkat</h3>
              <div className="quick-info-list">
                <div className="quick-info-item">
                  <strong>Status:</strong>
                  <span className={`status-text status-${beasiswaData.status.toLowerCase()}`}>
                    {beasiswaData.status}
                  </span>
                </div>
                <div className="quick-info-item">
                  <strong>Dana:</strong>
                  <span>{formatRupiah(beasiswaData.nominal)}</span>
                </div>
                <div className="quick-info-item">
                  <strong>Kategori:</strong>
                  <span>{beasiswaData.kategori}</span>
                </div>
                <div className="quick-info-item">
                  <strong>Deadline:</strong>
                  <span>{formatDate(beasiswaData.deadline)}</span>
                </div>
              </div>
            </div>

            {/* Related Beasiswa */}
            {relatedBeasiswa.length > 0 && (
              <div className="sidebar-card related-beasiswa">
                <h3>🎓 Beasiswa Serupa</h3>
                <div className="related-list">
                  {relatedBeasiswa.map((related) => (
                    <div 
                      key={related.id} 
                      className="related-item"
                      onClick={() => navigate(`/beasiswa/${related.id}`)}
                    >
                      <h4>{related.judul}</h4>
                      <p>{formatRupiah(related.nominal)}</p>
                      <span className={`mini-status status-${related.status.toLowerCase()}`}>
                        {related.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contact Info */}
            <div className="sidebar-card contact-info">
              <h3>📞 Butuh Bantuan?</h3>
              <p>Tim kami siap membantu Anda dalam proses pendaftaran beasiswa.</p>
              <div className="contact-buttons">
                <a href="tel:+6289631011926" className="contact-btn">
                  📞 Hubungi Kami
                </a>
                <a href="mailto:info@pergunu.com" className="contact-btn">
                  ✉️ Email
                </a>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* Application Form Modal */}
      {showApplicationForm && (
        <div className="modal-overlay" onClick={() => setShowApplicationForm(false)}>
          <div className="modal-content application-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Pendaftaran Beasiswa</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowApplicationForm(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="beasiswa-info-mini">
                <h4>{beasiswaData.judul}</h4>
                <p><strong>Dana:</strong> {formatRupiah(beasiswaData.nominal)}</p>
                <p><strong>Deadline:</strong> {formatDate(beasiswaData.deadline)}</p>
              </div>

              <form onSubmit={handleSubmitApplication} className="application-form">
                <div className="form-group">
                  <label htmlFor="fullName">Nama Lengkap *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="contoh@email.com"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">Nomor Telepon *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="08xxxxxxxxxx"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="education">Pendidikan Terakhir</label>
                  <select
                    id="education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                  >
                    <option value="">Pilih pendidikan terakhir</option>
                    <option value="SMA/SMK">SMA/SMK</option>
                    <option value="D3">D3</option>
                    <option value="S1">S1</option>
                    <option value="S2">S2</option>
                    <option value="S3">S3</option>
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="gpa">IPK/Nilai Rata-rata</label>
                  <input
                    type="number"
                    id="gpa"
                    name="gpa"
                    value={formData.gpa}
                    onChange={handleInputChange}
                    step="0.01"
                    min="0"
                    max="4"
                    placeholder="3.50"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="motivation">Motivasi Mendaftar</label>
                  <textarea
                    id="motivation"
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    rows="4"
                    placeholder="Ceritakan motivasi dan tujuan Anda mendaftar beasiswa ini..."
                  />
                </div>

                {submitMessage && (
                  <div className={`submit-message ${submitMessage.includes('✅') ? 'success' : 'error'}`}>
                    {submitMessage}
                  </div>
                )}

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn-cancel"
                    onClick={() => setShowApplicationForm(false)}
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    className="btn-submit"
                    disabled={submitLoading}
                  >
                    {submitLoading ? '⏳ Mengirim...' : '🚀 Kirim Pendaftaran'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default BeasiswaDetail;