// App.jsx - Main Application Component
// Komponen utama yang mengatur routing dan struktur aplikasi PERGUNU
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";

// Import komponen untuk halaman utama (homepage)
import Navbar from "./componen/Navbar/Navbar";           // Navigation bar
import Hero from "./componen/Hero/Hero";                 // Hero section dengan animasi
import Tentang from "./componen/Tentang/Tentang";        // Section tentang PERGUNU
import Berita from "./componen/Berita/Berita";           // Grid berita terbaru
import Anggota from "./componen/Anggota/Anggota";        // Tim dan anggota
import Layanan from "./componen/Layanan/Layanan";        // Layanan yang ditawarkan
import Sponsor from "./componen/Sponsor/Sponsor";        // Partner dan sponsor
import BeasiswaCard from "./componen/Beasiswa/Beasiswa"; // Card info beasiswa
import Footer from "./componen/Footer/Footer";           // Footer website
import StatusTracker from "./componen/StatusTracker/StatusTracker"; // Cek status pendaftaran

// Import halaman-halaman terpisah (pages) yang memiliki route sendiri
import NewsDetail from "./pages/Berita/NewsDetail";   // Dynamic news detail page
import NewsDetailLayout from "./componen/NewsDetailLayout/NewsDetailLayout"; // New enhanced layout
import Login from "./pages/Login/Login";                  // Halaman login user/admin
import RegisterForm from "./pages/RegisterForm/RegisterForm"; // Form pendaftaran anggota
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard"; // Dashboard admin
import UserDashboard from "./pages/UserDashboard/UserDashboard";     // Dashboard user
import SponsorPage from "./pages/SponsorPage/SponsorPage"; // Halaman khusus sponsor
import Beasiswa from "./pages/Beasiswa/Beasiswa";         // Halaman informasi beasiswa
import LayananDetail from "./pages/Layanan/LayananDetail"; // Halaman detail layanan

import "./App.css";
import { PendingApplicationsProvider } from './context/PendingApplicationsContext';

const App = () => {
  // Hook untuk mendapatkan lokasi/URL saat ini untuk keperluan scroll management
  const location = useLocation();

  // Effect untuk disable scroll restoration browser secara global
  // Ini mencegah browser mengingat posisi scroll saat navigasi back/forward
  // Berguna untuk SPA yang mengelola scroll secara manual
  useEffect(() => {
    if (window.history.scrollRestoration) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Effect untuk reset posisi scroll ke atas saat pindah ke halaman tertentu
  // Dipicu setiap kali location.pathname berubah
  // Berguna untuk halaman yang dibuka di tab/window baru atau navigasi direct
  useEffect(() => {
    if (location.pathname === '/sponsor' || location.pathname === '/tentang' || 
        location.pathname === '/anggota' || location.pathname === '/berita' || 
        location.pathname === '/layanan' || location.pathname === '/beasiswa') {
      window.scrollTo(0, 0); // Scroll ke posisi teratas halaman
    }
  }, [location.pathname]); // Dependency array: effect dijalankan ketika pathname berubah

  // Effect untuk handle navigasi hash (anchor links) di homepage
  // Contoh: /#tentang akan scroll ke section tentang dengan smooth scrolling
  useEffect(() => {
    if (location.pathname === '/' && location.hash) {
      // Tunggu sedikit agar page selesai render sebelum scroll
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          // Scroll ke element dengan animasi smooth
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100); // Delay 100ms untuk memastikan DOM sudah ready
    }
  }, [location.pathname, location.hash]); // Re-run ketika path atau hash berubah

  return (
    <>
      <Routes>
        {/* ROUTE UTAMA - HOMEPAGE (/) */}
        {/* Halaman utama yang menggabungkan semua section dalam satu page */}
        {/* Single Page Application dengan semua konten dalam satu route */}
        <Route
          path="/"
          element={
            <>
              <Navbar />  {/* Navigation bar tetap di atas */}
              <div className="app-wrapper">
                <Hero />  {/* Section banner utama dengan CTA dan animasi typing */}
              </div>
              <Tentang />       {/* Section tentang organisasi PERGUNU */}
              <Anggota />       {/* Section tim inti dan keanggotaan */}
              <Berita />        {/* Section berita terbaru (3 artikel) */}
              <BeasiswaCard />  {/* Section program beasiswa dan bantuan */}
              <Layanan />       {/* Section layanan yang ditawarkan PERGUNU */}
              <div id="status-tracker">
                <StatusTracker />  {/* Section cek status pendaftaran dengan form */}
              </div>
              <Sponsor />  {/* Section sponsor, partner, dan mitra kerjasama */}
              <Footer />   {/* Footer dengan informasi kontak dan copyright */}
            </>
          }
        />
        
        {/* ROUTES BERITA - Halaman artikel berita detail terpisah */}
        {/* Dynamic route for news detail based on ID - UNIFIED SYSTEM */}
        <Route path="/berita/:id" element={<><Navbar /><NewsDetail /></>} />
        
        {/* Enhanced news detail layout with image overlay and sidebar */}
        <Route path="/news/:id" element={<><Navbar /><NewsDetailLayout /></>} />
        
        {/* Legacy routes for backward compatibility - redirects to unified news system */}
        <Route path="/berita-1" element={<><Navbar /><NewsDetail /></>} />
        <Route path="/berita-2" element={<><Navbar /><NewsDetail /></>} />
        <Route path="/berita-3" element={<><Navbar /><NewsDetail /></>} />
        
        {/* ROUTES HALAMAN SECTION - Versi halaman penuh dari section homepage */}
        {/* Untuk user yang ingin fokus pada satu section tertentu */}
        <Route path="/sponsor" element={<><Navbar /><SponsorPage /><Footer /></>} />
        <Route path="/tentang" element={<><Navbar /><Tentang /><Footer /></>} />
        <Route path="/anggota" element={<><Navbar /><Anggota /><Footer /></>} />
        <Route path="/berita" element={<><Navbar /><Berita /><Footer /></>} />
        <Route path="/layanan" element={<><Navbar /><Layanan /><Footer /></>} />
  <Route path="/layanan/:id" element={<><Navbar /><LayananDetail /><Footer /></>} />
        <Route path="/beasiswa" element={<><Navbar /><Beasiswa /><Footer /></>} />
        
        {/* ROUTES SISTEM - Authentication dan Dashboard */}
        {/* Halaman-halaman yang memerlukan interaksi khusus atau autentikasi */}
        <Route path="/login" element={<Login />} />                    {/* Login admin/user */}
        <Route path="/daftar" element={<RegisterForm />} />            {/* Form pendaftaran anggota */}
  <Route path="/admin" element={<PendingApplicationsProvider><AdminDashboard /></PendingApplicationsProvider>} />           {/* Dashboard untuk admin */}
        <Route path="/user-dashboard" element={<UserDashboard />} />   {/* Dashboard untuk user */}
      </Routes>
    </>
  );
};

// Export App component sebagai default export
// Component ini akan diimport di main.jsx sebagai root component
export default App;
