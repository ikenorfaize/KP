import React from "react";
import "./Footer.css";
import { FaPhoneAlt, FaEnvelope, FaInstagram, FaYoutube, FaWhatsapp } from "react-icons/fa";
import LogoPergunu from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer id="hubungi" className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-left">
            <img src={LogoPergunu} alt="Logo PERGUNU" className="footer-logo" />
            <div className="footer-title">
              <h4>PERGUNU</h4>
              <h4>SITUBONDO</h4>
            </div>
          </div>
          <div className="footer-social">
            <div className="icon-circle"><FaInstagram /></div>
            <div className="icon-circle"><FaYoutube /></div>
            <div className="icon-circle"><FaWhatsapp /></div>
          </div>
        </div>

        <hr className="footer-divider" />

        {/* Baris bawah: kontak & alamat */}
        <div className="footer-bottom">
          <div className="footer-contact">
            <FaPhoneAlt className="contact-icon" />
            <span>+62 896 3101 1926</span>
          </div>
          <div className="footer-contact">
            <FaEnvelope className="contact-icon" />
            <span>mediapergunusitubondo@gmail.com</span>
          </div>
          <div className="footer-address">
            <p>Jl. Madura No.79 Mimbaan</p>
            <p>Kabupaten Situbondo (Sebelah</p>
            <p>Timur Terminal Situbondo)</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
