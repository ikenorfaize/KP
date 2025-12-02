import React, { useState, useEffect } from 'react'; // Tambahkan useState dan useEffect untuk state management
import { useNavigate } from 'react-router-dom'; // Tambahkan useNavigate untuk navigation
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import { formatRupiah } from "../../utils/formatCurrency";
import './beasiswa_page.css';

const Beasiswa = () => {
  const navigate = useNavigate(); // Hook untuk navigation
  
  // State management untuk beasiswa data dan filter
  const [beasiswaData, setBeasiswaData] = useState([]); // Array beasiswa dari API
  const [filteredData, setFilteredData] = useState([]); // Data setelah difilter
  const [activeFilter, setActiveFilter] = useState('Semua Program'); // Filter yang aktif
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(''); // Error handling
  
  // State untuk modal form pendaftaran
  const [showModal, setShowModal] = useState(false); // Show/hide modal
  const [selectedBeasiswa, setSelectedBeasiswa] = useState(null); // Beasiswa yang dipilih
  const [formData, setFormData] = useState({ // Data form pendaftaran
    fullName: '',
    email: '',
    phone: '',
    education: '',
    gpa: '',
    motivation: '',
    documents: null
  });
  const [submitLoading, setSubmitLoading] = useState(false); // Loading saat submit
  const [submitMessage, setSubmitMessage] = useState(''); // Message hasil submit

  const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://kp-mocha.vercel.app/api";

  // Function untuk fetch data beasiswa dari API
  const fetchBeasiswa = async (kategori = null) => {
    setLoading(true);
    setError('');
    
    try {
      const url = kategori && kategori !== 'Semua Program' 
        ? `${API_BASE}/beasiswa/kategori/${kategori}`
        : `${API_BASE}/beasiswa`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Gagal mengambil data beasiswa');
      }
      
      const data = await response.json();
      setBeasiswaData(data);
      setFilteredData(data);
    } catch (err) {
      console.error('Error fetching beasiswa:', err);
      setError('Gagal memuat data beasiswa. Silakan coba lagi.');
      setBeasiswaData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  };

  // Load data saat component mount
  useEffect(() => {
    fetchBeasiswa();
  }, []);

  // Function untuk handle filter click
  const handleFilterClick = (kategori) => {
    setActiveFilter(kategori);
    fetchBeasiswa(kategori); // Fetch data berdasarkan kategori
  };

  // Function untuk handle daftar sekarang button
  const handleDaftarClick = (beasiswa) => {
    setSelectedBeasiswa(beasiswa);
    setShowModal(true);
    setSubmitMessage(''); // Reset message
  };

  // Function untuk handle input form change
  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  // Function untuk handle submit form pendaftaran
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
        beasiswaId: selectedBeasiswa.id,
        beasiswaTitle: selectedBeasiswa.judul,
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
        setShowModal(false);
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

  // Function untuk handle detail button (akan redirect ke halaman detail)
  const handleDetailClick = (beasiswa) => {
    navigate(`/beasiswa/${beasiswa.id}`); // Navigate ke halaman detail beasiswa
  };

  // List kategori filter (bisa dibuat dinamis dari API jika diperlukan)
  const filterCategories = [
    'Semua Program',
    'Riset', 
    'Pendidikan',
    'S1',
    'S2', 
    'Pelatihan',
    'Santri'
  ];

  return (
    <div>
      {/* Hero Section */}
        <section className="hero">
            <div className="container hero-content">
            <div className="hero-text">
            <div className="badge">Program Beasiswa</div>
                <h1>Beasiswa untuk Guru Nahdliyin</h1>
                <p>
                Wujudkan impian pendidikan dengan berbagai program beasiswa yang tersedia
                untuk anggota PERGUNU dan keluarga
                </p>
            </div>
            <div className="hero-image hero-image-frame">
            <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600" alt="Scholarship" />
            </div>
            <div className="hero-buttons">
                <a href="#scholarships" className="btn-primary">
          🎓    Lihat Semua Beasiswa
                </a>
                <a href="#" className="btn-outline">Panduan Pendaftaran</a>
            </div>
            </div>
        </section>

      {/* Filter - Dynamic dari state */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            {filterCategories.map((kategori) => (
              <button 
                key={kategori}
                className={`filter-btn ${activeFilter === kategori ? 'active' : ''}`}
                onClick={() => handleFilterClick(kategori)}
                disabled={loading} // Disable saat loading
              >
                {kategori}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Card List - Dynamic dari API */}
      <section className="scholarships">
        <div className="container scholarships-grid">
          {loading ? (
            // Loading state
            <div className="loading-container">
              <p>⏳ Memuat data beasiswa...</p>
            </div>
          ) : error ? (
            // Error state  
            <div className="error-container">
              <p>❌ {error}</p>
              <button onClick={() => fetchBeasiswa(activeFilter)} className="btn-retry">
                Coba Lagi
              </button>
            </div>
          ) : filteredData.length === 0 ? (
            // Empty state
            <div className="empty-container">
              <p>📋 Tidak ada beasiswa tersedia untuk kategori "{activeFilter}"</p>
            </div>
          ) : (
            // Render dynamic beasiswa cards
            filteredData.map((beasiswa) => (
              <div className="card" key={beasiswa.id}>
                <div className="card-header">
                  <h3>{beasiswa.judul}</h3>
                  <p>{formatRupiah(beasiswa.nominal)}</p>
                </div>
                <div className="card-status">
                  <span className={`status-${beasiswa.status.toLowerCase()}`}>
                    {beasiswa.status}
                  </span>
                  <span className="deadline">
                    Deadline: {new Date(beasiswa.deadline).toLocaleDateString('id-ID')}
                  </span>
                </div>
                <p className="desc">
                  {beasiswa.deskripsi}
                </p>
                <div className="requirements">
                  <strong>Persyaratan:</strong>
                  <ul>
                    {beasiswa.persyaratan.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="card-actions">
                  <button 
                    className="btn-apply"
                    onClick={() => handleDaftarClick(beasiswa)}
                  >
                    Daftar Sekarang
                  </button>
                  <button 
                    className="btn-detail"
                    onClick={() => handleDetailClick(beasiswa)}
                  >
                    Detail
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Proses Pendaftaran */}
      <section className="process">
        <div className="container">
          <h2 className="process-title">Proses Pendaftaran</h2>
          <p className="process-desc">Ikuti langkah langkah berikut untuk mendaftar beasiswa PERGUNU Situbondo</p>
          <div className="process-steps">
            <div className="step">
              <div className="circle">1</div>
              <h4>Pilih Program</h4>
              <p>Pilih program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">2</div>
              <h4>Siapkan Dokumen</h4>
              <p>Siapkan program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">3</div>
              <h4>Submit Aplikasi</h4>
              <p>Submit program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">4</div>
              <h4>Pilih Program</h4>
              <p>Pilih program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
          </div>
        </div>
      </section>



      {/* Modal Form Pendaftaran Beasiswa */}
      {showModal && selectedBeasiswa && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📝 Pendaftaran Beasiswa</h3>
              <button 
                className="modal-close" 
                onClick={() => setShowModal(false)}
              >
                ✕
              </button>
            </div>
            
            <div className="modal-body">
              <div className="beasiswa-info">
                <h4>{selectedBeasiswa.judul}</h4>
                <p><strong>Dana:</strong> {formatRupiah(selectedBeasiswa.nominal)}</p>
                <p><strong>Deadline:</strong> {new Date(selectedBeasiswa.deadline).toLocaleDateString('id-ID')}</p>
                <p><strong>Status:</strong> 
                  <span className={`status-${selectedBeasiswa.status.toLowerCase()}`}>
                    {selectedBeasiswa.status}
                  </span>
                </p>
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

                <div className="form-group">
                  <label htmlFor="documents">Dokumen Pendukung (PDF/JPG/PNG)</label>
                  <input
                    type="file"
                    id="documents"
                    name="documents"
                    onChange={handleInputChange}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                  <small>Format: PDF, JPG, PNG. Maksimal 5MB</small>
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
                    onClick={() => setShowModal(false)}
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
    </div>
  );
};

export default Beasiswa;
