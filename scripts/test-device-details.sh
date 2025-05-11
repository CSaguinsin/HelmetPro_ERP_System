#!/bin/bash

# Test script for the device-details endpoint
# Usage: ./test-device-details.sh [token] [device_id]

if [ -z "$1" ]
then
  echo "No token provided. Please run: ./test-device-details.sh [token] [device_id]"
  exit 1
fi

TOKEN=$1
DEVICE_ID=${2:-""}

echo "Testing with authorization header (Bearer token)..."
curl -X GET \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:3000/api/hardware/device-details" | jq .

echo "Testing with access_token header..."
curl -X GET \
  -H "access_token: $TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:3000/api/hardware/device-details" | jq .

echo "Testing with user_client_id header..."
curl -X GET \
  -H "access_token: $TOKEN" \
  -H "x-user-client-id: client1" \
  -H "Content-Type: application/json" \
  "http://localhost:3000/api/hardware/device-details" | jq .

# If a device ID was provided, test with that specific device
if [ ! -z "$DEVICE_ID" ]
then
  echo "Testing with specific device ID ($DEVICE_ID)..."
  curl -X GET \
    -H "access_token: $TOKEN" \
    -H "Content-Type: application/json" \
    "http://localhost:3000/api/hardware/device-details?device_id=$DEVICE_ID" | jq .
else
  echo "Testing with default device_id parameter..."
  curl -X GET \
    -H "access_token: $TOKEN" \
    -H "Content-Type: application/json" \
    "http://localhost:3000/api/hardware/device-details?device_id=1" | jq .
fi

echo "Testing POST method..."
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  "http://localhost:3000/api/hardware/device-details" | jq . 