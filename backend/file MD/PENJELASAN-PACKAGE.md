# 📦 PENJELASAN PACKAGE.JSON

## Informasi Dasar Proyek
- **name**: "kp-project" - Nama proyek PERGUNU
- **private**: true - Tidak dipublish ke npm registry (proyek internal)
- **version**: "0.0.0" - Versi aplikasi saat ini
- **type**: "module" - Menggunakan ES modules (import/export) bukan CommonJS

## 🚀 NPM Scripts yang Tersedia

### Development Scripts
- **`npm run dev`** - Menjalankan Vite dev server (port 5173)
  - Hot reload untuk development
  - Source maps untuk debugging
  - Fast refresh untuk React
  
- **`npm run build`** - Build production dengan optimasi
  - Minifikasi JavaScript dan CSS
  - Tree shaking untuk remove unused code
  - Code splitting untuk performance
  
- **`npm run lint`** - Linting kode dengan ESLint
  - Check code quality dan style
  - Detect potential bugs
  
- **`npm run preview`** - Preview hasil build production
  - Test build sebelum deploy
  - Local server untuk preview

### Backend Scripts  
- **`npm run api`** - JSON Server sebagai mock API (port 3001)
  - Database: db.json
  - REST API endpoints otomatis
  - Watch mode untuk auto-reload
  
- **`npm run file-server`** - Express server untuk upload file (port 3002)
  - Handle upload file (foto, sertifikat)
  - Multer untuk file processing
  - CORS configuration
  
- **`npm run webhook-server`** - Webhook handler (port 3003)
  - Handle webhook dari external services
  - Email integration
  - Form processing

### Combo Scripts
- **`npm run demo`** - Frontend + API bersamaan
  - Concurrently run: dev server + JSON server
  - Basic development setup
  
- **`npm run full-demo`** - Semua services kecuali webhook
  - Run: dev + api + file-server
  - Complete development environment
  
- **`npm run production`** - Semua services lengkap
  - Run: dev + api + file-server + webhook-server
  - Full production simulation

## 📚 Dependencies (Runtime)

### Core React
- **react**: ^19.1.0 - Framework utama
- **react-dom**: ^19.1.0 - DOM rendering untuk React
- **react-router-dom**: ^7.7.0 - Client-side routing

### UI & Icons
- **react-icons**: ^5.5.0 - Icon library lengkap
- **@tailwindcss/postcss**: ^4.1.11 - TailwindCSS integration

### Email Service
- **@emailjs/browser**: ^4.4.1 - Client-side email service
- Tidak perlu server email sendiri
- Template-based email system

### Backend Dependencies (untuk server files)
- **express**: ^5.1.0 - Web server framework
- **multer**: ^2.0.2 - File upload middleware
- **cors**: ^2.8.5 - Cross-origin request handling
- **bcryptjs**: ^3.0.2 - Password hashing

## 🛠️ DevDependencies (Development Only)

### Build Tools
- **vite**: ^7.0.0 - Fast build tool dan dev server
- **@vitejs/plugin-react**: ^4.5.2 - React support untuk Vite

### CSS Framework
- **tailwindcss**: ^4.1.11 - Utility-first CSS framework
- **autoprefixer**: ^10.4.21 - Auto-add vendor prefixes
- **postcss**: ^8.5.6 - CSS processing tool

### Linting & Quality
- **eslint**: ^9.29.0 - JavaScript linter
- **@eslint/js**: ^9.29.0 - ESLint JavaScript rules
- **eslint-plugin-react-hooks**: ^5.2.0 - Rules untuk React hooks
- **eslint-plugin-react-refresh**: ^0.4.20 - Rules untuk React refresh
- **globals**: ^16.2.0 - Global variables definition

### Development Utilities
- **concurrently**: ^9.2.0 - Run multiple npm commands bersamaan
- **json-server**: ^1.0.0-beta.3 - Mock REST API dari JSON file

### TypeScript Support (untuk editor)
- **@types/react**: ^19.1.8 - Type definitions untuk React
- **@types/react-dom**: ^19.1.6 - Type definitions untuk React DOM

## 🏗️ Architecture Dependencies

### Frontend Stack
```
React 19 + React Router 7 + TailwindCSS 4 + Vite 7
```

### Backend Stack  
```
Express 5 + JSON Server + Multer + bcryptjs
```

### Development Stack
```
ESLint + PostCSS + Autoprefixer + Concurrently
```

## 🚀 Cara Penggunaan

### Development Normal
```bash
npm run dev          # Frontend only
npm run api          # Backend API only
```

### Development Lengkap
```bash
npm run full-demo    # All services (recommended)
```

### Production Build
```bash
npm run build        # Build untuk production
npm run preview      # Test hasil build
```

### Code Quality
```bash
npm run lint         # Check kode quality
```

File package.json ini sudah dikonfigurasi optimal untuk development dan production aplikasi PERGUNU.
