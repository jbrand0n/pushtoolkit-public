# Push Notification API Test Script (PowerShell)
# This script tests all the main API endpoints

$BaseUrl = "http://localhost:3000/api"
$Token = ""
$SiteId = ""
$NotificationId = ""

Write-Host "🧪 Testing Push Notification API" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 1. Health Check
Write-Host "1️⃣  Testing health check..." -ForegroundColor Yellow
$healthResponse = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method Get
$healthResponse | ConvertTo-Json
Write-Host ""

# 2. Register User
Write-Host "2️⃣  Registering new user..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    password = "testpassword123"
    name = "Test User"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/register" -Method Post -Body $registerBody -ContentType "application/json"
    $registerResponse | ConvertTo-Json
    $Token = $registerResponse.data.token
    Write-Host "Token: $Token" -ForegroundColor Green
} catch {
    Write-Host "Registration failed (user might already exist). Trying login..." -ForegroundColor Yellow
}
Write-Host ""

# 3. Login
Write-Host "3️⃣  Testing login..." -ForegroundColor Yellow
$loginBody = @{
    email = "test@example.com"
    password = "testpassword123"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json"
$loginResponse | ConvertTo-Json
$Token = $loginResponse.data.token
Write-Host "Token: $Token" -ForegroundColor Green
Write-Host ""

# 4. Get Current User
Write-Host "4️⃣  Getting current user..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $Token"
}
$meResponse = Invoke-RestMethod -Uri "$BaseUrl/auth/me" -Method Get -Headers $headers
$meResponse | ConvertTo-Json
Write-Host ""

# 5. Create Site
Write-Host "5️⃣  Creating site..." -ForegroundColor Yellow
$siteBody = @{
    name = "Test Website"
    url = "https://test.example.com"
    settings = @{
        timezone = "America/New_York"
        icon = "https://test.example.com/icon.png"
    }
} | ConvertTo-Json

$siteResponse = Invoke-RestMethod -Uri "$BaseUrl/sites" -Method Post -Body $siteBody -ContentType "application/json" -Headers $headers
$siteResponse | ConvertTo-Json
$SiteId = $siteResponse.data.site.id
Write-Host "Site ID: $SiteId" -ForegroundColor Green
Write-Host ""

# 6. Get All Sites
Write-Host "6️⃣  Getting all sites..." -ForegroundColor Yellow
$sitesResponse = Invoke-RestMethod -Uri "$BaseUrl/sites" -Method Get -Headers $headers
$sitesResponse | ConvertTo-Json -Depth 3
Write-Host ""

# 7. Get Installation Code
Write-Host "7️⃣  Getting installation code..." -ForegroundColor Yellow
$installResponse = Invoke-RestMethod -Uri "$BaseUrl/sites/$SiteId/install-code" -Method Get -Headers $headers
Write-Host "Installation code retrieved successfully!" -ForegroundColor Green
Write-Host ""

# 8. Create Notification
Write-Host "8️⃣  Creating notification..." -ForegroundColor Yellow
$notificationBody = @{
    title = "Test Notification"
    message = "This is a test push notification!"
    destinationUrl = "https://test.example.com/welcome"
    iconUrl = "https://test.example.com/icon.png"
} | ConvertTo-Json

$notificationResponse = Invoke-RestMethod -Uri "$BaseUrl/sites/$SiteId/notifications" -Method Post -Body $notificationBody -ContentType "application/json" -Headers $headers
$notificationResponse | ConvertTo-Json
$NotificationId = $notificationResponse.data.notification.id
Write-Host "Notification ID: $NotificationId" -ForegroundColor Green
Write-Host ""

# 9. Get All Notifications
Write-Host "9️⃣  Getting all notifications..." -ForegroundColor Yellow
$notificationsResponse = Invoke-RestMethod -Uri "$BaseUrl/sites/$SiteId/notifications" -Method Get -Headers $headers
$notificationsResponse | ConvertTo-Json -Depth 3
Write-Host ""

# 10. Get Single Notification
Write-Host "🔟 Getting notification details..." -ForegroundColor Yellow
$singleNotificationResponse = Invoke-RestMethod -Uri "$BaseUrl/notifications/$NotificationId" -Method Get -Headers $headers
$singleNotificationResponse | ConvertTo-Json -Depth 3
Write-Host ""

# 11. Simulate Subscriber
Write-Host "1️⃣1️⃣  Simulating subscriber registration..." -ForegroundColor Yellow
$subscribeBody = @{
    siteId = $SiteId
    subscription = @{
        endpoint = "https://fcm.googleapis.com/fcm/send/test-endpoint-$(Get-Random)"
        keys = @{
            p256dh = "test-p256dh-key"
            auth = "test-auth-key"
        }
    }
    browser = "Chrome"
    os = "Windows"
    country = "US"
} | ConvertTo-Json

$subscribeResponse = Invoke-RestMethod -Uri "$BaseUrl/subscribe" -Method Post -Body $subscribeBody -ContentType "application/json"
$subscribeResponse | ConvertTo-Json
Write-Host ""

# 12. Get Subscribers
Write-Host "1️⃣2️⃣  Getting all subscribers..." -ForegroundColor Yellow
$subscribersResponse = Invoke-RestMethod -Uri "$BaseUrl/sites/$SiteId/subscribers" -Method Get -Headers $headers
$subscribersResponse | ConvertTo-Json -Depth 3
Write-Host ""

Write-Host "✅ API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "--------" -ForegroundColor Cyan
Write-Host "Token: $Token" -ForegroundColor White
Write-Host "Site ID: $SiteId" -ForegroundColor White
Write-Host "Notification ID: $NotificationId" -ForegroundColor White
Write-Host ""
Write-Host "To send notification, run:" -ForegroundColor Yellow
Write-Host "Invoke-RestMethod -Uri '$BaseUrl/notifications/$NotificationId/send' -Method Post -Headers @{Authorization='Bearer $Token'}" -ForegroundColor White
