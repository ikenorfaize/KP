import React, { useEffect, useRef } from "react";
import "./Hero.css";
import heroImg from "../../assets/hero.png";

const Hero = () => {
  const ref = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        const windowHeight = window.innerHeight || document.documentElement.clientHeight;
        if (top <= windowHeight * 0.8) {
          ref.current.classList.add("animate");
        } else {
          ref.current.classList.remove("animate");
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // jalankan sekali saat mount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className="hero-section"
      style={{ backgroundImage: `url(${heroImg})` }}
      ref={ref}
    >
      <div className="hero-overlay">
        <div className="hero-container">
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
                Persatuan Guru Nahdlatul Ulama (Pergunu) merupakan salah satu badan otonom NU
                yang menghimpun dan menaungi para guru, dosen dan ustad.
              </p>
              <button className="hero-button">Daftarkan diri anda</button>
            </div>
            <div className="nav-buttons">
              <button className="nav-button filled">→</button>
              <button className="nav-button outlined">←</button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;