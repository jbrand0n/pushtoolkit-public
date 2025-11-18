<?php
/**
 * PushToolkit Admin
 *
 * Handles admin interface and settings
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_Admin {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('admin_menu', array($this, 'add_menu_pages'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_dashboard_setup', array($this, 'add_dashboard_widget'));
        add_action('add_meta_boxes', array($this, 'add_post_meta_box'));
        add_action('save_post', array($this, 'save_post_meta'), 10, 2);
        add_action('wp_ajax_pushtoolkit_test_connection', array($this, 'ajax_test_connection'));
        add_action('wp_ajax_pushtoolkit_send_test_notification', array($this, 'ajax_send_test_notification'));
    }

    /**
     * Add menu pages
     */
    public function add_menu_pages() {
        add_menu_page(
            __('PushToolkit', 'pushtoolkit-wp'),
            __('PushToolkit', 'pushtoolkit-wp'),
            'manage_options',
            'pushtoolkit',
            array($this, 'dashboard_page'),
            'dashicons-megaphone',
            30
        );

        add_submenu_page(
            'pushtoolkit',
            __('Dashboard', 'pushtoolkit-wp'),
            __('Dashboard', 'pushtoolkit-wp'),
            'manage_options',
            'pushtoolkit',
            array($this, 'dashboard_page')
        );

        add_submenu_page(
            'pushtoolkit',
            __('Settings', 'pushtoolkit-wp'),
            __('Settings', 'pushtoolkit-wp'),
            'manage_options',
            'pushtoolkit-settings',
            array($this, 'settings_page')
        );

        add_submenu_page(
            'pushtoolkit',
            __('Send Notification', 'pushtoolkit-wp'),
            __('Send Notification', 'pushtoolkit-wp'),
            'manage_options',
            'pushtoolkit-send',
            array($this, 'send_notification_page')
        );

        add_submenu_page(
            'pushtoolkit',
            __('Subscribers', 'pushtoolkit-wp'),
            __('Subscribers', 'pushtoolkit-wp'),
            'manage_options',
            'pushtoolkit-subscribers',
            array($this, 'subscribers_page')
        );
    }

    /**
     * Register settings
     */
    public function register_settings() {
        register_setting('pushtoolkit_settings', 'pushtoolkit_settings', array($this, 'sanitize_settings'));

        // API Settings Section
        add_settings_section(
            'pushtoolkit_api_section',
            __('API Connection', 'pushtoolkit-wp'),
            array($this, 'api_section_callback'),
            'pushtoolkit-settings'
        );

        add_settings_field(
            'api_url',
            __('API URL', 'pushtoolkit-wp'),
            array($this, 'api_url_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_api_section'
        );

        add_settings_field(
            'site_id',
            __('Site ID', 'pushtoolkit-wp'),
            array($this, 'site_id_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_api_section'
        );

        add_settings_field(
            'jwt_token',
            __('JWT Token', 'pushtoolkit-wp'),
            array($this, 'jwt_token_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_api_section'
        );

        // Automation Settings Section
        add_settings_section(
            'pushtoolkit_automation_section',
            __('Automation Settings', 'pushtoolkit-wp'),
            array($this, 'automation_section_callback'),
            'pushtoolkit-settings'
        );

        add_settings_field(
            'auto_push_on_publish',
            __('Auto Push on Publish', 'pushtoolkit-wp'),
            array($this, 'auto_push_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_automation_section'
        );

        add_settings_field(
            'auto_push_post_types',
            __('Post Types', 'pushtoolkit-wp'),
            array($this, 'post_types_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_automation_section'
        );

        // Notification Settings Section
        add_settings_section(
            'pushtoolkit_notification_section',
            __('Default Notification Settings', 'pushtoolkit-wp'),
            array($this, 'notification_section_callback'),
            'pushtoolkit-settings'
        );

        add_settings_field(
            'default_icon_url',
            __('Default Icon URL', 'pushtoolkit-wp'),
            array($this, 'icon_url_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_notification_section'
        );

        add_settings_field(
            'utm_source',
            __('UTM Source', 'pushtoolkit-wp'),
            array($this, 'utm_source_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_notification_section'
        );

        add_settings_field(
            'utm_medium',
            __('UTM Medium', 'pushtoolkit-wp'),
            array($this, 'utm_medium_callback'),
            'pushtoolkit-settings',
            'pushtoolkit_notification_section'
        );
    }

    /**
     * Sanitize settings
     */
    public function sanitize_settings($input) {
        $sanitized = array();

        if (isset($input['api_url'])) {
            $sanitized['api_url'] = esc_url_raw($input['api_url']);
        }

        if (isset($input['site_id'])) {
            $sanitized['site_id'] = sanitize_text_field($input['site_id']);
        }

        if (isset($input['jwt_token'])) {
            $sanitized['jwt_token'] = sanitize_text_field($input['jwt_token']);
        }

        $sanitized['auto_push_on_publish'] = isset($input['auto_push_on_publish']) ? (bool) $input['auto_push_on_publish'] : false;

        if (isset($input['auto_push_post_types']) && is_array($input['auto_push_post_types'])) {
            $sanitized['auto_push_post_types'] = array_map('sanitize_text_field', $input['auto_push_post_types']);
        } else {
            $sanitized['auto_push_post_types'] = array();
        }

        if (isset($input['default_icon_url'])) {
            $sanitized['default_icon_url'] = esc_url_raw($input['default_icon_url']);
        }

        if (isset($input['utm_source'])) {
            $sanitized['utm_source'] = sanitize_text_field($input['utm_source']);
        }

        if (isset($input['utm_medium'])) {
            $sanitized['utm_medium'] = sanitize_text_field($input['utm_medium']);
        }

        return $sanitized;
    }

    /**
     * Settings section callbacks
     */
    public function api_section_callback() {
        echo '<p>' . __('Configure your PushToolkit API connection. You can find these details in your PushToolkit dashboard.', 'pushtoolkit-wp') . '</p>';
    }

    public function automation_section_callback() {
        echo '<p>' . __('Configure automatic push notification sending when content is published.', 'pushtoolkit-wp') . '</p>';
    }

    public function notification_section_callback() {
        echo '<p>' . __('Set default values for push notifications.', 'pushtoolkit-wp') . '</p>';
    }

    /**
     * Settings field callbacks
     */
    public function api_url_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['api_url']) ? $settings['api_url'] : '';
        echo '<input type="url" name="pushtoolkit_settings[api_url]" value="' . esc_attr($value) . '" class="regular-text" placeholder="https://your-pushtoolkit-instance.com">';
        echo '<p class="description">' . __('The URL of your PushToolkit backend API (without /api suffix).', 'pushtoolkit-wp') . '</p>';
    }

    public function site_id_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['site_id']) ? $settings['site_id'] : '';
        echo '<input type="text" name="pushtoolkit_settings[site_id]" value="' . esc_attr($value) . '" class="regular-text" placeholder="abc123def456...">';
        echo '<p class="description">' . __('Your PushToolkit site ID (32-character hex string).', 'pushtoolkit-wp') . '</p>';
    }

    public function jwt_token_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['jwt_token']) ? $settings['jwt_token'] : '';
        echo '<input type="password" name="pushtoolkit_settings[jwt_token]" value="' . esc_attr($value) . '" class="large-text" placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...">';
        echo '<p class="description">' . __('Your JWT authentication token from PushToolkit.', 'pushtoolkit-wp') . '</p>';
        echo '<button type="button" class="button" id="pushtoolkit-test-connection">' . __('Test Connection', 'pushtoolkit-wp') . '</button>';
        echo '<span id="pushtoolkit-connection-status"></span>';
    }

    public function auto_push_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['auto_push_on_publish']) ? $settings['auto_push_on_publish'] : true;
        echo '<label><input type="checkbox" name="pushtoolkit_settings[auto_push_on_publish]" value="1" ' . checked($value, true, false) . '> ';
        echo __('Automatically send push notifications when content is published', 'pushtoolkit-wp') . '</label>';
    }

    public function post_types_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $selected = isset($settings['auto_push_post_types']) ? $settings['auto_push_post_types'] : array('post');
        $post_types = get_post_types(array('public' => true), 'objects');

        echo '<fieldset>';
        foreach ($post_types as $post_type) {
            $checked = in_array($post_type->name, $selected) ? 'checked' : '';
            echo '<label><input type="checkbox" name="pushtoolkit_settings[auto_push_post_types][]" value="' . esc_attr($post_type->name) . '" ' . $checked . '> ';
            echo esc_html($post_type->labels->name) . '</label><br>';
        }
        echo '</fieldset>';
        echo '<p class="description">' . __('Select which post types should trigger automatic push notifications.', 'pushtoolkit-wp') . '</p>';
    }

    public function icon_url_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['default_icon_url']) ? $settings['default_icon_url'] : '';
        echo '<input type="url" name="pushtoolkit_settings[default_icon_url]" value="' . esc_attr($value) . '" class="regular-text">';
        echo '<p class="description">' . __('Default icon URL for push notifications (recommended 192x192 PNG).', 'pushtoolkit-wp') . '</p>';
    }

    public function utm_source_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['utm_source']) ? $settings['utm_source'] : 'wordpress';
        echo '<input type="text" name="pushtoolkit_settings[utm_source]" value="' . esc_attr($value) . '" class="regular-text">';
        echo '<p class="description">' . __('UTM source parameter for tracking.', 'pushtoolkit-wp') . '</p>';
    }

    public function utm_medium_callback() {
        $settings = get_option('pushtoolkit_settings', array());
        $value = isset($settings['utm_medium']) ? $settings['utm_medium'] : 'push-notification';
        echo '<input type="text" name="pushtoolkit_settings[utm_medium]" value="' . esc_attr($value) . '" class="regular-text">';
        echo '<p class="description">' . __('UTM medium parameter for tracking.', 'pushtoolkit-wp') . '</p>';
    }

    /**
     * Enqueue admin scripts
     */
    public function enqueue_scripts($hook) {
        if (strpos($hook, 'pushtoolkit') === false) {
            return;
        }

        wp_enqueue_style('pushtoolkit-admin', PUSHTOOLKIT_PLUGIN_URL . 'assets/css/admin.css', array(), PUSHTOOLKIT_VERSION);
        wp_enqueue_script('pushtoolkit-admin', PUSHTOOLKIT_PLUGIN_URL . 'assets/js/admin.js', array('jquery'), PUSHTOOLKIT_VERSION, true);

        wp_localize_script('pushtoolkit-admin', 'pushToolkitAdmin', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pushtoolkit_admin'),
        ));
    }

    /**
     * Dashboard page
     */
    public function dashboard_page() {
        $api = pushtoolkit_wp()->api;
        $analytics = $api->get_dashboard_analytics();

        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/admin-dashboard.php';
    }

    /**
     * Settings page
     */
    public function settings_page() {
        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/admin-settings.php';
    }

    /**
     * Send notification page
     */
    public function send_notification_page() {
        // Handle form submission
        if (isset($_POST['pushtoolkit_send_notification']) && check_admin_referer('pushtoolkit_send_notification')) {
            $this->handle_send_notification();
        }

        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/admin-send-notification.php';
    }

    /**
     * Subscribers page
     */
    public function subscribers_page() {
        $api = pushtoolkit_wp()->api;
        $page = isset($_GET['paged']) ? intval($_GET['paged']) : 1;
        $subscribers = $api->get_subscribers($page, 20);

        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/admin-subscribers.php';
    }

    /**
     * Handle send notification
     */
    private function handle_send_notification() {
        $api = pushtoolkit_wp()->api;
        $settings = get_option('pushtoolkit_settings', array());

        $notification_data = array(
            'type' => 'ONE_TIME',
            'title' => sanitize_text_field($_POST['notification_title']),
            'message' => sanitize_textarea_field($_POST['notification_message']),
            'destinationUrl' => esc_url_raw($_POST['destination_url']),
        );

        if (!empty($_POST['icon_url'])) {
            $notification_data['iconUrl'] = esc_url_raw($_POST['icon_url']);
        } elseif (!empty($settings['default_icon_url'])) {
            $notification_data['iconUrl'] = $settings['default_icon_url'];
        }

        if (!empty($_POST['image_url'])) {
            $notification_data['imageUrl'] = esc_url_raw($_POST['image_url']);
        }

        // Add UTM parameters
        if (!empty($settings['utm_source']) || !empty($settings['utm_medium'])) {
            $notification_data['utmParams'] = array();
            if (!empty($settings['utm_source'])) {
                $notification_data['utmParams']['source'] = $settings['utm_source'];
            }
            if (!empty($settings['utm_medium'])) {
                $notification_data['utmParams']['medium'] = $settings['utm_medium'];
            }
        }

        $result = $api->create_and_send_notification($notification_data);

        if (is_wp_error($result)) {
            add_settings_error('pushtoolkit_messages', 'pushtoolkit_error', $result->get_error_message(), 'error');
        } else {
            add_settings_error('pushtoolkit_messages', 'pushtoolkit_success', __('Notification sent successfully!', 'pushtoolkit-wp'), 'success');
        }
    }

    /**
     * Add dashboard widget
     */
    public function add_dashboard_widget() {
        wp_add_dashboard_widget(
            'pushtoolkit_dashboard_widget',
            __('PushToolkit Analytics', 'pushtoolkit-wp'),
            array($this, 'render_dashboard_widget')
        );
    }

    /**
     * Render dashboard widget
     */
    public function render_dashboard_widget() {
        $api = pushtoolkit_wp()->api;
        $analytics = $api->get_dashboard_analytics();

        if (is_wp_error($analytics)) {
            echo '<p>' . esc_html($analytics->get_error_message()) . '</p>';
            return;
        }

        $data = isset($analytics['data']) ? $analytics['data'] : array();
        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/dashboard-widget.php';
    }

    /**
     * Add post meta box
     */
    public function add_post_meta_box() {
        $settings = get_option('pushtoolkit_settings', array());
        $post_types = isset($settings['auto_push_post_types']) ? $settings['auto_push_post_types'] : array('post');

        foreach ($post_types as $post_type) {
            add_meta_box(
                'pushtoolkit_notification',
                __('Push Notification', 'pushtoolkit-wp'),
                array($this, 'render_post_meta_box'),
                $post_type,
                'side',
                'default'
            );
        }
    }

    /**
     * Render post meta box
     */
    public function render_post_meta_box($post) {
        wp_nonce_field('pushtoolkit_post_meta', 'pushtoolkit_post_meta_nonce');

        $disable_push = get_post_meta($post->ID, '_pushtoolkit_disable_push', true);
        $custom_title = get_post_meta($post->ID, '_pushtoolkit_custom_title', true);
        $custom_message = get_post_meta($post->ID, '_pushtoolkit_custom_message', true);

        include PUSHTOOLKIT_PLUGIN_DIR . 'templates/post-meta-box.php';
    }

    /**
     * Save post meta
     */
    public function save_post_meta($post_id, $post) {
        // Check nonce
        if (!isset($_POST['pushtoolkit_post_meta_nonce']) || !wp_verify_nonce($_POST['pushtoolkit_post_meta_nonce'], 'pushtoolkit_post_meta')) {
            return;
        }

        // Check autosave
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Check permissions
        if (!current_user_can('edit_post', $post_id)) {
            return;
        }

        // Save meta data
        if (isset($_POST['pushtoolkit_disable_push'])) {
            update_post_meta($post_id, '_pushtoolkit_disable_push', 1);
        } else {
            delete_post_meta($post_id, '_pushtoolkit_disable_push');
        }

        if (isset($_POST['pushtoolkit_custom_title'])) {
            update_post_meta($post_id, '_pushtoolkit_custom_title', sanitize_text_field($_POST['pushtoolkit_custom_title']));
        }

        if (isset($_POST['pushtoolkit_custom_message'])) {
            update_post_meta($post_id, '_pushtoolkit_custom_message', sanitize_textarea_field($_POST['pushtoolkit_custom_message']));
        }
    }

    /**
     * AJAX: Test connection
     */
    public function ajax_test_connection() {
        check_ajax_referer('pushtoolkit_admin', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Insufficient permissions.', 'pushtoolkit-wp')));
        }

        $api = pushtoolkit_wp()->api;
        $result = $api->test_connection();

        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        }

        wp_send_json_success(array('message' => __('Connection successful!', 'pushtoolkit-wp'), 'user' => $result['user']));
    }

    /**
     * AJAX: Send test notification
     */
    public function ajax_send_test_notification() {
        check_ajax_referer('pushtoolkit_admin', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_send_json_error(array('message' => __('Insufficient permissions.', 'pushtoolkit-wp')));
        }

        $api = pushtoolkit_wp()->api;
        $notification_data = array(
            'type' => 'ONE_TIME',
            'title' => __('Test Notification', 'pushtoolkit-wp'),
            'message' => __('This is a test notification from PushToolkit WordPress plugin.', 'pushtoolkit-wp'),
            'destinationUrl' => home_url(),
        );

        $result = $api->create_and_send_notification($notification_data);

        if (is_wp_error($result)) {
            wp_send_json_error(array('message' => $result->get_error_message()));
        }

        wp_send_json_success(array('message' => __('Test notification sent!', 'pushtoolkit-wp')));
    }
}
