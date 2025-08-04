// KONFIGURASI VITE - Build tool dan dev server untuk aplikasi React
import { defineConfig } from 'vite' // Helper untuk definisi konfigurasi Vite
import react from '@vitejs/plugin-react' // Plugin untuk support React (JSX, fast refresh)
import tailwindcss from '@tailwindcss/postcss' // PostCSS plugin untuk TailwindCSS
import autoprefixer from 'autoprefixer' // PostCSS plugin untuk auto vendor prefixes

// https://vite.dev/config/
export default defineConfig({
  // Plugins yang digunakan
  plugins: [
    react() // Enable React support dengan fast refresh dan JSX transform
  ],
  
  // Konfigurasi CSS processing
  css: {
    postcss: {
      plugins: [
        tailwindcss(), // Process TailwindCSS directives (@tailwind, @apply, dll)
        autoprefixer(), // Auto-add vendor prefixes (-webkit-, -moz-, dll) untuk cross-browser compatibility
      ],
    },
  },
})
