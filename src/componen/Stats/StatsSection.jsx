import React from 'react';
import './StatsSection.css';
import { useScrollAnimation } from '../../hooks/useScrollAnimation';

const stats = [
  { value: '27+', label: 'Anggota' },
  { value: '17+', label: 'Kegiatan' },
  { value: '35+', label: 'Proker' },
];

const StatsSection = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={`stats-section ${isVisible ? 'animate' : ''}`} ref={ref}>
      <div className="stats-wrapper">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="stat-box"
            style={{ transitionDelay: `${index * 0.2}s` }}
          >
            <div className="stat-inner">
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
