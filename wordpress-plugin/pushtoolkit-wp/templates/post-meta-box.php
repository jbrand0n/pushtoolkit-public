<?php
/**
 * Post Meta Box Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="pushtoolkit-meta-box">
    <p>
        <label>
            <input type="checkbox" name="pushtoolkit_disable_push" value="1" <?php checked($disable_push, 1); ?>>
            <?php _e('Disable push notification for this post', 'pushtoolkit-wp'); ?>
        </label>
    </p>

    <p>
        <label for="pushtoolkit_custom_title"><?php _e('Custom Notification Title', 'pushtoolkit-wp'); ?></label>
        <input type="text" id="pushtoolkit_custom_title" name="pushtoolkit_custom_title" value="<?php echo esc_attr($custom_title); ?>" class="widefat" placeholder="<?php _e('Leave empty to use post title', 'pushtoolkit-wp'); ?>">
    </p>

    <p>
        <label for="pushtoolkit_custom_message"><?php _e('Custom Notification Message', 'pushtoolkit-wp'); ?></label>
        <textarea id="pushtoolkit_custom_message" name="pushtoolkit_custom_message" rows="3" class="widefat" placeholder="<?php _e('Leave empty to use post excerpt', 'pushtoolkit-wp'); ?>"><?php echo esc_textarea($custom_message); ?></textarea>
    </p>

    <p class="description">
        <?php _e('Customize the push notification that will be sent when this post is published. Leave fields empty to use default values.', 'pushtoolkit-wp'); ?>
    </p>
</div>
