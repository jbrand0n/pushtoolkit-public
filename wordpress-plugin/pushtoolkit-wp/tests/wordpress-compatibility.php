<?php
/**
 * WordPress Compatibility Test
 *
 * Tests plugin compatibility with WordPress versions
 * Run: php tests/wordpress-compatibility.php
 */

// Exit if accessed directly (WordPress context)
if (!defined('ABSPATH') && php_sapi_name() !== 'cli') {
    exit;
}

class PushToolkit_Compatibility_Test {

    private $plugin_dir;
    private $tests_passed = 0;
    private $tests_failed = 0;

    public function __construct() {
        $this->plugin_dir = dirname(__DIR__);
    }

    public function run() {
        echo "=== PushToolkit WordPress Compatibility Tests ===\n\n";

        $this->test_php_version();
        $this->test_plugin_headers();
        $this->test_wordpress_functions();
        $this->test_hooks_and_filters();
        $this->test_text_domain();
        $this->test_escape_functions();
        $this->test_sanitization();
        $this->test_database_operations();
        $this->test_ajax_handlers();
        $this->test_file_structure();

        $this->print_results();
    }

    /**
     * Test PHP version compatibility
     */
    private function test_php_version() {
        echo "Testing PHP version compatibility...\n";

        $required_version = '7.4';
        $current_version = PHP_VERSION;

        if (version_compare($current_version, $required_version, '>=')) {
            $this->pass("PHP version $current_version meets requirement (>= $required_version)");
        } else {
            $this->fail("PHP version $current_version does not meet requirement (>= $required_version)");
        }
    }

    /**
     * Test plugin headers
     */
    private function test_plugin_headers() {
        echo "Testing plugin headers...\n";

        $main_file = file_get_contents($this->plugin_dir . '/pushtoolkit-wp.php');

        $required_headers = array(
            'Plugin Name',
            'Description',
            'Version',
            'Author',
            'License',
            'Text Domain',
        );

        foreach ($required_headers as $header) {
            if (preg_match('/' . preg_quote($header, '/') . ':/i', $main_file)) {
                $this->pass("Header '$header' found");
            } else {
                $this->fail("Header '$header' missing");
            }
        }

        // Check version format
        if (preg_match('/Version:\s*(\d+\.\d+\.\d+)/', $main_file, $matches)) {
            $this->pass("Version format valid: " . $matches[1]);
        } else {
            $this->fail("Version format invalid");
        }
    }

    /**
     * Test WordPress function usage
     */
    private function test_wordpress_functions() {
        echo "Testing WordPress function usage...\n";

        $php_files = $this->get_php_files();

        // Check for deprecated functions
        $deprecated_functions = array(
            'mysql_query',
            'get_currentuserinfo',
            'wp_get_http',
            'user_pass_ok',
        );

        $found_deprecated = array();
        foreach ($php_files as $file) {
            // Skip test files
            if (strpos($file, '/tests/') !== false) {
                continue;
            }

            $content = file_get_contents($file);
            foreach ($deprecated_functions as $func) {
                // Check for actual function calls, not just mentions
                if (preg_match('/\b' . preg_quote($func, '/') . '\s*\(/', $content)) {
                    $found_deprecated[] = "$func in " . basename($file);
                }
            }
        }

        if (empty($found_deprecated)) {
            $this->pass("No deprecated WordPress functions found");
        } else {
            $this->fail("Deprecated functions: " . implode(', ', $found_deprecated));
        }
    }

    /**
     * Test hooks and filters
     */
    private function test_hooks_and_filters() {
        echo "Testing hooks and filters...\n";

        $admin_file = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        // Check for proper hook usage
        if (preg_match('/add_action\s*\(/', $admin_file)) {
            $this->pass("Action hooks properly used");
        } else {
            $this->fail("No action hooks found");
        }

        if (preg_match('/add_filter\s*\(/', $admin_file)) {
            $this->pass("Filters properly used");
        }

        // Check for hook priorities
        if (preg_match('/add_action\s*\([^,]+,[^,]+,\s*\d+/', $admin_file)) {
            $this->pass("Hook priorities specified where needed");
        }
    }

    /**
     * Test text domain
     */
    private function test_text_domain() {
        echo "Testing text domain...\n";

        $php_files = $this->get_php_files();
        $text_domain = 'pushtoolkit-wp';
        $wrong_domain = array();

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            // Find all __() and _e() calls
            if (preg_match_all('/_[_e]\s*\([^,]+,\s*[\'"]([^\'"]+)/', $content, $matches)) {
                foreach ($matches[1] as $domain) {
                    if ($domain !== $text_domain) {
                        $wrong_domain[] = "$domain in " . basename($file);
                    }
                }
            }
        }

        if (empty($wrong_domain)) {
            $this->pass("Text domain '$text_domain' used consistently");
        } else {
            $this->fail("Wrong text domains: " . implode(', ', array_unique($wrong_domain)));
        }
    }

    /**
     * Test escape functions
     */
    private function test_escape_functions() {
        echo "Testing escape functions...\n";

        $template_files = glob($this->plugin_dir . '/templates/*.php');
        $escape_used = false;

        foreach ($template_files as $file) {
            $content = file_get_contents($file);

            if (preg_match('/(esc_html|esc_attr|esc_url|esc_js|esc_textarea)/', $content)) {
                $escape_used = true;
                break;
            }
        }

        if ($escape_used) {
            $this->pass("Escape functions used in templates");
        } else {
            $this->fail("No escape functions found in templates");
        }
    }

    /**
     * Test sanitization
     */
    private function test_sanitization() {
        echo "Testing sanitization...\n";

        $admin_file = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        $sanitization_functions = array(
            'sanitize_text_field',
            'sanitize_textarea_field',
            'esc_url_raw',
            'intval',
        );

        $found = false;
        foreach ($sanitization_functions as $func) {
            if (strpos($admin_file, $func) !== false) {
                $found = true;
                break;
            }
        }

        if ($found) {
            $this->pass("Input sanitization implemented");
        } else {
            $this->fail("No sanitization functions found");
        }
    }

    /**
     * Test database operations
     */
    private function test_database_operations() {
        echo "Testing database operations...\n";

        $php_files = $this->get_php_files();

        // Check for direct database access
        $uses_options_api = false;
        $uses_meta_api = false;

        foreach ($php_files as $file) {
            $content = file_get_contents($file);

            if (preg_match('/(get_option|update_option|delete_option)/', $content)) {
                $uses_options_api = true;
            }

            if (preg_match('/(get_post_meta|update_post_meta|delete_post_meta)/', $content)) {
                $uses_meta_api = true;
            }
        }

        if ($uses_options_api) {
            $this->pass("Options API used for settings");
        }

        if ($uses_meta_api) {
            $this->pass("Meta API used for post data");
        }
    }

    /**
     * Test AJAX handlers
     */
    private function test_ajax_handlers() {
        echo "Testing AJAX handlers...\n";

        $admin_file = file_get_contents($this->plugin_dir . '/includes/class-admin.php');

        // Check for AJAX action registration
        if (preg_match('/wp_ajax_/', $admin_file)) {
            $this->pass("AJAX actions properly registered");
        }

        // Check for wp_send_json_* usage
        if (preg_match('/wp_send_json_(success|error)/', $admin_file)) {
            $this->pass("AJAX responses use wp_send_json_* functions");
        }
    }

    /**
     * Test file structure
     */
    private function test_file_structure() {
        echo "Testing file structure...\n";

        $required_dirs = array('includes', 'templates', 'assets');
        $required_files = array(
            'pushtoolkit-wp.php',
            'README.md',
            'LICENSE',
        );

        foreach ($required_dirs as $dir) {
            if (is_dir($this->plugin_dir . '/' . $dir)) {
                $this->pass("Directory '$dir' exists");
            } else {
                $this->fail("Directory '$dir' missing");
            }
        }

        foreach ($required_files as $file) {
            if (file_exists($this->plugin_dir . '/' . $file)) {
                $this->pass("File '$file' exists");
            } else {
                $this->fail("File '$file' missing");
            }
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
     * Mark test as passed
     */
    private function pass($message) {
        echo "  ✓ $message\n";
        $this->tests_passed++;
    }

    /**
     * Mark test as failed
     */
    private function fail($message) {
        echo "  ✗ $message\n";
        $this->tests_failed++;
    }

    /**
     * Print test results
     */
    private function print_results() {
        echo "\n=== TEST RESULTS ===\n";
        echo "Passed: " . $this->tests_passed . "\n";
        echo "Failed: " . $this->tests_failed . "\n";

        if ($this->tests_failed === 0) {
            echo "\n✅ All compatibility tests passed!\n";
        } else {
            echo "\n❌ Some tests failed. Please review the issues above.\n";
            exit(1);
        }
    }
}

// Run tests
$test = new PushToolkit_Compatibility_Test();
$test->run();
