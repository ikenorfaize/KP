import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import "./Navbar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Check for logged in user
  useEffect(() => {
    const userAuth = localStorage.getItem('userAuth');
    const adminAuth = localStorage.getItem('adminAuth');
    
    if (userAuth) {
      setUser({ ...JSON.parse(userAuth), type: 'user' });
    } else if (adminAuth) {
      setUser({ ...JSON.parse(adminAuth), type: 'admin' });
    }
  }, []);

  const handleLogout = () => {
    const confirmed = window.confirm('Apakah Anda yakin ingin keluar?');
    if (confirmed) {
      localStorage.removeItem('userAuth');
      localStorage.removeItem('adminAuth');
      setUser(null);
      window.location.href = '/';
    }
  };
  
  // Check if we're on a separate component page
  const isComponentPage = ['/sponsor', '/tentang', '/anggota', '/berita', '/layanan'].includes(location.pathname);
  
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
              {isComponentPage ? (
                <Link 
                  to="/#tentang" 
                  className={location.pathname === '/tentang' ? 'sponsor-active' : ''}
                >
                  Tentang
                </Link>
              ) : (
                <a href="#tentang">Tentang</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link 
                  to="/#anggota"
                  className={location.pathname === '/anggota' ? 'sponsor-active' : ''}
                >
                  Anggota
                </Link>
              ) : (
                <a href="#anggota">Anggota</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link 
                  to="/#berita"
                  className={location.pathname === '/berita' ? 'sponsor-active' : ''}
                >
                  Berita
                </Link>
              ) : (
                <a href="#berita">Berita</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link 
                  to="/#layanan"
                  className={location.pathname === '/layanan' ? 'sponsor-active' : ''}
                >
                  Layanan
                </Link>
              ) : (
                <a href="#layanan">Layanan</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link 
                  to="/#beasiswa"
                  className={location.pathname === '/beasiswa' ? 'sponsor-active' : ''}
                >
                  Beasiswa
                </Link>
              ) : (
                <a href="#beasiswa">Beasiswa</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link 
                  to="/#sponsor" 
                  className={location.pathname === '/sponsor' ? 'sponsor-active' : ''}
                >
                  Sponsor
                </Link>
              ) : (
                <a href="#sponsor">Sponsor</a>
              )}
            </li>
            <li>
              {isComponentPage ? (
                <Link to="/#hubungi">Hubungi Kami</Link>
              ) : (
                <a href="#hubungi">Hubungi Kami</a>
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
