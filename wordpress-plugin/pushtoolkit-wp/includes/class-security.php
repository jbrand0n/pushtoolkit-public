<?php
/**
 * Security Hardening for PushToolkit
 *
 * Additional security measures and validations
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_Security {

    /**
     * Constructor
     */
    public function __construct() {
        // Rate limiting for API requests
        add_action('init', array($this, 'check_rate_limits'));

        // Validate HTTPS in production
        add_action('admin_init', array($this, 'validate_https'));

        // Sanitize API responses
        add_filter('pushtoolkit_api_response', array($this, 'sanitize_api_response'));

        // Validate JWT token format
        add_filter('pushtoolkit_validate_jwt', array($this, 'validate_jwt_format'), 10, 1);
    }

    /**
     * Check rate limits for API requests
     */
    public function check_rate_limits() {
        // Skip for non-AJAX requests
        if (!defined('DOING_AJAX') || !DOING_AJAX) {
            return;
        }

        // Skip if not our AJAX action
        if (!isset($_REQUEST['action']) || strpos($_REQUEST['action'], 'pushtoolkit_') !== 0) {
            return;
        }

        $user_id = get_current_user_id();
        if (!$user_id) {
            return;
        }

        $transient_key = 'pushtoolkit_rate_limit_' . $user_id;
        $requests = get_transient($transient_key);

        if ($requests === false) {
            // First request
            set_transient($transient_key, 1, MINUTE_IN_SECONDS);
        } else {
            $requests++;

            // Limit: 60 requests per minute
            if ($requests > 60) {
                wp_send_json_error(array(
                    'message' => __('Too many requests. Please try again later.', 'pushtoolkit-wp')
                ), 429);
            }

            set_transient($transient_key, $requests, MINUTE_IN_SECONDS);
        }
    }

    /**
     * Validate HTTPS in production
     */
    public function validate_https() {
        // Skip in local development
        if (defined('WP_DEBUG') && WP_DEBUG) {
            return;
        }

        // Check if HTTPS is enabled
        if (!is_ssl()) {
            add_action('admin_notices', function() {
                ?>
                <div class="notice notice-error">
                    <p>
                        <strong><?php _e('PushToolkit Security Warning:', 'pushtoolkit-wp'); ?></strong>
                        <?php _e('Push notifications require HTTPS. Please enable SSL/TLS on your website.', 'pushtoolkit-wp'); ?>
                    </p>
                </div>
                <?php
            });
        }
    }

    /**
     * Sanitize API responses
     */
    public function sanitize_api_response($response) {
        if (is_wp_error($response)) {
            return $response;
        }

        // Recursively sanitize array data
        return $this->sanitize_array_deep($response);
    }

    /**
     * Recursively sanitize array
     */
    private function sanitize_array_deep($data) {
        if (is_array($data)) {
            return array_map(array($this, 'sanitize_array_deep'), $data);
        }

        if (is_string($data)) {
            // Sanitize based on context
            if (filter_var($data, FILTER_VALIDATE_URL)) {
                return esc_url_raw($data);
            }
            return sanitize_text_field($data);
        }

        return $data;
    }

    /**
     * Validate JWT token format
     */
    public function validate_jwt_format($token) {
        if (empty($token)) {
            return false;
        }

        // JWT should have 3 parts separated by dots
        $parts = explode('.', $token);
        if (count($parts) !== 3) {
            return false;
        }

        // Each part should be base64 encoded
        foreach ($parts as $part) {
            if (!preg_match('/^[a-zA-Z0-9_-]+$/', $part)) {
                return false;
            }
        }

        return true;
    }

    /**
     * Validate API URL format
     */
    public static function validate_api_url($url) {
        if (empty($url)) {
            return false;
        }

        // Must be valid URL
        if (!filter_var($url, FILTER_VALIDATE_URL)) {
            return false;
        }

        // Must be HTTPS in production
        if (!defined('WP_DEBUG') || !WP_DEBUG) {
            if (strpos($url, 'https://') !== 0) {
                return false;
            }
        }

        // Must not end with /api
        if (substr($url, -4) === '/api') {
            return false;
        }

        return true;
    }

    /**
     * Validate site ID format
     */
    public static function validate_site_id($site_id) {
        if (empty($site_id)) {
            return false;
        }

        // Must be 32-character hex string
        if (!preg_match('/^[a-f0-9]{32}$/i', $site_id)) {
            return false;
        }

        return true;
    }

    /**
     * Check if user has permission for notification operations
     */
    public static function can_manage_notifications() {
        return current_user_can('manage_options') || current_user_can('publish_posts');
    }

    /**
     * Check if user can send notifications
     */
    public static function can_send_notifications() {
        return current_user_can('manage_options');
    }

    /**
     * Sanitize notification data
     */
    public static function sanitize_notification_data($data) {
        $sanitized = array();

        // Required fields
        if (isset($data['title'])) {
            $sanitized['title'] = sanitize_text_field($data['title']);
            // Limit length
            $sanitized['title'] = substr($sanitized['title'], 0, 100);
        }

        if (isset($data['message'])) {
            $sanitized['message'] = sanitize_textarea_field($data['message']);
            // Limit length
            $sanitized['message'] = substr($sanitized['message'], 0, 500);
        }

        if (isset($data['destinationUrl'])) {
            $sanitized['destinationUrl'] = esc_url_raw($data['destinationUrl']);
        }

        // Optional fields
        if (isset($data['iconUrl'])) {
            $sanitized['iconUrl'] = esc_url_raw($data['iconUrl']);
        }

        if (isset($data['imageUrl'])) {
            $sanitized['imageUrl'] = esc_url_raw($data['imageUrl']);
        }

        if (isset($data['type'])) {
            $allowed_types = array('ONE_TIME', 'RECURRING', 'TRIGGERED', 'WELCOME', 'RSS');
            $sanitized['type'] = in_array($data['type'], $allowed_types) ? $data['type'] : 'ONE_TIME';
        }

        // UTM parameters
        if (isset($data['utmParams']) && is_array($data['utmParams'])) {
            $sanitized['utmParams'] = array();
            foreach ($data['utmParams'] as $key => $value) {
                $sanitized['utmParams'][sanitize_key($key)] = sanitize_text_field($value);
            }
        }

        return $sanitized;
    }

    /**
     * Log security events
     */
    public static function log_security_event($event, $details = array()) {
        if (!defined('WP_DEBUG_LOG') || !WP_DEBUG_LOG) {
            return;
        }

        $user_id = get_current_user_id();
        $ip_address = self::get_client_ip();

        $log_entry = array(
            'event' => $event,
            'user_id' => $user_id,
            'ip_address' => $ip_address,
            'timestamp' => current_time('mysql'),
            'details' => $details,
        );

        error_log('PushToolkit Security Event: ' . json_encode($log_entry));
    }

    /**
     * Get client IP address
     */
    private static function get_client_ip() {
        $ip = '';

        if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
            $ip = $_SERVER['HTTP_CLIENT_IP'];
        } elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
        } else {
            $ip = $_SERVER['REMOTE_ADDR'];
        }

        return filter_var($ip, FILTER_VALIDATE_IP) ? $ip : '0.0.0.0';
    }
}
