# Script to fix image paths in database
# Updates news and beasiswa to use proper local paths or placeholders

$dbPath = "C:\Users\fairu\campus\KP\backend\src\db.json"
$uploadDir = "C:\Users\fairu\campus\KP\backend\src\uploads\images"

Write-Host "📖 Reading database..." -ForegroundColor Cyan
$db = Get-Content $dbPath -Raw | ConvertFrom-Json

Write-Host "🔍 Checking news images..." -ForegroundColor Yellow

# Fix news images
$fixedCount = 0
foreach($news in $db.news) {
    $oldImage = $news.image
    
    # Skip if no image
    if(-not $news.image) { continue }
    
    # Check if using Cloudinary or Vercel proxy
    if($news.image -like "*cloudinary*" -or $news.image -like "*vercel*") {
        # Use placeholder for now
        $news.image = "/uploads/images/placeholder-news.png"
        Write-Host "  ⚠️ Fixed Cloudinary URL: $($news.title)" -ForegroundColor Yellow
        $fixedCount++
    }
    # Check if using relative path only (filename)
    elseif($news.image -notlike "http*" -and $news.image -notlike "/uploads/*") {
        # Add proper path prefix
        $news.image = "/uploads/images/$($news.image)"
        Write-Host "  ✅ Added path prefix: $($news.title)" -ForegroundColor Green
        $fixedCount++
    }
}

Write-Host "`n🔍 Checking beasiswa images..." -ForegroundColor Yellow

# Fix beasiswa images
foreach($beasiswa in $db.beasiswa) {
    $oldImage = $beasiswa.image
    
    # Skip if no image
    if(-not $beasiswa.image) { continue }
    
    # Check if using Cloudinary or Vercel proxy
    if($beasiswa.image -like "*cloudinary*" -or $beasiswa.image -like "*vercel*") {
        # Use placeholder for now
        $beasiswa.image = "/uploads/images/placeholder-beasiswa.png"
        Write-Host "  ⚠️ Fixed Cloudinary URL: $($beasiswa.title)" -ForegroundColor Yellow
        $fixedCount++
    }
    # Check if using relative path only (filename)
    elseif($beasiswa.image -notlike "http*" -and $beasiswa.image -notlike "/uploads/*") {
        # Add proper path prefix
        $beasiswa.image = "/uploads/images/$($beasiswa.image)"
        Write-Host "  ✅ Added path prefix: $($beasiswa.title)" -ForegroundColor Green
        $fixedCount++
    }
}

# Save updated database
Write-Host "`n💾 Saving updated database..." -ForegroundColor Cyan
$jsonContent = $db | ConvertTo-Json -Depth 10
[System.IO.File]::WriteAllText($dbPath, $jsonContent, [System.Text.UTF8Encoding]::new($false))

Write-Host "✅ Fixed $fixedCount image paths!" -ForegroundColor Green

# Create placeholder images
Write-Host "`n🎨 Creating placeholder images..." -ForegroundColor Cyan

if(-not (Test-Path $uploadDir)) {
    New-Item -ItemType Directory -Path $uploadDir -Force | Out-Null
}

# Simple placeholder text files (will be replaced with actual images later)
@"
This is a placeholder for news images.
Upload actual images through the admin panel.
"@ | Out-File "$uploadDir\placeholder-news.png" -Encoding UTF8

@"
This is a placeholder for beasiswa images.
Upload actual images through the admin panel.
"@ | Out-File "$uploadDir\placeholder-beasiswa.png" -Encoding UTF8

Write-Host "✅ Placeholders created!" -ForegroundColor Green
Write-Host "`n📊 Summary:" -ForegroundColor Cyan
Write-Host "  - Fixed: $fixedCount image paths" -ForegroundColor White
Write-Host "  - Database: $dbPath" -ForegroundColor White
Write-Host "  - Upload dir: $uploadDir" -ForegroundColor White
Write-Host "`n⚠️ Note: Placeholder images are text files. Upload real images via admin panel." -ForegroundColor Yellow
