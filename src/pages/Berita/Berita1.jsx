import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Berita4.css"; // Using shared styles
import SidebarWidget from "../../componen/SidebarWidget";
import Berita1Img from "../../assets/Berita1.png";
import Berita4Img from "../../assets/Berita4.png";
import Berita2Img from "../../assets/Berita2.png";
import Berita3Img from "../../assets/Berita3.png";

const Berita1 = () => {
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
            <span className="breadcrumb-current">Penyerahan Sertifikat SeHAT</span>
          </div>
          
          <div className="berita-hero-content">
            <div className="badge category">Sosial</div>
            <h1 className="berita-title">
              Penyerahan Simbolis Sertifikat Hak Atas Tanah (SeHAT) Nelayan
            </h1>
            
            <div className="berita-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>18 Januari 2024</span>
              </div>
              <div className="meta-item">
                <span>⏱️</span>
                <span>3 min read</span>
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
              src={Berita1Img} 
              alt="Penyerahan Sertifikat SeHAT Nelayan" 
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
                Program pemerintah untuk memberikan kepastian hukum kepada nelayan melalui sertifikat hak atas tanah yang dilaksanakan oleh Dinas Perikanan Kabupaten Situbondo dalam rangka meningkatkan kesejahteraan masyarakat pesisir.
              </div>

              <div className="article-body">
                <p>
                  Kabupaten Situbondo kembali menunjukkan komitmennya dalam memberikan kepastian hukum kepada masyarakat, khususnya para nelayan. Melalui program Sertifikat Hak Atas Tanah (SeHAT), Dinas Perikanan Kabupaten Situbondo melaksanakan penyerahan simbolis sertifikat kepada para nelayan di wilayah pesisir.
                </p>

                <h3>Latar Belakang Program SeHAT</h3>
                <p>
                  Program Sertifikat Hak Atas Tanah (SeHAT) merupakan inisiatif pemerintah daerah untuk memberikan jaminan kepastian hukum atas kepemilikan tanah bagi masyarakat, terutama nelayan yang selama ini tinggal di wilayah pesisir. Program ini bertujuan untuk meningkatkan kesejahteraan ekonomi dan memberikan rasa aman kepada para nelayan dalam menjalankan aktivitas sehari-hari.
                </p>

                <h3>Pelaksanaan Penyerahan</h3>
                <p>
                  Acara penyerahan simbolis sertifikat dilaksanakan di Balai Desa dengan dihadiri oleh Kepala Dinas Perikanan, perwakilan dari Badan Pertanahan Nasional (BPN), serta para tokoh masyarakat setempat. Dalam kesempatan ini, sebanyak 50 sertifikat diserahkan kepada nelayan yang telah memenuhi persyaratan administrasi.
                </p>

                <h3>Manfaat bagi Nelayan</h3>
                <p>
                  Dengan adanya sertifikat hak atas tanah ini, para nelayan dapat merasakan berbagai manfaat, antara lain:
                </p>
                <ul>
                  <li>Kepastian hukum atas kepemilikan tanah</li>
                  <li>Kemudahan dalam mengakses kredit perbankan</li>
                  <li>Peningkatan nilai aset yang dimiliki</li>
                  <li>Perlindungan dari sengketa tanah</li>
                  <li>Kemudahan dalam proses jual beli tanah</li>
                </ul>

                <h3>Respons Positif Masyarakat</h3>
                <p>
                  Para nelayan yang menerima sertifikat menyambut baik program ini. Mereka merasa terbantu dengan adanya kepastian hukum atas tanah yang selama ini mereka tempati. "Kami sangat berterima kasih kepada pemerintah daerah yang telah memperhatikan nasib kami para nelayan," ujar salah satu penerima sertifikat.
                </p>

                <h3>Komitmen Berkelanjutan</h3>
                <p>
                  Kepala Dinas Perikanan menyampaikan bahwa program ini akan terus dilanjutkan hingga seluruh nelayan di Kabupaten Situbondo memiliki sertifikat hak atas tanah. Pihaknya juga berkomitmen untuk terus mendampingi masyarakat nelayan dalam berbagai program pemberdayaan lainnya.
                </p>

                <p>
                  Program SeHAT ini merupakan salah satu wujud nyata perhatian pemerintah daerah terhadap kesejahteraan masyarakat pesisir, khususnya para nelayan yang menjadi tulang punggung ekonomi maritim di Kabupaten Situbondo.
                </p>
              </div>

              <div className="article-footer">
                <div className="tags">
                  <span className="tag">Sosial</span>
                  <span className="tag">Nelayan</span>
                  <span className="tag">Sertifikat Tanah</span>
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
              <SidebarWidget 
                title="Berita Terkait"
                maxItems={6}
                currentNewsId="default-1"
                autoUpdate={true}
                updateInterval={30000}
                showViewAllButton={true}
              />
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
              id="newsletter-email-berita1"
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
              src={Berita1Img} 
              alt="Penyerahan Sertifikat SeHAT Nelayan" 
              className="modal-image"
            />
            <div className="modal-caption">
              <h4>Penyerahan Sertifikat Hak Atas Tanah (SeHAT) Nelayan</h4>
              <p>Penyerahan sertifikat hak atas tanah kepada nelayan dalam upaya memberikan kepastian hukum dan meningkatkan kesejahteraan masyarakat pesisir.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Berita1;