# Clean MongoDB and reimport fresh data

$apiUrl = "https://kp-mocha.vercel.app/api"
$importFolder = "mongodb-import"

Write-Host "`n╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║  CLEANING & REIMPORTING FRESH DATA                         ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝`n" -ForegroundColor Cyan

# Step 1: Delete all existing data
Write-Host "STEP 1: Deleting old data..." -ForegroundColor Yellow

$collections = @("news", "applications", "beasiswa", "beasiswa_applications")

foreach ($collection in $collections) {
    try {
        Write-Host "  Deleting all $collection..." -ForegroundColor White
        $items = Invoke-RestMethod -Uri "$apiUrl/$collection" -Method GET -ErrorAction Stop
        
        foreach ($item in $items) {
            try {
                $null = Invoke-RestMethod -Uri "$apiUrl/$collection/$($item._id)" -Method DELETE -ErrorAction Stop
            }
            catch {
                # Ignore delete errors
            }
        }
        Write-Host "    ✅ $collection cleared" -ForegroundColor Green
    }
    catch {
        Write-Host "    ⚠️  Could not clear $collection : $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

Write-Host "`nSTEP 2: Importing fresh data..." -ForegroundColor Yellow

# Function to import users
function Import-Users {
    param([string]$filePath)
    
    Write-Host "`n  Importing users..." -ForegroundColor Cyan
    $data = Get-Content $filePath -Raw | ConvertFrom-Json
    $imported = 0
    
    foreach ($user in $data) {
        try {
            $null = Invoke-RestMethod -Uri "$apiUrl/register" -Method POST -Body ($user | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
            $imported++
            Write-Host "    ✅ $($user.email)" -ForegroundColor Green
        }
        catch {
            if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*409*") {
                Write-Host "    ⚠️  Already exists: $($user.email)" -ForegroundColor Yellow
            }
            else {
                Write-Host "    ❌ Failed: $($user.email)" -ForegroundColor Red
            }
        }
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host "  ✅ Users: $imported/$($data.Count) imported`n" -ForegroundColor Green
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
    
    foreach ($doc in $data) {
        try {
            $null = Invoke-RestMethod -Uri "$apiUrl/$collectionName" -Method POST -Body ($doc | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
            $imported++
        }
        catch {
            Write-Host "    ❌ Failed to import one document" -ForegroundColor Red
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
Write-Host "Verifying data..." -ForegroundColor Cyan
try {
    $status = Invoke-RestMethod -Uri "$apiUrl/admin/db-status" -Method GET
    Write-Host "`nFinal counts:" -ForegroundColor Yellow
    $status.collections.PSObject.Properties | ForEach-Object {
        $expected = switch($_.Name){'users'{6};'news'{8};'applications'{8};'beasiswa'{6};default{0}}
        $match = if($_.Value -eq $expected){'✅'}else{'⚠️ '}
        Write-Host "  $match $($_.Name): $($_.Value) (expected: $expected)" -ForegroundColor $(if($_.Value -eq $expected){'Green'}else{'Yellow'})
    }
}
catch {
    Write-Host "Could not verify: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n✅ Data sekarang BERSIH dan sesuai backup asli kamu!" -ForegroundColor Green
Write-Host "Test dengan: vercel --prod --force`n" -ForegroundColor Cyan
