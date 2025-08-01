import React from "react";
import { useNavigate } from "react-router-dom";
import "./BeritaUtama.css"; // Using shared styles

const Berita1 = () => {
  const navigate = useNavigate();

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
          <img 
            src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=600" 
            alt="Penyerahan Sertifikat SeHAT Nelayan" 
            className="featured-img"
          />
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
              <div className="sidebar-widget">
                <h4>Berita Terkait</h4>
                <div className="related-news">
                  <div className="related-item" onClick={() => navigate('/berita-utama')}>
                    <img src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=100&h=60" alt="Related news" />
                    <div className="related-content">
                      <h5>RUU Sistem Pendidikan Nasional</h5>
                      <span className="related-date">20 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-2')}>
                    <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=60" alt="Related news" />
                    <div className="related-content">
                      <h5>Pelatihan Teknologi Penangkapan Ikan</h5>
                      <span className="related-date">15 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-3')}>
                    <img src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=100&h=60" alt="Related news" />
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
    </div>
  );
};

export default Berita1;