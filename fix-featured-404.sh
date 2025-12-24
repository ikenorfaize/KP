#!/bin/bash
# Quick Fix Script untuk Error 404 "News not found"
# Run: bash fix-featured-404.sh

set -e  # Exit on error

echo "========================================"
echo "🔧 FIXING FEATURED NEWS 404 ERROR"
echo "========================================"
echo ""

# Change to project directory
cd ~/KP2/KP || cd ~/KP || { echo "❌ Project directory not found!"; exit 1; }
echo "✅ Found project directory: $(pwd)"
echo ""

# Step 1: Pull latest code
echo "📥 Step 1: Pulling latest code..."
git pull origin main
echo ""

# Step 2: Stop all containers
echo "🛑 Step 2: Stopping containers..."
sudo docker-compose down
echo ""

# Step 3: Clean docker cache
echo "🧹 Step 3: Cleaning docker cache..."
sudo docker system prune -f
echo ""

# Step 4: Rebuild with no cache
echo "🔨 Step 4: Rebuilding all services..."
sudo docker-compose build --no-cache
echo ""

# Step 5: Start containers
echo "🚀 Step 5: Starting containers..."
sudo docker-compose up -d
echo ""

# Step 6: Wait for services to be ready
echo "⏳ Step 6: Waiting 30 seconds for services..."
sleep 30
echo ""

# Step 7: Check backend logs
echo "📋 Step 7: Checking backend logs..."
sudo docker-compose logs backend | tail -20
echo ""

# Step 8: Get valid news IDs
echo "🔍 Step 8: Getting valid news IDs from database..."
sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[0:5] | .[] | {id, title, featured}'
echo ""

# Step 9: Test endpoint
echo "🧪 Step 9: Testing featured endpoint..."
FIRST_ID=$(sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[0].id')
echo "Using news ID: $FIRST_ID"
echo ""

curl -X PUT "http://localhost:3001/api/news/$FIRST_ID/feature" \
  -H "Content-Type: application/json" \
  -H "x-user-id: test" \
  -d '{"featured": true}' \
  -w "\nHTTP Status: %{http_code}\n"
echo ""

# Step 10: Check Traefik
echo "🔗 Step 10: Checking Traefik routing..."
curl -s -X GET "https://api.fairuzfd.site/api/news" | jq -r '.[0] | {id, title}' || echo "⚠️ External URL not responding"
echo ""

# Final instructions
echo "========================================"
echo "✅ FIX COMPLETED!"
echo "========================================"
echo ""
echo "📋 Next Steps:"
echo "1. Clear browser cache (Ctrl+Shift+Delete)"
echo "2. Open browser in INCOGNITO mode"
echo "3. Go to: https://fairuzfd.site/admin"
echo "4. Login as admin"
echo "5. Click '⭐ Jadikan Utama' button"
echo ""
echo "Expected result: Button should work WITHOUT 404 error!"
echo ""
echo "🆘 If still error, check:"
echo "   - News ID exists in database (see list above)"
echo "   - User is logged in with admin role"
echo "   - Browser cache is cleared"
echo ""
