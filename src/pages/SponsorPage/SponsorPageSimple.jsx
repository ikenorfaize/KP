import React from 'react';
import { Link } from 'react-router-dom';
import './SponsorPage.css';

const SponsorPage = () => {
  const sponsors = [
    {
      id: 1,
      name: "Bank Mandiri Syariah",
      category: "Perbankan",
      type: "premium",
      description: "Mendukung program pendidikan dan beasiswa untuk guru-guru NU di seluruh Indonesia",
      contribution: "Beasiswa Pendidikan & Fasilitas Keuangan",
      since: "2020"
    },
    {
      id: 2,
      name: "Kementerian Pendidikan",
      category: "Pemerintah", 
      type: "premium",
      description: "Mitra strategis dalam pengembangan kualitas pendidikan dan pelatihan guru",
      contribution: "Dana Program & Sertifikasi Guru",
      since: "2018"
    },
    {
      id: 3,
      name: "Universitas Nahdlatul Ulama",
      category: "Pendidikan",
      type: "gold",
      description: "Kerjasama dalam program pendidikan tinggi dan penelitian pendidikan Islam",
      contribution: "Program Magister & Riset Pendidikan",
      since: "2019"
    }
  ];

  const packages = [
    {
      id: 1,
      title: "Premium",
      price: "100 Juta+",
      type: "premium",
      features: [
        "Logo di semua materi promosi",
        "Booth eksklusif di event",
        "Speaking opportunity",
        "Media coverage khusus"
      ]
    },
    {
      id: 2,
      title: "Gold",
      price: "50-100 Juta",
      type: "gold",
      features: [
        "Logo di materi utama",
        "Booth di event tertentu",
        "Newsletter mention",
        "Social media coverage"
      ]
    }
  ];

  return (
    <div className="sponsor-page">
      {/* Header */}
      <header className="sponsor-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <Link to="/" className="logo-link">
                <div className="logo">P</div>
                <div className="logo-text">
                  <h1>PERGUNU</h1>
                  <p>Situbondo</p>
                </div>
              </Link>
            </div>
            
            <nav className="nav">
              <Link to="/">Home</Link>
              <a href="/#tentang">Tentang</a>
              <a href="/#anggota">Anggota</a>
              <a href="/#berita">Berita</a>
              <a href="/#layanan">Layanan</a>
              <Link to="/sponsor-page" className="active">Sponsor</Link>
              <a href="/#hubungi">Hubungi Kami</a>
            </nav>
            
            <Link to="/login" className="cta-button">Login</Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <div className="badge">Kemitraan Strategis</div>
              <h1>Mitra & Sponsor PERGUNU</h1>
              <p>Bersama membangun ekosistem pendidikan yang berkualitas melalui kemitraan strategis dan kolaborasi berkelanjutan</p>
              <div className="hero-buttons">
                <a href="#contact" className="btn-primary">
                  🤝 Jadi Mitra Kami
                </a>
                <a href="#packages" className="btn-outline">Download Proposal</a>
              </div>
            </div>
            <div className="hero-image">
              <div className="hero-image-container">
                <div style={{
                  width: '100%',
                  height: '256px',
                  background: 'rgba(255,255,255,0.2)',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '18px'
                }}>
                  Partnership Illustration
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <div className="section-header">
            <div className="badge">Manfaat Kemitraan</div>
            <h2>Mengapa Bermitra dengan PERGUNU?</h2>
            <p>Bergabunglah dengan jaringan mitra strategis yang berkomitmen memajukan pendidikan Indonesia</p>
          </div>
          
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">🎯</div>
              <h3>Brand Visibility</h3>
              <p>Eksposur brand di seluruh kegiatan dan materi komunikasi PERGUNU</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🏢</div>
              <h3>Network Access</h3>
              <p>Akses ke jaringan guru dan pendidik NU di seluruh Indonesia</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🏆</div>
              <h3>CSR Impact</h3>
              <p>Kontribusi nyata dalam pengembangan pendidikan nasional</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>Strategic Partnership</h3>
              <p>Kemitraan strategis jangka panjang dalam bidang pendidikan</p>
            </div>
          </div>
        </div>
      </section>

      {/* Sponsors Section */}
      <section className="sponsors">
        <div className="container">
          <div className="section-header">
            <h2>Mitra Terpercaya Kami</h2>
            <p>Terima kasih kepada semua mitra yang telah mendukung misi PERGUNU dalam memajukan pendidikan</p>
          </div>
          
          <div className="sponsors-grid">
            {sponsors.map((sponsor) => (
              <div key={sponsor.id} className="sponsor-card">
                <div className="sponsor-header">
                  <div className={`sponsor-type ${sponsor.type}`}>
                    {sponsor.type.charAt(0).toUpperCase() + sponsor.type.slice(1)}
                  </div>
                  <div className="sponsor-logo" style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#0F7536',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    fontWeight: 'bold'
                  }}>
                    {sponsor.name.charAt(0)}
                  </div>
                </div>
                <div className="sponsor-content">
                  <h3 className="sponsor-name">{sponsor.name}</h3>
                  <div className="sponsor-category">{sponsor.category}</div>
                  <p className="sponsor-description">{sponsor.description}</p>
                  
                  <div className="sponsor-details">
                    <div className="sponsor-detail">
                      <div className="sponsor-detail-icon">🏆</div>
                      <div className="sponsor-detail-content">
                        <div className="sponsor-detail-title">Kontribusi:</div>
                        <div className="sponsor-detail-text">{sponsor.contribution}</div>
                      </div>
                    </div>
                    <div className="sponsor-detail">
                      <div className="sponsor-detail-icon">🏢</div>
                      <div className="sponsor-detail-content">
                        <div className="sponsor-detail-text">Bermitra sejak {sponsor.since}</div>
                      </div>
                    </div>
                  </div>
                  
                  <a href="#contact" className="sponsor-website">
                    🔗 Hubungi untuk Kemitraan
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Packages */}
      <section id="packages" className="packages">
        <div className="container">
          <div className="section-header">
            <div className="badge">Paket Kemitraan</div>
            <h2>Pilihan Paket Sponsorship</h2>
            <p>Berbagai pilihan paket kemitraan yang dapat disesuaikan dengan kebutuhan dan kemampuan organisasi Anda</p>
          </div>
          
          <div className="packages-grid">
            {packages.map((pkg) => (
              <div key={pkg.id} className="package-card">
                <div className={`package-header ${pkg.type}`}>
                  <div className="package-title">{pkg.title}</div>
                  <div className="package-price">{pkg.price}</div>
                </div>
                <div className="package-content">
                  <ul className="package-features">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="package-feature">{feature}</li>
                    ))}
                  </ul>
                  <a href="#contact" className="package-button">Pilih Paket</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Tertarik Bermitra dengan Kami?</h2>
          <p>Mari bergabung dalam misi memajukan pendidikan Indonesia. Hubungi tim kemitraan kami untuk diskusi lebih lanjut.</p>
          
          <div className="contact-grid">
            <div className="contact-item">
              <div className="contact-icon">📞</div>
              <h4>Telepon</h4>
              <p>+62 338 123456</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">✉️</div>
              <h4>Email</h4>
              <p>partnership@pergunu-situbondo.org</p>
            </div>
            
            <div className="contact-item">
              <div className="contact-icon">📍</div>
              <h4>Alamat</h4>
              <p>Jl. Pendidikan No. 123, Situbondo</p>
            </div>
          </div>
          
          <div className="contact-buttons">
            <a href="tel:+6233812345" className="btn-primary">📞 Hubungi Sekarang</a>
            <Link to="/" className="btn-outline">Kembali ke Home</Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SponsorPage;
