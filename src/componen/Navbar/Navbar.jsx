import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
     <div className="navbar-wrapper">
    <header className="navbar">
      <div className="navbar-left">
        <img src={logo} alt="PERGUNU" className="logo" />
      </div>
      <nav className="navbar-right">
        <ul>
          <li><a href="#">Home</a></li>
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#kegiatan">Kegiatan</a></li>
          <li><a href="#berita">Berita</a></li>
          <li><a href="#layanan">Layanan</a></li>
          <li><a href="#hubungi kami">Hubungi Kami</a></li>
        </ul>
      </nav>
    </header>
    </div>
  );
};

export default Navbar;
