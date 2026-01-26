/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Hostinger Node.js hosting
  // output: 'standalone',
  
  // For Hostinger shared hosting (static export)
  // output: 'export',
  
  images: {
    // Uncomment for static export
    // unoptimized: true,
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.printmedia.fi',
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
