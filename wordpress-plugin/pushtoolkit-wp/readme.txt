=== PushToolkit for WordPress ===
Contributors: pushtoolkit
Tags: push notifications, web push, notifications, engagement, marketing
Requires at least: 5.0
Tested up to: 6.4
Requires PHP: 7.4
Stable tag: 1.0.0
License: MIT
License URI: https://opensource.org/licenses/MIT

Integrate PushToolkit push notifications with WordPress. Send browser push notifications automatically when publishing posts.

== Description ==

PushToolkit for WordPress seamlessly integrates your WordPress site with the PushToolkit push notification platform. Automatically send browser push notifications to your subscribers when you publish new content, and manage all aspects of your push notification campaigns directly from your WordPress dashboard.

= Features =

* **Automatic Notifications**: Send push notifications automatically when publishing posts or pages
* **Manual Notifications**: Create and send custom push notifications anytime from your WordPress dashboard
* **Subscriber Management**: View and manage your push notification subscribers within WordPress
* **Analytics Dashboard**: Track notification performance with detailed analytics
* **Per-Post Controls**: Customize or disable notifications for individual posts
* **Service Worker Integration**: Automatic service worker installation and configuration
* **UTM Tracking**: Built-in UTM parameter support for campaign tracking
* **Multi-Post Type Support**: Choose which post types trigger automatic notifications
* **Security Hardened**: Rate limiting, HTTPS validation, and comprehensive security measures

= Requirements =

* WordPress 5.0 or higher
* PHP 7.4 or higher
* HTTPS-enabled website (required for push notifications)
* A running PushToolkit backend instance

= How It Works =

1. Install and activate the plugin
2. Configure your PushToolkit API connection
3. Visitors to your site will be prompted to allow push notifications
4. When you publish new content, subscribers automatically receive notifications
5. Track performance and engagement in the analytics dashboard

= Integration with PushToolkit =

This plugin requires a PushToolkit backend instance. PushToolkit is a self-hosted push notification platform that gives you complete control over your data and subscriber relationships.

Learn more: [PushToolkit Documentation](https://github.com/jbrand0n/pushtoolkit)

== Installation ==

= Automatic Installation =

1. Log in to your WordPress admin panel
2. Navigate to Plugins > Add New
3. Search for "PushToolkit"
4. Click "Install Now" and then "Activate"

= Manual Installation =

1. Download the plugin files
2. Upload the `pushtoolkit-wp` folder to `/wp-content/plugins/`
3. Activate the plugin through the WordPress admin panel

= Configuration =

1. Go to PushToolkit > Settings
2. Enter your PushToolkit API URL
3. Enter your Site ID from your PushToolkit dashboard
4. Enter your JWT authentication token
5. Click "Test Connection" to verify
6. Configure automation and notification settings
7. Save settings

For detailed setup instructions, see the [Installation Guide](https://github.com/jbrand0n/pushtoolkit/blob/main/wordpress-plugin/pushtoolkit-wp/INSTALL.md).

== Frequently Asked Questions ==

= Do I need a PushToolkit account? =

Yes, you need a running PushToolkit backend instance. PushToolkit is a self-hosted push notification platform. You can deploy your own instance following the deployment guide.

= Does this work with any WordPress theme? =

Yes, the plugin works with any WordPress theme that follows WordPress coding standards.

= Can I customize the notification content? =

Yes! You can customize the title and message for each post using the Push Notification meta box in the post editor. You can also use filters to programmatically customize notification data.

= Do I need HTTPS? =

Yes, push notifications are a web standard that requires HTTPS. Your WordPress site must have SSL/TLS enabled.

= Can I send notifications manually? =

Yes, go to PushToolkit > Send Notification to create and send custom notifications at any time.

= How do I get my JWT token? =

Log into your PushToolkit dashboard and navigate to your account settings, or use the PushToolkit API login endpoint to retrieve your JWT token.

= Can I disable notifications for specific posts? =

Yes, each post has a Push Notification meta box where you can disable automatic notifications or customize the notification content.

= Is this plugin GDPR compliant? =

The plugin itself doesn't store subscriber data - all data is managed by your PushToolkit backend. Users must explicitly opt-in by clicking "Allow" in their browser's permission prompt.

== Screenshots ==

1. Settings page - Configure your PushToolkit API connection
2. Dashboard - View analytics and performance metrics
3. Send Notification - Create and send custom notifications
4. Subscribers - Manage your notification subscribers
5. Post editor - Per-post notification controls

== Changelog ==

= 1.0.0 - 2024-11-18 =
* Initial release
* Automatic push notifications on post publish
* Manual notification sending
* Subscriber management
* Analytics dashboard
* Service worker auto-configuration
* Per-post notification controls
* Security hardening with rate limiting
* WordPress 6.4 compatibility
* PHP 8.x compatibility

== Upgrade Notice ==

= 1.0.0 =
Initial release of PushToolkit for WordPress.

== Privacy Policy ==

This plugin connects to your self-hosted PushToolkit backend to send and manage push notifications. No data is sent to third-party services.

When users subscribe to notifications:
* Their browser push subscription is sent to your PushToolkit backend
* Browser type, operating system, and country may be collected
* All data remains on your PushToolkit server

For more information, review your PushToolkit backend's privacy policy.

== Support ==

For support, please:

* Check the [documentation](https://github.com/jbrand0n/pushtoolkit/tree/main/wordpress-plugin/pushtoolkit-wp)
* Open an issue on [GitHub](https://github.com/jbrand0n/pushtoolkit/issues)
* Visit the [support forum](https://wordpress.org/support/plugin/pushtoolkit-wp/)

== Development ==

This plugin is open source and available on GitHub:
https://github.com/jbrand0n/pushtoolkit

Contributions are welcome!
