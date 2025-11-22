# Clean MongoDB collections and reimport fresh data

$apiUrl = "https://kp-mocha.vercel.app/api"
$importFolder = "mongodb-import"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CLEANING & REIMPORTING FRESH DATA                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Step 1: Clear all collections using new admin endpoint
Write-Host "STEP 1: Clearing old data from MongoDB..." -ForegroundColor Yellow

$collections = @("news", "applications", "beasiswa", "beasiswa_applications")

foreach ($collection in $collections) {
    try {
        Write-Host "  Clearing $collection..." -ForegroundColor White
        $body = @{ collectionName = $collection } | ConvertTo-Json
        $result = Invoke-RestMethod -Uri "$apiUrl/admin/clear-collection" -Method POST -Body $body -ContentType "application/json" -ErrorAction Stop
        Write-Host "    ✅ Deleted $($result.deletedCount) documents" -ForegroundColor Green
    }
    catch {
        Write-Host "    ⚠️  Error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nSTEP 2: Importing fresh data from backup..." -ForegroundColor Yellow

# Function to import users
function Import-Users {
    param([string]$filePath)
    
    Write-Host "`n  Importing users..." -ForegroundColor Cyan
    $data = Get-Content $filePath -Raw | ConvertFrom-Json
    $imported = 0
    $skipped = 0
    
    foreach ($user in $data) {
        try {
            $null = Invoke-RestMethod -Uri "$apiUrl/register" -Method POST -Body ($user | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
            $imported++
            Write-Host "    ✅ $($user.email)" -ForegroundColor Green
        }
        catch {
            $skipped++
            Write-Host "    ⚠️  Skipped: $($user.email)" -ForegroundColor Gray
        }
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host "  ✅ Users: $imported imported, $skipped skipped`n" -ForegroundColor Green
}

# Function to import other collections
function Import-Collection {
    param(
        [string]$collectionName,
        [string]$filePath
    )
    
    Write-Host "  Importing $collectionName..." -ForegroundColor Cyan
    $data = Get-Content $filePath -Raw | ConvertFrom-Json
    
    if ($data.Count -eq 0) {
        Write-Host "    ⚠️  No data to import`n" -ForegroundColor Gray
        return
    }
    
    $imported = 0
    $failed = 0
    
    foreach ($doc in $data) {
        try {
            $null = Invoke-RestMethod -Uri "$apiUrl/$collectionName" -Method POST -Body ($doc | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
            $imported++
        }
        catch {
            $failed++
        }
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host "  ✅ $collectionName : $imported/$($data.Count) imported`n" -ForegroundColor Green
}

# Import all collections
Import-Users -filePath "$importFolder\users.json"
Import-Collection -collectionName "news" -filePath "$importFolder\news.json"
Import-Collection -collectionName "applications" -filePath "$importFolder\applications.json"
Import-Collection -collectionName "beasiswa" -filePath "$importFolder\beasiswa.json"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║  ✅ CLEAN IMPORT COMPLETE!                                 ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Green

# Verify
Write-Host "Verifying final data..." -ForegroundColor Cyan
Start-Sleep -Seconds 2

try {
    $status = Invoke-RestMethod -Uri "$apiUrl/admin/db-status" -Method GET
    Write-Host "`nFinal counts:" -ForegroundColor Yellow
    $allMatch = $true
    
    $expected = @{
        'users' = 6
        'news' = 8
        'applications' = 8
        'beasiswa' = 6
        'beasiswa_applications' = 0
    }
    
    $status.collections.PSObject.Properties | ForEach-Object {
        $exp = $expected[$_.Name]
        $match = $_.Value -eq $exp
        if (-not $match) { $allMatch = $false }
        $icon = if($match){'✅'}else{'❌'}
        $color = if($match){'Green'}else{'Red'}
        Write-Host "  $icon $($_.Name): $($_.Value) (expected: $exp)" -ForegroundColor $color
    }
    
    if ($allMatch) {
        Write-Host "`n🎉 SUCCESS! Data sekarang 100% BERSIH dan sesuai backup!" -ForegroundColor Green
    } else {
        Write-Host "`n⚠️  Some counts don't match - check Atlas web console" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "Could not verify: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTest persistence dengan: vercel --prod --force`n" -ForegroundColor Cyan
