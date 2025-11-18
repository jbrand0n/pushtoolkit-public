#!/bin/bash

##
# PushToolkit WordPress Plugin - Test Runner
#
# Runs all plugin tests including security audit and compatibility checks
##

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PLUGIN_DIR="$(dirname "$SCRIPT_DIR")"

echo "========================================"
echo "  PushToolkit Plugin Test Suite"
echo "========================================"
echo ""

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Track test results
TESTS_PASSED=0
TESTS_FAILED=0

# Function to run a test
run_test() {
    local test_name=$1
    local test_script=$2

    echo ""
    echo "Running: $test_name"
    echo "----------------------------------------"

    if php "$SCRIPT_DIR/$test_script"; then
        echo -e "${GREEN}✓ $test_name PASSED${NC}"
        ((TESTS_PASSED++))
    else
        echo -e "${RED}✗ $test_name FAILED${NC}"
        ((TESTS_FAILED++))
        return 1
    fi
}

# Change to tests directory
cd "$SCRIPT_DIR"

# Run all tests
run_test "Security Audit" "security-audit.php" || true
run_test "WordPress Compatibility" "wordpress-compatibility.php" || true

# Print summary
echo ""
echo "========================================"
echo "  TEST SUMMARY"
echo "========================================"
echo "Tests Passed: $TESTS_PASSED"
echo "Tests Failed: $TESTS_FAILED"
echo ""

if [ $TESTS_FAILED -eq 0 ]; then
    echo -e "${GREEN}✅ ALL TESTS PASSED!${NC}"
    exit 0
else
    echo -e "${RED}❌ SOME TESTS FAILED${NC}"
    echo "Please review the output above and fix any issues."
    exit 1
fi
