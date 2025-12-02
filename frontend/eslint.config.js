// KONFIGURASI ESLINT - Tools untuk static analysis dan code quality
import js from '@eslint/js' // ESLint JavaScript rules dasar
import globals from 'globals' // Definisi global variables (window, document, dll)
import reactHooks from 'eslint-plugin-react-hooks' // Rules khusus React hooks
import reactRefresh from 'eslint-plugin-react-refresh' // Rules untuk React fast refresh
import { defineConfig, globalIgnores } from 'eslint/config' // Helper untuk konfigurasi

export default defineConfig([
  // Ignore folder dist (hasil build) dari linting
  globalIgnores(['dist']),
  
  // Configuration for API/server files (Node.js environment)
  {
    files: ['api/**/*.js', 'file-server.js', 'fix-password.js'],
    extends: [js.configs.recommended],
    languageOptions: {
      ecmaVersion: 2022,
      globals: {
        ...globals.node, // Node.js globals (process, Buffer, __dirname, etc.)
        console: 'readonly'
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    rules: {
      // Allow unused variables that start with underscore (conventional)
      'no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  
  // Configuration for client-side React files
  {
    // File yang akan di-lint (JavaScript dan JSX)
    files: ['src/**/*.{js,jsx}'],
    
    // Extend konfigurasi yang sudah ada
    extends: [
      js.configs.recommended, // Rules JavaScript dasar
      reactHooks.configs['recommended-latest'], // Rules React hooks terbaru
      reactRefresh.configs.vite, // Rules untuk Vite fast refresh
    ],
    
    // Konfigurasi bahasa dan environment
    languageOptions: {
      ecmaVersion: 2020, // Support JavaScript ES2020
      globals: globals.browser, // Global variables browser (window, document, dll)
      parserOptions: {
        ecmaVersion: 'latest', // Parse JavaScript terbaru
        ecmaFeatures: { jsx: true }, // Enable JSX parsing
        sourceType: 'module', // Support ES modules (import/export)
      },
    },
    
    // Custom rules untuk proyek ini
    rules: {
      // Ignore unused variables yang dimulai dengan huruf besar (constants)
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
    },
  },
])
