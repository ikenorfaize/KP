@echo off
echo ========================================
echo   PERGUNU PROJECT - Starting All Services
echo ========================================
echo.

REM Kill existing node processes
echo [1/4] Stopping existing Node processes...
taskkill /F /IM node.exe >nul 2>&1
timeout /t 2 >nul

REM Start Backend API (Port 3001)
echo [2/4] Starting Backend API on port 3001...
start "Backend API - Port 3001" cmd /k "cd /d %~dp0backend && node src/index-refactored.js"
timeout /t 3 >nul

REM Start File Server (Port 3002)
echo [3/4] Starting File Server on port 3002...
start "File Server - Port 3002" cmd /k "cd /d %~dp0backend && node src/file-server.js"
timeout /t 3 >nul

REM Start Frontend (Port 5173)
echo [4/4] Starting Frontend on port 5173...
start "Frontend - Port 5173" cmd /k "cd /d %~dp0frontend && npm run dev"
timeout /t 5 >nul

echo.
echo ========================================
echo   All Services Started!
echo ========================================
echo.
echo   Backend API:    http://localhost:3001
echo   File Server:    http://localhost:3002
echo   Frontend:       http://localhost:5173
echo.
echo   Public URLs (if Cloudflare tunnels running):
echo   - https://apipergunu.fairuzfd.dev
echo   - https://fspergunu.fairuzfd.dev
echo   - https://pergunu.fairuzfd.dev
echo.
echo Press any key to open frontend in browser...
pause >nul
start http://localhost:5173
