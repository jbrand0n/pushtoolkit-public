<?php
/**
 * Admin Settings Page Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php settings_errors('pushtoolkit_messages'); ?>

    <form action="options.php" method="post">
        <?php
        settings_fields('pushtoolkit_settings');
        do_settings_sections('pushtoolkit-settings');
        submit_button(__('Save Settings', 'pushtoolkit-wp'));
        ?>
    </form>

    <hr>

    <h2><?php _e('Quick Start Guide', 'pushtoolkit-wp'); ?></h2>

    <div class="pushtoolkit-help-section">
        <ol>
            <li>
                <strong><?php _e('Set up your PushToolkit account:', 'pushtoolkit-wp'); ?></strong>
                <p><?php _e('If you haven\'t already, deploy your own PushToolkit instance or use an existing one.', 'pushtoolkit-wp'); ?></p>
            </li>
            <li>
                <strong><?php _e('Create a site in PushToolkit:', 'pushtoolkit-wp'); ?></strong>
                <p><?php _e('Log into your PushToolkit dashboard and create a new site. Copy the Site ID.', 'pushtoolkit-wp'); ?></p>
            </li>
            <li>
                <strong><?php _e('Get your JWT token:', 'pushtoolkit-wp'); ?></strong>
                <p><?php _e('You can find your JWT token in your PushToolkit account settings or by logging in via the API.', 'pushtoolkit-wp'); ?></p>
            </li>
            <li>
                <strong><?php _e('Configure the plugin:', 'pushtoolkit-wp'); ?></strong>
                <p><?php _e('Enter your API URL, Site ID, and JWT token in the settings above, then click "Test Connection".', 'pushtoolkit-wp'); ?></p>
            </li>
            <li>
                <strong><?php _e('Publish content:', 'pushtoolkit-wp'); ?></strong>
                <p><?php _e('When you publish a new post, a push notification will automatically be sent to your subscribers!', 'pushtoolkit-wp'); ?></p>
            </li>
        </ol>
    </div>

    <hr>

    <h2><?php _e('Service Worker Status', 'pushtoolkit-wp'); ?></h2>

    <?php
    $upload_dir = wp_upload_dir();
    $sw_file = $upload_dir['basedir'] . '/sw.js';
    $sw_url = $upload_dir['baseurl'] . '/sw.js';
    ?>

    <p>
        <strong><?php _e('Service Worker File:', 'pushtoolkit-wp'); ?></strong>
        <?php if (file_exists($sw_file)): ?>
            <span style="color: green;">✓ <?php _e('Generated', 'pushtoolkit-wp'); ?></span>
            <br>
            <code><?php echo esc_html($sw_url); ?></code>
        <?php else: ?>
            <span style="color: red;">✗ <?php _e('Not Found', 'pushtoolkit-wp'); ?></span>
            <br>
            <?php _e('The service worker will be created when you save your settings with a valid API URL.', 'pushtoolkit-wp'); ?>
        <?php endif; ?>
    </p>
</div>
