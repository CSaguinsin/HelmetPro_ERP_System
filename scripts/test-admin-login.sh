#!/bin/bash

# Simple login test for Admin credentials
# This script tests just the login for Admin account

# Colors for better readability
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}HELMETPRO ADMIN LOGIN TEST${NC}"
echo -e "${BLUE}=========================${NC}"
echo ""

# Login with Admin credentials
echo -e "${BLUE}Attempting login with Admin credentials${NC}"
LOGIN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@helmetprosolutions.com", "password": "Qwer1122@"}' \
  http://localhost:3000/api/hardware/login)

echo "Raw response:"
echo "$LOGIN_RESPONSE"
echo ""

echo "Formatted response (if JSON):"
if echo "$LOGIN_RESPONSE" | jq . > /dev/null 2>&1; then
  echo "$LOGIN_RESPONSE" | jq .
else
  echo "Response is not valid JSON"
fi
echo ""

# Try to extract token
TOKEN=$(echo "$LOGIN_RESPONSE" | jq -r '.access_token' 2>/dev/null)

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo -e "${RED}Login failed. No valid token in response.${NC}"
else
  echo -e "${GREEN}Login successful! Token received.${NC}"
  TOKEN_SHORT="${TOKEN:0:20}...${TOKEN:(-20)}"
  echo "Token: $TOKEN_SHORT"
fi 