// Entry point for Hostinger LiteSpeed Node.js hosting
// Loads the Next.js standard server

// Set environment
process.env.NODE_ENV = 'production'
process.env.PORT = process.env.PORT || '3000'
process.env.HOSTNAME = process.env.HOSTNAME || '0.0.0.0'

// Load Next.js server
const next = require('next')
const { createServer } = require('http')

const app = next({ dev: false, dir: './' })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  }).listen(process.env.PORT, process.env.HOSTNAME, () => {
    console.log(`> Ready on http://${process.env.HOSTNAME}:${process.env.PORT}`)
  })
})
