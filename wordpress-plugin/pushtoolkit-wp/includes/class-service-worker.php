<?php
/**
 * PushToolkit Service Worker Handler
 *
 * Manages service worker file generation and serving
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

class PushToolkit_Service_Worker {

    /**
     * Constructor
     */
    public function __construct() {
        add_action('init', array($this, 'maybe_regenerate_sw'));
        add_action('update_option_pushtoolkit_settings', array($this, 'regenerate_sw'), 10, 2);
    }

    /**
     * Maybe regenerate service worker on settings update
     */
    public function maybe_regenerate_sw() {
        // Check if service worker exists
        $upload_dir = wp_upload_dir();
        $sw_file = $upload_dir['basedir'] . '/sw.js';

        if (!file_exists($sw_file)) {
            $this->regenerate_sw();
        }
    }

    /**
     * Regenerate service worker file
     */
    public function regenerate_sw($old_value = null, $value = null) {
        $settings = get_option('pushtoolkit_settings', array());
        $api_url = isset($settings['api_url']) ? $settings['api_url'] : '';

        if (empty($api_url)) {
            return;
        }

        $upload_dir = wp_upload_dir();
        $sw_file = $upload_dir['basedir'] . '/sw.js';

        // Get service worker template
        $sw_template = file_get_contents(PUSHTOOLKIT_PLUGIN_DIR . 'assets/sw-template.js');

        // Replace placeholders
        $sw_content = str_replace('{{API_URL}}', $api_url . '/api', $sw_template);

        // Write file
        file_put_contents($sw_file, $sw_content);

        // Set correct permissions
        chmod($sw_file, 0644);
    }

    /**
     * Get service worker URL
     */
    public static function get_sw_url() {
        $upload_dir = wp_upload_dir();
        return $upload_dir['baseurl'] . '/sw.js';
    }
}
