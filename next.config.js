/** @type {import('next').NextConfig} */
const nextConfig = {
  // Standalone output for VPS/Node.js deployment
  output: 'standalone',

  images: {
    // Disable image optimization for Hostinger
    unoptimized: true,
  },

  // Disable x-powered-by header
  poweredByHeader: false,

  // Compress responses
  compress: true,
}

module.exports = nextConfig
