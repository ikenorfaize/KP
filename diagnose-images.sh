#!/bin/bash
# Diagnostic Script untuk Image Issues
# Jalankan di Azure VM: bash diagnose-images.sh

echo "========================================"
echo "🔍 DIAGNOSING IMAGE ISSUES"
echo "========================================"
echo ""

# Navigate to project
cd ~/KP2/KP || { echo "❌ Project not found"; exit 1; }

echo "📊 Step 1: Check News in Database"
echo "-----------------------------------"
sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | {id, title, image, hasImage: (.image != null and .image != "")}' | head -20
echo ""

echo "📸 Step 2: Check Images with Empty/Null Path"
echo "---------------------------------------------"
EMPTY_IMAGES=$(sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | select(.image == null or .image == "" or .image == "/src/assets/noimage.png") | {id, title}')
echo "$EMPTY_IMAGES"
echo ""

echo "🔗 Step 3: Check Image URL Types"
echo "-----------------------------------"
echo "Cloudinary URLs:"
sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | select(.image | startswith("https://res.cloudinary")) | {id, title, image}' | head -5
echo ""
echo "Local paths:"
sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | select(.image | startswith("/src/assets")) | {id, title, image}' | head -5
echo ""
echo "Relative paths:"
sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | select(.image != null and (.image | startswith("/") | not) and (.image | startswith("http") | not)) | {id, title, image}' | head -5
echo ""

echo "📁 Step 4: Check Uploaded Images Folder"
echo "----------------------------------------"
echo "Images in backend uploads:"
sudo docker-compose exec backend ls -lh /app/uploads/images/ 2>/dev/null | head -10 || echo "⚠️ No images folder"
echo ""

echo "🧪 Step 5: Test Image Upload Endpoint"
echo "---------------------------------------"
curl -X POST http://localhost:3001/api/upload/image -F "image=@/dev/null" 2>&1 | head -5
echo ""

echo "📋 Step 6: Count News by Image Status"
echo "---------------------------------------"
TOTAL=$(sudo docker-compose exec -T backend cat /app/src/db.json | jq '.news | length')
WITH_IMAGE=$(sudo docker-compose exec -T backend cat /app/src/db.json | jq '[.news[] | select(.image != null and .image != "" and .image != "/src/assets/noimage.png")] | length')
WITHOUT_IMAGE=$(($TOTAL - $WITH_IMAGE))

echo "Total news: $TOTAL"
echo "With valid image: $WITH_IMAGE"
echo "Without image: $WITHOUT_IMAGE"
echo ""

echo "========================================"
echo "✅ DIAGNOSIS COMPLETE"
echo "========================================"
echo ""
echo "📝 RECOMMENDATION:"
if [ $WITHOUT_IMAGE -gt 0 ]; then
  echo "⚠️ $WITHOUT_IMAGE news tidak punya image valid!"
  echo ""
  echo "Solusi:"
  echo "1. Re-upload gambar untuk berita yang kosong via Admin Panel"
  echo "2. Atau jalankan fix script untuk set default image"
  echo ""
  echo "Berita yang perlu di-fix:"
  sudo docker-compose exec -T backend cat /app/src/db.json | jq -r '.news[] | select(.image == null or .image == "" or .image == "/src/assets/noimage.png") | "  - ID: \(.id) | \(.title)"' | head -10
else
  echo "✅ Semua berita punya image valid!"
fi
