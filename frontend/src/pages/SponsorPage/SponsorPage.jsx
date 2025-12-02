import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import Sponsor from "../../componen/Sponsor/Sponsor";
import beasiswaPoster from "../../assets/beasiswa_poster.png";
import './SponsorPage.css';

const SponsorPage = () => {
  const location = useLocation();

  // Force immediate scroll to top when route changes
  useEffect(() => {
    window.history.scrollRestoration = 'manual';
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
    
    setTimeout(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }, []);

  return (
    <div className="sponsor-page">
      <Navbar />
      <div className="page-content">
        {/* Hero Section untuk halaman Sponsor */}
        <section 
          className="sponsor-page-hero"
          style={{
            backgroundImage: `url(${beasiswaPoster})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          <div className="container">
            <div className="sponsor-hero-content">
              <div className="sponsor-hero-icon">
                <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17 21V19C17 16.7909 15.2091 15 13 15H5C2.79086 15 1 16.7909 1 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M23 21V19C23 17.1362 21.7252 15.5701 20 15.126" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 3.12598C17.7252 3.56986 19 5.13616 19 7C19 8.86384 17.7252 10.4301 16 10.874" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h1 className="sponsor-page-title">Partner & Sponsor</h1>
              <p className="sponsor-page-subtitle">
                Berkolaborasi dengan berbagai institusi dan organisasi untuk kemajuan 
                pendidikan Indonesia dan pengembangan PERGUNU Situbondo
              </p>
              <div className="sponsor-hero-stats">
                <div className="sponsor-stat-item">
                  <span className="sponsor-stat-number">50+</span>
                  <span className="sponsor-stat-label">Mitra Kerjasama</span>
                </div>
                <div className="sponsor-stat-item">
                  <span className="sponsor-stat-number">25+</span>
                  <span className="sponsor-stat-label">Sponsor Aktif</span>
                </div>
                <div className="sponsor-stat-item">
                  <span className="sponsor-stat-number">10</span>
                  <span className="sponsor-stat-label">Tahun Pengalaman</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section Sponsor - sama seperti di homepage */}
        <Sponsor />
      </div>
      <Footer />
    </div>
  );
};

export default SponsorPage;