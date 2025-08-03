import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BeritaUtama.css"; // Using shared styles
import Berita2Img from "../../assets/Berita2.png";
import BeritaUtamaImg from "../../assets/BeritaUtama.png";
import Berita1Img from "../../assets/Berita1.png";
import Berita3Img from "../../assets/Berita3.png";

const Berita2 = () => {
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
            <span className="breadcrumb-current">Pelatihan Teknologi Penangkapan Ikan</span>
          </div>
          
          <div className="berita-hero-content">
            <div className="badge category">Pelatihan</div>
            <h1 className="berita-title">
              Pelatihan Teknologi Penangkapan Ikan oleh Dinas Perikanan Situbondo
            </h1>
            
            <div className="berita-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>15 Januari 2024</span>
              </div>
              <div className="meta-item">
                <span>⏱️</span>
                <span>4 min read</span>
              </div>
              <div className="meta-item">
                <span>👤</span>
                <span>Dinas Perikanan Situbondo</span>
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
              src={Berita2Img} 
              alt="Pelatihan Teknologi Penangkapan Ikan" 
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
                Program pelatihan untuk meningkatkan kemampuan teknologi penangkapan ikan bagi nelayan lokal dengan teknik ramah lingkungan dan teknologi modern yang diselenggarakan Dinas Perikanan Kabupaten Situbondo.
              </div>

              <div className="article-body">
                <p>
                  Dinas Perikanan Kabupaten Situbondo menggelar program pelatihan teknologi penangkapan ikan yang bertujuan untuk meningkatkan kemampuan dan keterampilan nelayan lokal. Program ini merupakan bagian dari upaya pemerintah daerah dalam mengembangkan sektor perikanan yang berkelanjutan dan ramah lingkungan.
                </p>

                <h3>Teknologi Modern untuk Nelayan</h3>
                <p>
                  Pelatihan ini memperkenalkan berbagai teknologi modern dalam penangkapan ikan, termasuk penggunaan GPS untuk navigasi, fish finder untuk deteksi ikan, dan teknik penangkapan yang efisien. Para peserta juga dibekali dengan pengetahuan tentang penggunaan alat tangkap yang ramah lingkungan untuk menjaga kelestarian ekosistem laut.
                </p>

                <h3>Materi Pelatihan Komprehensif</h3>
                <p>
                  Program pelatihan yang berlangsung selama tiga hari ini mencakup berbagai materi penting, antara lain:
                </p>
                <ul>
                  <li>Pengenalan teknologi fish finder dan GPS</li>
                  <li>Teknik penangkapan ikan yang efektif dan berkelanjutan</li>
                  <li>Manajemen hasil tangkapan dan penanganan pasca panen</li>
                  <li>Keselamatan kerja di laut</li>
                  <li>Konservasi lingkungan laut</li>
                  <li>Kewirausahaan bidang perikanan</li>
                </ul>

                <h3>Partisipasi Aktif Nelayan</h3>
                <p>
                  Pelatihan ini diikuti oleh 40 nelayan dari berbagai desa pesisir di Kabupaten Situbondo. Para peserta menunjukkan antusiasme yang tinggi dalam mengikuti setiap sesi pelatihan. Mereka aktif bertanya dan berdiskusi tentang penerapan teknologi modern dalam aktivitas penangkapan ikan sehari-hari.
                </p>

                <h3>Praktik Lapangan</h3>
                <p>
                  Selain teori, pelatihan ini juga dilengkapi dengan praktik lapangan langsung di laut. Para nelayan mendapat kesempatan untuk mencoba sendiri penggunaan berbagai alat teknologi modern yang telah dipelajari. Instruktur berpengalaman mendampingi setiap peserta untuk memastikan mereka dapat menguasai teknologi tersebut dengan baik.
                </p>

                <h3>Dampak Positif yang Diharapkan</h3>
                <p>
                  Dengan adanya pelatihan ini, diharapkan para nelayan dapat meningkatkan produktivitas penangkapan ikan mereka. Penggunaan teknologi modern akan membantu nelayan dalam menemukan lokasi ikan dengan lebih efisien, sehingga menghemat waktu dan bahan bakar. Selain itu, teknik penangkapan yang ramah lingkungan akan membantu menjaga kelestarian sumber daya laut.
                </p>

                <h3>Komitmen Berkelanjutan</h3>
                <p>
                  Kepala Dinas Perikanan menyampaikan bahwa program pelatihan seperti ini akan terus dilaksanakan secara berkala. Pihaknya juga berkomitmen untuk terus mendampingi para nelayan dalam menerapkan teknologi yang telah dipelajari. "Kami akan terus memberikan dukungan teknis dan bantuan yang diperlukan untuk meningkatkan kesejahteraan nelayan," ujarnya.
                </p>

                <p>
                  Program pelatihan teknologi penangkapan ikan ini merupakan investasi jangka panjang untuk mengembangkan sektor perikanan di Kabupaten Situbondo, sekaligus meningkatkan kesejahteraan masyarakat nelayan.
                </p>
              </div>

              <div className="article-footer">
                <div className="tags">
                  <span className="tag">Pelatihan</span>
                  <span className="tag">Teknologi Perikanan</span>
                  <span className="tag">Nelayan</span>
                  <span className="tag">Situbondo</span>
                  <span className="tag">Dinas Perikanan</span>
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
                  <div className="related-item" onClick={() => navigate('/berita-utama')}>
                    <img src={BeritaUtamaImg} alt="Related news" />
                    <div className="related-content">
                      <h5>RUU Sistem Pendidikan Nasional</h5>
                      <span className="related-date">20 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-1')}>
                    <img src={Berita1Img} alt="Related news" />
                    <div className="related-content">
                      <h5>Penyerahan Sertifikat SeHAT Nelayan</h5>
                      <span className="related-date">18 Jan 2024</span>
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
            <input type="email" className="newsletter-input" placeholder="Masukkan email Anda" required />
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
              src={Berita2Img} 
              alt="Pelatihan Teknologi Penangkapan Ikan" 
              className="modal-image"
            />
            <div className="modal-caption">
              <h4>Pelatihan Teknologi Penangkapan Ikan</h4>
              <p>Program pelatihan teknologi penangkapan ikan yang ramah lingkungan untuk meningkatkan produktivitas dan keberlanjutan usaha nelayan.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Berita2;