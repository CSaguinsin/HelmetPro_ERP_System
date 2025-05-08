/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
  // Updated to use the correct property name
  experimental: {
    // Empty for now since we're not using external packages
  },
  // Use this instead of the deprecated serverComponentsExternalPackages
  serverExternalPackages: []
};

module.exports = nextConfig; 