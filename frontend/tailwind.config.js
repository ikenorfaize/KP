/** @type {import('tailwindcss').Config} */
// KONFIGURASI TAILWINDCSS - Utility-first CSS framework
export default {
  // Content paths - file mana saja yang akan di-scan untuk TailwindCSS classes
  content: [
    "./index.html", // File HTML utama
    "./src/**/*.{js,jsx,ts,tsx}", // Semua file JS/JSX/TS/TSX di folder src
  ],
  
  // Theme customization
  theme: {
    extend: {
      // Custom colors untuk branding PERGUNU
      colors: {
        // Custom primary color palette (berbagai shade biru)
        primary: {
          50: '#f0f9ff',  // Biru sangat terang
          100: '#e0f2fe', // Biru terang
          200: '#bae6fd', // Biru muda
          300: '#7dd3fc', // Biru sedang
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        pergunu: {
          green: '#28a745',
          blue: '#0D8ABC',
          dark: '#1a1a1a',
          light: '#f8f9fa',
        },
        // Admin Dashboard Colors
        admin: {
          'primary-green': '#0F7536',
          'soft-green': '#97BDA2',
          'light-green': '#77A686',
          'light-gray': '#E6E9E7',
          'white': '#FEFEFE',
        }
      },
      fontFamily: {
        sans: ['system-ui', 'Avenir', 'Helvetica', 'Arial', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'bounce-gentle': 'bounceGentle 1s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
