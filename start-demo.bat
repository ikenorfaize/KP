@echo off
echo ========================================
echo    PERGUNU WEB - API DEMO SETUP
echo ========================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js tidak terdeteksi. Silakan install Node.js terlebih dahulu.
    echo    Download: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js terdeteksi
echo.

REM Check if npm dependencies are installed
if not exist "node_modules" (
    echo 📦 Installing npm dependencies...
    npm install
    if %errorlevel% neq 0 (
        echo ❌ Gagal install dependencies
        pause
        exit /b 1
    )
    echo ✅ Dependencies installed
    echo.
)

REM Check if JSON Server is installed globally
json-server --version >nul 2>&1
if %errorlevel% neq 0 (
    echo 📦 Installing JSON Server globally...
    npm install -g json-server
    if %errorlevel% neq 0 (
        echo ❌ Gagal install JSON Server. Trying without global...
        npm install json-server --save-dev
        if %errorlevel% neq 0 (
            echo ❌ Gagal install JSON Server
            pause
            exit /b 1
        )
        echo ✅ JSON Server installed locally
    ) else (
        echo ✅ JSON Server installed globally
    )
    echo.
)

REM Check if db.json exists
if not exist "db.json" (
    echo ❌ File db.json tidak ditemukan!
    echo    Pastikan file db.json ada di folder yang sama.
    pause
    exit /b 1
)

echo ========================================
echo    STARTING DEMO SERVERS
echo ========================================
echo.
echo 🚀 Starting JSON Server on port 3001...
echo 🌐 Starting Vite Dev Server on port 5173...
echo.
echo ⚠️  JANGAN TUTUP WINDOW INI SELAMA DEMO!
echo.
echo 📖 Demo Instructions:
echo    1. Register user baru di: http://localhost:5173/register
echo    2. Login dengan user yang sudah register
echo    3. Check API data di: http://localhost:3001/users
echo    4. Demo credentials:
echo       - Username: demo / Email: demo@pergunu.com
echo       - Username: admin / Email: admin@pergunu.com
echo.
echo Press Ctrl+C untuk stop servers
echo ========================================
echo.

REM Start both servers using start command
start "JSON Server" cmd /k "json-server --watch db.json --port 3001 && pause"
timeout /t 3 /nobreak >nul
start "Vite Dev Server" cmd /k "npm run dev && pause"

echo.
echo ✅ Both servers started!
echo 📝 API available at: http://localhost:3001
echo 🌐 Website available at: http://localhost:5173
echo.
pause
