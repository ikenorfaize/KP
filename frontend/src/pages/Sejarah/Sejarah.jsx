import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../componen/Navbar/Navbar";
import Footer from "../../componen/Footer/Footer";
import "./Sejarah.css";

const Sejarah = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="sejarah-page">
      <Navbar />
      <div className="sejarah-container">
        <div className="sejarah-content">
          <h1 className="sejarah-title">Sejarah Berdirinya PERGUNU</h1>
          
          <div className="sejarah-text">
            <p>
              Persatuan Guru Nahdlatul Ulama (PERGUNU) merupakan organisasi profesi yang menaungi para guru dan tenaga pendidik di lingkungan Nahdlatul Ulama. Organisasi ini dibentuk sebagai wadah perjuangan, pengembangan kompetensi, serta penguatan nilai-nilai keislaman dalam dunia pendidikan.
            </p>
            <p>
              PERGUNU resmi berdiri pada tahun 1952, di tengah semangat kebangkitan pendidikan nasional pasca-kemerdekaan. Pada masa itu, para guru Nahdliyin merasa perlu memiliki forum bersama yang dapat memperjuangkan aspirasi profesi sekaligus menjawab tantangan pendidikan di berbagai pelosok negeri.
            </p>

            <h2>Mengapa PERGUNU Didirikan?</h2>
            <p>
              Kondisi pendidikan Indonesia pada awal dekade 1950-an masih menghadapi berbagai keterbatasan, baik dari sisi fasilitas, kurikulum, maupun pengakuan terhadap profesi guru. Para pendidik yang tergabung dalam Nahdlatul Ulama melihat perlunya sebuah gerakan yang tidak hanya bersifat sosial, tapi juga profesional dan strategis. Dari kebutuhan inilah PERGUNU lahir, membawa semangat kolaboratif untuk memperkuat peran guru dalam mencerdaskan kehidupan bangsa.
            </p>

            <h2>Visi dan Peran Strategis</h2>
            <p>
              Sejak awal, PERGUNU tidak hanya menjadi organisasi pengayom, tetapi juga motor penggerak perubahan di dunia pendidikan. Dengan memadukan semangat keislaman dan kebangsaan, PERGUNU aktif dalam:
            </p>
            <ul>
              <li>Meningkatkan kapasitas dan kompetensi guru NU</li>
              <li>Mengembangkan pendidikan berbasis nilai Aswaja (Ahlussunnah wal Jama’ah)</li>
              <li>Mendorong kebijakan pendidikan yang inklusif dan berkeadilan</li>
              <li>Memperkuat jaringan guru NU di seluruh Indonesia</li>
            </ul>

            <h2>PERGUNU Hari Ini</h2>
            <p>
              Kini, PERGUNU telah berkembang di berbagai wilayah, dari tingkat pusat hingga ranting di desa-desa. Dengan mengusung moto “Bergerak Bersama, Mendidik Bangsa”, PERGUNU terus berkomitmen menjadi bagian dari solusi atas tantangan pendidikan nasional dan global.
            </p>
            <p>
              Organisasi ini membuka ruang seluas-luasnya bagi para guru untuk berdaya, berkontribusi, dan menjadi teladan dalam membangun peradaban melalui pendidikan yang bermartabat.
            </p>
          </div>

          <div className="sejarah-actions">
            <Link to="/" className="back-button">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Sejarah;
