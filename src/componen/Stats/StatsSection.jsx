import React from 'react';
import './StatsSection.css';

const stats = [
  { value: '27+', label: 'Anggota' },
  { value: '17+', label: 'Kegiatan' },
  { value: '35+', label: 'Proker' },
];

const StatsSection = () => {
  return (
    <section className="stats-section">
      <div className="stats-wrapper">
        {stats.map((stat, index) => (
          <div key={index} className="stat-box">
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
