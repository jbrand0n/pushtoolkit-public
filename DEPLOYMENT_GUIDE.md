# PushToolkit - Vercel Deployment Guide

Complete guide for deploying PushToolkit to Vercel with production-ready configuration.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Git Repository Setup](#git-repository-setup)
4. [Database Setup](#database-setup)
5. [Redis Setup](#redis-setup)
6. [Vercel Deployment](#vercel-deployment)
7. [Environment Variables](#environment-variables)
8. [Post-Deployment](#post-deployment)
9. [Custom Domain](#custom-domain)
10. [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [x] GitHub account
- [x] Vercel account (connect with GitHub)
- [x] PostgreSQL database (Vercel Postgres, Supabase, or Neon)
- [x] Redis instance (Upstash recommended for Vercel)
- [x] VAPID keys generated
- [x] Resend API key for emails

---

## Pre-Deployment Checklist

### 1. Update Configuration Files

#### Update `backend/package.json` for production:
```json
{
  "scripts": {
    "start": "node src/index.js",
    "build": "npx prisma generate",
    "postinstall": "npx prisma generate"
  }
}
```

#### Create `vercel.json` in root:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "backend/src/index.js",
      "use": "@vercel/node"
    },
    {
      "src": "frontend/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "backend/src/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ]
}
```

### 2. Update CORS Configuration

In `backend/src/index.js`, update CORS for production:
```javascript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 3. Create `.gitignore` (if not exists)
```
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Production
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db

# Prisma
*.db
*.db-journal

# Service worker cache
.bmad-core/
web-bundles/
```

---

## Git Repository Setup

### 1. Initialize Git Repository (if not already done)
```bash
git init
git add .
git commit -m "Initial commit: PushToolkit deployment"
```

### 2. Create GitHub Repository
1. Go to https://github.com/new
2. Name: `pushtoolkit` (or your preferred name)
3. Keep it Private or Public
4. Don't initialize with README (you already have files)
5. Click "Create repository"

### 3. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/pushtoolkit.git
git branch -M main
git push -u origin main
```

---

## Database Setup

### Option 1: Vercel Postgres (Recommended)

1. Go to https://vercel.com/dashboard
2. Click "Storage" → "Create Database"
3. Select "Postgres"
4. Choose region (closest to your users)
5. Click "Create"
6. Copy the `DATABASE_URL` from the `.env.local` tab

### Option 2: Supabase (Free Tier Available)

1. Go to https://supabase.com/dashboard
2. Create new project
3. Wait for database to initialize
4. Go to Settings → Database
5. Copy connection string (choose "URI" format)
6. Replace `[YOUR-PASSWORD]` with your database password

Format: `postgresql://postgres:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres`

### Option 3: Neon (Serverless Postgres)

1. Go to https://neon.tech
2. Sign up and create project
3. Copy connection string
4. Format: `postgresql://user:pass@ep-xxx.region.aws.neon.tech/neondb`

### Run Database Migrations

After setting up database, run migrations locally first:
```bash
cd backend
DATABASE_URL="your-production-database-url" npx prisma migrate deploy
```

---

## Redis Setup

### Upstash Redis (Recommended for Vercel)

1. Go to https://upstash.com
2. Sign up and create Redis database
3. Choose region (same as your Vercel deployment)
4. Copy these values:
   - REDIS_HOST (Endpoint)
   - REDIS_PORT (Port - usually 6379)
   - REDIS_PASSWORD (Password)

Example:
```
REDIS_HOST=usw1-charming-rat-12345.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=AbCdEfGhIjKlMnOpQrStUvWxYz123456
```

---

## Vercel Deployment

### Method 1: Deploy via Vercel Dashboard (Easiest)

1. **Go to Vercel Dashboard**
   - Visit https://vercel.com/dashboard
   - Click "Add New" → "Project"

2. **Import Git Repository**
   - Select your GitHub repository
   - Click "Import"

3. **Configure Project**
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave as root)
   - **Build Command**: Leave default or use:
     ```
     cd backend && npm install && npx prisma generate && cd ../frontend && npm install && npm run build
     ```
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install`

4. **Add Environment Variables** (See next section)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-5 minutes for deployment

### Method 2: Deploy via Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Link to existing project? No
# - What's your project name? pushtoolkit
# - In which directory is your code? ./
# - Want to modify settings? Yes
# - Build Command: (see above)
# - Output Directory: frontend/dist
# - Development Command: npm run dev

# Deploy to production
vercel --prod
```

---

## Environment Variables

### Required Environment Variables for Vercel

Add these in Vercel Dashboard → Settings → Environment Variables:

#### Backend Variables
```bash
# Database
DATABASE_URL=postgresql://user:pass@host:5432/database

# Redis
REDIS_HOST=your-redis-host.upstash.io
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# JWT Secrets (Generate new ones for production!)
JWT_SECRET=your-super-secret-jwt-key-256-bits-minimum
JWT_EXPIRES_IN=7d
REFRESH_TOKEN_SECRET=your-refresh-token-secret-256-bits
REFRESH_TOKEN_EXPIRES_IN=30d

# Server
NODE_ENV=production
PORT=3000
API_URL=https://your-domain.vercel.app

# CORS
FRONTEND_URL=https://your-domain.vercel.app

# Email (Resend)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
FROM_NAME=PushToolkit

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Encryption Key (MUST be exactly 32 characters)
# Generate with: node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))"
ENCRYPTION_KEY=your-32-character-encryption-key

# Logging
LOG_LEVEL=info
```

#### Frontend Variables
```bash
VITE_API_URL=https://your-domain.vercel.app/api
VITE_APP_NAME=PushToolkit
```

### How to Add Environment Variables in Vercel

1. Go to your project in Vercel Dashboard
2. Click "Settings" → "Environment Variables"
3. Add each variable:
   - Key: Variable name (e.g., `DATABASE_URL`)
   - Value: Variable value
   - Environments: Check "Production", "Preview", "Development"
4. Click "Save"

### Generate Secure Secrets

Use these commands to generate secure secrets:

```bash
# JWT Secret (32 bytes)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Encryption Key (exactly 32 characters)
node -e "console.log(require('crypto').randomBytes(32).toString('base64').slice(0, 32))"

# VAPID Keys (for push notifications)
cd backend
npx web-push generate-vapid-keys
```

---

## Post-Deployment

### 1. Verify Deployment

Visit your Vercel URL:
- Frontend: `https://your-project.vercel.app`
- Backend Health: `https://your-project.vercel.app/api/health`

### 2. Run Database Migrations

If not done during build:
```bash
# Set environment variable locally
export DATABASE_URL="your-production-database-url"

# Run migrations
cd backend
npx prisma migrate deploy
```

### 3. Test Critical Features

- [ ] Landing page loads
- [ ] Login page accessible
- [ ] API health check responds
- [ ] Database connection works
- [ ] Redis connection works

### 4. Monitor Logs

In Vercel Dashboard:
- Go to your project
- Click "Deployments" → Click latest deployment
- View "Function Logs" for backend errors
- View "Build Logs" for build issues

---

## Custom Domain

### 1. Add Domain in Vercel

1. Go to Project Settings → "Domains"
2. Click "Add Domain"
3. Enter your domain: `yourdomain.com`
4. Click "Add"

### 2. Configure DNS

Add these DNS records at your domain registrar:

**For root domain (yourdomain.com):**
```
Type: A
Name: @
Value: 76.76.21.21
```

**For www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

### 3. Update Environment Variables

After domain is active, update:
```bash
FRONTEND_URL=https://yourdomain.com
API_URL=https://yourdomain.com
VITE_API_URL=https://yourdomain.com/api
```

### 4. Redeploy

After updating environment variables, redeploy:
- Go to Deployments tab
- Click "..." on latest deployment
- Click "Redeploy"

---

## Troubleshooting

### Build Fails

**Issue**: Build fails with "Cannot find module"
```bash
# Solution: Check package.json has all dependencies
cd backend && npm install
cd ../frontend && npm install
git add package-lock.json
git commit -m "Update dependencies"
git push
```

**Issue**: Prisma client not generated
```bash
# Solution: Add postinstall script to backend/package.json
"scripts": {
  "postinstall": "npx prisma generate"
}
```

### Database Connection Fails

**Issue**: "Database does not exist"
```bash
# Solution: Create database manually
psql "your-database-url"
CREATE DATABASE pushtoolkit;
```

**Issue**: SSL connection error
```bash
# Solution: Add ?sslmode=require to DATABASE_URL
DATABASE_URL=postgresql://user:pass@host:5432/db?sslmode=require
```

### Redis Connection Fails

**Issue**: "Connection refused"
- Check REDIS_HOST, REDIS_PORT, REDIS_PASSWORD are correct
- Ensure Redis instance is running
- Check if Redis requires SSL (Upstash uses SSL by default)

### CORS Errors

**Issue**: "Access-Control-Allow-Origin" error
```javascript
// Solution: Update backend/src/index.js
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
```

### Environment Variables Not Loading

**Issue**: Undefined environment variables
1. Check spelling in Vercel Dashboard
2. Ensure variables are set for correct environment (Production/Preview)
3. Redeploy after adding variables
4. For VITE variables, must start with `VITE_`

### Function Timeout

**Issue**: "Function execution timeout"
- Vercel free tier: 10s timeout
- Solution: Optimize slow queries or upgrade plan
- Check for infinite loops in code

---

## Production Checklist

Before going live:

### Security
- [ ] Change all default secrets (JWT_SECRET, ENCRYPTION_KEY)
- [ ] Update VAPID contact email in `backend/src/utils/vapid.js`
- [ ] Enable HTTPS only (Vercel does this automatically)
- [ ] Review rate limiting settings
- [ ] Audit API endpoints for security

### Database
- [ ] Run all migrations
- [ ] Set up automatic backups
- [ ] Review connection pool settings
- [ ] Test database connection

### Performance
- [ ] Enable Vercel Analytics
- [ ] Set up monitoring (Sentry, LogRocket)
- [ ] Test page load speeds
- [ ] Optimize images and assets

### Functionality
- [ ] Test all user flows
- [ ] Verify email sending works
- [ ] Test push notifications
- [ ] Check mobile responsiveness
- [ ] Test with real data

### Documentation
- [ ] Update README with production URL
- [ ] Document API endpoints
- [ ] Create user guide
- [ ] Set up status page

---

## Scaling Considerations

### When to Upgrade

**Free Tier Limits:**
- 100GB bandwidth/month
- 6,000 build minutes
- 100 deployments/day

**Upgrade when:**
- Traffic exceeds 100GB/month
- Need faster builds
- Require longer function execution
- Need team collaboration features

### Performance Optimization

1. **Enable Edge Caching**
   ```javascript
   // Add to API routes that can be cached
   res.set('Cache-Control', 's-maxage=60, stale-while-revalidate');
   ```

2. **Database Connection Pooling**
   ```javascript
   // Prisma already uses connection pooling
   // Adjust pool size in DATABASE_URL:
   DATABASE_URL="...?connection_limit=10"
   ```

3. **Redis Connection Reuse**
   ```javascript
   // Use singleton pattern for Redis client
   // Already implemented in backend/src/config/redis.js
   ```

---

## Support

### Documentation
- Vercel Docs: https://vercel.com/docs
- Prisma Docs: https://www.prisma.io/docs
- Upstash Docs: https://docs.upstash.com

### Common Issues
- Vercel Status: https://vercel-status.com
- GitHub Issues: Create issue in your repository

---

## Next Steps

After successful deployment:

1. **Set Up Monitoring**
   - Add Sentry for error tracking
   - Enable Vercel Analytics
   - Set up uptime monitoring

2. **Configure CI/CD**
   - Automatic deployments on push to main
   - Preview deployments for PRs
   - Automated tests before deployment

3. **Add Payment Integration**
   - Stripe for subscriptions
   - Enable signup flow
   - Create pricing tiers

4. **Marketing**
   - Set up SEO meta tags
   - Create social media cards
   - Submit to directories

---

**🚀 You're Ready to Deploy!**

Follow the steps in order and your PushToolkit instance will be live in minutes.

For questions or issues, refer to the troubleshooting section or create an issue in your repository.
