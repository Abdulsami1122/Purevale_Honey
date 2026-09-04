// Low-level token helpers. Business logic (persisting / rotating refresh tokens)
// lives in services/token.service.js.
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const env = require('../config/env')

/** Short-lived stateless access token. */
function signAccessToken(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  })
}

function verifyAccessToken(token) {
  return jwt.verify(token, env.JWT_ACCESS_SECRET)
}

/** Opaque, high-entropy refresh token — never a JWT, so it can't be self-verified. */
function generateRefreshToken() {
  return crypto.randomBytes(48).toString('hex')
}

/** Only the hash is stored server-side. */
function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex')
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  generateRefreshToken,
  hashToken,
}
