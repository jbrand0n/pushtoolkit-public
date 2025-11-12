# PushToolkit - System Architecture

## Overview
A browser-based push notification platform for SMBs, e-commerce, and content creators to send targeted notifications and drive repeat engagement.

## Tech Stack

### Backend
- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: PostgreSQL 15
- **ORM**: Prisma
- **Cache/Queue**: Redis + BullMQ
- **Push Protocol**: web-push library + VAPID

### Frontend (Dashboard)
- **Framework**: React 18 + Vite
- **Styling**: TailwindCSS
- **State**: React Query + Zustand
- **Charts**: Recharts

### Infrastructure
- **Hosting**: DigitalOcean/AWS
- **CDN**: CloudFlare (for service worker)
- **Container**: Docker
- **CI/CD**: GitHub Actions

## System Components

### 1. API Server (Express)
- RESTful API for dashboard
- Webhook handlers
- Authentication (JWT)
- Rate limiting

### 2. Push Service
- VAPID key management
- FCM/WebPush integration
- Delivery tracking
- Retry logic

### 3. Scheduler Service
- BullMQ job queue
- Recurring notification cron jobs
- Welcome campaign automation
- RSS feed monitoring

### 4. Analytics Engine
- Event tracking (impressions, clicks, dismissals)
- Real-time aggregation
- Value calculation
- Segment performance

### 5. Service Worker
- Browser notification API
- Background sync
- Notification click handling
- UTM tracking

## Database Schema

### Core Entities

#### Sites
- id (uuid)
- name (string)
- url (string)
- site_id (string, unique)
- vapid_public_key (string)
- vapid_private_key (string, encrypted)
- owner_id (uuid, FK to users)
- settings (jsonb) - timezone, TTL, icon, etc.
- created_at, updated_at

#### Subscribers
- id (uuid)
- site_id (uuid, FK)
- endpoint (text, unique)
- p256dh_key (string)
- auth_key (string)
- browser (string)
- os (string)
- country (string)
- subscribed_at (timestamp)
- last_seen_at (timestamp)
- is_active (boolean)
- tags (jsonb)
- metadata (jsonb)

#### Notifications
- id (uuid)
- site_id (uuid, FK)
- type (enum: one_time, recurring, triggered, welcome, rss)
- status (enum: draft, scheduled, sending, completed, cancelled)
- title (string)
- message (text)
- icon_url (string)
- image_url (string)
- destination_url (string)
- utm_params (jsonb)
- action_buttons (jsonb)
- scheduled_at (timestamp)
- sent_at (timestamp)
- segment_id (uuid, FK, nullable)
- created_by (uuid, FK to users)
- created_at, updated_at

#### Recurring Schedules
- id (uuid)
- notification_id (uuid, FK)
- interval_type (enum: daily, weekly, monthly)
- interval_value (int)
- start_date (timestamp)
- end_date (timestamp, nullable)
- next_run_at (timestamp)
- is_active (boolean)

#### Welcome Campaigns
- id (uuid)
- site_id (uuid, FK)
- name (string)
- is_active (boolean)
- created_at, updated_at

#### Welcome Campaign Steps
- id (uuid)
- campaign_id (uuid, FK)
- sequence_order (int)
- notification_id (uuid, FK)
- delay_minutes (int) - delay after subscription
- created_at

#### Segments
- id (uuid)
- site_id (uuid, FK)
- name (string)
- rules (jsonb) - complex rule engine
- estimated_count (int)
- updated_at

#### Delivery Logs
- id (uuid)
- notification_id (uuid, FK)
- subscriber_id (uuid, FK)
- status (enum: sent, delivered, clicked, dismissed, failed)
- delivered_at (timestamp)
- clicked_at (timestamp)
- error_message (text)
- created_at

#### Analytics Aggregates
- id (uuid)
- notification_id (uuid, FK)
- date (date)
- sent_count (int)
- delivered_count (int)
- clicked_count (int)
- dismissed_count (int)
- failed_count (int)
- value_generated (decimal) - clicks * value_per_click

#### Users
- id (uuid)
- email (string, unique)
- password_hash (string)
- name (string)
- role (enum: owner, admin, member)
- created_at, updated_at

#### Site Users (Team Management)
- site_id (uuid, FK)
- user_id (uuid, FK)
- role (enum: admin, member)
- PRIMARY KEY (site_id, user_id)

#### RSS Feeds
- id (uuid)
- site_id (uuid, FK)
- url (string)
- name (string)
- last_fetched_at (timestamp)
- last_item_guid (string)
- is_active (boolean)

## API Architecture

### Authentication Flow
1. User signs up/logs in → JWT token issued
2. Token includes user_id and accessible site_ids
3. All requests validate JWT + check site access

### Key API Endpoints

#### Sites
- POST /api/sites - Create site
- GET /api/sites/:siteId - Get site details
- PATCH /api/sites/:siteId - Update settings
- GET /api/sites/:siteId/install-code - Get installation code

#### Subscribers
- POST /api/subscribe - Handle browser subscription
- GET /api/sites/:siteId/subscribers - List subscribers
- GET /api/sites/:siteId/subscribers/:id - Get subscriber
- DELETE /api/subscribers/:id - Unsubscribe

#### Notifications
- POST /api/sites/:siteId/notifications - Create notification
- GET /api/sites/:siteId/notifications - List notifications
- GET /api/notifications/:id - Get notification details
- PATCH /api/notifications/:id - Update notification
- POST /api/notifications/:id/send - Send notification
- DELETE /api/notifications/:id - Cancel/delete

#### Campaigns
- POST /api/sites/:siteId/welcome-campaigns - Create campaign
- GET /api/sites/:siteId/welcome-campaigns - List campaigns
- PATCH /api/welcome-campaigns/:id - Update campaign

#### Segments
- POST /api/sites/:siteId/segments - Create segment
- GET /api/sites/:siteId/segments - List segments
- POST /api/segments/:id/estimate - Get subscriber count

#### Analytics
- GET /api/sites/:siteId/analytics/dashboard - Dashboard metrics
- GET /api/notifications/:id/performance - Notification stats

#### RSS Feeds
- POST /api/sites/:siteId/rss-feeds - Add RSS feed
- GET /api/sites/:siteId/rss-feeds - List feeds

## Service Worker Flow

### Installation Flow
1. User visits website with SDK script
2. SDK script requests notification permission
3. On permission granted, register service worker
4. Service worker subscribes to push manager
5. Send subscription object to API server
6. Store subscription in database

### Notification Flow
1. Server triggers notification send
2. For each subscriber, create job in BullMQ queue
3. Worker picks up job, sends via web-push
4. Service worker receives push event
5. Shows notification with custom data
6. Tracks impression (background fetch)
7. On click, opens URL and tracks click event

## Background Jobs (BullMQ)

### Queue Types

#### notification-send
- Process individual notification sends
- Retry on failure (exponential backoff)
- Track delivery status

#### scheduled-notifications
- Cron job checks for due notifications
- Triggers notification-send jobs

#### recurring-notifications
- Cron job (every hour)
- Checks recurring schedules
- Creates new notification instances

#### welcome-campaign
- Triggered on new subscription
- Schedules drip sequence
- Delays based on campaign config

#### rss-monitor
- Cron job (every 15 min)
- Fetches RSS feeds
- Creates notifications for new items

#### analytics-aggregation
- Cron job (daily)
- Aggregates delivery logs
- Updates analytics tables

## Security Considerations

### Data Protection
- VAPID keys encrypted at rest
- Subscriber endpoints hashed for privacy
- Rate limiting on API endpoints
- CORS configuration for dashboard

### Authentication
- JWT with short expiration
- Refresh token rotation
- API key for webhook validation

### Compliance
- GDPR: Easy unsubscribe, data export
- Opt-in only (no silent subscriptions)
- User data retention policies

## Scaling Strategy

### Phase 1: Single Server (0-10K subscribers)
- Single API + Worker process
- PostgreSQL on same server
- Redis on same server

### Phase 2: Horizontal Scaling (10K-100K)
- Load balancer
- Multiple API servers
- Dedicated worker servers
- Managed PostgreSQL (RDS/DO)
- Managed Redis

### Phase 3: Distributed (100K+)
- Microservices (API, Worker, Analytics)
- Read replicas for PostgreSQL
- Redis cluster
- CDN for static assets
- Message queue (RabbitMQ/SQS)

## Monitoring & Observability

- **Logging**: Winston + CloudWatch/Papertrail
- **Metrics**: Prometheus + Grafana
- **Errors**: Sentry
- **Uptime**: Pingdom/UptimeRobot
- **Analytics**: Custom dashboard + Mixpanel

## Development Workflow

1. Local development with Docker Compose
2. Feature branches + PR reviews
3. Automated tests (Jest + Supertest)
4. Staging environment deployment
5. Production deployment with rollback capability
