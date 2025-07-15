import React from "react";
import "./anggota.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
import andrewImg from "../../assets/andrew.png";
import delwynImg from "../../assets/delwyn.png";
import sergioImg from "../../assets/sergio.png";

const anggotaList = [
  { nama: "Andrew", jabatan: "Ketua", foto: andrewImg },
  { nama: "Delwyn", jabatan: "Wakil Ketua", foto: delwynImg },
  { nama: "Sergio", jabatan: "Sekretaris", foto: sergioImg },
];

const Anggota = () => {
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section className={`anggota-section ${isVisible ? 'animate' : ''}`} id="anggota" ref={ref}>
      <h2 className="anggota-title">Anggota</h2>
      <div className="anggota-container">
        {anggotaList.map((anggota, index) => (
          <div className="anggota-card" key={index} style={{transitionDelay: `${index * 0.2}s`}}>
            <img src={anggota.foto} alt={anggota.nama} className="anggota-img" />
            <h3 className="anggota-nama">{anggota.nama}</h3>
            <p className="anggota-jabatan">{anggota.jabatan}</p>
            <div className="dot"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Anggota;
