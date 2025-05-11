#!/bin/bash

# Test Script for HelmetPro device-details endpoints with test_mode
# Usage: ./compare-device-details.sh

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO DEVICE DETAILS TEST${NC}"
echo -e "${BLUE}===========================${NC}"
echo -e "${YELLOW}This script tests the device-details endpoint with and without test_mode.${NC}"
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

# Step 2: Test device-details with real behavior
echo -e "${BLUE}STEP 2: Testing device-details with REAL behavior${NC}"

echo -e "${RED}GET /api/hardware/device-details (REAL):${NC}"
REAL_GET_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $REAL_GET_RESPONSE | jq .
echo ""

echo -e "${RED}POST /api/hardware/device-details (REAL):${NC}"
REAL_POST_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $REAL_POST_RESPONSE | jq .
echo ""

# Step 3: Test device-details with test_mode
echo -e "${BLUE}STEP 3: Testing device-details with TEST_MODE${NC}"

echo -e "${GREEN}GET /api/hardware/device-details (TEST_MODE):${NC}"
TEST_GET_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  "http://localhost:3000/api/hardware/device-details?test_mode=true")

echo "Response:"
echo $TEST_GET_RESPONSE | jq .
echo ""

echo -e "${GREEN}POST /api/hardware/device-details (TEST_MODE):${NC}"
TEST_POST_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test_mode": true}' \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $TEST_POST_RESPONSE | jq .
echo ""

echo -e "${BLUE}DEVICE DETAILS TEST COMPLETED${NC}"
echo -e "${BLUE}=============================${NC}" 