import React from "react";
import "./anggota.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation"; // Custom hook untuk animasi scroll
import andrewImg from "../../assets/andrew.png"; // Import gambar anggota
import delwynImg from "../../assets/delwyn.png";
import sergioImg from "../../assets/sergio.png";

// Data anggota organisasi - bisa dipindah ke file terpisah atau fetch dari API
const anggotaList = [
  { nama: "Andrew", jabatan: "Ketua", foto: andrewImg },
  { nama: "Delwyn", jabatan: "Wakil Ketua", foto: delwynImg },
  { nama: "Sergio", jabatan: "Sekretaris", foto: sergioImg },
];

// KOMPONEN ANGGOTA - Menampilkan daftar anggota organisasi dengan animasi scroll
const Anggota = () => {
  // Hook untuk animasi saat scroll - mengembalikan ref dan status visibility
  const [ref, isVisible] = useScrollAnimation();

  return (
    <section 
      className={`anggota-section ${isVisible ? 'animate' : ''}`} // Class conditional untuk animasi
      id="anggota" // ID untuk scroll navigation dari navbar
      ref={ref} // Ref untuk detect scroll position
    >
      <h2 className="anggota-title">Anggota</h2>
      <div className="anggota-container">
        {/* Map through data anggota untuk render cards */}
        {anggotaList.map((anggota, index) => (
          <div className="anggota-card" key={index}>
            <img 
              src={anggota.foto} 
              alt={anggota.nama} 
              className="anggota-img" 
            />
            <h3 className="anggota-nama">{anggota.nama}</h3>
            <p className="anggota-jabatan">{anggota.jabatan}</p>
            <div className="dot"></div> {/* Decorative element */}
          </div>
        ))}
      </div>
    </section>
  );
};

export default Anggota;
