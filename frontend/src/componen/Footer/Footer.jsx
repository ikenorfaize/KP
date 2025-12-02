// Footer Component - Komponen footer untuk informasi kontak dan media sosial
// Ditampilkan di bagian bawah website dengan informasi PERGUNU Situbondo
import React from "react";
import "./Footer.css";
// Import icon dari react-icons untuk tampilan yang menarik
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import LogoPergunu from "../../assets/logo.png";  // Logo PERGUNU

const Footer = () => {
  return (
    <footer id="hubungi" className="footer">
      <div className="footer-container">
        {/* Bagian atas footer: logo, nama organisasi, dan media sosial */}
        <div className="footer-top">
          <div className="footer-left">
            {/* Logo PERGUNU dengan alt text untuk accessibility */}
            <img src={LogoPergunu} alt="Logo PERGUNU" className="footer-logo" />
            <div className="footer-title">
              <h4>PERGUNU</h4>         {/* Nama organisasi */}
              <h4>SITUBONDO</h4>       {/* Lokasi cabang */}
            </div>
          </div>
          
          {/* Icon media sosial untuk engagement online */}
          <div className="footer-social">
            <div className="icon-circle"><FaInstagram /></div>   {/* Link Instagram */}
            <div className="icon-circle"><FaYoutube /></div>     {/* Link YouTube */}
            <div className="icon-circle"><FaWhatsapp /></div>    {/* Link WhatsApp */}
          </div>
        </div>

        {/* Garis pemisah antara bagian atas dan bawah */}
        <hr className="footer-divider" />

        {/* Bagian bawah footer: informasi kontak dan alamat lengkap */}
        <div className="footer-bottom">
          {/* Nomor telepon dengan icon phone */}
          <div className="footer-contact">
            <FaPhoneAlt className="contact-icon" />
            <span>+62 896 3101 1926</span>  {/* Nomor WhatsApp/telepon */}
          </div>
          
          {/* Email dengan icon envelope */}
          <div className="footer-contact">
            <FaEnvelope className="contact-icon" />
            <span>mediapergunusitubondo@gmail.com</span>  {/* Email resmi */}
          </div>
          
          {/* Alamat kantor lengkap */}
          <div className="footer-address">
            <p>Jl. Madura No.79 Mimbaan</p>              {/* Nama jalan dan nomor */}
            <p>Kabupaten Situbondo (Sebelah</p>          {/* Kabupaten */}
            <p>Timur Terminal Situbondo)</p>             {/* Patokan lokasi */}
          </div>
        </div>
      </div>
    </footer>
  );
};

// Export Footer component untuk digunakan di App.jsx dan halaman lain
export default Footer;
