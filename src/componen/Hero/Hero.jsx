import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import heroImg from "../../assets/hero.png";

const heroContents = [
  {
    title: "Bergerak dan Menggerakkan, Merawat Jagad dan Membangun Peradaban",
    desc: "Persatuan Guru Nahdlatul Ulama (Pergunu) merupakan salah satu badan otonom NU yang menghimpun dan menaungi para guru, dosen dan ustad.",
  },
  {
    title: "Menguatkan Peran Guru dalam Era Digital",
    desc: "Pergunu berkomitmen meningkatkan kapasitas guru melalui pelatihan, kolaborasi, dan inovasi teknologi pendidikan.",
  },
  {
    title: "Membangun Generasi Unggul dan Bermoral",
    desc: "Kami percaya pendidikan karakter dan akhlak adalah kunci membentuk generasi penerus bangsa yang berkualitas.",
  },
];

const Hero = () => {
  const ref = useRef(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect();
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        if (top <= windowHeight * 0.8) {
          ref.current.classList.add("animate");
        } else {
          ref.current.classList.remove("animate");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nextContent = () => {
    setIndex((prevIndex) => (prevIndex + 1) % heroContents.length);
  };

  const prevContent = () => {
    setIndex((prevIndex) =>
      (prevIndex - 1 + heroContents.length) % heroContents.length
    );
  };

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
              <h1 className="hero-title">{heroContents[index].title}</h1>
            </div>
            <div className="hero-right">
              <p className="hero-desc">{heroContents[index].desc}</p>
              <a
                href="https://docs.google.com/forms/d/e/1FAIpQLSeRLaYBI9DDEg23yFs8LbOw01U-m1rr7l87VWwCQTl6AJRNUA/viewform?usp=dialog"
                target="_blank"
                rel="noopener noreferrer"
                className="hero-button"
              >
                Daftarkan diri anda
              </a>
            </div>

            <div className="nav-buttons">
              <button className="nav-button filled" onClick={nextContent}>
                →
              </button>
              <button className="nav-button outlined" onClick={prevContent}>
                ←
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
