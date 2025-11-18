# PushToolkit for WordPress

A powerful WordPress plugin that integrates seamlessly with PushToolkit to send browser push notifications to your subscribers.

## Features

- **Automatic Push Notifications**: Automatically send push notifications when you publish new posts or pages
- **Custom Notifications**: Send manual push notifications from your WordPress dashboard
- **Subscriber Management**: View and manage your push notification subscribers
- **Analytics Dashboard**: Track notification performance with detailed analytics
- **Per-Post Control**: Customize or disable notifications for individual posts
- **Service Worker Integration**: Automatically handles service worker installation
- **UTM Tracking**: Built-in UTM parameter support for tracking campaigns
- **Multi-Post Type Support**: Choose which post types trigger automatic notifications

## Requirements

- WordPress 5.0 or higher
- PHP 7.4 or higher
- A running PushToolkit instance (backend API)
- HTTPS-enabled website (required for push notifications)

## Installation

### Step 1: Upload the Plugin

1. Download the plugin files
2. Upload the `pushtoolkit-wp` folder to `/wp-content/plugins/`
3. Activate the plugin through the 'Plugins' menu in WordPress

### Step 2: Set Up PushToolkit

If you don't have a PushToolkit instance yet:

1. Deploy PushToolkit using the [deployment guide](../../docs/deployment.md)
2. Create an account and log in to your PushToolkit dashboard
3. Create a new site in PushToolkit for your WordPress website

### Step 3: Configure the Plugin

1. Go to **PushToolkit > Settings** in your WordPress admin
2. Enter your **API URL** (e.g., `https://your-pushtoolkit-instance.com`)
3. Enter your **Site ID** (found in your PushToolkit dashboard)
4. Enter your **JWT Token** (obtained from PushToolkit account settings)
5. Click **Test Connection** to verify the configuration
6. Configure automation settings and default notification options
7. Click **Save Settings**

## Getting Your JWT Token

There are two ways to get your JWT token:

### Option 1: Via PushToolkit Dashboard
Log into your PushToolkit dashboard and navigate to Account Settings to find your JWT token.

### Option 2: Via API (using curl)
```bash
curl -X POST https://your-pushtoolkit-instance.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

The response will include your JWT token:
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": { ... }
  }
}
```

## Usage

### Automatic Notifications

Once configured, the plugin will automatically send push notifications when you publish new content:

1. Create or edit a post
2. In the **Push Notification** meta box (right sidebar), you can:
   - Disable the notification for this specific post
   - Customize the notification title
   - Customize the notification message
3. Publish the post
4. A push notification will be sent automatically to all subscribers

### Manual Notifications

To send a one-time notification:

1. Go to **PushToolkit > Send Notification**
2. Fill in the notification details:
   - Title (max 60 characters recommended)
   - Message (max 120 characters recommended)
   - Destination URL
   - Optional icon and image URLs
3. Review the preview
4. Click **Send Notification**

### View Analytics

1. Go to **PushToolkit > Dashboard** to view:
   - Total subscribers
   - Notifications sent
   - Click-through rates
   - Recent notification performance

2. Or check the **PushToolkit Analytics** widget on your WordPress dashboard

### Manage Subscribers

1. Go to **PushToolkit > Subscribers** to:
   - View all subscribers
   - See subscriber details (browser, OS, country)
   - Check subscription status
   - View subscription dates

## Configuration Options

### API Settings

- **API URL**: The base URL of your PushToolkit backend (without `/api`)
- **Site ID**: Your unique site identifier from PushToolkit (32-character hex string)
- **JWT Token**: Your authentication token from PushToolkit

### Automation Settings

- **Auto Push on Publish**: Enable/disable automatic notifications when content is published
- **Post Types**: Select which post types should trigger automatic notifications (posts, pages, custom post types)

### Notification Defaults

- **Default Icon URL**: Default icon for notifications (192x192 PNG recommended)
- **UTM Source**: Default UTM source parameter for tracking
- **UTM Medium**: Default UTM medium parameter for tracking

## Filters and Hooks

### `pushtoolkit_notification_data`

Filter notification data before sending:

```php
add_filter('pushtoolkit_notification_data', function($notification_data, $post) {
    // Customize notification data
    $notification_data['title'] = 'Custom: ' . $notification_data['title'];

    // Add custom UTM parameters
    $notification_data['utmParams']['campaign'] = 'my-campaign';

    return $notification_data;
}, 10, 2);
```

## Troubleshooting

### Notifications Not Sending

1. **Check API Connection**: Go to Settings and click "Test Connection"
2. **Verify HTTPS**: Push notifications require HTTPS
3. **Check Service Worker**: Verify the service worker file exists at `/wp-content/uploads/sw.js`
4. **Review Error Logs**: Check WordPress debug logs for errors

### Subscribers Not Appearing

1. **Browser Permissions**: Users must grant notification permission
2. **HTTPS Required**: Push notifications only work on HTTPS sites
3. **Service Worker**: Ensure service worker is properly registered

### Service Worker Issues

1. **Clear Browser Cache**: Sometimes old service workers need to be cleared
2. **Check Console**: Open browser developer tools and check for errors
3. **Regenerate File**: Save settings again to regenerate the service worker file

## Technical Details

### Service Worker

The plugin automatically generates and manages a service worker file at `/wp-content/uploads/sw.js`. This file:

- Handles push notification events
- Shows notifications to users
- Tracks impressions, clicks, and dismissals
- Manages notification interactions

### API Communication

All communication with PushToolkit uses the REST API:

- **Authentication**: JWT tokens in `Authorization` header
- **Endpoints**: Full API access to notifications, subscribers, and analytics
- **Rate Limiting**: Respects PushToolkit rate limits

### Data Storage

The plugin stores minimal data in WordPress:

- Plugin settings in `wp_options` table
- Per-post notification preferences in `wp_postmeta` table
- No subscriber data is stored (managed by PushToolkit)

## Security

- **HTTPS Required**: Push notifications only work on HTTPS
- **JWT Authentication**: Secure API communication
- **Nonce Verification**: All admin actions are nonce-protected
- **Capability Checks**: Only administrators can manage notifications
- **Input Sanitization**: All user input is sanitized and validated

## Support

For issues or questions:

1. Check the [PushToolkit documentation](../../docs)
2. Review this README
3. Open an issue on [GitHub](https://github.com/yourusername/pushtoolkit)

## Changelog

### 1.0.0
- Initial release
- Automatic push notifications on post publish
- Manual notification sending
- Subscriber management
- Analytics dashboard
- Service worker integration
- Per-post notification controls

## License

MIT License - see LICENSE file for details

## Credits

Developed for integration with [PushToolkit](https://github.com/yourusername/pushtoolkit) - a self-hosted push notification platform.
