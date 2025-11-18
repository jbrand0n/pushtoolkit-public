<?php
/**
 * Security Audit Script for PushToolkit WordPress Plugin
 *
 * This script performs automated security checks on the plugin
 * Run: php tests/security-audit.php
 */

// Exit if accessed directly (WordPress context)
if (!defined('ABSPATH') && php_sapi_name() !== 'cli') {
    exit;
}

class PushToolkit_Security_Audit {

    private $plugin_dir;
    private $issues = array();
    private $warnings = array();
    private $passed = array();

    public function __construct() {
        $this->plugin_dir = dirname(__DIR__);
    }

    public function run() {
        echo "=== PushToolkit Security Audit ===\n\n";

        $this->check_direct_access_protection();
        $this->check_nonce_verification();
        $this->check_capability_checks();
        $this->check_output_escaping();
        $this->check_input_sanitization();
        $this->check_sql_injection();
        $this->check_file_inclusion();
        $this->check_csrf_protection();
        $this->check_authentication();
        $this->check_sensitive_data();

        $this->print_report();
    }

    /**
     * Check if files have direct access protection
     */
    private function check_direct_access_protection() {
        echo "Checking direct access protection...\n";

        $php_files = $this->get_php_files();
        $missing_protection = array();

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            // Check for ABSPATH check
            if (strpos($content, "defined('ABSPATH')") === false &&
                strpos($content, 'defined("ABSPATH")') === false &&
                !preg_match('/if\s*\(\s*!\s*defined\s*\(\s*[\'"]ABSPATH[\'"]\s*\)\s*\)/', $content)) {
                $missing_protection[] = str_replace($this->plugin_dir . '/', '', $file);
            }
        }

        if (empty($missing_protection)) {
            $this->passed[] = "✓ All PHP files have direct access protection";
        } else {
            $this->issues[] = "✗ Files missing ABSPATH check: " . implode(', ', $missing_protection);
        }
    }

    /**
     * Check for proper nonce verification
     */
    private function check_nonce_verification() {
        echo "Checking nonce verification...\n";

        $content = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        // Check AJAX handlers
        if (preg_match_all('/function\s+ajax_(\w+)\s*\(/', $content, $matches)) {
            foreach ($matches[1] as $ajax_function) {
                $function_content = $this->get_function_content($content, 'ajax_' . $ajax_function);

                if (strpos($function_content, 'check_ajax_referer') === false) {
                    $this->issues[] = "✗ AJAX function ajax_$ajax_function missing nonce verification";
                } else {
                    $this->passed[] = "✓ AJAX function ajax_$ajax_function has nonce verification";
                }
            }
        }

        // Check form handlers - look for nonce check before calling handler
        if (strpos($content, 'handle_send_notification') !== false) {
            // Check if nonce is verified before calling the handler
            $calling_function = $this->get_function_content($content, 'send_notification_page');
            if (strpos($calling_function, 'check_admin_referer') !== false ||
                strpos($calling_function, 'wp_verify_nonce') !== false) {
                $this->passed[] = "✓ Form handler has nonce verification (in caller)";
            } else {
                $form_content = $this->get_function_content($content, 'handle_send_notification');
                if (strpos($form_content, 'check_admin_referer') === false &&
                    strpos($form_content, 'wp_verify_nonce') === false) {
                    $this->issues[] = "✗ Form handler missing nonce verification";
                } else {
                    $this->passed[] = "✓ Form handler has nonce verification";
                }
            }
        }
    }

    /**
     * Check capability checks
     */
    private function check_capability_checks() {
        echo "Checking capability checks...\n";

        $admin_file = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        // Check AJAX handlers
        $ajax_handlers = array('ajax_test_connection', 'ajax_send_test_notification');
        foreach ($ajax_handlers as $handler) {
            if (strpos($admin_file, "function $handler") !== false) {
                $function_content = $this->get_function_content($admin_file, $handler);

                if (strpos($function_content, 'current_user_can') === false) {
                    $this->issues[] = "✗ $handler missing capability check";
                } else {
                    $this->passed[] = "✓ $handler has capability check";
                }
            }
        }
    }

    /**
     * Check output escaping
     */
    private function check_output_escaping() {
        echo "Checking output escaping...\n";

        $template_files = glob($this->plugin_dir . '/templates/*.php');
        $unescaped = array();

        foreach ($template_files as $file) {
            $content = file_get_contents($file);

            // Check for potentially unescaped output
            if (preg_match_all('/echo\s+\$([a-zA-Z_][a-zA-Z0-9_]*)/m', $content, $matches)) {
                foreach ($matches[0] as $match) {
                    if (strpos($match, 'esc_') === false) {
                        $unescaped[] = str_replace($this->plugin_dir . '/', '', $file) . ": " . $match;
                    }
                }
            }
        }

        if (empty($unescaped)) {
            $this->passed[] = "✓ All template outputs appear to be escaped";
        } else {
            $this->warnings[] = "⚠ Potentially unescaped output found: " . count($unescaped) . " instances";
        }
    }

    /**
     * Check input sanitization
     */
    private function check_input_sanitization() {
        echo "Checking input sanitization...\n";

        $admin_file = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        // Check sanitize_settings function
        if (strpos($admin_file, 'function sanitize_settings') !== false) {
            $sanitize_content = $this->get_function_content($admin_file, 'sanitize_settings');

            $has_sanitization = (
                strpos($sanitize_content, 'esc_url_raw') !== false ||
                strpos($sanitize_content, 'sanitize_text_field') !== false ||
                strpos($sanitize_content, 'sanitize_textarea_field') !== false
            );

            if ($has_sanitization) {
                $this->passed[] = "✓ Settings sanitization implemented";
            } else {
                $this->issues[] = "✗ Settings sanitization missing";
            }
        }

        // Check save_post_meta function
        if (strpos($admin_file, 'function save_post_meta') !== false) {
            $meta_content = $this->get_function_content($admin_file, 'save_post_meta');

            if (strpos($meta_content, 'sanitize_') !== false) {
                $this->passed[] = "✓ Post meta sanitization implemented";
            } else {
                $this->issues[] = "✗ Post meta sanitization missing";
            }
        }
    }

    /**
     * Check for SQL injection vulnerabilities
     */
    private function check_sql_injection() {
        echo "Checking SQL injection vulnerabilities...\n";

        $php_files = $this->get_php_files();
        $direct_queries = array();

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            // Check for direct wpdb queries without prepare
            if (preg_match_all('/\$wpdb->(query|get_\w+)\s*\(\s*["\']/', $content, $matches, PREG_OFFSET_CAPTURE)) {
                foreach ($matches[0] as $match) {
                    // Check if prepare() is used
                    $context = substr($content, max(0, $match[1] - 100), 200);
                    if (strpos($context, '->prepare(') === false) {
                        $direct_queries[] = str_replace($this->plugin_dir . '/', '', $file);
                    }
                }
            }
        }

        if (empty($direct_queries)) {
            $this->passed[] = "✓ No direct SQL queries found (using WordPress APIs)";
        } else {
            $this->warnings[] = "⚠ Direct SQL queries found in: " . implode(', ', array_unique($direct_queries));
        }
    }

    /**
     * Check file inclusion vulnerabilities
     */
    private function check_file_inclusion() {
        echo "Checking file inclusion vulnerabilities...\n";

        $php_files = $this->get_php_files();
        $unsafe_includes = array();

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            // Check for includes with variables
            if (preg_match_all('/(require|include)(_once)?\s*\(\s*\$/', $content, $matches)) {
                $unsafe_includes[] = str_replace($this->plugin_dir . '/', '', $file);
            }
        }

        if (empty($unsafe_includes)) {
            $this->passed[] = "✓ No unsafe file inclusions found";
        } else {
            $this->warnings[] = "⚠ Variable file inclusions in: " . implode(', ', array_unique($unsafe_includes));
        }
    }

    /**
     * Check CSRF protection
     */
    private function check_csrf_protection() {
        echo "Checking CSRF protection...\n";

        $templates = glob($this->plugin_dir . '/templates/*.php');
        $forms_without_nonce = array();

        foreach ($templates as $file) {
            $content = file_get_contents($file);

            // Check for forms
            if (preg_match('/<form/i', $content)) {
                if (strpos($content, 'wp_nonce_field') === false &&
                    strpos($content, 'settings_fields') === false) {
                    $forms_without_nonce[] = basename($file);
                }
            }
        }

        if (empty($forms_without_nonce)) {
            $this->passed[] = "✓ All forms have CSRF protection";
        } else {
            $this->issues[] = "✗ Forms without nonce: " . implode(', ', $forms_without_nonce);
        }
    }

    /**
     * Check authentication
     */
    private function check_authentication() {
        echo "Checking authentication...\n";

        $api_client = file_get_contents($this->plugin_dir . '/includes/class-api-client.php');

        // Check for JWT token storage
        if (strpos($api_client, 'jwt_token') !== false) {
            $this->passed[] = "✓ JWT token authentication implemented";
        }

        // Check for HTTPS validation in production
        if (preg_match('/https?:\/\//i', $api_client)) {
            $this->warnings[] = "⚠ Ensure HTTPS is enforced in production";
        }
    }

    /**
     * Check sensitive data handling
     */
    private function check_sensitive_data() {
        echo "Checking sensitive data handling...\n";

        $php_files = $this->get_php_files();
        $exposed_data = array();

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            // Check for error_log with sensitive data
            if (preg_match('/error_log.*(\$_(POST|GET|COOKIE)|password|token)/i', $content)) {
                $exposed_data[] = basename($file);
            }

            // Check for var_dump or print_r in production code
            if (preg_match('/(var_dump|print_r)\s*\(/', $content)) {
                $this->warnings[] = "⚠ Debug functions found in " . basename($file);
            }
        }

        if (empty($exposed_data)) {
            $this->passed[] = "✓ No sensitive data exposure in logs";
        }
    }

    /**
     * Helper: Get all PHP files
     */
    private function get_php_files() {
        $iterator = new RecursiveIteratorIterator(
            new RecursiveDirectoryIterator($this->plugin_dir, RecursiveDirectoryIterator::SKIP_DOTS)
        );

        $files = array();
        foreach ($iterator as $file) {
            if ($file->isFile() && $file->getExtension() === 'php') {
                $files[] = $file->getPathname();
            }
        }

        return $files;
    }

    /**
     * Helper: Get function content
     */
    private function get_function_content($content, $function_name) {
        $pattern = '/function\s+' . preg_quote($function_name, '/') . '\s*\([^)]*\)\s*\{/';

        if (preg_match($pattern, $content, $matches, PREG_OFFSET_CAPTURE)) {
            $start = $matches[0][1];
            $brace_count = 0;
            $in_function = false;

            for ($i = $start; $i < strlen($content); $i++) {
                if ($content[$i] === '{') {
                    $brace_count++;
                    $in_function = true;
                } elseif ($content[$i] === '}') {
                    $brace_count--;
                    if ($in_function && $brace_count === 0) {
                        return substr($content, $start, $i - $start + 1);
                    }
                }
            }
        }

        return '';
    }

    /**
     * Print audit report
     */
    private function print_report() {
        echo "\n=== AUDIT REPORT ===\n\n";

        echo "PASSED CHECKS (" . count($this->passed) . "):\n";
        foreach ($this->passed as $pass) {
            echo "  $pass\n";
        }

        if (!empty($this->warnings)) {
            echo "\nWARNINGS (" . count($this->warnings) . "):\n";
            foreach ($this->warnings as $warning) {
                echo "  $warning\n";
            }
        }

        if (!empty($this->issues)) {
            echo "\nISSUES FOUND (" . count($this->issues) . "):\n";
            foreach ($this->issues as $issue) {
                echo "  $issue\n";
            }
            echo "\n❌ Security audit FAILED. Please fix the issues above.\n";
            exit(1);
        } else {
            echo "\n✅ Security audit PASSED!\n";
            if (!empty($this->warnings)) {
                echo "⚠️  Please review warnings above.\n";
            }
        }
    }
}

// Run audit
$audit = new PushToolkit_Security_Audit();
$audit->run();
