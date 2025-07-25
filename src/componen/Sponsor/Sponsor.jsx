import React from 'react';
import { Link } from 'react-router-dom';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';
import './Sponsor.css';

const Sponsor = () => {
  const [ref, isVisible] = useScrollAnimation(0.1);

  const sponsors = [
    {
      id: 1,
      name: "Kementerian Pendidikan",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Logo_Kemendikbud.png/150px-Logo_Kemendikbud.png",
      description: "Kementerian Pendidikan, Kebudayaan, Riset, dan Teknologi"
    },
    {
      id: 2,
      name: "Kementerian Agama",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/09/Logo_of_Ministry_of_Religious_Affairs_of_Republic_of_Indonesia.svg/150px-Logo_of_Ministry_of_Religious_Affairs_of_Republic_of_Indonesia.svg.png",
      description: "Kementerian Agama Republik Indonesia"
    },
    {
      id: 3,
      name: "Muhammadiyah",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5c/Logo_Muhammadiyah.svg/150px-Logo_Muhammadiyah.svg.png",
      description: "Persyarikatan Muhammadiyah"
    },
    {
      id: 4,
      name: "Nahdlatul Ulama",
      logo: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Logo_NU.svg/150px-Logo_NU.svg.png",
      description: "Nahdlatul Ulama"
    }
  ];

  return (
    <section 
      id="sponsor" 
      className={`sponsor-section ${isVisible ? 'animate-in' : ''}`}
      ref={ref}
    >
      <div className="container">
        <div className="sponsor-header">
          <h2 className="sponsor-title">Partner & Sponsor</h2>
          <p className="sponsor-subtitle">
            Berkolaborasi dengan berbagai institusi untuk kemajuan pendidikan Indonesia
          </p>
        </div>
        
        <div className="sponsor-grid">
          {sponsors.map((sponsor) => (
            <div key={sponsor.id} className="sponsor-card">
              <div className="sponsor-logo">
                <img 
                  src={sponsor.logo} 
                  alt={sponsor.name}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRjVGNUY1Ii8+Cjx0ZXh0IHg9Ijc1IiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTk5IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Mb2dvPC90ZXh0Pgo8L3N2Zz4K';
                  }}
                />
              </div>
              <div className="sponsor-info">
                <h3 className="sponsor-name">{sponsor.name}</h3>
                <p className="sponsor-description">{sponsor.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="sponsor-cta">
          <h3>Ingin Menjadi Partner?</h3>
          <p>Bergabunglah dengan kami untuk memajukan pendidikan Indonesia</p>
          <Link to="/sponsor" className="sponsor-btn">Lihat Semua Sponsor</Link>
        </div>
      </div>
    </section>
  );
};

export default Sponsor;
