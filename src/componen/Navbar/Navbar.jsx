// Navbar Component - Main Navigation Menu untuk Aplikasi PERGUNU
// Komponen navigasi utama yang menangani:
// - Navigation links dengan behavior adaptif (scroll vs route navigation)
// - Authentication state management (login/logout UI)
// - Mobile responsive hamburger menu
// - Active state indicator untuk current page/section
// - User session persistence dan security
// - Conditional navigation berdasarkan user role

import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";  // Router hooks untuk navigasi
import "./Navbar.css";
import logo from "../../assets/logo.png";  // Logo PERGUNU

// KOMPONEN NAVBAR - Menu navigasi utama aplikasi
const Navbar = () => {
  // Hook untuk mendapatkan lokasi/path saat ini untuk conditional behavior
  const location = useLocation();
  
  // State untuk menyimpan data user yang sedang login (null jika belum login)
  const [user, setUser] = useState(null);
  
  // State untuk mobile menu toggle
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Effect untuk cek status login user saat component mount dan setiap render
  useEffect(() => {
    // Cek localStorage untuk data session yang tersimpan
    const userAuth = localStorage.getItem('userAuth');    // Regular user session
    const adminAuth = localStorage.getItem('adminAuth');  // Admin session
    
    // Set user state berdasarkan data session yang ditemukan
    if (userAuth) {
      try {
        const userData = JSON.parse(userAuth);
        setUser({ ...userData, type: 'user' });  // Mark sebagai regular user
      } catch (error) {
        console.error('Error parsing userAuth:', error);
        localStorage.removeItem('userAuth');  // Clear corrupted data
      }
    } else if (adminAuth) {
      try {
        const adminData = JSON.parse(adminAuth);
        setUser({ ...adminData, type: 'admin' }); // Mark sebagai admin
      } catch (error) {
        console.error('Error parsing adminAuth:', error);
        localStorage.removeItem('adminAuth');  // Clear corrupted data
      }
    }
  }, [location.pathname]); // Re-run when route changes

  // Fungsi untuk handle logout dengan confirmation
  const handleLogout = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
      // Clear semua session data dari localStorage
      localStorage.removeItem('userAuth');
      localStorage.removeItem('adminAuth');
      setUser(null);  // Reset user state
      
      // Force redirect ke homepage dengan page reload untuk clean state
      window.location.href = '/';
    }
  };
  
  // Ketika bukan di homepage, link navbar harus menuju anchor di homepage (/#anchor)
  const isHome = location.pathname === '/';
  
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
            <li>
              {/* // Link ke homepage atau anchor section */}
              {isHome ? (
                <a href="#tentang">Tentang</a>
              ) : (
                <Link 
                  to="/#tentang" 
                  className={location.pathname === '/tentang' ? 'sponsor-active' : ''}
                >
                  Tentang
                </Link>
              )}
            </li>
            <li>
              {/* // Link ke homepage atau anchor section */}
              {isHome ? (
                <a href="#anggota">Anggota</a>
              ) : (
                <Link 
                  to="/#anggota"
                  className={location.pathname === '/anggota' ? 'sponsor-active' : ''}
                >
                  Anggota
                </Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#berita">Berita</a>
              ) : (
                <Link 
                  to="/#berita"
                  className={location.pathname === '/berita' ? 'sponsor-active' : ''}
                >
                  Berita
                </Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#beasiswa">Beasiswa</a>
              ) : (
                <Link 
                  to="/#beasiswa"
                  className={location.pathname === '/beasiswa' ? 'sponsor-active' : ''}
                >
                  Beasiswa
                </Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#layanan">Layanan</a>
              ) : (
                <Link 
                  to="/#layanan"
                  className={location.pathname === '/layanan' ? 'sponsor-active' : ''}
                >
                  Layanan
                </Link>
              )}
            </li>
            
            <li>
              {isHome ? (
                <a href="#sponsor">Sponsor</a>
              ) : (
                <Link 
                  to="/#sponsor" 
                  className={location.pathname === '/sponsor' ? 'sponsor-active' : ''}
                >
                  Sponsor
                </Link>
              )}
            </li>
            <li>
              {isHome ? (
                <a href="#hubungi">Hubungi Kami</a>
              ) : (
                <Link to="/#hubungi">Hubungi Kami</Link>
              )}
            </li>
            <li className="login-button-wrapper">
              {user ? (
                <div className="user-menu">
                  <div className="user-info">
                    <span className="user-name">Hi, {user.fullName}</span>
                    <div className="user-actions">
                      {user.type === 'admin' ? (
                        <Link to="/admin" className="dashboard-btn admin">
                          Admin Panel
                        </Link>
                      ) : (
                        <Link to="/user-dashboard" className="dashboard-btn user">
                          Dashboard
                        </Link>
                      )}
                      <button onClick={handleLogout} className="navbar-logout-btn">
                        <span>🚪</span>
                        Log Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className={({ isActive }) => `navbar-login-btn ${isActive ? "active" : ""}`}
                >
                  Login
                </NavLink>
              )}
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
