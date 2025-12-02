import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import Sponsor from "../../componen/Sponsor/Sponsor";
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
        <section className="page-hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="page-title">Partner & Sponsor</h1>
              <p className="page-subtitle">
                Berkolaborasi dengan berbagai institusi dan organisasi untuk kemajuan 
                pendidikan Indonesia dan pengembangan PERGUNU Situbondo
              </p>
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