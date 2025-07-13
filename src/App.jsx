import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./componen/Navbar/Navbar";
import Hero from "./componen/Hero/Hero";
import Tentang from "./componen/Tentang/Tentang";
import Berita from "./componen/Berita/Berita";
import StatsSection from "./componen/Stats/StatsSection";
import Anggota from "./componen/Anggota/Anggota";
import Layanan from "./componen/Layanan/Layanan";

import BeritaUtama from "./pages/BeritaUtama";
import Berita1 from "./pages/Berita1";
import Berita2 from "./pages/Berita2";
import Berita3 from "./pages/Berita3";
const App = () => {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Routes>
          <Route path="/" element={
            <>
              <Hero />
              <Tentang />
              <StatsSection />
              <Anggota />
              <Berita />
              <Layanan />
            </>
          } />
          <Route path="/berita-utama" element={<BeritaUtama />} />
          <Route path="/berita-1" element={<Berita1 />} />
          <Route path="/berita-2" element={<Berita2 />} />
          <Route path="/berita-3" element={<Berita3 />} />
        </Routes>
      </div>
    </>
  );
};

export default App;

