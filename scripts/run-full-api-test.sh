#!/bin/bash

# Comprehensive test script for HelmetPro hardware API endpoints
# Usage: ./run-full-api-test.sh

# Define colors for better output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========== HELMETPRO API TEST SUITE ==========${NC}"
echo -e "${BLUE}Starting comprehensive API test flow...${NC}"
echo ""

# Step 1: Login and get token
echo -e "${YELLOW}STEP 1: AUTHENTICATION${NC}"
echo "Logging in with admin credentials..."

LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@helmetprosolutions.com", "password": "Qwer1122@"}' \
  http://localhost:3000/api/hardware/login)

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ Login failed. Response:${NC}"
  echo $LOGIN_RESPONSE | jq .
  exit 1
else
  echo -e "${GREEN}✅ Login successful! Token received.${NC}"
  # Show shortened token for verification
  TOKEN_SHORT="${TOKEN:0:20}...${TOKEN:(-20)}"
  echo "Token: $TOKEN_SHORT"
  echo ""
fi

# Step 2: Test device-details endpoint
echo -e "${YELLOW}STEP 2: DEVICE DETAILS${NC}"
echo "Testing GET /api/hardware/device-details..."

DEVICE_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $DEVICE_RESPONSE | jq .
echo ""

# Step 3: Test device-details with test_mode
echo "Testing GET /api/hardware/device-details with test_mode=true..."

TEST_DEVICE_RESPONSE=$(curl -s -X GET \
  http://localhost:3000/api/hardware/device-details?test_mode=true)

echo "Response:"
echo $TEST_DEVICE_RESPONSE | jq .
echo ""

# Step 4: Test POST on device-details
echo "Testing POST /api/hardware/device-details..."

POST_DEVICE_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $POST_DEVICE_RESPONSE | jq .
echo ""

# Step 5: Test assets endpoint
echo -e "${YELLOW}STEP 3: ASSETS${NC}"
echo "Testing GET /api/hardware/assets..."

ASSETS_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/assets)

echo "Response:"
echo $ASSETS_RESPONSE | jq .
echo ""

# Step 6: Test assets with test_mode
echo "Testing GET /api/hardware/assets with test_mode=true..."

TEST_ASSETS_RESPONSE=$(curl -s -X GET \
  http://localhost:3000/api/hardware/assets?test_mode=true)

echo "Response:"
echo $TEST_ASSETS_RESPONSE | jq .
echo ""

# Step 7: Test POST (list mode) on assets
echo "Testing POST /api/hardware/assets (list mode)..."

POST_ASSETS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/assets)

echo "Response:"
echo $POST_ASSETS_RESPONSE | jq .
echo ""

# Step 8: Create a test file for upload
echo "Creating test image file..."
echo "HelmetPro Test Image" > test-image.jpg

# Step 9: Test file upload to assets
echo "Testing POST /api/hardware/assets (file upload) with test_mode=true..."

UPLOAD_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -F "file=@test-image.jpg" \
  -F "name=Test Image" \
  -F "type=image" \
  "http://localhost:3000/api/hardware/assets?test_mode=true")

echo "Response:"
echo $UPLOAD_RESPONSE | jq .
echo ""

# Clean up
rm test-image.jpg

echo -e "${GREEN}========== TEST COMPLETED ==========${NC}"
echo "All API endpoints have been tested." 