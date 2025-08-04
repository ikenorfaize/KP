import React, { useEffect, useRef, useState } from "react";
import "./Hero.css";
import heroImg from "../../assets/hero.png"; // Import gambar hero banner

// Array konten hero yang bisa berganti-ganti (carousel content)
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

// KOMPONEN HERO - Banner utama dengan carousel content dan animasi scroll
const Hero = () => {
  const ref = useRef(null); // Ref untuk element animasi scroll
  const [index, setIndex] = useState(0); // State untuk index konten yang aktif

  // Effect untuk animasi scroll - menambah class 'animate' saat visible
  useEffect(() => {
    const handleScroll = () => {
      if (ref.current) {
        const { top } = ref.current.getBoundingClientRect(); // Posisi element dari viewport
        const windowHeight =
          window.innerHeight || document.documentElement.clientHeight;
        // Trigger animasi saat element 80% visible
        if (top <= windowHeight * 0.8) {
          ref.current.classList.add("animate");
        } else {
          ref.current.classList.remove("animate");
        }
      }
    };

    // Add scroll listener dan trigger sekali saat mount
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll); // Cleanup
  }, []);

  // Fungsi untuk navigasi ke konten selanjutnya (carousel)
  const nextContent = () => {
    setIndex((prevIndex) => (prevIndex + 1) % heroContents.length);
  };

  // Fungsi untuk navigasi ke konten sebelumnya (carousel)
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
              <div className="hero-buttons">
                <a
                  href="/daftar"
                  className="hero-button primary"
                >
                  Daftarkan diri anda
                </a>
                <a
                  href="#status-tracker"
                  className="hero-button secondary"
                >
                  Cek Status Pendaftaran
                </a>
              </div>
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
