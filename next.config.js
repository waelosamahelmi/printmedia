/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Hostinger Node.js hosting
  output: 'standalone',
  
  images: {
    // Disable image optimization completely for Hostinger
    unoptimized: true,
    loader: 'custom',
    loaderFile: './src/lib/imageLoader.js',
  },
  
  // Trailing slashes for better static hosting
  trailingSlash: true,
  
  // Disable x-powered-by header
  poweredByHeader: false,
  
  // Compress responses
  compress: true,
}

module.exports = nextConfig
