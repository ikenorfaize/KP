# ===================================
# 🧹 CLEANUP OLD MONOREPO FILES
# ===================================
# This script removes old files that are now in backend/frontend

Write-Host "🧹 Starting cleanup of old monorepo files..." -ForegroundColor Cyan
Write-Host ""

# Safety check
Write-Host "⚠️  WARNING: This will DELETE old files!" -ForegroundColor Yellow
Write-Host "   Make sure backend/ and frontend/ are working before proceeding!" -ForegroundColor Yellow
Write-Host ""
$confirm = Read-Host "Type 'YES' to continue"

if ($confirm -ne "YES") {
    Write-Host "❌ Cleanup cancelled" -ForegroundColor Red
    exit
}

Write-Host ""
Write-Host "🗑️  Removing old structure files..." -ForegroundColor Yellow

# Remove old folders
$foldersToRemove = @(
    "api",
    "src",
    "public",
    "uploads",
    "node_modules",
    "dist"
)

foreach ($folder in $foldersToRemove) {
    if (Test-Path $folder) {
        Write-Host "  → Removing folder: $folder" -ForegroundColor Gray
        Remove-Item -Path $folder -Recurse -Force
        Write-Host "    ✓ Deleted" -ForegroundColor Green
    }
}

# Remove old files
$filesToRemove = @(
    "package.json",
    "package-lock.json",
    "index.html",
    "vite.config.js",
    "tailwind.config.js",
    "postcss.config.js",
    "eslint.config.js",
    "file-server.js"
)

foreach ($file in $filesToRemove) {
    if (Test-Path $file) {
        Write-Host "  → Removing file: $file" -ForegroundColor Gray
        Remove-Item -Path $file -Force
        Write-Host "    ✓ Deleted" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "🧹 Removing migration scripts..." -ForegroundColor Yellow

$scriptsToRemove = @(
    "restructure-project.ps1",
    "restructure-project-v2.ps1"
)

foreach ($script in $scriptsToRemove) {
    if (Test-Path $script) {
        Write-Host "  → Removing: $script" -ForegroundColor Gray
        Remove-Item -Path $script -Force
        Write-Host "    ✓ Deleted" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "✅ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📂 Your project now has clean multi-repo structure:" -ForegroundColor Cyan
Write-Host "   backend/   - Backend API" -ForegroundColor White
Write-Host "   frontend/  - Frontend app" -ForegroundColor White
Write-Host "   [docs]     - Documentation" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: vercel.json still exists - update it for multi-repo deployment" -ForegroundColor Yellow
Write-Host ""
