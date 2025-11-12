# PowerShell script to generate production secrets for PushToolkit

Write-Host "==================================="
Write-Host "PushToolkit Secret Generator"
Write-Host "==================================="
Write-Host ""
Write-Host "Copy these values to your Vercel environment variables:"
Write-Host ""

Write-Host "JWT_SECRET:"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host ""

Write-Host "REFRESH_TOKEN_SECRET:"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
Write-Host ""

Write-Host "ENCRYPTION_KEY (must be exactly 32 characters):"
node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))"
Write-Host ""

Write-Host "VAPID KEYS:"
Set-Location backend
npx web-push generate-vapid-keys
Set-Location ..
Write-Host ""

Write-Host "==================================="
Write-Host "✓ All secrets generated!"
Write-Host "==================================="
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Save these values securely"
Write-Host "2. Add them to Vercel environment variables"
Write-Host "3. Deploy your application"
