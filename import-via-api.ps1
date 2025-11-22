# Import data to MongoDB via Vercel API (avoids local firewall issues)

$apiUrl = "https://kp-mocha.vercel.app/api"
$importFolder = "mongodb-import"

Write-Host "`n=== IMPORTING DATA VIA VERCEL API ===" -ForegroundColor Cyan
Write-Host "This bypasses local firewall/network issues`n" -ForegroundColor Yellow

# Function to import users (uses register endpoint)
function Import-Users {
    param([string]$filePath)
    
    Write-Host "Importing users..." -ForegroundColor Yellow
    
    $data = Get-Content $filePath -Raw | ConvertFrom-Json
    Write-Host "  Total documents: $($data.Count)" -ForegroundColor White
    
    $imported = 0
    foreach ($user in $data) {
        try {
            # Use register endpoint for users
            $response = Invoke-RestMethod -Uri "$apiUrl/register" -Method POST -Body ($user | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
            $imported++
            Write-Host "    Imported: $($user.email)" -ForegroundColor Green
        }
        catch {
            # User might already exist, that's OK
            if ($_.Exception.Message -like "*already exists*" -or $_.Exception.Message -like "*409*") {
                Write-Host "    Skipped (already exists): $($user.email)" -ForegroundColor Gray
            }
            else {
                Write-Host "    Failed: $($user.email) - $($_.Exception.Message)" -ForegroundColor Red
            }
        }
        Start-Sleep -Milliseconds 100
    }
    
    Write-Host "  Completed: $imported/$($data.Count) documents imported`n" -ForegroundColor Green
}

# Function to import other collections
function Import-Collection {
    param(
        [string]$collectionName,
        [string]$filePath
    )
    
    Write-Host "Importing $collectionName..." -ForegroundColor Yellow
    
    # Read JSON file
    $data = Get-Content $filePath -Raw | ConvertFrom-Json
    
    if ($data.Count -eq 0) {
        Write-Host "  Skipped (no data)" -ForegroundColor Gray
        return
    }
    
    Write-Host "  Total documents: $($data.Count)" -ForegroundColor White
    
    # Import in batches of 10 to avoid timeout
    $batchSize = 10
    $totalBatches = [Math]::Ceiling($data.Count / $batchSize)
    $imported = 0
    
    for ($i = 0; $i -lt $data.Count; $i += $batchSize) {
        $batch = $data[$i..[Math]::Min($i + $batchSize - 1, $data.Count - 1)]
        $batchNum = [Math]::Floor($i / $batchSize) + 1
        
        try {
            foreach ($doc in $batch) {
                $response = Invoke-RestMethod -Uri "$apiUrl/$collectionName" -Method POST -Body ($doc | ConvertTo-Json -Depth 10) -ContentType "application/json" -ErrorAction Stop
                $imported++
            }
            Write-Host "    Batch $batchNum/$totalBatches complete ($imported/$($data.Count))" -ForegroundColor Green
        }
        catch {
            Write-Host "    Batch $batchNum failed: $($_.Exception.Message)" -ForegroundColor Red
        }
        
        # Small delay to avoid overwhelming the API
        Start-Sleep -Milliseconds 200
    }
    
    Write-Host "  Completed: $imported/$($data.Count) documents imported`n" -ForegroundColor Green
}

# Import each collection
Import-Users -filePath "$importFolder\users.json"
Import-Collection -collectionName "news" -filePath "$importFolder\news.json"
Import-Collection -collectionName "applications" -filePath "$importFolder\applications.json"
Import-Collection -collectionName "beasiswa" -filePath "$importFolder\beasiswa.json"

Write-Host "=== IMPORT COMPLETE ===" -ForegroundColor Green
Write-Host "`nVerify at: https://cloud.mongodb.com" -ForegroundColor Cyan
Write-Host "Expected counts:" -ForegroundColor Yellow
Write-Host "  users: 6" -ForegroundColor White
Write-Host "  news: 8" -ForegroundColor White
Write-Host "  applications: 8" -ForegroundColor White
Write-Host "  beasiswa: 6`n" -ForegroundColor White
