/**
 * PushToolkit Admin JavaScript
 */

(function($) {
    'use strict';

    $(document).ready(function() {

        /**
         * Test Connection Button
         */
        $('#pushtoolkit-test-connection').on('click', function(e) {
            e.preventDefault();

            var $button = $(this);
            var $status = $('#pushtoolkit-connection-status');
            var originalText = $button.text();

            // Disable button and show loading
            $button.prop('disabled', true).text('Testing...');
            $status.removeClass('success error').text('');

            // Make AJAX request
            $.ajax({
                url: pushToolkitAdmin.ajaxUrl,
                type: 'POST',
                data: {
                    action: 'pushtoolkit_test_connection',
                    nonce: pushToolkitAdmin.nonce
                },
                success: function(response) {
                    if (response.success) {
                        $status.addClass('success').text('✓ ' + response.data.message);

                        if (response.data.user) {
                            console.log('Connected as:', response.data.user);
                        }
                    } else {
                        $status.addClass('error').text('✗ ' + response.data.message);
                    }
                },
                error: function(xhr, status, error) {
                    $status.addClass('error').text('✗ Connection failed: ' + error);
                },
                complete: function() {
                    $button.prop('disabled', false).text(originalText);
                }
            });
        });

        /**
         * Character Counter for Title and Message
         */
        function addCharacterCounter(selector, maxLength) {
            var $field = $(selector);
            if ($field.length === 0) return;

            var $counter = $('<span class="character-counter" style="float: right; color: #646970; font-size: 12px;"></span>');
            $field.after($counter);

            function updateCounter() {
                var length = $field.val().length;
                var remaining = maxLength - length;
                var color = remaining < 0 ? '#d63638' : (remaining < 20 ? '#dba617' : '#646970');

                $counter.css('color', color).text(length + '/' + maxLength + ' characters');
            }

            $field.on('input', updateCounter);
            updateCounter();
        }

        // Add character counters
        addCharacterCounter('#notification_title', 60);
        addCharacterCounter('#notification_message', 120);
        addCharacterCounter('#pushtoolkit_custom_title', 60);
        addCharacterCounter('#pushtoolkit_custom_message', 120);

        /**
         * Confirm before sending notification
         */
        $('input[name="pushtoolkit_send_notification"]').on('click', function(e) {
            var title = $('#notification_title').val();
            var message = $('#notification_message').val();

            if (!title || !message) {
                return true; // Let form validation handle it
            }

            var confirmMessage = 'You are about to send the following notification to all subscribers:\n\n';
            confirmMessage += 'Title: ' + title + '\n';
            confirmMessage += 'Message: ' + message + '\n\n';
            confirmMessage += 'Are you sure you want to send this notification?';

            if (!confirm(confirmMessage)) {
                e.preventDefault();
                return false;
            }
        });

        /**
         * Preview notification
         */
        function updateNotificationPreview() {
            var title = $('#notification_title').val() || 'Notification Title';
            var message = $('#notification_message').val() || 'Notification message will appear here.';
            var iconUrl = $('#icon_url').val() || 'https://via.placeholder.com/64';
            var imageUrl = $('#image_url').val();

            var $preview = $('#notification-preview');
            if ($preview.length === 0) {
                $preview = $('<div id="notification-preview" style="margin-top: 20px; padding: 15px; background: #f5f5f5; border-radius: 4px;"></div>');
                $preview.append('<h3 style="margin-top: 0;">Preview</h3>');
                $preview.append('<div class="notification-preview-content"></div>');
                $('.form-table').after($preview);
            }

            var html = '<div style="display: flex; align-items: start; gap: 10px;">';
            html += '<img src="' + iconUrl + '" style="width: 48px; height: 48px; border-radius: 4px;" onerror="this.src=\'https://via.placeholder.com/48\'">';
            html += '<div style="flex: 1;">';
            html += '<div style="font-weight: 600; margin-bottom: 5px;">' + escapeHtml(title) + '</div>';
            html += '<div style="color: #666; font-size: 14px;">' + escapeHtml(message) + '</div>';

            if (imageUrl) {
                html += '<img src="' + imageUrl + '" style="width: 100%; margin-top: 10px; border-radius: 4px;" onerror="this.style.display=\'none\'">';
            }

            html += '</div></div>';

            $preview.find('.notification-preview-content').html(html);
        }

        // Update preview on input
        $('#notification_title, #notification_message, #icon_url, #image_url').on('input', function() {
            updateNotificationPreview();
        });

        // Initial preview
        if ($('#notification_title').length > 0) {
            updateNotificationPreview();
        }

        /**
         * Helper function to escape HTML
         */
        function escapeHtml(text) {
            var map = {
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                '"': '&quot;',
                "'": '&#039;'
            };
            return text.replace(/[&<>"']/g, function(m) { return map[m]; });
        }

        /**
         * Auto-save settings notice dismiss
         */
        $('.notice.is-dismissible').on('click', '.notice-dismiss', function() {
            $(this).closest('.notice').fadeOut();
        });

        /**
         * Toggle custom notification fields
         */
        $('input[name="pushtoolkit_disable_push"]').on('change', function() {
            var $customFields = $('#pushtoolkit_custom_title, #pushtoolkit_custom_message').closest('p');

            if ($(this).is(':checked')) {
                $customFields.fadeOut();
            } else {
                $customFields.fadeIn();
            }
        }).trigger('change');

    });

})(jQuery);
