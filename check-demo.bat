@echo off
echo ================================================
echo    PERGUNU DEMO - STARTUP CHECK
echo ================================================
echo.

REM Check if JSON Server is running
netstat -an | findstr :3001 > nul
if %errorlevel% equ 0 (
    echo ✅ JSON Server sudah running di port 3001
) else (
    echo ❌ JSON Server belum running
    echo 🚀 Starting JSON Server...
    start "JSON Server" cmd /k "json-server --watch db.json --port 3001"
    timeout /t 3 /nobreak > nul
    echo ✅ JSON Server started!
)

echo.
REM Check if Vite is running  
netstat -an | findstr :5173 > nul
if %errorlevel% equ 0 (
    echo ✅ Vite Server sudah running di port 5173
) else (
    echo ❌ Vite Server belum running
    echo 🚀 Starting Vite Server...
    start "Vite Server" cmd /k "npm run dev"
    timeout /t 3 /nobreak > nul
    echo ✅ Vite Server started!
)

echo.
echo ================================================
echo    DEMO READY!
echo ================================================
echo 🌐 Website: http://localhost:5173
echo 📊 API Data: http://localhost:3001/users
echo.
echo 🔐 Demo Login Credentials:
echo    Admin: admin / admin123
echo    User:  demo / demo123
echo.
echo ⚠️  PENTING: Untuk data persistent, pastikan 
echo    JSON Server running SEBELUM register user!
echo ================================================
pause
