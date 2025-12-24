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
  
  // State untuk menyimpan active section berdasarkan scroll position
  const [activeSection, setActiveSection] = useState('');

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

  // Effect untuk mendeteksi active section berdasarkan scroll position
  useEffect(() => {
    // Hanya jalankan di homepage
    if (location.pathname !== '/') return;

    const handleScroll = () => {
      const sections = ['berita', 'beasiswa', 'hubungi']; // Removed layanan and sponsor since they're separate pages
      const scrollPosition = window.scrollY + 100; // Offset untuk navbar
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Special case untuk footer/hubungi - jika user sudah scroll mendekati bottom
      if (scrollPosition + windowHeight >= documentHeight - 50) {
        setActiveSection('hubungi');
        return;
      }

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetBottom = offsetTop + element.offsetHeight;
          
          if (scrollPosition >= offsetTop && scrollPosition < offsetBottom) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Set initial active section
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Cleanup
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location.pathname]);

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
              {/* Home - Link to homepage */}
              <Link 
                to="/"
                className={location.pathname === '/' ? 'sponsor-active' : ''}
              >
                Home
              </Link>
            </li>
            <li>
              {/* Beasiswa - Always link to /beasiswa page */}
              <Link 
                to="/beasiswa"
                className={location.pathname === '/beasiswa' || (isHome && activeSection === 'beasiswa') ? 'sponsor-active' : ''}
              >
                Beasiswa
              </Link>
            </li>
            <li>
              {/* Layanan - Link to dedicated Layanan page */}
              <Link 
                to="/layanan"
                className={location.pathname === '/layanan' ? 'sponsor-active' : ''}
              >
                Layanan
              </Link>
            </li>
            <li>
              {/* Sponsor - Link to dedicated Sponsor page */}
              <Link 
                to="/sponsor"
                className={location.pathname === '/sponsor' ? 'sponsor-active' : ''}
              >
                Sponsor
              </Link>
            </li>
            <li>
              {/* Hubungi Kami - Link to contact section */}
              {isHome ? (
                <a 
                  href="#hubungi"
                  className={activeSection === 'hubungi' ? 'sponsor-active' : ''}
                >
                  Hubungi Kami
                </a>
              ) : (
                <Link 
                  to="/#hubungi"
                  className={location.pathname === '/hubungi' ? 'sponsor-active' : ''}
                >
                  Hubungi Kami
                </Link>
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
