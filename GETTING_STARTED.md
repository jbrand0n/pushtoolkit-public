# Getting Started - PushToolkit

## Current Status ✅

Your backend server is **already running** on port 3000!
- Health check: http://localhost:3000/health
- API Base: http://localhost:3000/api

## Quick Start Guide

### 1. Start the Frontend

Open a new terminal and run:

```bash
cd frontend
npm run dev
```

The frontend will start on **http://localhost:5173**

### 2. Access the Application

Open your browser and go to:
```
http://localhost:5173
```

You'll be redirected to the login page since you're not authenticated.

### 3. Create Your First Account

Click on **"Sign up"** and create an account with:
- Full Name: Your Name
- Email: your@email.com
- Password: (at least 8 characters)
- Confirm Password: (match the password)

### 4. Create Your First Site

After logging in:
1. You'll be redirected to the dashboard
2. Click **"+ New Site"** in the header
3. Fill in your site details:
   - Site Name: My Website
   - Website URL: https://your-website.com
   - Icon URL: (optional)
   - Timezone: Choose your timezone

### 5. Get the Installation Code

1. Go to **Settings** in the sidebar
2. Click on the **Installation** tab
3. Click **"Show Installation Code"**
4. Copy the JavaScript code snippet
5. Add it to your website before the closing `</body>` tag

### 6. Test Notifications

Once your site is set up:

1. **Create a Notification**
   - Go to **Notifications** in the sidebar
   - Click **"+ Create Notification"**
   - Fill in the form:
     - Title: "Welcome!"
     - Message: "Thanks for subscribing to our notifications"
     - Destination URL: Your website URL
     - Leave schedule empty for draft

2. **Send the Notification**
   - Click "Create Notification"
   - In the notifications list, click **"Send Now"**

## Available Routes

### Frontend Routes
- `/login` - Login page
- `/signup` - Registration page
- `/dashboard` - Analytics overview
- `/notifications` - Manage notifications
- `/notifications/new` - Create notification
- `/subscribers` - View subscribers
- `/campaigns` - Welcome campaigns
- `/segments` - Audience segments
- `/rss-feeds` - RSS feed automation
- `/settings` - Site settings

### Backend API Endpoints (Already Working!)
- `POST /api/auth/register` - Create account ✅
- `POST /api/auth/login` - Login ✅
- `GET /api/auth/me` - Get current user ✅
- `POST /api/sites` - Create site
- `GET /api/sites` - List sites
- `GET /api/sites/:id` - Get site details
- `PATCH /api/sites/:id` - Update site
- `GET /api/sites/:id/install-code` - Get installation code
- `GET /api/sites/:id/subscribers` - List subscribers
- `POST /api/sites/:id/notifications` - Create notification
- `POST /api/notifications/:id/send` - Send notification
- And many more...

## Testing the API Directly

You can test the backend API using curl or Postman:

### Create a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

This will return a JWT token that you can use for authenticated requests.

### Get Current User (with token)
```bash
curl http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_JWT_TOKEN_HERE"
```

## Common Issues & Solutions

### "Route not found" Error
This error appears when:
1. You try to access a route that doesn't exist
2. The backend can't find the endpoint you're requesting

**Solution**: Make sure you're using the correct routes as listed above.

### Backend Not Running
If you see connection errors:

```bash
# Check if backend is running
netstat -ano | findstr :3000

# If not running, start it:
cd backend
npm run dev
```

### Frontend Won't Start
If you have issues starting the frontend:

```bash
cd frontend
npm install  # Reinstall dependencies if needed
npm run dev
```

### Port Already in Use
If port 3000 or 5173 is already in use:

**Option 1**: Kill the process using the port
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill it (replace PID with actual process ID)
taskkill /PID <PID> /F
```

**Option 2**: Change the port in `.env` files

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3000/api
VITE_APP_NAME=PushToolkit
```

## What's Next?

1. **Explore the Dashboard** - Navigate through all the pages
2. **Create Segments** - Define custom audience groups
3. **Set Up Welcome Campaigns** - Automate new subscriber onboarding
4. **Add RSS Feeds** - Auto-notify subscribers of new content
5. **View Analytics** - Track performance and engagement

## Database Access

To view/manage your database:

```bash
cd backend
npx prisma studio
```

This will open Prisma Studio at http://localhost:5555 where you can browse and edit your data.

## Need Help?

- Check the `frontend/DASHBOARD_README.md` for detailed frontend docs
- Check the `ARCHITECTURE.md` for system architecture
- Check the `FRONTEND_BUILD_COMPLETE.md` for feature list

## Development Workflow

1. **Backend changes**: The server auto-restarts (nodemon is running)
2. **Frontend changes**: Hot module replacement (Vite HMR)
3. **Database changes**: Run `npx prisma migrate dev` in the backend folder

---

**You're all set!** 🚀

Start exploring the dashboard by running:
```bash
cd frontend
npm run dev
```

Then open http://localhost:5173 in your browser.
