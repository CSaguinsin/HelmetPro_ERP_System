#!/bin/bash

# Install dependencies
npm install --legacy-peer-deps

# Build the Next.js application
npx next build

# Ensure .next directory exists
mkdir -p .next

# Create an empty export-detail.json file if it doesn't exist
# This prevents the ENOENT error during deployment
if [ ! -f ".next/export-detail.json" ]; then
  echo '{}' > .next/export-detail.json
  echo "Created empty export-detail.json file"
fi

echo "Build completed!" 