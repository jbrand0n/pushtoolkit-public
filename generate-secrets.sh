#!/bin/bash
# Generate production secrets for PushToolkit deployment

echo "==================================="
echo "PushToolkit Secret Generator"
echo "==================================="
echo ""
echo "Copy these values to your Vercel environment variables:"
echo ""

echo "JWT_SECRET:"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo ""

echo "REFRESH_TOKEN_SECRET:"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo ""

echo "ENCRYPTION_KEY (must be exactly 32 characters):"
node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))"
echo ""

echo "VAPID KEYS:"
cd backend
npx web-push generate-vapid-keys
echo ""

echo "==================================="
echo "✓ All secrets generated!"
echo "==================================="
echo ""
echo "Next steps:"
echo "1. Save these values securely"
echo "2. Add them to Vercel environment variables"
echo "3. Deploy your application"
