#!/bin/bash

# Real Production Test Script for HelmetPro hardware API endpoints
# This script tests exactly how the API behaves with Gerald's real credentials, NO test mode
# Usage: ./test-gerald-real-data.sh

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO GERALD USER TEST${NC}"
echo -e "${BLUE}==========================${NC}"
echo -e "${RED}Testing with GERALD's credentials and NO test mode!${NC}"
echo -e "${RED}This will show actual behavior with this real user data.${NC}"
echo ""

# Step 1: Login with Gerald's credentials
echo -e "${BLUE}STEP 1: Authenticating with Gerald's credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "diazgerald13@gmail.com", "password": "cells@2021"}' \
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

# Step 2: Test device-details endpoints (REAL database)
echo -e "${BLUE}STEP 2: Testing device-details endpoints (REAL data)${NC}"
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

# Step 3: Test device settings endpoints (REAL database)
echo -e "${BLUE}STEP 3: Testing device settings endpoints (REAL data)${NC}"
echo "GET /api/hardware/device-settings:"
DEVICE_SETTINGS_RESPONSE=$(curl -s -X GET \
  -H "access_token: $TOKEN" \
  http://localhost:3000/api/hardware/device-settings)

echo "Response:"
echo $DEVICE_SETTINGS_RESPONSE | jq .
echo ""

echo "POST /api/hardware/device-settings:"
POST_DEVICE_SETTINGS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  http://localhost:3000/api/hardware/device-settings)

echo "Response:"
echo $POST_DEVICE_SETTINGS_RESPONSE | jq .
echo ""

# Step 4: Test transaction endpoint (REAL database)
echo -e "${BLUE}STEP 4: Testing transaction endpoint (REAL data)${NC}"
echo "POST /api/hardware/transaction:"
TRANSACTION_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "amount": 50}' \
  http://localhost:3000/api/hardware/transaction)

echo "Response:"
echo $TRANSACTION_RESPONSE | jq .
echo ""

# Step 5: Test status endpoint (REAL database)
echo -e "${BLUE}STEP 5: Testing status endpoint (REAL data)${NC}"
echo "POST /api/hardware/status:"
STATUS_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"code": 100, "description": "Machine operating normally"}' \
  http://localhost:3000/api/hardware/status)

echo "Response:"
echo $STATUS_RESPONSE | jq .
echo ""

# Step 6: Test feedback endpoint (REAL database)
echo -e "${BLUE}STEP 6: Testing feedback endpoint (REAL data)${NC}"
echo "POST /api/hardware/feedback:"
FEEDBACK_RESPONSE=$(curl -s -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"machineId": "TEST001", "rating": 5}' \
  http://localhost:3000/api/hardware/feedback)

echo "Response:"
echo $FEEDBACK_RESPONSE | jq .
echo ""

echo -e "${BLUE}GERALD USER TEST COMPLETED${NC}"
echo -e "${BLUE}===========================${NC}" 