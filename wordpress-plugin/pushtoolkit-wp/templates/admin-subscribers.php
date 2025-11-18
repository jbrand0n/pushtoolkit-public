<?php
/**
 * Subscribers Page Template
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="wrap">
    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <?php if (is_wp_error($subscribers)): ?>
        <div class="notice notice-error">
            <p><?php echo esc_html($subscribers->get_error_message()); ?></p>
        </div>
    <?php else: ?>
        <?php
        $subscriber_list = isset($subscribers['data']['subscribers']) ? $subscribers['data']['subscribers'] : array();
        $total = isset($subscribers['data']['total']) ? intval($subscribers['data']['total']) : 0;
        $pagination = isset($subscribers['data']['pagination']) ? $subscribers['data']['pagination'] : array();
        ?>

        <p class="description">
            <?php printf(__('Total subscribers: %d', 'pushtoolkit-wp'), $total); ?>
        </p>

        <?php if (!empty($subscriber_list)): ?>
            <table class="wp-list-table widefat fixed striped">
                <thead>
                    <tr>
                        <th><?php _e('Browser', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('OS', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Country', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Subscribed', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Last Seen', 'pushtoolkit-wp'); ?></th>
                        <th><?php _e('Status', 'pushtoolkit-wp'); ?></th>
                    </tr>
                </thead>
                <tbody>
                    <?php foreach ($subscriber_list as $subscriber): ?>
                        <tr>
                            <td><?php echo esc_html($subscriber['browser'] ?? 'Unknown'); ?></td>
                            <td><?php echo esc_html($subscriber['os'] ?? 'Unknown'); ?></td>
                            <td><?php echo esc_html($subscriber['country'] ?? '-'); ?></td>
                            <td><?php echo isset($subscriber['subscribedAt']) ? esc_html(date('Y-m-d H:i', strtotime($subscriber['subscribedAt']))) : '-'; ?></td>
                            <td><?php echo isset($subscriber['lastSeenAt']) ? esc_html(date('Y-m-d H:i', strtotime($subscriber['lastSeenAt']))) : '-'; ?></td>
                            <td>
                                <?php if (isset($subscriber['isActive']) && $subscriber['isActive']): ?>
                                    <span style="color: green;">✓ <?php _e('Active', 'pushtoolkit-wp'); ?></span>
                                <?php else: ?>
                                    <span style="color: gray;">✗ <?php _e('Inactive', 'pushtoolkit-wp'); ?></span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    <?php endforeach; ?>
                </tbody>
            </table>

            <?php if (isset($pagination['totalPages']) && $pagination['totalPages'] > 1): ?>
                <div class="tablenav">
                    <div class="tablenav-pages">
                        <?php
                        $current_page = isset($pagination['currentPage']) ? intval($pagination['currentPage']) : 1;
                        $total_pages = intval($pagination['totalPages']);

                        echo paginate_links(array(
                            'base' => add_query_arg('paged', '%#%'),
                            'format' => '',
                            'prev_text' => __('&laquo;'),
                            'next_text' => __('&raquo;'),
                            'total' => $total_pages,
                            'current' => $current_page
                        ));
                        ?>
                    </div>
                </div>
            <?php endif; ?>
        <?php else: ?>
            <p><?php _e('No subscribers yet.', 'pushtoolkit-wp'); ?></p>
            <p><?php _e('Visitors to your site need to grant permission to receive push notifications. Once they do, they will appear here.', 'pushtoolkit-wp'); ?></p>
        <?php endif; ?>
    <?php endif; ?>
</div>
