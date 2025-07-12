import React from "react";
import Navbar from "./componen/Navbar/Navbar";
import Hero from "./componen/Hero/Hero";
import "./App.css"; 
import Tentang from "./componen/Tentang/Tentang";
import StatsSection from "./componen/Stats/StatsSection";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Hero />
      </div>
      <Tentang />
      <StatsSection />
    </>
  );
};

export default App;
