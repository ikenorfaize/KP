import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './SponsorPage.css';

const SponsorPage = () => {
  const location = useLocation();
  // Remove hero animation ref since hero should be visible immediately
  const [benefitsRef, benefitsVisible] = useScrollAnimation(0.1);
  const [sponsorsRef, sponsorsVisible] = useScrollAnimation(0.1);
  const [packagesRef, packagesVisible] = useScrollAnimation(0.1);
  const [contactRef, contactVisible] = useScrollAnimation(0.1);

  // Force immediate scroll to top when route changes - HIGHEST PRIORITY
  useEffect(() => {
    console.log('SponsorPage mounted, forcing scroll to top');
    
    // Multiple approaches to ensure scroll to top
    window.history.scrollRestoration = 'manual';
    
    // Force immediate scroll with multiple methods
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    console.log('Initial scroll position:', window.scrollY);
    
    // Additional timeout to ensure it works
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      console.log('After first timeout, scroll position:', window.scrollY);
    }, 0);
    
    // Another timeout for stubborn cases
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      console.log('After second timeout, scroll position:', window.scrollY);
    }, 10);
    
    // Final check
    setTimeout(() => {
      console.log('Final scroll position:', window.scrollY);
    }, 100);
  }, []);

  useEffect(() => {
    // Handle hash routing to scroll to specific section only
    if (location.hash) {
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.hash]);

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
      {/* Hero Section - No animation, visible immediately */}
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
      <section 
        className={`benefits ${benefitsVisible ? 'animate-in' : ''}`}
        ref={benefitsRef}
      >
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
      <section 
        className={`sponsors ${sponsorsVisible ? 'animate-in' : ''}`}
        ref={sponsorsRef}
      >
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
      <section 
        id="packages" 
        className={`packages ${packagesVisible ? 'animate-in' : ''}`}
        ref={packagesRef}
      >
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
      <section 
        id="contact" 
        className={`contact ${contactVisible ? 'animate-in' : ''}`}
        ref={contactRef}
      >
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
