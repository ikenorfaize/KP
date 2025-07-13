import React from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
     <div className="navbar-wrapper">
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/">
          <img src={logo} alt="PERGUNU" className="logo" />
        </Link>
      </div>
      <nav className="navbar-right">
        <ul>
          <li><a href="#tentang">Tentang</a></li>
          <li><a href="#kegiatan">Kegiatan</a></li>
          <li><a href="#berita">Berita</a></li>
          <li><Link to="/layanan">Layanan</Link></li>
          <li><a href="#hubungi">Hubungi Kami</a></li>
        </ul>
      </nav>
    </header>
    </div>
  );
};

export default Navbar;
