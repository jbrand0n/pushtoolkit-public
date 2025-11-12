# Quick Start Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 15
- Redis 7+
- Docker (optional)

## Option 1: Docker Compose (Recommended for Development)

### Start PostgreSQL and Redis

```bash
docker-compose up -d
```

This will start:
- PostgreSQL on port 5432
- Redis on port 6379

### Set up Backend

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Generate VAPID keys
npx web-push generate-vapid-keys

# Copy the keys to your .env file
# VAPID_PUBLIC_KEY=...
# VAPID_PRIVATE_KEY=...
# VAPID_SUBJECT=mailto:your-email@example.com

# Update DATABASE_URL in .env
DATABASE_URL="postgresql://pushuser:pushpass@localhost:5432/pushtoolkit?schema=public"

# Generate Prisma client
npm run prisma:generate

# Run database migrations
npm run prisma:migrate

# Start development server
npm run dev
```

Backend will be running on http://localhost:3000

### Set up Frontend

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be running on http://localhost:5173

## Option 2: Manual Setup (Without Docker)

### Install PostgreSQL

1. Download and install PostgreSQL 15+
2. Create a database: `CREATE DATABASE pushtoolkit;`
3. Update `DATABASE_URL` in backend/.env

### Install Redis

1. Download and install Redis 7+
2. Start Redis server: `redis-server`
3. Update Redis config in backend/.env if needed

### Continue with Backend and Frontend setup above

## Generate VAPID Keys

VAPID keys are required for web push notifications:

```bash
cd backend
npx web-push generate-vapid-keys
```

Copy the output to your `.env` file:

```
VAPID_PUBLIC_KEY=your-public-key
VAPID_PRIVATE_KEY=your-private-key
VAPID_SUBJECT=mailto:your-email@example.com
```

## Database Management

### View database with Prisma Studio

```bash
cd backend
npm run prisma:studio
```

### Create a new migration

```bash
cd backend
npx prisma migrate dev --name your_migration_name
```

### Reset database

```bash
cd backend
npx prisma migrate reset
```

## Testing the Service Worker

1. Open `service-worker/example-integration.html` in your browser
2. Update the configuration with your API URL and keys
3. Serve the files with a local web server (service workers require HTTPS or localhost)

```bash
# Using Python
python -m http.server 8080

# Using Node.js http-server
npx http-server -p 8080
```

4. Visit http://localhost:8080/service-worker/example-integration.html
5. Click "Enable Notifications" to test the subscription flow

## Next Steps

1. **Implement Authentication**: Add JWT-based auth routes in `backend/src/routes/auth.js`
2. **Create Site Routes**: Implement site management in `backend/src/routes/sites.js`
3. **Build Push Service**: Complete the push service in `backend/src/services/push/`
4. **Set up Workers**: Implement BullMQ workers in `backend/src/workers/`
5. **Build Dashboard UI**: Create React components in `frontend/src/`

## Troubleshooting

### Port already in use

```bash
# Find and kill process using port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:3000 | xargs kill -9
```

### Database connection issues

- Check PostgreSQL is running
- Verify DATABASE_URL is correct
- Check PostgreSQL logs

### Service worker not registering

- Ensure you're using HTTPS or localhost
- Check browser console for errors
- Verify service worker path is correct

## Environment Variables Reference

See `backend/.env.example` for all available environment variables.
