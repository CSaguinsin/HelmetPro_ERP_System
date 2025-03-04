import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

export default nextConfig;