<?php
/**
 * Admin Dashboard Page Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php if (is_wp_error($analytics)): ?>
        <div class="notice notice-error">
            <p><?php echo esc_html($analytics->get_error_message()); ?></p>
        </div>
        <p><?php _e('Please check your PushToolkit settings and ensure your API connection is configured correctly.', 'pushtoolkit-wp'); ?></p>
        <p><a href="<?php echo admin_url('admin.php?page=pushtoolkit-settings'); ?>" class="button button-primary"><?php _e('Go to Settings', 'pushtoolkit-wp'); ?></a></p>
    <?php else: ?>
        <?php
        $data = isset($analytics['data']) ? $analytics['data'] : array();
        $total_subscribers = isset($data['totalSubscribers']) ? intval($data['totalSubscribers']) : 0;
        $notifications_sent = isset($data['notificationsSent']) ? intval($data['notificationsSent']) : 0;
        $total_clicks = isset($data['totalClicks']) ? intval($data['totalClicks']) : 0;
        $click_rate = isset($data['clickRate']) ? $data['clickRate'] : '0%';
        $recent_notifications = isset($data['recentNotifications']) ? $data['recentNotifications'] : array();
        ?>

        <div class="pushtoolkit-dashboard-stats">
            <div class="pushtoolkit-stat-card">
                <h3><?php _e('Total Subscribers', 'pushtoolkit-wp'); ?></h3>
                <p class="pushtoolkit-stat-number"><?php echo number_format($total_subscribers); ?></p>
            </div>

            <div class="pushtoolkit-stat-card">
                <h3><?php _e('Notifications Sent', 'pushtoolkit-wp'); ?></h3>
                <p class="pushtoolkit-stat-number"><?php echo number_format($notifications_sent); ?></p>
            </div>

            <div class="pushtoolkit-stat-card">
                <h3><?php _e('Total Clicks', 'pushtoolkit-wp'); ?></h3>
                <p class="pushtoolkit-stat-number"><?php echo number_format($total_clicks); ?></p>
            </div>

            <div class="pushtoolkit-stat-card">
                <h3><?php _e('Click Rate', 'pushtoolkit-wp'); ?></h3>
                <p class="pushtoolkit-stat-number"><?php echo esc_html($click_rate); ?></p>
            </div>
        </div>

        <h2><?php _e('Recent Notifications', 'pushtoolkit-wp'); ?></h2>

        <?php if (!empty($recent_notifications)): ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php _e('Title', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Type', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Status', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Sent', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Clicks', 'pushtoolkit-wp'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($recent_notifications as $notification): ?>
                        <tr>
                            <td><?php echo esc_html($notification['title']); ?></td>
                            <td><?php echo esc_html($notification['type']); ?></td>
                            <td><?php echo esc_html($notification['status']); ?></td>
                            <td><?php echo isset($notification['sentAt']) ? esc_html(date('Y-m-d H:i', strtotime($notification['sentAt']))) : '-'; ?></td>
                            <td><?php echo isset($notification['clicks']) ? intval($notification['clicks']) : 0; ?></td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>
        <?php else: ?>
            <p><?php _e('No notifications sent yet.', 'pushtoolkit-wp'); ?></p>
        <?php endif; ?>

        <p style="margin-top: 20px;">
            <a href="<?php echo admin_url('admin.php?page=pushtoolkit-send'); ?>" class="button button-primary"><?php _e('Send New Notification', 'pushtoolkit-wp'); ?></a>
            <a href="<?php echo admin_url('admin.php?page=pushtoolkit-subscribers'); ?>" class="button"><?php _e('View Subscribers', 'pushtoolkit-wp'); ?></a>
        </p>
    <?php endif; ?>
</div>
