<?php
/**
 * Plugin Name: PushToolkit for WordPress
 * Plugin URI: https://github.com/yourusername/pushtoolkit
 * Description: Integrate PushToolkit push notifications with your WordPress site. Send browser push notifications for new posts, pages, and custom events.
 * Version: 1.0.0
 * Author: PushToolkit
 * Author URI: https://pushtoolkit.com
 * License: MIT
 * Text Domain: pushtoolkit-wp
 * Domain Path: /languages
 * Requires at least: 5.0
 * Requires PHP: 7.4
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PUSHTOOLKIT_VERSION', '1.0.0');
define('PUSHTOOLKIT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PUSHTOOLKIT_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PUSHTOOLKIT_PLUGIN_FILE', __FILE__);

/**
 * Main PushToolkit Plugin Class
 */
class PushToolkit_WP {

    /**
     * Single instance of the class
     */
    private static $instance = null;

    /**
     * API Client instance
     */
    public $api;

    /**
     * Get single instance
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    /**
     * Constructor
     */
    private function __construct() {
        $this->includes();
        $this->init_hooks();
    }

    /**
     * Include required files
     */
    private function includes() {
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-security.php';
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-api-client.php';
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-admin.php';
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-frontend.php';
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-notifications.php';
        require_once PUSHTOOLKIT_PLUGIN_DIR . 'includes/class-service-worker.php';

        // Initialize API client
        $this->api = new PushToolkit_API_Client();
    }

    /**
     * Initialize hooks
     */
    private function init_hooks() {
        // Activation and deactivation
        register_activation_hook(PUSHTOOLKIT_PLUGIN_FILE, array($this, 'activate'));
        register_deactivation_hook(PUSHTOOLKIT_PLUGIN_FILE, array($this, 'deactivate'));

        // Initialize components
        add_action('plugins_loaded', array($this, 'init'));

        // Add settings link
        add_filter('plugin_action_links_' . plugin_basename(PUSHTOOLKIT_PLUGIN_FILE), array($this, 'add_settings_link'));
    }

    /**
     * Initialize plugin components
     */
    public function init() {
        // Load text domain for translations
        load_plugin_textdomain('pushtoolkit-wp', false, dirname(plugin_basename(PUSHTOOLKIT_PLUGIN_FILE)) . '/languages');

        // Initialize security
        new PushToolkit_Security();

        // Initialize admin functionality
        if (is_admin()) {
            new PushToolkit_Admin();
        }

        // Initialize frontend functionality
        new PushToolkit_Frontend();

        // Initialize notifications handler
        new PushToolkit_Notifications();

        // Initialize service worker handler
        new PushToolkit_Service_Worker();
    }

    /**
     * Plugin activation
     */
    public function activate() {
        // Set default options
        $defaults = array(
            'api_url' => '',
            'site_id' => '',
            'jwt_token' => '',
            'auto_push_on_publish' => true,
            'auto_push_post_types' => array('post'),
            'default_icon_url' => '',
            'utm_source' => 'wordpress',
            'utm_medium' => 'push-notification',
        );

        add_option('pushtoolkit_settings', $defaults);

        // Create service worker file
        $this->create_service_worker();

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Plugin deactivation
     */
    public function deactivate() {
        // Clean up service worker file
        $upload_dir = wp_upload_dir();
        $sw_file = $upload_dir['basedir'] . '/sw.js';
        if (file_exists($sw_file)) {
            @unlink($sw_file);
        }

        // Flush rewrite rules
        flush_rewrite_rules();
    }

    /**
     * Create service worker file
     */
    private function create_service_worker() {
        $settings = get_option('pushtoolkit_settings', array());
        $api_url = isset($settings['api_url']) ? $settings['api_url'] : '';

        if (empty($api_url)) {
            return;
        }

        $upload_dir = wp_upload_dir();
        $sw_content = file_get_contents(PUSHTOOLKIT_PLUGIN_DIR . 'assets/sw-template.js');
        $sw_content = str_replace('{{API_URL}}', $api_url, $sw_content);

        file_put_contents($upload_dir['basedir'] . '/sw.js', $sw_content);
    }

    /**
     * Add settings link on plugins page
     */
    public function add_settings_link($links) {
        $settings_link = '<a href="' . admin_url('admin.php?page=pushtoolkit-settings') . '">' . __('Settings', 'pushtoolkit-wp') . '</a>';
        array_unshift($links, $settings_link);
        return $links;
    }
}

/**
 * Initialize the plugin
 */
function pushtoolkit_wp() {
    return PushToolkit_WP::get_instance();
}

// Start the plugin
pushtoolkit_wp();
