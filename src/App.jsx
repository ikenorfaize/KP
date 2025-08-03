import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./componen/Navbar/Navbar";
import Hero from "./componen/Hero/Hero";
import Tentang from "./componen/Tentang/Tentang";
import Berita from "./componen/Berita/Berita";
import StatsSection from "./componen/Stats/StatsSection";
import Anggota from "./componen/Anggota/Anggota";
import Layanan from "./componen/Layanan/Layanan";
import Sponsor from "./componen/Sponsor/Sponsor";
import BeasiswaCard from "./componen/Beasiswa/Beasiswa";
import Footer from "./componen/Footer/Footer";
import StatusTracker from "./componen/StatusTracker/StatusTracker";

import BeritaUtama from "./pages/Berita/BeritaUtama";
import Berita1 from "./pages/Berita/Berita1";
import Berita2 from "./pages/Berita/Berita2";
import Berita3 from "./pages/Berita/Berita3";
import Login from "./pages/Login/Login";
import RegisterForm from "./pages/RegisterForm/RegisterForm";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";
import UserDashboard from "./pages/UserDashboard/UserDashboard";
import SponsorPage from "./pages/SponsorPage/SponsorPage";
import Beasiswa from "./pages/Beasiswa/Beasiswa";

import "./App.css";

const App = () => {
  const location = useLocation();

  // Disable browser scroll restoration globally
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Reset scroll position on route change for specific routes
  useEffect(() => {
    if (location.pathname === '/sponsor' || location.pathname === '/tentang' || 
        location.pathname === '/anggota' || location.pathname === '/berita' || 
        location.pathname === '/layanan' || location.pathname === '/beasiswa') {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  // Handle hash navigation for home page
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      // Wait a bit for the page to render
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    }
  }, [location.pathname, location.hash]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <div className="app-wrapper">
                <Hero />
              </div>
              <Tentang />
              <StatsSection />
              <Anggota />
              <Berita />
              <BeasiswaCard />
              <Layanan />
              <div id="status-tracker">
                <StatusTracker />
              </div>
              <Sponsor />
              <Footer />
            </>
          }
        />
        <Route path="/berita-utama" element={<><Navbar /><BeritaUtama /></>} />
        <Route path="/berita-1" element={<><Navbar /><Berita1 /></>} />
        <Route path="/berita-2" element={<><Navbar /><Berita2 /></>} />
        <Route path="/berita-3" element={<><Navbar /><Berita3 /></>} />
        <Route path="/sponsor" element={<><Navbar /><SponsorPage /><Footer /></>} />
        <Route path="/tentang" element={<><Navbar /><Tentang /><Footer /></>} />
        <Route path="/anggota" element={<><Navbar /><Anggota /><Footer /></>} />
        <Route path="/berita" element={<><Navbar /><Berita /><Footer /></>} />
        <Route path="/layanan" element={<><Navbar /><Layanan /><Footer /></>} />
        <Route path="/beasiswa" element={<><Navbar /><Beasiswa /><Footer /></>} />
        <Route path="/login" element={<Login />} />
        <Route path="/daftar" element={<RegisterForm />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
      </Routes>
    </>
  );
};

export default App;
