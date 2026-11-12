require('dotenv').config()
const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const { neon } = require('@neondatabase/serverless')

const env = require('./config/env')
const prisma = require('./config/db')
const routes = require('./routes')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')
const { apiLimiter } = require('./middlewares/rateLimiter')

const sql = env.DATABASE_URL ? neon(env.DATABASE_URL) : null

const app = express()

// Behiind a proxy (Heroku/Render/Nginx) so rate-limit + secure cookies see the real IP/proto.
app.set('trust proxy', 1)
app.disable('x-powered-by')

// --- Security headers ---
app.use(helmet())

// --- CORS with an explicit origin whitelist ---
app.use(
  cors({
    origin(origin, callback) {
      // allow same-origin / curl / server-to-server (no Origin header)
      if (!origin) return callback(null, true)
      const cleanOrigin = origin.replace(/\/+$/, '')
      if (
        env.CORS_ORIGIN_LIST.includes(cleanOrigin) ||
        /^https:\/\/purevale-honey(-[a-z0-9]+)?\.vercel\.app$/.test(cleanOrigin)
      ) {
        return callback(null, true)
      }
      return callback(new Error('Not allowed by CORS'))
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  }),
)

// --- Body + cookie parsing ---
// Media uploads (data-URI images / short videos) need a roomier limit than the
// rest of the API, so this route gets its own parser first.
app.use('/api/uploads', express.json({ limit: '25mb' }))
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))
app.use(cookieParser())

// --- Rate limiting across the API surface ---
app.use('/api', apiLimiter)

// --- Database test API (Neon serverless) ---
app.get('/api/db-test', async (req, res) => {
  try {
    if (!sql) {
      return res.status(500).json({
        success: false,
        message: 'DATABASE_URL is not configured in environment variables',
      })
    }
    const result = await sql`SELECT version()`

    res.status(200).json({
      success: true,
      message: 'Neon Database Connected Successfully!',
      database: result[0]?.version || result[0] || 'PostgreSQL',
    })
  } catch (error) {
    console.error('Database Error:', error)

    res.status(500).json({
      success: false,
      message: 'Database Connection Failed',
      error: error.message,
    })
  }
})

// --- Health check with DB status ---
app.get('/api/health', async (_req, res) => {
  let dbStatus = 'connected'
  let dbError = null

  try {
    await prisma.$queryRaw`SELECT 1`
  } catch (err) {
    dbStatus = 'disconnected'
    dbError = err.message
  }

  const ok = dbStatus === 'connected'
  res.status(ok ? 200 : 503).json({
    success: ok,
    message: ok ? 'healthy' : 'Database connection error',
    uptime: process.uptime(),
    database: {
      status: dbStatus,
      isLocalhost: (env.DATABASE_URL || '').includes('localhost'),
      hasNeon: (env.DATABASE_URL || '').includes('neon.tech'),
      ...(dbError ? { error: dbError } : {}),
    },
  })
})

// --- Routes ---
app.use('/api', routes)

// --- 404 + centralised error handler (must be last) ---
app.use(notFound)
app.use(errorHandler)

module.exports = app
