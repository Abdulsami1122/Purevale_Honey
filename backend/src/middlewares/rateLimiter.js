const rateLimit = require('express-rate-limit')
const env = require('../config/env')

const json = (message) => ({ success: false, message })

// Broad limiter applied to the whole /api surface.
const apiLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many requests — please slow down and try again later'),
})

// Tight limiter for credential endpoints (login / register / refresh).
// Relaxed outside production so local testing does not lock itself out.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: env.isProd ? 20 : 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: json('Too many authentication attempts — try again in a few minutes'),
})

module.exports = { apiLimiter, authLimiter }
