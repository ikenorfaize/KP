#!/bin/bash
# ===================================
# 🔄 RESTART ALL SERVICES
# ===================================

echo "🛑 Stopping all services..."

# Stop frontend
pkill -9 -f vite
echo "✅ Frontend stopped"

# Stop backend
pkill -f "index-refactored"
echo "✅ Backend stopped"

# Stop file server
pkill -f "file-server"
echo "✅ File server stopped"

# Wait for processes to fully terminate
sleep 3

echo ""
echo "🚀 Starting all services..."

# Start Backend API
cd ~/backend
nohup node src/index-refactored.js > backend.log 2>&1 & echo $! > backend.pid
echo "✅ Backend started (PID: $(cat backend.pid))"

# Start File Server
cd ~/backend
nohup node src/file-server.js > file-server.log 2>&1 & echo $! > file-server.pid
echo "✅ File server started (PID: $(cat file-server.pid))"

# Start Frontend
cd ~/frontend
nohup npx vite --host 0.0.0.0 --force > frontend.log 2>&1 & echo $! > frontend.pid
echo "✅ Frontend starting (PID: $(cat frontend.pid))"

echo ""
echo "⏳ Waiting 10 seconds for services to initialize..."
sleep 10

echo ""
echo "🔍 Checking services status..."

# Check backend
BACKEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/api/health)
if [ "$BACKEND_STATUS" = "200" ]; then
  echo "✅ Backend API (3001): Running"
else
  echo "❌ Backend API (3001): Not responding (HTTP $BACKEND_STATUS)"
fi

# Check file server
FILE_SERVER_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3002)
if [ "$FILE_SERVER_STATUS" = "200" ]; then
  echo "✅ File Server (3002): Running"
else
  echo "❌ File Server (3002): Not responding (HTTP $FILE_SERVER_STATUS)"
fi

# Check frontend
FRONTEND_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:5173)
if [ "$FRONTEND_STATUS" = "200" ]; then
  echo "✅ Frontend Vite (5173): Running"
else
  echo "❌ Frontend Vite (5173): Not responding (HTTP $FRONTEND_STATUS)"
fi

# Check cloudflare tunnel
TUNNEL_COUNT=$(ps aux | grep cloudflared | grep -v grep | wc -l)
if [ "$TUNNEL_COUNT" -gt 0 ]; then
  echo "✅ Cloudflare Tunnel: Running ($TUNNEL_COUNT processes)"
else
  echo "⚠️ Cloudflare Tunnel: Not running (starting now...)"
  nohup cloudflared tunnel run pergunu-vm > cloudflared.log 2>&1 &
  sleep 3
  echo "✅ Cloudflare Tunnel: Started"
fi

echo ""
echo "🎯 All services restart complete!"
echo "🌐 Access website at: https://pergunu.fairuzfd.dev"
echo ""
echo "📊 View logs:"
echo "  - Backend:     tail -f ~/backend/backend.log"
echo "  - File Server: tail -f ~/backend/file-server.log"
echo "  - Frontend:    tail -f ~/frontend/frontend.log"
echo "  - Tunnel:      tail -f ~/cloudflared.log"
