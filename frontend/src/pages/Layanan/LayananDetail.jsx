import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { layananData } from '../../componen/Layanan/layananData';
import logo from '../../assets/logo.png';
import './LayananDetail.css';

const LayananDetail = () => {
  const { id } = useParams();
  const item = layananData.find(x => x.id === id);

  if (!item) {
    return (
      <div className="layanan-detail-page">
        <div className="container">
          <h1>Konten tidak ditemukan</h1>
          <p>Maaf, layanan dengan id "{id}" tidak tersedia.</p>
          <Link className="tentang-button" to="/layanan">Kembali ke Layanan</Link>
        </div>
      </div>
    );
  }

  // Dedicated rich UI for TapCash detail
  if (id === 'tapcash') {
    return (
      <div className="layanan-detail-page">
        <div className="container">
          <div className="tapcash-hero">
            <div className="hero-copy">
              <h1 className="title">TapCash PERGUNU</h1>
              <p className="lead">
                Ide kartu multi guna PERGUNU dengan fasilitas TapCash yang strategis untuk transaksi, iuran, dan donasi ZIS—terintegrasi aman dan mudah.
              </p>
              <div className="cta-row">
                <a className="tentang-button" href="#implementasi">Lihat langkah implementasi</a>
                <Link className="btn-outline" to={`/?id=${id}#layanan`}>
                  Buka layanan ini
                </Link>
              </div>
            </div>
            <div className="id-card" aria-label="Mockup kartu anggota">
              <div className="card-top">
                <img src={logo} alt="PERGUNU" className="card-logo" />
                <span className="brand">PERGUNU</span>
              </div>
              <div className="card-body">
                <div className="chip" />
                <div className="member">
                  <div className="name">Nama Anggota</div>
                  <div className="id">ID: 0000 1234 5678</div>
                </div>
                <div className="qr" aria-hidden="true" />
              </div>
              <div className="card-footer">TapCash • Multi Guna</div>
            </div>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <h3 className="section-title">🪪 Identitas Keanggotaan</h3>
              <ul className="list">
                <li>Nama anggota</li>
                <li>Nomor Induk Anggota PERGUNU</li>
                <li>QR Code untuk verifikasi digital</li>
                <li>Foto anggota (opsional)</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3 className="section-title">💳 Fungsi TapCash</h3>
              <ul className="list">
                <li>Transaksi di merchant TapCash (transportasi, minimarket, dll.)</li>
                <li>Top-up saldo via bank mitra (BNI, Mandiri, BRI)</li>
                <li>Saldo dapat digunakan untuk:
                  <ul className="sub-list">
                    <li>Pembayaran iuran anggota</li>
                    <li>Donasi zakat, infaq, sedekah</li>
                    <li>Pembelian produk komunitas guru</li>
                  </ul>
                </li>
              </ul>
            </div>
            <div className="feature-card">
              <h3 className="section-title">🤝 Integrasi ZIS</h3>
              <ul className="list">
                <li>Auto-debit untuk donasi rutin</li>
                <li>Laporan transaksi dan donasi bulanan</li>
                <li>Poin/badge untuk anggota aktif berdonasi</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3 className="section-title">🔐 Keamanan & Validasi</h3>
              <ul className="list">
                <li>Chip TapCash untuk transaksi aman</li>
                <li>Verifikasi ganda via aplikasi (PIN atau OTP)</li>
                <li>Pelacakan transaksi dan histori donasi</li>
              </ul>
            </div>
            <div className="feature-card">
              <h3 className="section-title">🎁 Manfaat Tambahan</h3>
              <ul className="list">
                <li>Diskon khusus di merchant mitra PERGUNU</li>
                <li>Akses prioritas ke kegiatan organisasi</li>
                <li>Program loyalitas untuk anggota aktif</li>
              </ul>
            </div>
          </div>

          <div id="implementasi" className="impl-section">
            <h3 className="section-title">📦 Langkah Implementasi</h3>
            <ol className="steps">
              <li>Kerja sama dengan bank penyedia TapCash (BNI/Mandiri)</li>
              <li>Desain kartu dan branding PERGUNU</li>
              <li>Pengembangan backend untuk pengelolaan ZIS & keanggotaan</li>
              <li>Sosialisasi dan pelatihan penggunaan kepada anggota</li>
              <li>Monitoring dan evaluasi berkala</li>
            </ol>
            <div className="cta-row">
              <a className="tentang-button" href="#">Minta Proposal Teknis</a>
              <Link className="btn-outline" to={`/?id=${id}#layanan`}>Kembali</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Default generic renderer for other layanan
  return (
    <div className="layanan-detail-page">
      <div className="container">
        <h1 className="title">{item.title}</h1>
        {item.image && (
          <img className="hero-image" src={item.image} alt={item.title} />
        )}
        <div className="content">
          {typeof item.content === 'object' ? (
            <>
              <p>{item.content.description}</p>
              {Array.isArray(item.content.features) && (
                <ul>
                  {item.content.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <p>{item.content}</p>
          )}
        </div>
        <div className="actions">
          <Link className="tentang-button" to={`/?id=${id}#layanan`}>Kembali</Link>
        </div>
      </div>
    </div>
  );
};

export default LayananDetail;
