import React from "react";
import "./Anggota.css";

import andrewImg from "../../assets/andrew.png";
import delwynImg from "../../assets/delwyn.png";
import sergioImg from "../../assets/sergio.png";

const anggotaList = [
  {
    nama: "Andrew Wallace",
    jabatan: "Wakil presiden",
    foto: andrewImg,
  },
  {
    nama: "Delwyn Alexander",
    jabatan: "Presiden",
    foto: delwynImg,
  },
  {
    nama: "Sergio Costa",
    jabatan: "Sekretaris",
    foto: sergioImg,
  },
];

const Anggota = () => {
  return (
    <section className="anggota-section">
      <h2 className="anggota-title">Anggota</h2>
      <div className="anggota-container">
        {anggotaList.map((anggota, index) => (
          <div className="anggota-card" key={index}>
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
