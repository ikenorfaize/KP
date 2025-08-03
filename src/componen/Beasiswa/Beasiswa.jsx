import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Beasiswa.css';

const BeasiswaCard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/beasiswa');
  };

  const handleCardClick = (path) => {
    navigate(path);
  };

  // SVG Icons as components
  const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600 mt-1 flex-shrink-0">
      <path d="M21.801 10A10 10 0 1 1 17 3.335"></path>
      <path d="m9 11 3 3L22 4"></path>
    </svg>
  );

  const GraduationCapIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z"></path>
      <path d="M22 10v6"></path>
      <path d="M6 12.5V16a6 3 0 0 0 12 0v-3.5"></path>
    </svg>
  );

  const ArrowRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M5 12h14"></path>
      <path d="m12 5 7 7-7 7"></path>
    </svg>
  );

  const BookOpenIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M12 7v14"></path>
      <path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"></path>
    </svg>
  );

  const StarIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
    </svg>
  );

  const TrendingUpIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
      <path d="M16 7h6v6"></path>
      <path d="m22 7-8.5 8.5-5-5L2 17"></path>
    </svg>
  );

  const AwardIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8 transition-colors">
      <path d="m15.477 12.89 1.515 8.526a.5.5 0 0 1-.81.47l-3.58-2.687a1 1 0 0 0-1.197 0l-3.586 2.686a.5.5 0 0 1-.81-.469l1.514-8.526"></path>
      <circle cx="12" cy="8" r="6"></circle>
    </svg>
  );

  return (
    <section className="beasiswa-section" id="beasiswa">
      <div className="beasiswa-container">
        <div className="section-header">
          <span className="badge">Program Unggulan</span>
          <h2 className="section-title">Program Beasiswa PERGUNU</h2>
          <p className="section-description">
            Beasiswa adalah bantuan biaya pendidikan yang diberikan kepada siswa, mahasiswa, atau individu yang memenuhi kriteria tertentu untuk melanjutkan atau menyelesaikan pendidikan mereka.
          </p>
        </div>

        <div className="main-content">
          <div className="content-left">
            <h3 className="content-title">Apa itu Program Beasiswa PERGUNU?</h3>
            <p className="content-description">
              Program Beasiswa PERGUNU adalah inisiatif untuk mendukung pendidikan berkualitas bagi anggota PERGUNU dan keluarga mereka. Kami menyediakan berbagai jenis beasiswa mulai dari pendidikan dasar hingga perguruan tinggi.
            </p>
            
            <div className="features-list">
              <div className="feature-item">
                <CheckIcon />
                <div>
                  <h4 className="feature-title">Beasiswa Pendidikan Formal</h4>
                  <p className="feature-desc">Dukungan biaya untuk jenjang SD, SMP, SMA, dan Perguruan Tinggi</p>
                </div>
              </div>
              
              <div className="feature-item">
                <CheckIcon />
                <div>
                  <h4 className="feature-title">Beasiswa Penelitian</h4>
                  <p className="feature-desc">Bantuan untuk penelitian pendidikan dan pengembangan keilmuan</p>
                </div>
              </div>
              
              <div className="feature-item">
                <CheckIcon />
                <div>
                  <h4 className="feature-title">Beasiswa Pelatihan Profesional</h4>
                  <p className="feature-desc">Program sertifikasi dan peningkatan kompetensi guru</p>
                </div>
              </div>
            </div>

            <div className="action-buttons">
              <button onClick={handleClick} className="btn-primary">
                <GraduationCapIcon />
                Jelajahi Semua Beasiswa
                <ArrowRightIcon />
              </button>
              <button onClick={() => handleCardClick('/beasiswa')} className="btn-secondary">
                <BookOpenIcon />
                Panduan Pendaftaran
              </button>
            </div>
          </div>

          <div className="content-right">
            <div className="scholarship-card">
              <div className="card-image">
                <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&h=400" alt="Program Beasiswa" />
                <div className="image-overlay"></div>
                <div className="card-content-overlay">
                  <h4 className="overlay-title">Program Beasiswa Terbaru</h4>
                  <p className="overlay-desc">Pendaftaran dibuka hingga 31 Maret 2024</p>
                </div>
              </div>
              <div className="card-stats">
                <div className="stat-item">
                  <div className="stat-number">Rp 15M</div>
                  <div className="stat-label">Total Dana</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">25</div>
                  <div className="stat-label">Program Aktif</div>
                </div>
                <div className="stat-item">
                  <div className="stat-number">95%</div>
                  <div className="stat-label">Tingkat Sukses</div>
                </div>
              </div>
            </div>
            <div className="floating-star">
              <StarIcon />
            </div>
            <div className="floating-trend">
              <TrendingUpIcon />
            </div>
          </div>
        </div>

        <div className="cards-grid">
          <div className="program-card" onClick={() => handleCardClick('/beasiswa')}>
            <div className="card-icon green">
              <GraduationCapIcon />
            </div>
            <h3 className="card-title">Beasiswa Pendidikan</h3>
            <p className="card-description">Program beasiswa untuk siswa berprestasi dari keluarga kurang mampu</p>
            <button onClick={() => handleCardClick('/beasiswa')} className="card-button green">
              Pelajari Lebih Lanjut
            </button>
          </div>

          <div className="program-card" onClick={() => handleCardClick('/beasiswa')}>
            <div className="card-icon blue">
              <BookOpenIcon />
            </div>
            <h3 className="card-title">Beasiswa Penelitian</h3>
            <p className="card-description">Dukungan untuk penelitian pendidikan dan pengembangan akademik</p>
            <button onClick={() => handleCardClick('/beasiswa')} className="card-button blue">
              Pelajari Lebih Lanjut
            </button>
          </div>

          <div className="program-card" onClick={() => handleCardClick('/beasiswa')}>
            <div className="card-icon mint">
              <AwardIcon />
            </div>
            <h3 className="card-title">Beasiswa Prestasi</h3>
            <p className="card-description">Penghargaan untuk siswa dengan prestasi akademik dan non-akademik</p>
            <button onClick={() => handleCardClick('/beasiswa')} className="card-button mint">
              Pelajari Lebih Lanjut
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BeasiswaCard;

