// StatsSection Component - Komponen untuk menampilkan statistik organisasi
// Menunjukkan pencapaian PERGUNU dalam angka yang menarik
import React from 'react';
import './StatsSection.css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';  // Custom hook untuk animasi scroll

// Data statistik yang akan ditampilkan
const stats = [
  { value: '27+', label: 'Anggota' },     // Jumlah anggota aktif
  { value: '17+', label: 'Kegiatan' },   // Jumlah kegiatan yang telah dilaksanakan
  { value: '35+', label: 'Proker' },     // Jumlah program kerja
];

const StatsSection = () => {
  // Menggunakan custom hook untuk animasi saat scroll
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={`stats-section ${isVisible ? 'animate' : ''}`} ref={ref}>
      <div className="stats-wrapper">
        {/* Map melalui array stats untuk generate stat boxes */}
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-box"
            style={{ transitionDelay: `${index * 0.2}s` }}  // Staggered animation delay
          >
            <div className="stat-inner">
              {/* Nilai statistik (angka besar) */}
              <div className="stat-value">{stat.value}</div>
              {/* Label statistik (keterangan) */}
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

// Export StatsSection component untuk digunakan di homepage
export default StatsSection;
