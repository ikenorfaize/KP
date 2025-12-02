// PostCSS Configuration - Konfigurasi PostCSS untuk pemrosesan CSS
// PostCSS adalah tool untuk mentransformasi CSS dengan plugin JavaScript
export default {
  plugins: {
    // Plugin TailwindCSS untuk memproses utility classes
    // Mengubah @tailwind directives menjadi CSS yang sesungguhnya
    '@tailwindcss/postcss': {},
    
    // Autoprefixer menambahkan vendor prefix secara otomatis
    // Contoh: transform: scale(1) → -webkit-transform: scale(1); transform: scale(1);
    // Memastikan kompatibilitas browser berdasarkan browserslist
    autoprefixer: {},
  },
}
