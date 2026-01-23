# Test Email Automation Endpoints
# Run this script after starting your Next.js server (npm run dev)

$baseUrl = "http://localhost:3000"
$checkUrl = "http://127.0.0.1:3000"

Write-Host "🧪 Testing Email Automation Endpoints..." -ForegroundColor Cyan
Write-Host "Target: $checkUrl" -ForegroundColor Gray
Write-Host ""

# Pre-flight check
try {
    $testConnection = Test-NetConnection -ComputerName "127.0.0.1" -Port 3000 -InformationLevel Quiet
    if (-not $testConnection) {
        Write-Host "❌ Error: Could not connect to port 3000." -ForegroundColor Red
        Write-Host "👉 Please ensure your Next.js server is running ('npm run dev')." -ForegroundColor Yellow
        exit
    }
}
catch {
    # Fallback if Test-NetConnection fails (older PS versions)
    Write-Host "⚠️  Warning: Skipping port check..." -ForegroundColor DarkGray
}

function Send-Request {
    param (
        [string]$Endpoint,
        [string]$Name,
        [string]$JsonBody
    )

    Write-Host "$Name..." -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$checkUrl/api/$Endpoint" -Method Post -ContentType "application/json" -Body $JsonBody -ErrorAction Stop
        
        if ($response.success -eq $true -or $response.message) {
            Write-Host " ✅ Success" -ForegroundColor Green
        }
        else {
            Write-Host " ❌ Failed (API returned error)" -ForegroundColor Red
            Write-Host ($response | ConvertTo-Json -Depth 2) -ForegroundColor Gray
        }
    }
    catch {
        Write-Host " ❌ Error" -ForegroundColor Red
        Write-Host "   $($_.Exception.Message)" -ForegroundColor Gray
        if ($_.Exception.Response) {
            # Try to read response stream if available
            $stream = $_.Exception.Response.GetResponseStream()
            if ($stream) {
                $reader = New-Object System.IO.StreamReader($stream)
                $body = $reader.ReadToEnd()
                Write-Host "   Server details: $body" -ForegroundColor DarkGray
            }
        }
    }
}

# 1. Test Contact Form
Send-Request -Endpoint "contact" -Name "1. Contact Form" -JsonBody '{"name": "Test User Contact", "email": "test.contact@example.com", "country": "TestLand", "mobile": "1234567890", "message": "This is a test message for the Contact Form automation."}'

# 2. Test Lead Generation
Send-Request -Endpoint "leads" -Name "2. Lead Generation" -JsonBody '{"lookingFor": "AI Integration Test", "name": "Test User Lead", "email": "test.lead@example.com", "country": "TestLand", "mobile": "0987654321", "message": "This is a test message for the Lead Generation automation."}'

# 3. Test Feedback
Send-Request -Endpoint "feedback" -Name "3. Feedback" -JsonBody '{"rating": 5, "feedback": "This is a test feedback submission with a 5-star rating."}'

Write-Host ""
Write-Host "Done! Check admin@ocr-extraction.com for emails." -ForegroundColor Cyan
