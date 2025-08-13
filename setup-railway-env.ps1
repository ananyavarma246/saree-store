# PowerShell script to set Railway environment variables
# Make sure you have Railway CLI installed: npm install -g @railway/cli

Write-Host "🚂 Setting up Railway Environment Variables for Admin Portal" -ForegroundColor Yellow
Write-Host ""

# Check if Railway CLI is installed
try {
    $railwayVersion = railway --version
    Write-Host "✅ Railway CLI found: $railwayVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Railway CLI not found. Please install it first:" -ForegroundColor Red
    Write-Host "npm install -g @railway/cli" -ForegroundColor Yellow
    Write-Host "Then run: railway login" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Setting environment variables..." -ForegroundColor Yellow

# Set the admin email
try {
    railway variables --set "ADMIN_EMAIL=admin@alankree.com"
    Write-Host "✅ Set ADMIN_EMAIL" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set ADMIN_EMAIL" -ForegroundColor Red
}

# Set the admin password hash
try {
    railway variables --set "ADMIN_PASSWORD_HASH=`$2b`$12`$FMu3EgqLiSvpkWvNV8ZeMO7bWV8OgqnI/gnkez7PrSul2tDuzDTDW"
    Write-Host "✅ Set ADMIN_PASSWORD_HASH" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set ADMIN_PASSWORD_HASH" -ForegroundColor Red
}

# Set JWT secret if not exists
try {
    railway variables --set "ADMIN_JWT_SECRET=your-super-secret-jwt-key-here-change-this-in-production"
    Write-Host "✅ Set ADMIN_JWT_SECRET" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to set ADMIN_JWT_SECRET" -ForegroundColor Red
}

Write-Host ""
Write-Host "🎯 Environment variables set! Railway will automatically redeploy." -ForegroundColor Green
Write-Host "Wait a few minutes, then test admin login at:" -ForegroundColor Yellow
Write-Host "https://alankree-production.up.railway.app/api/admin/login" -ForegroundColor Cyan
Write-Host ""
Write-Host "Test credentials:" -ForegroundColor Yellow
Write-Host "Email: admin@alankree.com" -ForegroundColor White
Write-Host "Password: admin123" -ForegroundColor White
