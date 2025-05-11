#!/bin/bash

# Test script for uploading files to the hardware/assets endpoint
# Usage: ./test-hardware-asset-upload.sh [token] [file_path]

if [ -z "$1" ]
then
  echo "No token provided. Please run: ./test-hardware-asset-upload.sh [token] [file_path]"
  exit 1
fi

if [ -z "$2" ]
then
  echo "No file path provided. Please run: ./test-hardware-asset-upload.sh [token] [file_path]"
  exit 1
fi

TOKEN=$1
FILE_PATH=$2
FILE_NAME=$(basename "$FILE_PATH")

echo "Testing POST file upload with authorization header..."
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -F "file=@$FILE_PATH" \
  -F "name=$FILE_NAME" \
  -F "type=image" \
  "http://localhost:3000/api/hardware/assets" | jq .

echo "Testing POST file upload with access_token header..."
curl -X POST \
  -H "access_token: $TOKEN" \
  -F "file=@$FILE_PATH" \
  -F "name=$FILE_NAME" \
  -F "type=image" \
  "http://localhost:3000/api/hardware/assets" | jq . 