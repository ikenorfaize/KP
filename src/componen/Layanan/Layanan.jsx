import React, { useState } from "react";
import "./Layanan.css";
import { useScrollAnimation } from "../../hooks/useScrollAnimation";
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
    title: "JAGO",
    content: {
      description: "JAGO adalah sebuah sistem aplikasi inovatif yang dirancang khusus untuk mendukung dan memperkuat komunitas Persatuan Guru Nahdlatul Ulama (Pergunu).",
      features: ["Terpercaya", "Layanan cepat"]
    },
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
    content: "Reuni dan temu kangen para alumni Pergunu untuk mempererat silaturahmi.",
    image: null,
  },
  {
    id: "wisata",
    title: "Wisata Kampung Kerapu",
    content: "Kegiatan wisata edukatif di Kampung Kerapu bersama komunitas Pergunu.",
    image: null,
  },
];

// KOMPONEN LAYANAN - Menampilkan berbagai layanan dengan detail selector
const Layanan = () => {
  const [selected, setSelected] = useState("jago"); // State untuk layanan yang dipilih (default JAGO)
  const [ref, isVisible] = useScrollAnimation(); // Hook animasi scroll
  const detail = layananData.find((item) => item.id === selected); // Find detail berdasarkan selected ID

  return (
    <section className={`layanan-section ${isVisible ? 'animate' : ''}`} id="layanan" ref={ref}>
      <p className="layanan-sub"></p>
      <h2 className="layanan-title">
        Bangun impian masa depan anda<br />
        dengan PERGUNU Situbondo
      </h2>
      <div className="layanan-wrapper">
        {/* Menu selector layanan - Radio button style */}
        <div className="layanan-menu">
          {layananData.map((item) => (
            <button
              key={item.id}
              className={`layanan-button ${selected === item.id ? "active" : ""}`} // Class conditional untuk active state
              onClick={() => setSelected(item.id)} // Set selected layanan
            >
              <span className="radio-button">
                {/* Radio dot hanya muncul jika selected */}
                {selected === item.id && <span className="radio-dot" />}
              </span>
              {item.title}
            </button>
          ))}
        </div>
        {/* Content area - Menampilkan detail layanan yang dipilih */}
        <div className="layanan-content">
          {/* Conditional rendering gambar jika ada */}
          {detail.image && (
            <img src={detail.image} alt={detail.title} className="layanan-image" />
          )}
          <div className="layanan-detail">
            <h3 className="detail-title">{detail.title}</h3>
            <div className="detail-content">
              {/* Conditional rendering berdasarkan tipe content (string vs object) */}
              {typeof detail.content === 'object' ? (
                <>
                  <p>{detail.content.description}</p>
                  {/* Render features sebagai list jika ada */}
                  <ul>
                    {detail.content.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </>
              ) : (
                <p>{detail.content}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Layanan;
