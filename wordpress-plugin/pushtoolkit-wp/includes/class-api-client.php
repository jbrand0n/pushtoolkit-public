<?php
/**
 * PushToolkit API Client
 *
 * Handles communication with PushToolkit backend API
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_API_Client {

    /**
     * API base URL
     */
    private $api_url;

    /**
     * Site ID
     */
    private $site_id;

    /**
     * JWT token
     */
    private $jwt_token;

    /**
     * Constructor
     */
    public function __construct() {
        $settings = get_option('pushtoolkit_settings', array());
        $this->api_url = isset($settings['api_url']) ? rtrim($settings['api_url'], '/') : '';
        $this->site_id = isset($settings['site_id']) ? $settings['site_id'] : '';
        $this->jwt_token = isset($settings['jwt_token']) ? $settings['jwt_token'] : '';
    }

    /**
     * Make API request
     */
    private function request($endpoint, $method = 'GET', $data = null, $auth_required = true) {
        if (empty($this->api_url)) {
            return new WP_Error('no_api_url', __('PushToolkit API URL not configured.', 'pushtoolkit-wp'));
        }

        $url = $this->api_url . '/api' . $endpoint;

        $args = array(
            'method' => $method,
            'timeout' => 30,
            'headers' => array(
                'Content-Type' => 'application/json',
            ),
        );

        // Add JWT token if required
        if ($auth_required && !empty($this->jwt_token)) {
            $args['headers']['Authorization'] = 'Bearer ' . $this->jwt_token;
        }

        // Add request body
        if ($data !== null && in_array($method, array('POST', 'PATCH', 'PUT'))) {
            $args['body'] = json_encode($data);
        }

        $response = wp_remote_request($url, $args);

        // Check for errors
        if (is_wp_error($response)) {
            return $response;
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $decoded = json_decode($body, true);

        // Handle error responses
        if ($status_code >= 400) {
            $error_message = isset($decoded['error']['message']) ? $decoded['error']['message'] : 'Unknown error';
            return new WP_Error('api_error', $error_message, array('status' => $status_code));
        }

        return $decoded;
    }

    /**
     * Test API connection
     */
    public function test_connection() {
        if (empty($this->jwt_token)) {
            return new WP_Error('no_jwt', __('JWT token not configured.', 'pushtoolkit-wp'));
        }

        $result = $this->request('/auth/me', 'GET');

        if (is_wp_error($result)) {
            return $result;
        }

        return array(
            'success' => true,
            'user' => isset($result['data']) ? $result['data'] : null,
        );
    }

    /**
     * Get site details
     */
    public function get_site() {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id, 'GET');
    }

    /**
     * Get installation code
     */
    public function get_install_code() {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id . '/install-code', 'GET');
    }

    /**
     * Create notification
     */
    public function create_notification($data) {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id . '/notifications', 'POST', $data);
    }

    /**
     * Send notification
     */
    public function send_notification($notification_id) {
        return $this->request('/notifications/' . $notification_id . '/send', 'POST');
    }

    /**
     * Create and send notification
     */
    public function create_and_send_notification($data) {
        $create_result = $this->create_notification($data);

        if (is_wp_error($create_result)) {
            return $create_result;
        }

        $notification_id = isset($create_result['data']['notification']['id']) ? $create_result['data']['notification']['id'] : null;

        if (empty($notification_id)) {
            return new WP_Error('no_notification_id', __('Failed to get notification ID.', 'pushtoolkit-wp'));
        }

        return $this->send_notification($notification_id);
    }

    /**
     * Get notifications list
     */
    public function get_notifications($page = 1, $limit = 10) {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id . '/notifications?page=' . $page . '&limit=' . $limit, 'GET');
    }

    /**
     * Get notification performance
     */
    public function get_notification_performance($notification_id) {
        return $this->request('/notifications/' . $notification_id . '/performance', 'GET');
    }

    /**
     * Get dashboard analytics
     */
    public function get_dashboard_analytics() {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id . '/analytics/dashboard', 'GET');
    }

    /**
     * Get subscribers list
     */
    public function get_subscribers($page = 1, $limit = 10) {
        if (empty($this->site_id)) {
            return new WP_Error('no_site_id', __('Site ID not configured.', 'pushtoolkit-wp'));
        }

        return $this->request('/sites/' . $this->site_id . '/subscribers?page=' . $page . '&limit=' . $limit, 'GET');
    }

    /**
     * Get subscriber details
     */
    public function get_subscriber($subscriber_id) {
        return $this->request('/subscribers/' . $subscriber_id, 'GET');
    }

    /**
     * Delete subscriber
     */
    public function delete_subscriber($subscriber_id) {
        return $this->request('/subscribers/' . $subscriber_id, 'DELETE');
    }

    /**
     * Login and get JWT token
     */
    public function login($email, $password) {
        $data = array(
            'email' => $email,
            'password' => $password,
        );

        $result = $this->request('/auth/login', 'POST', $data, false);

        if (is_wp_error($result)) {
            return $result;
        }

        // Extract token
        $token = isset($result['data']['token']) ? $result['data']['token'] : null;

        if (empty($token)) {
            return new WP_Error('no_token', __('Failed to get JWT token.', 'pushtoolkit-wp'));
        }

        return array(
            'success' => true,
            'token' => $token,
            'user' => isset($result['data']['user']) ? $result['data']['user'] : null,
        );
    }

    /**
     * Register new account
     */
    public function register($name, $email, $password) {
        $data = array(
            'name' => $name,
            'email' => $email,
            'password' => $password,
        );

        return $this->request('/auth/register', 'POST', $data, false);
    }

    /**
     * Get VAPID public key
     */
    public function get_vapid_public_key() {
        $site = $this->get_site();

        if (is_wp_error($site)) {
            return $site;
        }

        return isset($site['data']['site']['vapidPublicKey']) ? $site['data']['site']['vapidPublicKey'] : null;
    }
}
