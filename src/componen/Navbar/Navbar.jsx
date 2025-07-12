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
          <li>home</li>
          <li><a href="#tentang">Tentang</a></li>
          <li>Kegiatan</li>
          <li>Berita</li>
          <li>Layanan</li>
          <li>Hubungi kami</li>
        </ul>
      </nav>
    </header>
    </div>
  );
};

export default Navbar;
