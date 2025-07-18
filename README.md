# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## 🚀 DEMO UNTUK PRESENTASI CLIENT

### Cara Termudah (Windows):
```bash
# Double-click file start-demo.bat
# Atau jalankan di terminal:
start-demo.bat
```

### Manual Setup:

#### 1. Install Dependencies
```bash
npm install
```

#### 2. Install JSON Server (API Demo)
```bash
npm install -g json-server
```

#### 3. Jalankan Demo
```bash
# Terminal 1: API Server
json-server --watch db.json --port 3001

# Terminal 2: Website
npm run dev
```

### 🎯 Demo Flow untuk Client:
1. **Website**: http://localhost:5173
2. **API Data**: http://localhost:3001/users
3. **Demo Register**: Buat user baru di `/register`
4. **Demo Login**: Login dengan user yang sudah dibuat
5. **Show API**: Tunjukkan data tersimpan di API endpoint

### 📝 Demo Credentials:
- **Username**: `demo` | **Email**: `demo@pergunu.com`
- **Username**: `admin` | **Email**: `admin@pergunu.com`

### 🔧 API Endpoints (untuk demo):
- `GET /users` - Lihat semua user
- `POST /users` - Register user baru
- `GET /news` - Lihat berita
- `GET /statistics` - Lihat statistik

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
