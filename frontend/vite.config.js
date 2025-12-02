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
  
  // Build optimization
  build: {
    rollupOptions: {
      output: {
        // Aggressive cache busting with timestamp
        entryFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        chunkFileNames: `assets/[name]-[hash]-${Date.now()}.js`,
        assetFileNames: `assets/[name]-[hash]-${Date.now()}.[ext]`,
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'icons': ['react-icons'],
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  
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
