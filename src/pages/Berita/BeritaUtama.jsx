import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BeritaUtama.css";
import BeritaUtamaImg from "../../assets/BeritaUtama.png";
import Berita1Img from "../../assets/Berita1.png";
import Berita2Img from "../../assets/Berita2.png";
import Berita3Img from "../../assets/Berita3.png";

const BeritaUtama = () => {
  const navigate = useNavigate();
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  return (
    <div className="berita-detail-container">
      {/* Hero Section */}
      <section className="berita-hero">
        <div className="container">
          <div className="breadcrumb">
            <span onClick={() => navigate('/')} className="breadcrumb-link">Home</span>
            <span className="breadcrumb-separator">→</span>
            <span onClick={() => navigate('/berita')} className="breadcrumb-link">Berita</span>
            <span className="breadcrumb-separator">→</span>
            <span className="breadcrumb-current">RUU Sistem Pendidikan Nasional</span>
          </div>
          
          <div className="berita-hero-content">
            <div className="badge category">Pendidikan</div>
            <h1 className="berita-title">
              RUU Sistem Pendidikan Nasional "Kontribusi, Aspirasi dan Inspirasi Perguruan Tinggi, PAI, PJJ, Madrasah dan Pondok Pesantren"
            </h1>
            
            <div className="berita-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>20 Januari 2024</span>
              </div>
              <div className="meta-item">
                <span>⏱️</span>
                <span>5 min read</span>
              </div>
              <div className="meta-item">
                <span>👤</span>
                <span>Tim Redaksi PERGUNU</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="berita-featured-image">
        <div className="container">
          <div className="image-container">
            <img 
              src={BeritaUtamaImg} 
              alt="RUU Sistem Pendidikan Nasional" 
              className="featured-img interactive-img"
              onClick={() => setIsImageModalOpen(true)}
            />
            <div className="image-overlay">
              <div className="zoom-icon">🔍</div>
              <span className="zoom-text">Klik untuk memperbesar</span>
            </div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="berita-content">
        <div className="container">
          <div className="content-wrapper">
            <article className="article-content">
              <div className="article-lead">
                Diskusi mengenai Rancangan Undang-Undang Sistem Pendidikan Nasional (RUU Sisdiknas) yang menyoroti kontribusi, aspirasi, dan inspirasi dari berbagai elemen pendidikan seperti perguruan tinggi, Pendidikan Agama Islam (PAI), Pendidikan Jarak Jauh (PJJ), madrasah, dan pondok pesantren.
              </div>

              <div className="article-body">
                <p>
                  Rancangan Undang-Undang Sistem Pendidikan Nasional (RUU Sisdiknas) merupakan sebuah inisiatif penting yang bertujuan untuk memperkuat dan mengintegrasikan berbagai komponen pendidikan di Indonesia. Dalam konteks ini, peran perguruan tinggi, Pendidikan Agama Islam (PAI), Pendidikan Jarak Jauh (PJJ), madrasah, dan pondok pesantren menjadi sangat strategis.
                </p>

                <h3>Kontribusi Perguruan Tinggi</h3>
                <p>
                  Perguruan tinggi memiliki peran vital dalam menghasilkan sumber daya manusia yang berkualitas dan kompeten. Melalui RUU Sisdiknas, perguruan tinggi diharapkan dapat lebih optimal dalam memberikan kontribusi terhadap pembangunan nasional melalui tri dharma perguruan tinggi: pendidikan, penelitian, dan pengabdian kepada masyarakat.
                </p>

                <h3>Aspirasi Pendidikan Agama Islam (PAI)</h3>
                <p>
                  Pendidikan Agama Islam memiliki aspirasi untuk membentuk karakter peserta didik yang berakhlak mulia dan memiliki keimanan yang kuat. Dalam RUU Sisdiknas, PAI diposisikan sebagai mata pelajaran wajib yang harus diberikan pada setiap jenjang pendidikan, dari pendidikan dasar hingga pendidikan tinggi.
                </p>

                <h3>Inspirasi dari Pendidikan Jarak Jauh (PJJ)</h3>
                <p>
                  Pandemi COVID-19 telah memberikan inspirasi besar terhadap pengembangan Pendidikan Jarak Jauh (PJJ). Model pembelajaran ini terbukti efektif dalam menjangkau peserta didik di daerah terpencil dan memberikan fleksibilitas dalam proses pembelajaran. RUU Sisdiknas mengakomodasi pengembangan PJJ sebagai salah satu modalitas pembelajaran yang sah dan diakui.
                </p>

                <h3>Peran Madrasah dan Pondok Pesantren</h3>
                <p>
                  Madrasah dan pondok pesantren merupakan lembaga pendidikan yang memiliki karakteristik unik dalam sistem pendidikan nasional. Keduanya tidak hanya memberikan pendidikan umum, tetapi juga pendidikan agama yang mendalam. Dalam RUU Sisdiknas, kedua lembaga ini diakui sebagai bagian integral dari sistem pendidikan nasional.
                </p>

                <h3>Integrasi dan Sinergi</h3>
                <p>
                  RUU Sisdiknas menekankan pentingnya integrasi dan sinergi antara berbagai komponen pendidikan. Hal ini bertujuan untuk menciptakan sistem pendidikan yang komprehensif, berkualitas, dan mampu menghasilkan lulusan yang siap menghadapi tantangan zaman.
                </p>

                <p>
                  Dengan adanya RUU Sisdiknas ini, diharapkan sistem pendidikan nasional dapat lebih terstruktur, terintegrasi, dan mampu memberikan layanan pendidikan yang berkualitas bagi seluruh rakyat Indonesia, sesuai dengan amanat Undang-Undang Dasar 1945.
                </p>
              </div>

              <div className="article-footer">
                <div className="tags">
                  <span className="tag">Pendidikan</span>
                  <span className="tag">RUU Sisdiknas</span>
                  <span className="tag">Perguruan Tinggi</span>
                  <span className="tag">PAI</span>
                  <span className="tag">Madrasah</span>
                </div>
                
                <div className="share-buttons">
                  <span>Bagikan:</span>
                  <button className="share-btn facebook">📘 Facebook</button>
                  <button className="share-btn twitter">🐦 Twitter</button>
                  <button className="share-btn whatsapp">💬 WhatsApp</button>
                </div>
              </div>
            </article>

            {/* Sidebar */}
            <aside className="sidebar">
              <div className="sidebar-widget">
                <h4>Berita Terkait</h4>
                <div className="related-news">
                  <div className="related-item" onClick={() => navigate('/berita-1')}>
                    <img src={Berita1Img} alt="Related news" />
                    <div className="related-content">
                      <h5>Penyerahan Sertifikat Hak Atas Tanah (SeHAT) Nelayan</h5>
                      <span className="related-date">18 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-2')}>
                    <img src={Berita2Img} alt="Related news" />
                    <div className="related-content">
                      <h5>Pelatihan Teknologi Penangkapan Ikan</h5>
                      <span className="related-date">15 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-3')}>
                    <img src={Berita3Img} alt="Related news" />
                    <div className="related-content">
                      <h5>Kunjungan Bupati dan Wakil Bupati</h5>
                      <span className="related-date">12 Jan 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2>Dapatkan Berita Terbaru</h2>
          <p>Berlangganan newsletter kami untuk mendapatkan informasi terkini seputar PERGUNU Situbondo</p>
          
          <form className="newsletter-form" onSubmit={(e) => {
            e.preventDefault();
            const email = e.target.querySelector('.newsletter-input').value;
            alert('Terima kasih! Email ' + email + ' telah didaftarkan untuk newsletter.');
            e.target.reset();
          }}>
            <input 
              type="email" 
              id="newsletter-email-utama"
              name="newsletter-email"
              className="newsletter-input" 
              placeholder="Masukkan email Anda" 
              required 
              autoComplete="email"
            />
            <button type="submit" className="newsletter-btn">Berlangganan</button>
          </form>
        </div>
      </section>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div className="image-modal" onClick={() => setIsImageModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setIsImageModalOpen(false)}>
              ✕
            </button>
            <img 
              src={BeritaUtamaImg} 
              alt="RUU Sistem Pendidikan Nasional" 
              className="modal-image"
            />
            <div className="modal-caption">
              <h4>RUU Sistem Pendidikan Nasional</h4>
              <p>Kontribusi, Aspirasi dan Inspirasi Perguruan Tinggi, PAI, PJJ, Madrasah dan Pondok Pesantren dalam pembentukan sistem pendidikan nasional.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BeritaUtama;