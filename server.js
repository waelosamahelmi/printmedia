const { createServer } = require('http')
const next = require('next')

const dev = false
const hostname = '0.0.0.0'
const port = parseInt(process.env.PORT, 10) || 3000

const app = next({ dev, hostname, port })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    handle(req, res)
  })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`)
    })
    .on('error', (err) => {
      console.error('Server error:', err)
      process.exit(1)
    })
}).catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
