#!/bin/bash

# Test script for the hardware/assets endpoint
# Usage: ./test-hardware-assets.sh [token] [test_mode]

if [ -z "$1" ]
then
  echo "No token provided. Please run: ./test-hardware-assets.sh [token] [test_mode]"
  exit 1
fi

TOKEN=$1
TEST_MODE=${2:-"false"}

# Build URL with test_mode if needed
if [ "$TEST_MODE" == "true" ]; then
  URL="http://localhost:3000/api/hardware/assets?test_mode=true"
else
  URL="http://localhost:3000/api/hardware/assets"
fi

echo "Testing GET with authorization header (Bearer token)..."
curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$URL" | jq .

echo "Testing GET with access_token header..."
curl -X GET \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  "$URL" | jq .

echo "Testing POST with authorization header..."
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "$URL" | jq .

echo "Testing POST with access_token header..."
curl -X POST \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  "$URL" | jq . 