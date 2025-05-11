#!/bin/bash

# Master test script for HelmetPro API endpoints
# Usage: ./run-all-tests.sh

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO API COMPLETE TEST SUITE${NC}"
echo -e "${BLUE}===============================${NC}"
echo -e "${YELLOW}This script will run all tests in sequence.${NC}"
echo ""

# Function to run a test and display status
run_test() {
  local test_script=$1
  local test_name=$2
  
  echo -e "${BLUE}Running test: ${test_name}${NC}"
  echo -e "${YELLOW}Script: ${test_script}${NC}"
  echo ""
  
  # Run the test
  $test_script
  
  local status=$?
  if [ $status -eq 0 ]; then
    echo -e "${GREEN}Test completed successfully.${NC}"
  else
    echo -e "${RED}Test failed with status code: ${status}${NC}"
  fi
  
  echo ""
  echo -e "${BLUE}-------------------------------${NC}"
  echo ""
  
  return $status
}

# Make sure all scripts are executable
chmod +x scripts/*.sh

# Run each test script
run_test "scripts/clean-prod-test.sh" "Production API Test"
run_test "scripts/test-hardware-settings.sh" "Hardware Settings Test"
run_test "scripts/test-hardware-assets.sh" "Hardware Assets Test"
run_test "scripts/test-hardware-asset-upload.sh" "Asset Upload Test"

echo -e "${BLUE}ALL TESTS COMPLETED${NC}"
echo -e "${BLUE}===================${NC}" 