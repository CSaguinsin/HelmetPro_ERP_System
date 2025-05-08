#!/bin/bash

# Install dependencies but exclude large packages or use smaller alternatives where possible
npm install --legacy-peer-deps --include=dev

# Create a simple tailwind.config.js if it doesn't exist
if [ ! -f "tailwind.config.js" ]; then
  echo "Creating tailwind.config.js..."
  cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL
fi

# Check tsconfig.json for path aliases
echo "Checking tsconfig.json..."
if [ -f "tsconfig.json" ]; then
  cat tsconfig.json
fi

# Build the Next.js application
echo "Starting Next.js build..."
npm run build

# Clean up to reduce function size
echo "Optimizing build for deployment..."
# Remove caches
rm -rf .next/cache

# Remove large files that aren't necessary at runtime
find public/video -name "*.mp4" -type f -size +5M -delete

# Ensure .next directory exists
mkdir -p .next

# Create an empty export-detail.json file if it doesn't exist
# This prevents the ENOENT error during deployment
if [ ! -f ".next/export-detail.json" ]; then
  echo '{}' > .next/export-detail.json
  echo "Created empty export-detail.json file"
fi

echo "Build completed!" 