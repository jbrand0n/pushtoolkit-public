<?php
/**
 * Dashboard Widget Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="pushtoolkit-widget">
    <div class="pushtoolkit-widget-stats">
        <div class="pushtoolkit-widget-stat">
            <span class="pushtoolkit-widget-stat-label"><?php _e('Subscribers', 'pushtoolkit-wp'); ?></span>
            <span class="pushtoolkit-widget-stat-value"><?php echo isset($data['totalSubscribers']) ? number_format($data['totalSubscribers']) : '0'; ?></span>
        </div>

        <div class="pushtoolkit-widget-stat">
            <span class="pushtoolkit-widget-stat-label"><?php _e('Sent', 'pushtoolkit-wp'); ?></span>
            <span class="pushtoolkit-widget-stat-value"><?php echo isset($data['notificationsSent']) ? number_format($data['notificationsSent']) : '0'; ?></span>
        </div>

        <div class="pushtoolkit-widget-stat">
            <span class="pushtoolkit-widget-stat-label"><?php _e('Clicks', 'pushtoolkit-wp'); ?></span>
            <span class="pushtoolkit-widget-stat-value"><?php echo isset($data['totalClicks']) ? number_format($data['totalClicks']) : '0'; ?></span>
        </div>

        <div class="pushtoolkit-widget-stat">
            <span class="pushtoolkit-widget-stat-label"><?php _e('Click Rate', 'pushtoolkit-wp'); ?></span>
            <span class="pushtoolkit-widget-stat-value"><?php echo isset($data['clickRate']) ? esc_html($data['clickRate']) : '0%'; ?></span>
        </div>
    </div>

    <div class="pushtoolkit-widget-actions">
        <a href="<?php echo admin_url('admin.php?page=pushtoolkit-send'); ?>" class="button button-primary"><?php _e('Send Notification', 'pushtoolkit-wp'); ?></a>
        <a href="<?php echo admin_url('admin.php?page=pushtoolkit'); ?>" class="button"><?php _e('View Dashboard', 'pushtoolkit-wp'); ?></a>
    </div>
</div>

<style>
.pushtoolkit-widget-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
}

.pushtoolkit-widget-stat {
    display: flex;
    flex-direction: column;
    padding: 10px;
    background: #f5f5f5;
    border-radius: 4px;
}

.pushtoolkit-widget-stat-label {
    font-size: 11px;
    color: #666;
    margin-bottom: 5px;
}

.pushtoolkit-widget-stat-value {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.pushtoolkit-widget-actions {
    display: flex;
    gap: 10px;
}

.pushtoolkit-widget-actions .button {
    flex: 1;
    text-align: center;
}
</style>
