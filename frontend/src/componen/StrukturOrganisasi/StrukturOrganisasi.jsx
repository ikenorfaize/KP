// StrukturOrganisasi.jsx - Section Departemen-Departemen PERGUNU
import React from 'react';
import './struktur-organisasi.css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const StrukturOrganisasi = () => {
  const [ref, isVisible] = useScrollAnimation();
  // Fungsi untuk konfirmasi sebelum download
  const handleDownload = (fileName, documentName) => {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin mengunduh dokumen ${documentName}?`
    );
    
    if (confirmed) {
      // Buat element anchor sementara untuk trigger download
      const link = document.createElement('a');
      link.href = `/files/${fileName}`;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Tampilkan notifikasi sukses
      alert(`Dokumen ${documentName} berhasil diunduh!`);
    }
  };

  const departemen = [
    {
      id: 1,
      nama: "Departemen Peningkatan dan Kompetensi Guru",
      singkatan: "DPKG"
    },
    {
      id: 2,
      nama: "Departemen Pelindungan Hukum, Penghargaan dan Keselamatan Kerja",
      singkatan: "DPHPKK"
    },
    {
      id: 3,
      nama: "Departemen Penelitian, Karya Ilmiah dan Publikasi",
      singkatan: "DPKIP"
    },
    {
      id: 4,
      nama: "Departemen Kerjasama dan Kajian Strategis",
      singkatan: "DKKS"
    },
    {
      id: 5,
      nama: "Departemen Koperasi dan Peningkatan Kesejahteraan Guru",
      singkatan: "DKPKG"
    },
    {
      id: 6,
      nama: "Departemen Kaderisasi dan Pembinaan Karakter Aswaja Annahdliyah",
      singkatan: "DKPKAA"
    },
    {
      id: 7,
      nama: "Departemen Seni, Budaya dan Olahraga",
      singkatan: "DSBO"
    },
    {
      id: 8,
      nama: "Departemen Kesekretariatan dan Keanggotaan",
      singkatan: "DKK"
    },
    {
      id: 9,
      nama: "Departemen Komunikasi dan Teknologi Digital",
      singkatan: "DKTD"
    }
  ];

  return (
    <section 
      className={`struktur-organisasi ${isVisible ? 'animate' : ''}`} 
      id="struktur-organisasi"
      ref={ref}
    >
      <div className="container">
        {/* Header Section */}
        <div className="struktur-header">
          <p className="tentang-sub">Struktur Organisasi</p>
          <h2 className="struktur-pasal">PASAL 17</h2>
          <h3 className="struktur-title">Departemen-Departemen</h3>
        </div>

        {/* Departemen Grid */}
        <div className="departemen-grid">
          {departemen.map((dept) => (
            <div key={dept.id} className="departemen-card">
              <div className="departemen-number">
                <span>{dept.id}</span>
              </div>
              <div className="departemen-content">
                <h4 className="departemen-nama">{dept.nama}</h4>
                <p className="departemen-singkatan">({dept.singkatan})</p>
              </div>
            </div>
          ))}
        </div>

        {/* Reference Section */}
        <div className="struktur-reference">
          <p>Peraturan Dasar dan Peraturan Rumah Tangga (PD & PRT) Pergunu 2022; Hal: 17</p>
        </div>

        {/* Download Buttons */}
        <div className="struktur-downloads">
          <button 
            onClick={() => handleDownload('205_SK_JPZISNU_PERGUNU.pdf', 'SK JPZISNU')}
            className="tentang-button"
          >
            SK JPZISNU
          </button>
          <button 
            onClick={() => handleDownload('SK_PC_Kab_Situbondo_084.pdf', 'SK PC Kab. Situbondo')}
            className="tentang-button"
          >
            SK PC
          </button>
        </div>
      </div>
    </section>
  );
};

export default StrukturOrganisasi;
