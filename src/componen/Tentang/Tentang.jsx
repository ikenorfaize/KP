import React from "react";
import "./Tentang.css";
import TentangCard from "./TentangCard";
import aboutImg from "../../assets/about.png";

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

php-template
Copy
Edit
    <div className="tentang-middle">
      <img src={aboutImg} alt="guru mengajar" />
    </div>

        {/* Kanan */}
        <div className="tentang-right">
          <TentangCard title="Misi">
            <ul>
              <li>Meningkatkan kompetensi dan profesionalisme guru</li>
              <li>
                Mengembangkan budaya pendidikan yang unggul dalam iman, ilmu,
                teknologi, seni, dan budaya
              </li>
            </ul>
          </TentangCard>

          <TentangCard title="Visi">
            <p>
              Menjadi organisasi profesi guru yang berdaya, berkarakter, dan
              bermanfaat bagi umat.
            </p>
          </TentangCard>

          <TentangCard title="Nilai">
            <p>
              Nilai keislaman, kebangsaan, keilmuan, dan ke-NU-an sebagai ruh
              perjuangan guru.
            </p>
          </TentangCard>
        </div>
      </div>
    </section>
  );
};

export default Tentang;
