import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Standalone output improves Docker packaging by producing a minimal server bundle
  output: 'standalone',
  images: {
    // allow images served from same origin or CDN; add domains if using external images
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jsfitness.in',
      },
    ],
  },
};

export default nextConfig;
