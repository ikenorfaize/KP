import React from "react";
import { useNavigate } from "react-router-dom"; // Hook untuk navigasi programmatic
import "./Berita.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation"; // Custom hook scroll animation
// Import gambar-gambar berita
import beritaUtamaImg from "../../assets/BeritaUtama.png";
import berita1Img from "../../assets/Berita1.png";
import berita2Img from "../../assets/Berita2.png";
import berita3Img from "../../assets/Berita3.png";

// KOMPONEN BERITA - Menampilkan preview berita dengan featured article dan grid
const Berita = () => {
  const navigate = useNavigate(); // Hook untuk navigasi ke halaman berita
  const [ref, isVisible] = useScrollAnimation(); // Hook animasi saat scroll

  return (
    <section
      className={`berita-section ${isVisible ? "animate" : ""}`} // Class conditional untuk animasi
      id="berita" // ID untuk scroll navigation
      ref={ref} // Ref untuk detect scroll position
    >
      <div className="berita-wrapper">
        <p className="berita-label">Berita</p>

        {/* Berita utama - Featured article dengan layout khusus */}
        <div className="berita-utama-card">
          <div className="berita-utama-content">
            <h3>
              RUU Sistem Pendidikan Nasional <br />
              "Kontribusi, Aspirasi dan Inspirasi Perguruan Tinggi, PAI, PJJ, Madrasah dan Pondok Pesantren"
            </h3>
            <p>
              Diskusi mengenai RUU Sisdiknas yang menyoroti kontribusi, aspirasi,
              dan inspirasi dari berbagai elemen pendidikan.
            </p>
            {/* Button navigasi ke halaman berita lengkap */}
            <button onClick={() => navigate("/berita-utama")}>
              baca selengkapnya
            </button>
          </div>
          <img src={beritaUtamaImg} alt="Berita utama" />
        </div>

        {/* Grid berita lainnya - Layout grid untuk multiple articles*/}
        <div className="berita-grid">
          {/* Card berita dengan click handler untuk navigasi */}
          <div className="berita-card" onClick={() => navigate("/berita-1")}>
            <img src={berita1Img} alt="Berita 1" />
            <p>Penyerahan Sertifikat Hak Atas Tanah (SeHAT)...</p>
          </div>
          <div className="berita-card" onClick={() => navigate("/berita-2")}>
            <img src={berita2Img} alt="Berita 2" />
            <p>Pelatihan Teknologi Penangkapan Ikan oleh DKP Situbondo</p>
          </div>
          <div className="berita-card" onClick={() => navigate("/berita-3")}>
            <img src={berita3Img} alt="Berita 3" />
            <p>Bupati & Wakil Bupati Situbondo bersama DKP</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Berita;
