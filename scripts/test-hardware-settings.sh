#!/bin/bash

# Test Script for HelmetPro hardware settings API endpoints
# Usage: ./test-hardware-settings.sh

echo "HELMETPRO SETTINGS API TEST"
echo "============================"

# Step 1: Login with real credentials
echo "STEP 1: Authenticating with real credentials"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@helmetprosolutions.com", "password": "Qwer1122@"}' \
  http://localhost:3000/api/hardware/login)

# Extract token from response
TOKEN=$(echo $LOGIN_RESPONSE | jq -r '.access_token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "Login failed. Response:"
  echo $LOGIN_RESPONSE | jq .
  exit 1
else
  echo "Login successful! Token received."
  TOKEN_SHORT="${TOKEN:0:20}...${TOKEN:(-20)}"
  echo "Token: $TOKEN_SHORT"
  echo ""
fi

# Step 2: Test device settings endpoint
echo "STEP 2: Testing device settings endpoints"
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

# Step 3: Test transaction endpoint
echo "STEP 3: Testing transaction endpoint"
echo "POST /api/hardware/transaction:"
TRANSACTION_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "amount": 50, "test_mode": true}' \
  http://localhost:3000/api/hardware/transaction)

echo "Response:"
echo $TRANSACTION_RESPONSE | jq .
echo ""

# Step 4: Test status endpoint
echo "STEP 4: Testing status endpoint"
echo "POST /api/hardware/status:"
STATUS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": 100, "description": "Machine operating normally", "test_mode": true}' \
  http://localhost:3000/api/hardware/status)

echo "Response:"
echo $STATUS_RESPONSE | jq .
echo ""

# Step 5: Test feedback endpoint
echo "STEP 5: Testing feedback endpoint"
echo "POST /api/hardware/feedback:"
FEEDBACK_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "rating": 5, "test_mode": true}' \
  http://localhost:3000/api/hardware/feedback)

echo "Response:"
echo $FEEDBACK_RESPONSE | jq .
echo ""

echo "SETTINGS API TEST COMPLETED"
echo "===========================" 