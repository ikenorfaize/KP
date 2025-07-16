import React from "react";
import { NavLink } from "react-router-dom"; // ⬅️ ganti Link jadi NavLink
import "./Navbar.css";
import logo from "../../assets/logo.png";
import { Link } from "react-router-dom"; // ⬅️ Tambahkan ini untuk mengimpor Link

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
            <li><a href="#anggota">Anggota</a></li>
            <li><a href="#berita">Berita</a></li>
            <li><a href="#layanan">Layanan</a></li>
            <li><a href="#hubungi">Hubungi Kami</a></li>
              <NavLink
              to="/login"
              className={({ isActive }) => `login-link ${isActive ? "active" : ""}`}
            >
              Login
            </NavLink>

          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
