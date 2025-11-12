# Push Notification Dashboard - Frontend

A complete React dashboard for managing push notifications, built with React 18, Vite, TailwindCSS, React Query, and Zustand.

## Features Implemented

### Authentication
- **Login Page** (`/login`) - User authentication with JWT tokens
- **Signup Page** (`/signup`) - New user registration
- **Protected Routes** - Authentication-required routes with automatic redirect

### Dashboard Pages

#### 1. Dashboard Overview (`/dashboard`)
- Real-time analytics and metrics
- Stats cards showing:
  - Total Subscribers
  - Notifications Sent
  - Click Rate
  - Value Generated
- Charts for performance visualization:
  - Notifications performance over time (sent, delivered, clicked)
  - Weekly engagement bar chart
- Recent notifications list

#### 2. Notifications (`/notifications`)
- List all notifications with status filters
- Create new notifications (`/notifications/new`)
- Edit notifications (`/notifications/:id/edit`)
- Send notifications immediately or schedule for later
- Preview notifications before sending
- Support for:
  - One-time notifications
  - Recurring notifications
  - Triggered notifications
- Segment targeting
- Custom icons and images
- UTM tracking support

#### 3. Subscribers (`/subscribers`)
- View all subscribers with filtering
- Search by browser or country
- Filter by active/inactive status
- Display subscriber details:
  - Browser and OS
  - Country
  - Subscription date
  - Last seen date
- Remove subscribers

#### 4. Welcome Campaigns (`/campaigns`)
- Create automated welcome sequences
- Activate/deactivate campaigns
- Multi-step notification sequences
- Customizable delays between steps
- Automatically triggered on new subscriptions

#### 5. Segments (`/segments`)
- Create custom subscriber segments
- Target by:
  - Browser type
  - Operating system
  - Country
  - Subscription date
- Estimated subscriber counts
- Use segments in notification targeting

#### 6. RSS Feeds (`/rss-feeds`)
- Add RSS/Atom feeds
- Automatic monitoring every 15 minutes
- Auto-create notifications for new content
- Pause/activate feeds
- Track last fetch time

#### 7. Settings (`/settings`)
- General site settings
  - Site name and URL
  - Notification icon
  - Timezone configuration
- Installation code snippet
- VAPID keys display

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx      # Main layout with sidebar
│   │   ├── ProtectedRoute.jsx       # Auth guard component
│   │   └── StatCard.jsx             # Reusable stats card
│   ├── pages/
│   │   ├── Login.jsx                # Login page
│   │   ├── Signup.jsx               # Signup page
│   │   ├── Dashboard.jsx            # Dashboard overview
│   │   ├── Notifications.jsx        # Notifications list
│   │   ├── NotificationForm.jsx     # Create/edit notifications
│   │   ├── Subscribers.jsx          # Subscribers management
│   │   ├── Campaigns.jsx            # Welcome campaigns
│   │   ├── Segments.jsx             # Audience segments
│   │   ├── RSSFeeds.jsx             # RSS feeds management
│   │   └── Settings.jsx             # Site settings
│   ├── services/
│   │   ├── auth.js                  # Auth API calls
│   │   ├── sites.js                 # Sites API calls
│   │   ├── subscribers.js           # Subscribers API calls
│   │   ├── notifications.js         # Notifications API calls
│   │   ├── campaigns.js             # Campaigns API calls
│   │   ├── segments.js              # Segments API calls
│   │   ├── rss.js                   # RSS feeds API calls
│   │   └── analytics.js             # Analytics API calls
│   ├── stores/
│   │   ├── authStore.js             # Zustand auth state
│   │   └── siteStore.js             # Zustand site state
│   ├── lib/
│   │   └── api.js                   # Axios instance with interceptors
│   ├── styles/
│   │   └── index.css                # Global styles + Tailwind
│   ├── App.jsx                      # Main app with routing
│   └── main.jsx                     # React entry point
├── public/
├── index.html
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **TailwindCSS** - Utility-first CSS framework
- **React Router** - Client-side routing
- **React Query (@tanstack/react-query)** - Server state management
- **Zustand** - Client state management
- **Recharts** - Charts and data visualization
- **Axios** - HTTP client

## State Management

### Zustand Stores

**Auth Store** (`authStore.js`)
- User authentication state
- JWT token management
- Login/logout actions
- Persisted to localStorage

**Site Store** (`siteStore.js`)
- Current site selection
- Sites list
- Site CRUD operations

### React Query
- Server state caching
- Automatic refetching
- Optimistic updates
- Background synchronization

## API Integration

All API services use the centralized `api.js` instance which includes:
- Base URL configuration via environment variables
- JWT token injection in headers
- Automatic 401 handling with redirect to login
- Error handling

## Running the Dashboard

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Create `.env` file:
```
VITE_API_URL=http://localhost:3000/api
```

3. Start development server:
```bash
npm run dev
```

4. Build for production:
```bash
npm run build
```

5. Preview production build:
```bash
npm run preview
```

## Key Features

### Responsive Design
- Mobile-friendly sidebar that collapses
- Responsive tables and cards
- Touch-friendly buttons and controls

### User Experience
- Loading states for all async operations
- Error handling and user feedback
- Form validation
- Confirmation dialogs for destructive actions
- Preview for notifications before sending

### Security
- Protected routes requiring authentication
- JWT token management
- Automatic logout on token expiration
- Secure password requirements

### Analytics & Visualizations
- Real-time metrics with Recharts
- Line charts for performance trends
- Bar charts for engagement
- Color-coded status indicators

## Environment Variables

- `VITE_API_URL` - Backend API base URL (default: http://localhost:3000/api)

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

Requires a modern browser with support for:
- ES6+
- Fetch API
- LocalStorage
- Push API (for notifications)

## Next Steps

To complete the integration:

1. Ensure backend API is running and accessible
2. Update `VITE_API_URL` to point to your backend
3. Test all API endpoints match the expected formats
4. Customize colors and branding in `tailwind.config.js`
5. Add your logo and favicon to the `public` folder
6. Configure production deployment

## Notes

- All timestamps are displayed in the user's local timezone
- Charts use mock data when analytics API returns empty results
- File uploads for icons/images use URL input (can be extended to support direct uploads)
- Notification preview is a simplified representation of how it will appear in browsers
