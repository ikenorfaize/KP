// src/componen/Berita/Berita.jsx
import React from "react";
import "./Berita.css";
import { useNavigate } from "react-router-dom";
import beritaUtamaImg from "../../assets/BeritaUtama.png";
import berita1Img from "../../assets/Berita1.png";
import berita2Img from "../../assets/Berita2.png";
import berita3Img from "../../assets/Berita3.png";

const Berita = () => {
  const navigate = useNavigate();

  return (
    <section className="berita-section" id="berita">
      <p className="berita-label">Berita</p>
      <div className="berita-wrapper">
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
            <button onClick={() => navigate("/berita-utama")}>baca selengkapnya</button>
          </div>
          <img src={beritaUtamaImg} alt="Berita utama" />
        </div>

        <div className="berita-grid">
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
