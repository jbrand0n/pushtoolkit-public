<?php
/**
 * PushToolkit Notifications Handler
 *
 * Handles automatic notifications on post publish
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_Notifications {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('transition_post_status', array($this, 'handle_post_publish'), 10, 3);
    }

    /**
     * Handle post publish
     */
    public function handle_post_publish($new_status, $old_status, $post) {
        // Check if this is a new publish
        if ($new_status !== 'publish' || $old_status === 'publish') {
            return;
        }

        // Check if auto push is enabled
        $settings = get_option('pushtoolkit_settings', array());
        $auto_push_enabled = isset($settings['auto_push_on_publish']) ? $settings['auto_push_on_publish'] : true;

        if (!$auto_push_enabled) {
            return;
        }

        // Check if post type is enabled
        $enabled_post_types = isset($settings['auto_push_post_types']) ? $settings['auto_push_post_types'] : array('post');
        if (!in_array($post->post_type, $enabled_post_types)) {
            return;
        }

        // Check if push is disabled for this specific post
        $disable_push = get_post_meta($post->ID, '_pushtoolkit_disable_push', true);
        if ($disable_push) {
            return;
        }

        // Prepare notification data
        $this->send_post_notification($post);
    }

    /**
     * Send notification for post
     */
    public function send_post_notification($post) {
        $settings = get_option('pushtoolkit_settings', array());

        // Get custom title and message or use defaults
        $custom_title = get_post_meta($post->ID, '_pushtoolkit_custom_title', true);
        $custom_message = get_post_meta($post->ID, '_pushtoolkit_custom_message', true);

        $title = !empty($custom_title) ? $custom_title : $post->post_title;
        $message = !empty($custom_message) ? $custom_message : $this->get_post_excerpt($post);

        // Get post URL
        $url = get_permalink($post->ID);

        // Get featured image
        $image_url = '';
        if (has_post_thumbnail($post->ID)) {
            $image_url = get_the_post_thumbnail_url($post->ID, 'large');
        }

        // Get icon URL
        $icon_url = isset($settings['default_icon_url']) ? $settings['default_icon_url'] : '';
        if (empty($icon_url) && has_site_icon()) {
            $icon_url = get_site_icon_url(192);
        }

        // Prepare notification data
        $notification_data = array(
            'type' => 'ONE_TIME',
            'title' => $title,
            'message' => $message,
            'destinationUrl' => $url,
        );

        if (!empty($icon_url)) {
            $notification_data['iconUrl'] = $icon_url;
        }

        if (!empty($image_url)) {
            $notification_data['imageUrl'] = $image_url;
        }

        // Add UTM parameters
        $utm_params = array();
        if (!empty($settings['utm_source'])) {
            $utm_params['source'] = $settings['utm_source'];
        }
        if (!empty($settings['utm_medium'])) {
            $utm_params['medium'] = $settings['utm_medium'];
        }
        if (!empty($utm_params)) {
            $notification_data['utmParams'] = $utm_params;
        }

        // Allow filtering of notification data
        $notification_data = apply_filters('pushtoolkit_notification_data', $notification_data, $post);

        // Send notification
        $api = pushtoolkit_wp()->api;
        $result = $api->create_and_send_notification($notification_data);

        // Log result
        if (is_wp_error($result)) {
            error_log('PushToolkit: Failed to send notification for post ' . $post->ID . ': ' . $result->get_error_message());

            // Add admin notice
            add_action('admin_notices', function() use ($result) {
                ?>
                <div class="notice notice-error is-dismissible">
                    <p><?php echo esc_html(sprintf(__('PushToolkit: Failed to send notification: %s', 'pushtoolkit-wp'), $result->get_error_message())); ?></p>
                </div>
                <?php
            });
        } else {
            error_log('PushToolkit: Notification sent successfully for post ' . $post->ID);

            // Store notification ID
            if (isset($result['data']['notification']['id'])) {
                update_post_meta($post->ID, '_pushtoolkit_notification_id', $result['data']['notification']['id']);
            }

            // Add admin notice
            add_action('admin_notices', function() {
                ?>
                <div class="notice notice-success is-dismissible">
                    <p><?php echo esc_html__('PushToolkit: Push notification sent successfully!', 'pushtoolkit-wp'); ?></p>
                </div>
                <?php
            });
        }

        return $result;
    }

    /**
     * Get post excerpt
     */
    private function get_post_excerpt($post, $length = 120) {
        $excerpt = '';

        if (!empty($post->post_excerpt)) {
            $excerpt = $post->post_excerpt;
        } else {
            $excerpt = wp_strip_all_tags($post->post_content);
        }

        if (strlen($excerpt) > $length) {
            $excerpt = substr($excerpt, 0, $length) . '...';
        }

        return $excerpt;
    }
}
