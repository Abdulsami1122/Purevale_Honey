require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { ensureSeedAdmin } = require('./src/auth')
const { initDb, pool } = require('./src/db')
const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/products.routes')
const orderRoutes = require('./src/routes/orders.routes')
const statsRoutes = require('./src/routes/stats.routes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

// Initialize DB and ensure seed admin
initDb()
  .then(() => ensureSeedAdmin())
  .then(() => console.log('[DB] Connected to PostgreSQL (honey)'))
  .catch((err) => {
    console.error('[DB] Failed to connect or initialize PostgreSQL', err)
    process.exit(1)
  })

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'durrani-harvest-api' }))

app.use('/api/auth', authRoutes)
app.use('/api/customer', require('./src/routes/customer.routes'))
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/stats', statsRoutes)

// Legacy: wholesale export inquiry
app.post('/api/inquiry', (req, res) => {
  const { companyName, email, destination, product, message } = req.body || {}
  console.log('--- New Export Inquiry ---')
  console.log({ companyName, email, destination, product, message })
  res.status(200).json({ success: true, message: 'Inquiry received successfully.' })
})

// 404 + error handlers
app.use((_req, res) => res.status(404).json({ error: 'Not found' }))
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ error: 'Internal server error' })
})

app.listen(PORT, (err) => {
  if (err) {
    console.error(`[Server Error] Failed to start server: ${err.message}`)
    process.exit(1)
  }
  console.log(`Durrani Harvest API running on http://localhost:${PORT}`)
})
