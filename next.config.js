/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Hostinger Node.js hosting
  output: 'standalone',
  
  images: {
    // Disable image optimization for Hostinger compatibility
    unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.printmedia.fi',
      },
      {
        protocol: 'https',
        hostname: 'peru-goose-902556.hostingersite.com',
      },
    ],
  },
  
  // Trailing slashes for better static hosting
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
}

module.exports = nextConfig
