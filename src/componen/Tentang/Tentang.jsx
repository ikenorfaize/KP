import React from "react";
import "./Tentang.css";
import aboutImg from "../../assets/about.png"; // ganti dengan gambar kamu

const Tentang = () => {
return (
<section className="tentang-section" id="tentang">
<div className="tentang-container">
<div className="tentang-left">
<p className="tentang-sub">Tentang</p>
<h2 className="tentang-title">
Persatuan Guru Nahdlatul Ulama (PERGUNU) Situbondo
</h2>
<p className="tentang-desc">
Hadir sebagai wadah perjuangan para pendidik Nahdiyin dalam
mengusung nilai-nilai Ahlussunnah wal Jama’ah, memperjuangkan
kemuliaan profesi guru, dan menguatkan peran strategis pendidikan
dalam membangun peradaban bangsa.
</p>
<button className="tentang-button">Baca selengkapnya</button>
</div>
    <div className="tentang-middle">
      <img src={aboutImg} alt="guru mengajar" />
    </div>

    <div className="tentang-right">
      <div className="tentang-card green">
        <h4>Misi</h4>
        <ul>
          <li>Meningkatkan kompetensi dan profesionalisme guru</li>
          <li>
            Mengembangkan budaya pendidikan yang unggul dalam iman, ilmu,
            teknologi, seni, dan budaya
          </li>
        </ul>
      </div>
      <div className="tentang-card white">
        <details>
          <summary>Visi</summary>
          <p>
            Menjadi organisasi profesi guru yang berdaya, berkarakter, dan
            bermanfaat bagi umat.
          </p>
        </details>
        <details>
          <summary>Nilai</summary>
          <p>
            Nilai keislaman, kebangsaan, keilmuan, dan ke-NU-an sebagai
            ruh perjuangan guru.
          </p>
        </details>
      </div>
    </div>
  </div>
</section>
);
};

export default Tentang;