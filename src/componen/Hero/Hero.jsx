import React from "react";
import "./Hero.css";
import heroImg from "../../assets/hero.png";

const Hero = () => {
  return (
    <section className="hero-section" style={{ backgroundImage: `url(${heroImg})` }}>
      <div className="hero-overlay">
        <div className="hero-card">
          <div className="hero-left">
            <p className="hero-label">
              PERGUNU (Persatuan Guru Nahdlatul Ulama)
            </p>
            <h1 className="hero-title">
              Bergerak dan Menggerakkan, <br />
              Merawat Jagad dan Membangun Peradaban
            </h1>
          </div>
          <div className="hero-right">
            <p className="hero-desc">
              Persatuan Guru Nahdlatul Ulama (Pergunu) adalah organisasi profesi yang menaungi guru dan pendidik di lingkungan NU,
              sebagai wadah perjuangan, pengembangan kompetensi, dan penguatan nilai-nilai keislaman dalam pendidikan.
            </p>
            <button className="hero-button">Daftarkan diri anda</button>
          </div>
          <div className="nav-buttons">
            <button className="nav-button filled">→</button>
            <button className="nav-button outlined">←</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
