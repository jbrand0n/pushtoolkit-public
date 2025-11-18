# Installation Guide

This guide will walk you through installing and configuring the PushToolkit WordPress plugin.

## Prerequisites

Before you begin, ensure you have:

- [ ] WordPress 5.0 or higher installed
- [ ] PHP 7.4 or higher
- [ ] HTTPS enabled on your website (required for push notifications)
- [ ] A running PushToolkit instance
- [ ] Admin access to your WordPress site

## Step-by-Step Installation

### 1. Install the Plugin

#### Option A: Manual Upload

1. Download or copy the `pushtoolkit-wp` folder
2. Upload it to your WordPress installation at `/wp-content/plugins/pushtoolkit-wp/`
3. The directory structure should look like:
   ```
   /wp-content/plugins/
   └── pushtoolkit-wp/
       ├── pushtoolkit-wp.php
       ├── includes/
       ├── templates/
       ├── assets/
       └── ...
   ```

#### Option B: Via WordPress Admin (when packaged as ZIP)

1. Go to **Plugins > Add New** in WordPress admin
2. Click **Upload Plugin**
3. Choose the `pushtoolkit-wp.zip` file
4. Click **Install Now**
5. Click **Activate Plugin**

### 2. Set Up PushToolkit Backend

If you haven't already deployed PushToolkit:

1. Follow the [PushToolkit deployment guide](../../../docs/deployment.md)
2. Start the backend server:
   ```bash
   cd backend
   npm install
   npx prisma migrate deploy
   npm start
   ```
3. Access your PushToolkit dashboard at `http://your-domain:3000`

### 3. Create a PushToolkit Site

1. Log into your PushToolkit dashboard
2. Go to **Sites** or click **Create Site**
3. Fill in the details:
   - **Name**: Your WordPress site name
   - **URL**: Your WordPress site URL (e.g., `https://example.com`)
4. Click **Create Site**
5. Copy the **Site ID** (a 32-character hex string like `abc123def456...`)

### 4. Get Your JWT Token

#### Method 1: Via PushToolkit Dashboard

1. Log into your PushToolkit dashboard
2. Go to **Account Settings** or **Profile**
3. Copy your JWT token (long string starting with `eyJ...`)

#### Method 2: Via API

Use curl to get a token:

```bash
curl -X POST https://your-pushtoolkit-instance.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "your-email@example.com",
    "password": "your-password"
  }'
```

Copy the `token` value from the response.

### 5. Configure the WordPress Plugin

1. In WordPress admin, go to **PushToolkit > Settings**
2. Fill in the API Settings:
   - **API URL**: Your PushToolkit backend URL (e.g., `https://push.yourdomain.com`)
     - Do NOT include `/api` at the end
     - Must be HTTPS in production
   - **Site ID**: The Site ID you copied earlier
   - **JWT Token**: Paste the JWT token
3. Click **Test Connection** to verify
   - You should see a green checkmark and "Connection successful!"
   - If you see an error, double-check your credentials

4. Configure Automation Settings:
   - **Auto Push on Publish**: Check this to enable automatic notifications
   - **Post Types**: Select which post types should trigger notifications (e.g., Posts, Pages)

5. Configure Notification Defaults:
   - **Default Icon URL**: URL to a 192x192 PNG icon for notifications
     - Leave empty to use your site icon
   - **UTM Source**: `wordpress` (for tracking)
   - **UTM Medium**: `push-notification` (for tracking)

6. Click **Save Settings**

### 6. Verify Service Worker

1. After saving settings, check the Service Worker Status section
2. You should see: "✓ Generated"
3. The service worker URL will be shown (e.g., `https://yoursite.com/wp-content/uploads/sw.js`)

### 7. Test Push Notifications

#### Test Subscription

1. Open your WordPress site in a browser (must be HTTPS)
2. You should see a browser prompt asking to allow notifications
3. Click **Allow**
4. Check **PushToolkit > Subscribers** in WordPress admin
5. You should see your subscription appear

#### Test Notification

1. Go to **PushToolkit > Send Notification**
2. Fill in:
   - **Title**: "Test Notification"
   - **Message**: "This is a test from PushToolkit!"
   - **Destination URL**: Your homepage URL
3. Click **Send Notification**
4. You should receive a push notification in your browser

#### Test Auto-Publish

1. Create a new blog post
2. In the **Push Notification** meta box (right sidebar):
   - Ensure "Disable push notification" is NOT checked
   - Optionally customize the title/message
3. Click **Publish**
4. You should receive a push notification immediately

## Troubleshooting

### "Connection failed" Error

**Problem**: Test connection fails

**Solutions**:
- Verify the API URL is correct (no `/api` suffix)
- Check that your PushToolkit backend is running
- Ensure there are no firewall rules blocking the connection
- Verify the JWT token is valid and not expired

### No Permission Prompt

**Problem**: Browser doesn't ask for notification permission

**Solutions**:
- Ensure your site is using HTTPS (required for push notifications)
- Check browser console for errors (F12 → Console tab)
- Verify the service worker is loading correctly
- Clear browser cache and reload

### Service Worker Not Found

**Problem**: Service worker file not generated

**Solutions**:
- Save the plugin settings again
- Check file permissions in `/wp-content/uploads/`
- Ensure the API URL is set correctly

### Notifications Not Sending on Publish

**Problem**: No notification when publishing posts

**Solutions**:
- Check that "Auto Push on Publish" is enabled in settings
- Verify the post type is selected in the "Post Types" setting
- Ensure the "Disable push notification" checkbox is NOT checked on the post
- Check WordPress admin notices for error messages
- Review error logs for API errors

### Subscribers Not Showing

**Problem**: Can't see subscribers in the list

**Solutions**:
- Verify at least one browser has subscribed
- Check the API connection is working
- Ensure the correct Site ID is configured
- Check PushToolkit backend logs

## Advanced Configuration

### Custom Notification Icon

Add a custom icon for all notifications:

1. Upload a 192x192 PNG image to your media library
2. Copy the image URL
3. Go to **PushToolkit > Settings**
4. Paste the URL in **Default Icon URL**
5. Save settings

### Customize Notifications with Code

Add this to your theme's `functions.php`:

```php
// Customize notification data before sending
add_filter('pushtoolkit_notification_data', function($data, $post) {
    // Add custom UTM campaign
    $data['utmParams']['campaign'] = 'blog-' . date('Y-m');

    // Add author to title
    $author = get_the_author_meta('display_name', $post->post_author);
    $data['title'] = $data['title'] . ' by ' . $author;

    return $data;
}, 10, 2);
```

### Disable for Specific Categories

```php
// Don't send notifications for posts in "uncategorized" category
add_filter('pushtoolkit_notification_data', function($data, $post) {
    if (has_category('uncategorized', $post)) {
        // Return false to cancel notification
        return false;
    }
    return $data;
}, 10, 2);
```

## Next Steps

1. **Customize**: Adjust notification settings to match your brand
2. **Test**: Send test notifications to verify everything works
3. **Monitor**: Check the analytics dashboard regularly
4. **Optimize**: Adjust notification timing and content based on analytics

## Getting Help

If you encounter issues:

1. Check the [README](README.md) for common solutions
2. Review [PushToolkit documentation](../../../docs)
3. Check WordPress and PushToolkit logs
4. Open an issue on GitHub

## Security Checklist

- [ ] HTTPS enabled on WordPress site
- [ ] JWT token kept secure (never commit to version control)
- [ ] PushToolkit backend secured with proper firewall rules
- [ ] Regular backups of WordPress database
- [ ] Plugin kept up to date

Congratulations! Your PushToolkit WordPress integration is now ready to use.
