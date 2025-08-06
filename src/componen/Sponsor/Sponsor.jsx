// Sponsor Component - Komponen untuk menampilkan partner dan sponsor PERGUNU
// Menampilkan logo dan deskripsi organisasi yang bekerjasama
import React from 'react';
import { Link } from 'react-router-dom';                    // Link untuk navigasi ke halaman sponsor
import { useScrollAnimation } from '../../hooks/useScrollAnimation';  // Custom hook untuk animasi scroll
import './Sponsor.css';

// Import logo assets
import kementerianPendidikanLogo from '../../assets/KementerianPendidikan.png';
import kementerianAgamaLogo from '../../assets/KementerianAgama.png';
import muhammadiyahLogo from '../../assets/MUH.png';
import nahdlatulUlamaLogo from '../../assets/NU.png';

const Sponsor = () => {
  // Menggunakan custom hook untuk animasi saat scroll dengan threshold 10%
  const [ref, isVisible] = useScrollAnimation(0.1);

  // Data sponsor/partner yang bekerjasama dengan PERGUNU
  const sponsors = [
    {
      id: 1,
      name: "Kementerian Pendidikan",                       // Nama institusi
      logo: kementerianPendidikanLogo,                      // Logo dari assets
      description: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi"  // Deskripsi lengkap
    },
    {
      id: 2,
      name: "Kementerian Agama",
      logo: kementerianAgamaLogo,                          // Logo dari assets
      description: "Kementerian Agama Republik Indonesia"
    },
    {
      id: 3,
      name: "Muhammadiyah",
      logo: muhammadiyahLogo,                              // Logo dari assets
      description: "Persyarikatan Muhammadiyah"
    },
    {
      id: 4,
      name: "Nahdlatul Ulama",
      logo: nahdlatulUlamaLogo,                           // Logo dari assets
      description: "Nahdlatul Ulama"
    }
  ];

  return (
    <section 
      id="sponsor" 
      className={`sponsor-section ${isVisible ? 'animate-in' : ''}`}  // Class untuk animasi conditional
      ref={ref}  // Ref untuk intersection observer
    >
      <div className="container">
        {/* Header section dengan judul dan subtitle */}
        <div className="sponsor-header">
          <h2 className="sponsor-title">Partner & Sponsor</h2>
          <p className="sponsor-subtitle">
            Berkolaborasi dengan berbagai institusi untuk kemajuan pendidikan Indonesia
          </p>
        </div>
        
        {/* Grid untuk menampilkan logo sponsor dalam layout yang rapi */}
        <div className="sponsor-grid">
          {/* Map melalui array sponsors untuk generate card */}
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="sponsor-card">
              {/* Container untuk logo sponsor */}
              <div className="sponsor-logo">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}  // Alt text untuk accessibility
                />
              </div>
              
              {/* Informasi sponsor: nama dan deskripsi */}
              <div className="sponsor-info">
                <h3 className="sponsor-name">{sponsor.name}</h3>                    {/* Nama institusi */}
                <p className="sponsor-description">{sponsor.description}</p>        {/* Deskripsi singkat */}
              </div>
            </div>
          ))}
        </div>
        
        {/* Call-to-action untuk calon partner baru */}
        <div className="sponsor-cta">
          <h3>Ingin Menjadi Partner?</h3>
          <p>Bergabunglah dengan kami untuk memajukan pendidikan Indonesia</p>
          {/* Link ke halaman sponsor untuk informasi lebih lengkap */}
          <Link to="/sponsor" className="sponsor-btn">Lihat Semua Sponsor</Link>
        </div>
      </div>
    </section>
  );
};

// Export Sponsor component untuk digunakan di homepage dan halaman lain
export default Sponsor;
