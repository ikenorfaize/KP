// main.jsx - Entry Point Aplikasi React PERGUNU
// File ini adalah titik masuk utama aplikasi yang akan dimuat pertama kali
import React from "react";                      // React library untuk membuat UI
import ReactDOM from "react-dom/client";        // ReactDOM untuk rendering ke DOM (React 18+)
import App from "./App.jsx";                    // Import main App component yang berisi routing
import { BrowserRouter } from "react-router-dom"; // Router untuk navigasi antar halaman
import "./index.css";                           // Import global CSS styling

// Log environment variables for debugging
console.log('🔧 Environment Check [BUILD v0.0.4 - PRODUCTION FIX]:', {
  API_BASE: import.meta.env.VITE_API_BASE_URL || 'NOT SET',
  FILE_SERVER: import.meta.env.VITE_FILE_SERVER_URL || 'NOT SET',
  MODE: import.meta.env.MODE,
  BUILD_TIME: Date.now(),
  CACHE_BUST: '0b68490-production-fix-emailtemplates'
});

// ENTRY POINT APLIKASI REACT
// File ini adalah titik masuk utama untuk aplikasi React PERGUNU
// Sequence: index.html -> main.jsx -> App.jsx -> routing ke komponen lain

// Buat root element untuk React 18+ menggunakan createRoot API
// getElementById("root") merujuk ke div dengan id="root" di index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  // StrictMode membantu mendeteksi masalah dalam development mode
  // - Double-render components untuk detect side effects
  // - Warn tentang deprecated APIs
  // - Hanya aktif di development, tidak affect production
  <React.StrictMode>
    {/* BrowserRouter memungkinkan routing dengan URL browser normal */}
    {/* Contoh URL yang bisa diakses: /login, /admin, /daftar, /berita-1 */}
    {/* BrowserRouter menggunakan HTML5 History API untuk navigation */}
    <BrowserRouter>
      {/* Component App adalah router utama yang mengatur semua halaman */}
      {/* App.jsx berisi Routes dan Route untuk mapping URL ke komponen */}
      <App />
    </BrowserRouter>
  </React.StrictMode>
);