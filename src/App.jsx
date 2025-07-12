import React from "react";
import Navbar from "./componen/Navbar/Navbar";
import Hero from "./componen/Hero/Hero";
import "./App.css"; 
import Tentang from "./componen/Tentang/Tentang";

const App = () => {
  return (
    <>
      <Navbar />
      <div className="app-wrapper">
        <Hero />
      </div>
      <Tentang />
    </>
  );
};

export default App;
