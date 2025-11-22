# Script to split db.json into separate collection files for MongoDB Atlas import

Write-Host "`n🔄 Splitting db.json into separate collection files...`n" -ForegroundColor Cyan

# Read the main db.json file
$dbJson = Get-Content "api/db.json" -Raw | ConvertFrom-Json

# Create output directory
$outputDir = "mongodb-import"
if (!(Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir | Out-Null
}

# Export each collection to separate file
Write-Host "Exporting users collection..." -ForegroundColor Yellow
$dbJson.users | ConvertTo-Json -Depth 10 | Out-File "$outputDir/users.json" -Encoding UTF8
$userCount = $dbJson.users.Count
Write-Host "   Saved: $outputDir/users.json ($userCount documents)" -ForegroundColor Green
Write-Host ""

Write-Host "Exporting news collection..." -ForegroundColor Yellow
$dbJson.news | ConvertTo-Json -Depth 10 | Out-File "$outputDir/news.json" -Encoding UTF8
$newsCount = $dbJson.news.Count
Write-Host "   Saved: $outputDir/news.json ($newsCount documents)" -ForegroundColor Green
Write-Host ""

Write-Host "Exporting applications collection..." -ForegroundColor Yellow
$dbJson.applications | ConvertTo-Json -Depth 10 | Out-File "$outputDir/applications.json" -Encoding UTF8
$appCount = $dbJson.applications.Count
Write-Host "   Saved: $outputDir/applications.json ($appCount documents)" -ForegroundColor Green
Write-Host ""

Write-Host "Exporting beasiswa collection..." -ForegroundColor Yellow
$dbJson.beasiswa | ConvertTo-Json -Depth 10 | Out-File "$outputDir/beasiswa.json" -Encoding UTF8
$beasiswaCount = $dbJson.beasiswa.Count
Write-Host "   Saved: $outputDir/beasiswa.json ($beasiswaCount documents)" -ForegroundColor Green
Write-Host ""

Write-Host "Exporting beasiswa_applications collection..." -ForegroundColor Yellow
$dbJson.beasiswa_applications | ConvertTo-Json -Depth 10 | Out-File "$outputDir/beasiswa_applications.json" -Encoding UTF8
$beasiswaAppCount = $dbJson.beasiswa_applications.Count
Write-Host "   Saved: $outputDir/beasiswa_applications.json ($beasiswaAppCount documents)" -ForegroundColor Green
Write-Host ""

Write-Host "SUCCESS! All files created in mongodb-import folder" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Go to https://cloud.mongodb.com" -ForegroundColor White
Write-Host "2. Click Browse Collections on your cluster" -ForegroundColor White
Write-Host "3. Select pergunu_db database" -ForegroundColor White
Write-Host "4. For each collection, click INSERT DOCUMENT then Import JSON file" -ForegroundColor White
Write-Host "5. Upload the corresponding .json file from mongodb-import folder" -ForegroundColor White
Write-Host ""
