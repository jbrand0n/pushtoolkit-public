<?php
/**
 * Send Notification Page Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

$settings = get_option('pushtoolkit_settings', array());
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php settings_errors('pushtoolkit_messages'); ?>

    <form method="post" action="">
        <?php wp_nonce_field('pushtoolkit_send_notification'); ?>

        <table class="form-table">
            <tr>
                <th scope="row">
                    <label for="notification_title"><?php _e('Notification Title', 'pushtoolkit-wp'); ?> <span class="required">*</span></label>
                </th>
                <td>
                    <input type="text" name="notification_title" id="notification_title" class="regular-text" required>
                    <p class="description"><?php _e('The title of the push notification (max 60 characters recommended).', 'pushtoolkit-wp'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="notification_message"><?php _e('Message', 'pushtoolkit-wp'); ?> <span class="required">*</span></label>
                </th>
                <td>
                    <textarea name="notification_message" id="notification_message" rows="4" class="large-text" required></textarea>
                    <p class="description"><?php _e('The message body (max 120 characters recommended).', 'pushtoolkit-wp'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="destination_url"><?php _e('Destination URL', 'pushtoolkit-wp'); ?> <span class="required">*</span></label>
                </th>
                <td>
                    <input type="url" name="destination_url" id="destination_url" class="regular-text" value="<?php echo esc_url(home_url()); ?>" required>
                    <p class="description"><?php _e('Where users will be taken when they click the notification.', 'pushtoolkit-wp'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="icon_url"><?php _e('Icon URL', 'pushtoolkit-wp'); ?></label>
                </th>
                <td>
                    <input type="url" name="icon_url" id="icon_url" class="regular-text" value="<?php echo isset($settings['default_icon_url']) ? esc_url($settings['default_icon_url']) : ''; ?>">
                    <p class="description"><?php _e('Optional icon for the notification (192x192 PNG recommended).', 'pushtoolkit-wp'); ?></p>
                </td>
            </tr>

            <tr>
                <th scope="row">
                    <label for="image_url"><?php _e('Image URL', 'pushtoolkit-wp'); ?></label>
                </th>
                <td>
                    <input type="url" name="image_url" id="image_url" class="regular-text">
                    <p class="description"><?php _e('Optional large image for the notification.', 'pushtoolkit-wp'); ?></p>
                </td>
            </tr>
        </table>

        <p class="submit">
            <input type="submit" name="pushtoolkit_send_notification" class="button button-primary" value="<?php _e('Send Notification', 'pushtoolkit-wp'); ?>">
        </p>
    </form>

    <hr>

    <h2><?php _e('Tips', 'pushtoolkit-wp'); ?></h2>
    <ul>
        <li><?php _e('Keep titles short and compelling (40-60 characters).', 'pushtoolkit-wp'); ?></li>
        <li><?php _e('Message body should be clear and actionable (80-120 characters).', 'pushtoolkit-wp'); ?></li>
        <li><?php _e('Use high-quality images (192x192 for icons, larger for images).', 'pushtoolkit-wp'); ?></li>
        <li><?php _e('Test notifications before sending to large audiences.', 'pushtoolkit-wp'); ?></li>
    </ul>
</div>
