#!/bin/bash

# Comparison Test Script for HelmetPro hardware API endpoints
# This script compares real behavior vs test mode behavior
# Usage: ./compare-test-modes.sh

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO API TEST MODE COMPARISON${NC}"
echo -e "${BLUE}=================================${NC}"
echo -e "${YELLOW}This script shows the difference between real behavior and test mode.${NC}"
echo ""

# Step 1: Login with real credentials
echo -e "${BLUE}STEP 1: Authenticating with real credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@helmetprosolutions.com", "password": "Qwer1122@"}' \
  http://localhost:3000/api/hardware/login)

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Login failed. Response:${NC}"
  echo $LOGIN_RESPONSE | jq .
  exit 1
else
  echo -e "${GREEN}Login successful! Token received.${NC}"
  TOKEN_SHORT="${TOKEN:0:20}...${TOKEN:(-20)}"
  echo "Token: $TOKEN_SHORT"
  echo ""
fi

# Function to show comparison between real and test mode
compare_endpoint() {
  local endpoint=$1
  local method=$2
  local request_body=$3
  local test_body=$4
  local description=$5

  echo -e "${BLUE}Testing $description${NC}"
  echo -e "${YELLOW}Endpoint: $method $endpoint${NC}"
  echo ""
  
  # Test with real behavior
  echo -e "${RED}REAL BEHAVIOR:${NC}"
  if [ "$method" == "GET" ]; then
    REAL_RESPONSE=$(curl -s -X $method \
      -H "access_token: $TOKEN" \
      $endpoint)
  else
    REAL_RESPONSE=$(curl -s -X $method \
      -H "access_token: $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$request_body" \
      $endpoint)
  fi
  echo "Response:"
  echo $REAL_RESPONSE | jq .
  echo ""

  # Test with test mode
  echo -e "${GREEN}TEST MODE BEHAVIOR:${NC}"
  if [ "$method" == "GET" ]; then
    TEST_RESPONSE=$(curl -s -X $method \
      -H "access_token: $TOKEN" \
      "$endpoint?test_mode=true")
  else
    TEST_RESPONSE=$(curl -s -X $method \
      -H "access_token: $TOKEN" \
      -H "Content-Type: application/json" \
      -d "$test_body" \
      $endpoint)
  fi
  echo "Response:"
  echo $TEST_RESPONSE | jq .
  echo ""
  echo -e "${BLUE}-------------------------------${NC}"
  echo ""
}

# Compare device settings endpoint
compare_endpoint \
  "http://localhost:3000/api/hardware/device-settings" \
  "GET" \
  "{}" \
  "{\"test_mode\": true}" \
  "Device Settings (GET)"

compare_endpoint \
  "http://localhost:3000/api/hardware/device-settings" \
  "POST" \
  "{}" \
  "{\"test_mode\": true}" \
  "Device Settings (POST)"

# Compare transaction endpoint
compare_endpoint \
  "http://localhost:3000/api/hardware/transaction" \
  "POST" \
  "{\"machineId\": \"TEST001\", \"amount\": 50}" \
  "{\"machineId\": \"TEST001\", \"amount\": 50, \"test_mode\": true}" \
  "Transaction endpoint"

# Compare status endpoint
compare_endpoint \
  "http://localhost:3000/api/hardware/status" \
  "POST" \
  "{\"code\": 100, \"description\": \"Machine operating normally\"}" \
  "{\"code\": 100, \"description\": \"Machine operating normally\", \"test_mode\": true}" \
  "Status endpoint"

# Compare feedback endpoint
compare_endpoint \
  "http://localhost:3000/api/hardware/feedback" \
  "POST" \
  "{\"machineId\": \"TEST001\", \"rating\": 5}" \
  "{\"machineId\": \"TEST001\", \"rating\": 5, \"test_mode\": true}" \
  "Feedback endpoint"

echo -e "${BLUE}COMPARISON TEST COMPLETED${NC}"
echo -e "${BLUE}==========================${NC}" 