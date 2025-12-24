# Script untuk test API endpoints setelah cleanup
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Testing API Endpoints" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3001"
$testsPassed = 0
$testsFailed = 0

# Helper function untuk test endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    try {
        if ($Method -eq "GET") {
            $response = Invoke-RestMethod -Uri $Url -Method $Method -ErrorAction Stop
            Write-Host "  PASSED" -ForegroundColor Green
            return $true
        } else {
            $jsonBody = $Body | ConvertTo-Json
            $response = Invoke-RestMethod -Uri $Url -Method $Method -Body $jsonBody -ContentType "application/json" -ErrorAction Stop
            Write-Host "  PASSED" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host "  FAILED: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# Test 1: Health Check
if (Test-Endpoint -Name "Health Check" -Url "$baseUrl/api/health") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 2: Get All News
if (Test-Endpoint -Name "Get All News" -Url "$baseUrl/api/news") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 3: Get All Beasiswa
if (Test-Endpoint -Name "Get All Beasiswa" -Url "$baseUrl/api/beasiswa") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 4: Get Featured News
if (Test-Endpoint -Name "Get Featured News" -Url "$baseUrl/api/news/featured") {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 5: Register (should work with new cleaned code)
$registerData = @{
    username = "testuser_$(Get-Random)"
    email = "test_$(Get-Random)@test.com"
    password = "testpass123"
    fullName = "Test User"
}

if (Test-Endpoint -Name "Register User" -Url "$baseUrl/api/auth/register" -Method "POST" -Body $registerData) {
    $testsPassed++
} else {
    $testsFailed++
}

# Test 6: Check Password Endpoint (cleaned passwordCheck.js)
$passwordData = @{
    password = "uniquepassword123"
}

if (Test-Endpoint -Name "Check Password" -Url "$baseUrl/api/auth/check-password" -Method "POST" -Body $passwordData) {
    $testsPassed++
} else {
    $testsFailed++
}

# Summary
Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Total Tests: $($testsPassed + $testsFailed)" -ForegroundColor White
Write-Host "Passed: $testsPassed" -ForegroundColor Green
Write-Host "Failed: $testsFailed" -ForegroundColor Red

if ($testsFailed -eq 0) {
    Write-Host ""
    Write-Host "SUCCESS: All tests passed! API is working correctly." -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "FAILED: Some tests failed. Please check the errors above." -ForegroundColor Red
}
