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
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN', // Allows iframing only on the same domain (prevents clickjacking)
          },
          {
            key: 'Permissions-Policy',
            // Blocks external trackers from accessing user's hardware
            value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            // Protects user privacy by not leaking the full URL to external sites
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Content-Security-Policy',
            // Prevents loading scripts/images from unauthorized domains (anti-tracking)
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://checkout.razorpay.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://checkout.razorpay.com https://js-fitness.onrender.com http://localhost:5000; frame-src 'self' https://api.razorpay.com;",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
