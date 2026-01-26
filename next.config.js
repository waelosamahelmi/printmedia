/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Disable image optimization completely for Hostinger
    unoptimized: true,
  },
  
  // Trailing slashes for better static hosting
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
}

module.exports = nextConfig
