import React, { useState } from "react";
import "./Layanan.css";
import jagoImg from "../../assets/jago.png";

const layananData = [
  {
    id: "ramadhan",
    title: "Ramadhan 1445",
    content: "Kegiatan dan program Pergunu selama bulan Ramadhan 1445 H.",
    image: null,
  },
  {
    id: "jago",
    title: "Jago",
    content:
      "JAGO adalah sebuah sistem aplikasi inovatif yang dirancang khusus untuk mendukung dan memperkuat komunitas Persatuan Guru Nahdlatul Ulama (Pergunu).\n\n- Terpercaya\n- Layanan cepat",
    image: jagoImg,
  },
  {
    id: "bakti",
    title: "Kerja Bakti Bersama",
    content: "Program gotong royong bersama guru dan masyarakat sekitar.",
    image: null,
  },
  {
    id: "alumni",
    title: "Kumpul Alumni Pergunu",
    content:
      "Reuni dan temu kangen para alumni Pergunu untuk mempererat silaturahmi.",
    image: null,
  },
  {
    id: "wisata",
    title: "Wisata Kampung Kerapu",
    content: "Kegiatan wisata edukatif di Kampung Kerapu bersama komunitas Pergunu.",
    image: null,
  },
];

const Layanan = () => {
  const [selected, setSelected] = useState("ramadhan");

  const detail = layananData.find((item) => item.id === selected);

  return (
    <section className="layanan-section">
      <p className="layanan-sub">layanan</p>
      <h2 className="layanan-title">
        <u>Bangun impian masa depan anda</u>
        <br />
        <u>dengan PERGUNU Situbondo</u>
      </h2>
      <div className="layanan-container">
        <div className="layanan-list">
          {layananData.map((item) => (
            <button
              key={item.id}
              className={`layanan-item ${selected === item.id ? "active" : ""}`}
              onClick={() => setSelected(item.id)}
            >
              <span className="radio-circle">
                <span className="dot" />
              </span>
              {item.title}
            </button>
          ))}
        </div>

        <div className="layanan-detail">
          {detail.image && (
            <img src={detail.image} alt={detail.title} className="layanan-image" />
          )}
          <div>
            <h3>{detail.title}</h3>
            <p style={{ whiteSpace: "pre-line" }}>{detail.content}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layanan;
