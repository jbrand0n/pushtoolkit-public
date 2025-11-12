#!/bin/bash

# Push Notification API Test Script
# This script tests all the main API endpoints

BASE_URL="http://localhost:3000/api"
TOKEN=""
SITE_ID=""
NOTIFICATION_ID=""

echo "🧪 Testing Push Notification API"
echo "================================"
echo ""

# 1. Health Check
echo "1️⃣  Testing health check..."
curl -s http://localhost:3000/health | json_pp
echo ""
echo ""

# 2. Register User
echo "2️⃣  Registering new user..."
REGISTER_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }')
echo "$REGISTER_RESPONSE" | json_pp
TOKEN=$(echo "$REGISTER_RESPONSE" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
echo ""
echo "Token: $TOKEN"
echo ""
echo ""

# 3. Login (alternative)
echo "3️⃣  Testing login..."
LOGIN_RESPONSE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123"
  }')
echo "$LOGIN_RESPONSE" | json_pp
echo ""
echo ""

# 4. Get Current User
echo "4️⃣  Getting current user..."
curl -s "$BASE_URL/auth/me" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# 5. Create Site
echo "5️⃣  Creating site..."
SITE_RESPONSE=$(curl -s -X POST "$BASE_URL/sites" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Website",
    "url": "https://test.example.com",
    "settings": {
      "timezone": "America/New_York",
      "icon": "https://test.example.com/icon.png"
    }
  }')
echo "$SITE_RESPONSE" | json_pp
SITE_ID=$(echo "$SITE_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "Site ID: $SITE_ID"
echo ""
echo ""

# 6. Get All Sites
echo "6️⃣  Getting all sites..."
curl -s "$BASE_URL/sites" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# 7. Get Installation Code
echo "7️⃣  Getting installation code..."
curl -s "$BASE_URL/sites/$SITE_ID/install-code" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# 8. Create Notification
echo "8️⃣  Creating notification..."
NOTIFICATION_RESPONSE=$(curl -s -X POST "$BASE_URL/sites/$SITE_ID/notifications" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "title": "Test Notification",
    "message": "This is a test push notification!",
    "destinationUrl": "https://test.example.com/welcome",
    "iconUrl": "https://test.example.com/icon.png"
  }')
echo "$NOTIFICATION_RESPONSE" | json_pp
NOTIFICATION_ID=$(echo "$NOTIFICATION_RESPONSE" | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
echo ""
echo "Notification ID: $NOTIFICATION_ID"
echo ""
echo ""

# 9. Get All Notifications
echo "9️⃣  Getting all notifications..."
curl -s "$BASE_URL/sites/$SITE_ID/notifications" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# 10. Get Single Notification
echo "🔟 Getting notification details..."
curl -s "$BASE_URL/notifications/$NOTIFICATION_ID" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

# 11. Simulate Subscriber (public endpoint - no auth)
echo "1️⃣1️⃣  Simulating subscriber registration..."
curl -s -X POST "$BASE_URL/subscribe" \
  -H "Content-Type: application/json" \
  -d '{
    "siteId": "'"$SITE_ID"'",
    "subscription": {
      "endpoint": "https://fcm.googleapis.com/fcm/send/test-endpoint-123",
      "keys": {
        "p256dh": "test-p256dh-key",
        "auth": "test-auth-key"
      }
    },
    "browser": "Chrome",
    "os": "Windows",
    "country": "US"
  }' | json_pp
echo ""
echo ""

# 12. Get Subscribers
echo "1️⃣2️⃣  Getting all subscribers..."
curl -s "$BASE_URL/sites/$SITE_ID/subscribers" \
  -H "Authorization: Bearer $TOKEN" | json_pp
echo ""
echo ""

echo "✅ API Testing Complete!"
echo ""
echo "Summary:"
echo "--------"
echo "Token: $TOKEN"
echo "Site ID: $SITE_ID"
echo "Notification ID: $NOTIFICATION_ID"
echo ""
echo "To send notification:"
echo "curl -X POST \"$BASE_URL/notifications/$NOTIFICATION_ID/send\" -H \"Authorization: Bearer $TOKEN\""
