import React from "react";
import { useNavigate } from "react-router-dom";
import "./BeritaUtama.css"; // Using shared styles

const Berita3 = () => {
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
            <span className="breadcrumb-current">Kunjungan Bupati dan Wakil Bupati</span>
          </div>
          
          <div className="berita-hero-content">
            <div className="badge category">Pemerintahan</div>
            <h1 className="berita-title">
              Bupati dan Wakil Bupati Situbondo Bersama Dinas Perikanan
            </h1>
            
            <div className="berita-meta">
              <div className="meta-item">
                <span>📅</span>
                <span>12 Januari 2024</span>
              </div>
              <div className="meta-item">
                <span>⏱️</span>
                <span>6 min read</span>
              </div>
              <div className="meta-item">
                <span>👤</span>
                <span>Humas Pemkab Situbondo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      <section className="berita-featured-image">
        <div className="container">
          <img 
            src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=1200&h=600" 
            alt="Kunjungan Bupati dan Wakil Bupati Situbondo" 
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
                Kunjungan kerja Bupati dan Wakil Bupati Situbondo untuk meninjau program-program pemberdayaan masyarakat pesisir dan memastikan program berjalan sesuai target yang ditetapkan dalam upaya meningkatkan kesejahteraan nelayan.
              </div>

              <div className="article-body">
                <p>
                  Bupati Situbondo, Dadang Wigiarto, S.H., M.Si., bersama Wakil Bupati, Ir. H. Yusuf Widyatmoko, M.M., melaksanakan kunjungan kerja ke Dinas Perikanan Kabupaten Situbondo. Kunjungan ini bertujuan untuk meninjau secara langsung program-program yang telah dan sedang dilaksanakan oleh Dinas Perikanan dalam rangka pemberdayaan masyarakat pesisir.
                </p>

                <h3>Agenda Kunjungan Kerja</h3>
                <p>
                  Dalam kunjungan kerja yang berlangsung selama sehari penuh ini, Bupati dan Wakil Bupati melakukan evaluasi mendalam terhadap berbagai program strategis yang telah dijalankan. Agenda utama meliputi:
                </p>
                <ul>
                  <li>Evaluasi program pemberdayaan nelayan</li>
                  <li>Tinjauan infrastruktur perikanan</li>
                  <li>Dialog dengan kelompok nelayan</li>
                  <li>Peninjauan fasilitas cold storage</li>
                  <li>Monitoring program bantuan alat tangkap</li>
                </ul>

                <h3>Capaian Program Perikanan</h3>
                <p>
                  Kepala Dinas Perikanan memaparkan berbagai capaian positif yang telah diraih selama tahun 2023. Beberapa program unggulan yang mendapat apresiasi dari Bupati antara lain program bantuan perahu dan alat tangkap untuk nelayan, pembangunan fasilitas cold storage, serta program pelatihan teknologi penangkapan ikan yang ramah lingkungan.
                </p>

                <h3>Kondisi Infrastruktur Perikanan</h3>
                <p>
                  Selama peninjauan, Bupati dan Wakil Bupati menyempatkan diri untuk mengecek kondisi infrastruktur perikanan yang ada. Mereka mengapresiasi upaya Dinas Perikanan dalam menjaga dan mengembangkan fasilitas-fasilitas penunjang aktivitas nelayan, meskipun masih ada beberapa infrastruktur yang memerlukan perbaikan dan pengembangan lebih lanjut.
                </p>

                <h3>Dialog dengan Masyarakat Nelayan</h3>
                <p>
                  Bagian yang tak kalah penting dari kunjungan ini adalah dialog langsung dengan perwakilan kelompok nelayan. Para nelayan menyampaikan berbagai aspirasi dan kendala yang mereka hadapi dalam menjalankan aktivitas sehari-hari. Beberapa poin utama yang disampaikan meliputi:
                </p>
                <ul>
                  <li>Kebutuhan akan fasilitas pendaratan ikan yang lebih baik</li>
                  <li>Bantuan modal usaha untuk pengembangan armada</li>
                  <li>Pelatihan diversifikasi produk olahan ikan</li>
                  <li>Perbaikan akses jalan menuju dermaga</li>
                  <li>Program asuransi untuk nelayan</li>
                </ul>

                <h3>Komitmen Pemimpin Daerah</h3>
                <p>
                  Menanggapi berbagai aspirasi yang disampaikan, Bupati Situbondo menegaskan komitmennya untuk terus mendukung pengembangan sektor perikanan. "Sektor perikanan merupakan salah satu tulang punggung ekonomi daerah kita. Kami akan terus berupaya memberikan dukungan terbaik untuk kesejahteraan masyarakat nelayan," ujar Bupati.
                </p>

                <h3>Arahan dan Solusi</h3>
                <p>
                  Wakil Bupati, Ir. H. Yusuf Widyatmoko, M.M., memberikan arahan khusus kepada Dinas Perikanan untuk lebih mengoptimalkan program-program yang ada. Beliau juga menekankan pentingnya koordinasi yang baik dengan instansi terkait lainnya untuk memastikan sinergi dalam pelaksanaan program pemberdayaan masyarakat pesisir.
                </p>

                <h3>Rencana Tindak Lanjut</h3>
                <p>
                  Sebagai tindak lanjut dari kunjungan kerja ini, Bupati menginstruksikan Dinas Perikanan untuk menyusun rencana aksi yang lebih komprehensif untuk tahun 2024. Rencana tersebut harus mencakup target-target terukur dan timeline yang jelas untuk setiap program yang akan dilaksanakan.
                </p>

                <p>
                  Kunjungan kerja ini menunjukkan komitmen tinggi pemerintah daerah dalam memperhatikan nasib masyarakat nelayan dan mengembangkan potensi maritim Kabupaten Situbondo. Dengan dukungan penuh dari pemimpin daerah, diharapkan sektor perikanan dapat berkembang lebih pesat dan memberikan kesejahteraan yang lebih baik bagi masyarakat pesisir.
                </p>
              </div>

              <div className="article-footer">
                <div className="tags">
                  <span className="tag">Pemerintahan</span>
                  <span className="tag">Kunjungan Kerja</span>
                  <span className="tag">Bupati Situbondo</span>
                  <span className="tag">Dinas Perikanan</span>
                  <span className="tag">Pemberdayaan Nelayan</span>
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
                  
                  <div className="related-item" onClick={() => navigate('/berita-1')}>
                    <img src="https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=100&h=60" alt="Related news" />
                    <div className="related-content">
                      <h5>Penyerahan Sertifikat SeHAT Nelayan</h5>
                      <span className="related-date">18 Jan 2024</span>
                    </div>
                  </div>
                  
                  <div className="related-item" onClick={() => navigate('/berita-2')}>
                    <img src="https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=100&h=60" alt="Related news" />
                    <div className="related-content">
                      <h5>Pelatihan Teknologi Penangkapan Ikan</h5>
                      <span className="related-date">15 Jan 2024</span>
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

export default Berita3;