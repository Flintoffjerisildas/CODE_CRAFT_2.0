# deploy-production.ps1 - Windows PowerShell deployment script

Write-Host "🚀 Starting production deployment..." -ForegroundColor Green

# Step 1: Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install --production

# Step 2: Build frontend
Write-Host "⚛️ Building React frontend..." -ForegroundColor Yellow
Set-Location ../frontend
npm install
npm run build

# Step 3: Copy build to backend (for single-server deployment)
Write-Host "📁 Copying frontend build to backend..." -ForegroundColor Yellow
Copy-Item -Path "build" -Destination "../backend/" -Recurse -Force

# Step 4: Test production build locally (optional)
Write-Host "🧪 Testing production build..." -ForegroundColor Yellow
Set-Location ../backend
$env:NODE_ENV = "production"

# Start server in background
Start-Process -FilePath "node" -ArgumentList "server.js" -NoNewWindow -RedirectStandardOutput "server.log" -RedirectStandardError "error.log"

# Wait for server to start
Start-Sleep -Seconds 5

# Test health endpoint
try {
    $response = Invoke-RestMethod -Uri "http://localhost:5000/api/health" -Method Get
    Write-Host "✅ Health check passed: $($response.status)" -ForegroundColor Green
} catch {
    Write-Host "❌ Health check failed: $_" -ForegroundColor Red
    exit 1
}

# Stop test server
Get-Process -Name "node" | Where-Object {$_.Path -like "*server.js*"} | Stop-Process -Force

Write-Host "🎉 Production build ready!" -ForegroundColor Green
Write-Host "💡 Deploy the backend/ folder to your hosting service" -ForegroundColor Cyan
Write-Host "📋 Make sure to set NODE_ENV=production on your hosting platform" -ForegroundColor Cyan

# Clean up
Remove-Item "server.log" -ErrorAction SilentlyContinue
Remove-Item "error.log" -ErrorAction SilentlyContinue