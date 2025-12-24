#!/bin/bash
# Auto-Fix Script untuk News tanpa Image
# Set default image untuk semua news yang image-nya null/empty

echo "🔧 AUTO-FIX: Setting default images for news without images"
echo ""

cd ~/KP2/KP || exit 1

# Backup database first
echo "📦 Creating backup..."
sudo docker-compose exec -T backend cat /app/src/db.json > /tmp/db_backup_$(date +%Y%m%d_%H%M%S).json
echo "✅ Backup saved to /tmp/"
echo ""

# Get database
DB_JSON=$(sudo docker-compose exec -T backend cat /app/src/db.json)

# Fix: Set default image for news without images
echo "🔨 Fixing news without images..."
FIXED_JSON=$(echo "$DB_JSON" | jq '
  .news |= map(
    if (.image == null or .image == "" or .image == "/src/assets/noimage.png") then
      .image = "/src/assets/Berita1.png"
    else
      .
    end
  )
')

# Count how many fixed
COUNT=$(echo "$FIXED_JSON" | jq '[.news[] | select(.image == "/src/assets/Berita1.png")] | length')
echo "✅ Fixed $COUNT news items"
echo ""

# Save back to container
echo "💾 Saving fixed database..."
echo "$FIXED_JSON" | sudo docker-compose exec -T backend tee /app/src/db.json > /dev/null

echo ""
echo "========================================"
echo "✅ FIX APPLIED!"
echo "========================================"
echo ""
echo "📝 Next steps:"
echo "1. Refresh admin panel"
echo "2. Re-upload proper images for each news"
echo "3. Images will be saved to Cloudinary"
echo ""
echo "🔄 Restart backend to reload data:"
echo "   sudo docker-compose restart backend"
