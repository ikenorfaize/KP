import React from 'react';
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import './Beasiswa.css';

const Beasiswa = () => {
  return (
    <div>
      {/* Hero Section */}
        <section className="hero">
            <div className="container hero-content">
            <div className="hero-text">
            <div className="badge">Program Beasiswa</div>
                <h1>Beasiswa untuk Guru Nahdliyin</h1>
                <p>
                Wujudkan impian pendidikan dengan berbagai program beasiswa yang tersedia
                untuk anggota PERGUNU dan keluarga
                </p>
            <div className="hero-buttons">
                <a href="#scholarships" className="btn-primary">
          🎓    Lihat Semua Beasiswa
                </a>
                <a href="#" className="btn-outline">Panduan Pendaftaran</a>
            </div>
            </div>
            <div className="hero-image hero-image-frame">
            <img src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600" alt="Scholarship" />
            </div>
            </div>
        </section>

      {/* Filter */}
      <section className="filter-section">
        <div className="container">
          <div className="filter-buttons">
            <button className="filter-btn active">Semua Program</button>
            <button className="filter-btn">S1</button>
            <button className="filter-btn">S2</button>
            <button className="filter-btn">Pelatihan</button>
            <button className="filter-btn">Santri</button>
            <button className="filter-btn">Riset</button>
          </div>
        </div>
      </section>

      {/* Card List (sample satu jenis saja ditampilkan) */}
      <section className="scholarships">
        <div className="container scholarships-grid">
          {[...Array(6)].map((_, index) => (
            <div className="card" key={index}>
              <div className="card-header">
                <h3>Beasiswa Riset Pendidikan Islam</h3>
                <p>Rp 15.000.000</p>
              </div>
              <div className="card-status">
                <span className="status-active">Aktif</span>
                <span className="deadline">Deadline: 30/6/2025</span>
              </div>
              <p className="desc">
                Dana penelitian untuk pengembangan metode pembelajaran Islam kontemporer
              </p>
              <div className="requirements">
                <strong>Persyaratan:</strong>
                <ul>
                  <li>S2/S3 bidang pendidikan</li>
                  <li>Proposal penelitian yang relevan</li>
                  <li>Publikasi jurnal sebelumnya</li>
                </ul>
              </div>
              <div className="card-actions">
                <button className="btn-apply">Daftar Sekarang</button>
                <button className="btn-detail">Detail</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Proses Pendaftaran */}
      <section className="process">
        <div className="container">
          <h2 className="process-title">Proses Pendaftaran</h2>
          <p className="process-desc">Ikuti langkah langkah berikut untuk mendaftar beasiswa PERGUNU Situbondo</p>
          <div className="process-steps">
            <div className="step">
              <div className="circle">1</div>
              <h4>Pilih Program</h4>
              <p>Pilih program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">2</div>
              <h4>Siapkan Dokumen</h4>
              <p>Siapkan program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">3</div>
              <h4>Submit Aplikasi</h4>
              <p>Submit program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
            <div className="step">
              <div className="circle">4</div>
              <h4>Pilih Program</h4>
              <p>Pilih program beasiswa yang sesuai dengan kebutuhan dan kualifikasi anda</p>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak */}
      <footer className="contact-section">
        <div className="container">
          <h3>Butuh Informasi lebih lanjut ?</h3>
          <p>Tim kami siap membantu anda dalam proses pendaftaran beasiswa. Jangan ragu untuk menghubungi kami jika ada pertanyaan.</p>
          <div className="contact-buttons">
            <a href="tel:+6289631011926" className="btn-contact">📞 +62 896 3101 1926</a>
            <a href="mailto:info@example.com" className="btn-contact">✉️ Email kami</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Beasiswa;
