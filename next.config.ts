import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Optimize development performance
  reactStrictMode: false, // Disable strict mode for faster dev rendering

  // Image optimization
  images: {
    unoptimized: true, // Faster image serving in dev
  },

  // Experimental optimizations for dev mode
  experimental: {
    // Optimize package imports
    optimizePackageImports: ['@dnd-kit/core', '@dnd-kit/sortable', 'lucide-react'],
  },

  // Production optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
};

// Bundle analyzer (run with ANALYZE=true npm run build)
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

export default withBundleAnalyzer(nextConfig);
