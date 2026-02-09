// Entry point for Hostinger Node.js hosting
const path = require('path')
const fs = require('fs')

// Error handling
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err)
  console.error(err.stack)
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION:', err)
  console.error(err.stack)
})

// Set environment
process.env.NODE_ENV = process.env.NODE_ENV || 'production'
const PORT = process.env.PORT || 3000
const HOSTNAME = process.env.HOSTNAME || '0.0.0.0'

console.log('='.repeat(50))
console.log('Starting Next.js Server for Hostinger')
console.log('='.repeat(50))
console.log('NODE_ENV:', process.env.NODE_ENV)
console.log('PORT:', PORT)
console.log('HOSTNAME:', HOSTNAME)
console.log('CWD:', process.cwd())
console.log('='.repeat(50))

// Check if .next exists
const nextDir = path.join(process.cwd(), '.next')
if (!fs.existsSync(nextDir)) {
  console.error('ERROR: .next directory not found!')
  console.error('Please run: npm run build')
  process.exit(1)
}
console.log('✓ .next directory exists')

// Check if node_modules exists
const nodeModulesDir = path.join(process.cwd(), 'node_modules')
if (!fs.existsSync(nodeModulesDir)) {
  console.error('ERROR: node_modules directory not found!')
  console.error('Please run: npm install')
  process.exit(1)
}
console.log('✓ node_modules directory exists')

// Check environment variables
if (!process.env.DATABASE_URL) {
  console.warn('WARNING: DATABASE_URL not set!')
}
if (!process.env.NEXTAUTH_URL) {
  console.warn('WARNING: NEXTAUTH_URL not set!')
}
if (!process.env.NEXTAUTH_SECRET) {
  console.warn('WARNING: NEXTAUTH_SECRET not set!')
}

try {
  // Load Next.js
  console.log('Loading Next.js...')
  const next = require('next')
  const { createServer } = require('http')

  const app = next({
    dev: false,
    dir: './',
  })

  const handle = app.getRequestHandler()

  console.log('Preparing Next.js app...')
  app.prepare()
    .then(() => {
      console.log('✓ Next.js app prepared successfully')
      console.log('Creating HTTP server...')

      const server = createServer((req, res) => {
        console.log(`${new Date().toISOString()} ${req.method} ${req.url}`)
        handle(req, res)
      })

      server.listen(PORT, HOSTNAME, (err) => {
        if (err) {
          console.error('ERROR: Failed to start server:', err)
          process.exit(1)
        }
        console.log('='.repeat(50))
        console.log(`✓ Server running on http://${HOSTNAME}:${PORT}`)
        console.log('='.repeat(50))
      })

      server.on('error', (err) => {
        console.error('SERVER ERROR:', err)
        if (err.code === 'EADDRINUSE') {
          console.error(`Port ${PORT} is already in use`)
        }
        process.exit(1)
      })
    })
    .catch((err) => {
      console.error('ERROR: Failed to prepare Next.js app:', err)
      console.error(err.stack)
      process.exit(1)
    })
} catch (err) {
  console.error('FATAL ERROR:', err)
  console.error(err.stack)
  process.exit(1)
}
