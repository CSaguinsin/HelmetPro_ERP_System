#!/bin/bash

# Clean test script for HelmetPro API endpoints with production data only
# Usage: ./clean-prod-test.sh

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO API PRODUCTION TEST${NC}"
echo -e "${BLUE}=============================${NC}"

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

# Step 2: Test device-details endpoints
echo -e "${BLUE}STEP 2: Testing device-details endpoints${NC}"
echo "GET /api/hardware/device-details:"
DEVICE_DETAILS_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $DEVICE_DETAILS_RESPONSE | jq .
echo ""

echo "POST /api/hardware/device-details:"
POST_DEVICE_DETAILS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/device-details)

echo "Response:"
echo $POST_DEVICE_DETAILS_RESPONSE | jq .
echo ""

# Step 3: Test assets endpoints
echo -e "${BLUE}STEP 3: Testing assets endpoints${NC}"
echo "GET /api/hardware/assets:"
ASSETS_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/assets)

echo "Response:"
echo $ASSETS_RESPONSE | jq .
echo ""

echo "POST /api/hardware/assets:"
POST_ASSETS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/assets)

echo "Response:"
echo $POST_ASSETS_RESPONSE | jq .
echo ""

# Step 4: Test device settings endpoints
echo -e "${BLUE}STEP 4: Testing device settings endpoints${NC}"
echo "GET /api/hardware/device-settings:"
DEVICE_SETTINGS_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  "http://localhost:3000/api/hardware/device-settings?test_mode=true")

echo "Response:"
echo $DEVICE_SETTINGS_RESPONSE | jq .
echo ""

echo "POST /api/hardware/device-settings:"
POST_DEVICE_SETTINGS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"test_mode": true}' \
  http://localhost:3000/api/hardware/device-settings)

echo "Response:"
echo $POST_DEVICE_SETTINGS_RESPONSE | jq .
echo ""

# Step 5: Test transaction endpoint
echo -e "${BLUE}STEP 5: Testing transaction endpoint${NC}"
echo "POST /api/hardware/transaction:"
TRANSACTION_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "amount": 50, "test_mode": true}' \
  http://localhost:3000/api/hardware/transaction)

echo "Response:"
echo $TRANSACTION_RESPONSE | jq .
echo ""

# Step 6: Test status endpoint
echo -e "${BLUE}STEP 6: Testing status endpoint${NC}"
echo "POST /api/hardware/status:"
STATUS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": 100, "description": "Machine operating normally", "test_mode": true}' \
  http://localhost:3000/api/hardware/status)

echo "Response:"
echo $STATUS_RESPONSE | jq .
echo ""

# Step 7: Test feedback endpoint
echo -e "${BLUE}STEP 7: Testing feedback endpoint${NC}"
echo "POST /api/hardware/feedback:"
FEEDBACK_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "rating": 5, "test_mode": true}' \
  http://localhost:3000/api/hardware/feedback)

echo "Response:"
echo $FEEDBACK_RESPONSE | jq .
echo ""

echo -e "${BLUE}API TEST COMPLETED${NC}"
echo -e "${BLUE}=================${NC}" 