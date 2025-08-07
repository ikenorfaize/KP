@echo off
echo 🚀 Starting PERGUNU Development Servers...

echo.
echo 📡 Starting API Server (json-server)...
cd /d "C:\Users\fairu\campus\KP"
start "JSON-Server" cmd /k "npx json-server --watch db.json --port 3001"

echo.
echo 🌐 Starting Frontend Server (Vite)...
timeout /t 3 >nul
start "Vite-Server" cmd /k "npm run dev"

echo.
echo ✅ Both servers are starting...
echo 📖 Access the application at: http://localhost:5173
echo 🔐 Admin login: admin / admin123
echo.
pause
