require('dotenv').config()

const express = require('express')
const cors = require('cors')

const { ensureSeedAdmin } = require('./src/auth')
const { initDb, pool } = require('./src/db')
const authRoutes = require('./src/routes/auth.routes')
const productRoutes = require('./src/routes/products.routes')
const orderRoutes = require('./src/routes/orders.routes')
const statsRoutes = require('./src/routes/stats.routes')
const submissionsRoutes = require('./src/routes/submissions.routes')

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json({ limit: '5mb' }))

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
app.use('/api/submissions', submissionsRoutes)

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
