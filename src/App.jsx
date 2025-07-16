import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./componen/Navbar/Navbar";
import Hero from "./componen/Hero/Hero";
import Tentang from "./componen/Tentang/Tentang";
import Berita from "./componen/Berita/Berita";
import StatsSection from "./componen/Stats/StatsSection";
import Anggota from "./componen/Anggota/Anggota";
import Layanan from "./componen/Layanan/Layanan";
import Footer from "./componen/Footer/Footer";

import BeritaUtama from "./pages/BeritaUtama";
import Berita1 from "./pages/Berita1";
import Berita2 from "./pages/Berita2";
import Berita3 from "./pages/Berita3";
import Login from "./pages/Login/Login"; // ✅ Tambahkan ini

import "./App.css";

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <div className="app-wrapper">
                <Hero />
              </div>
              <Tentang />
              <StatsSection />
              <Anggota />
              <Berita />
              <Layanan />
              <Footer />
            </>
          }
        />
        <Route path="/berita-utama" element={<BeritaUtama />} />
        <Route path="/berita-1" element={<Berita1 />} />
        <Route path="/berita-2" element={<Berita2 />} />
        <Route path="/berita-3" element={<Berita3 />} />
        <Route path="/login" element={<Login />} /> {/* ✅ Tambahkan ini */}
      </Routes>
    </>
  );
};

export default App;
