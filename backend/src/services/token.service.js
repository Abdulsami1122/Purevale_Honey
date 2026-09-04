// Refresh-token lifecycle: issue, rotate (one-time use), revoke.
// Access tokens are stateless; refresh tokens are stored hashed so they can be
// invalidated on logout or compromise.
const prisma = require('../config/db')
const env = require('../config/env')
const {
  signAccessToken,
  generateRefreshToken,
  hashToken,
} = require('../utils/token')

const REFRESH_TTL_MS = env.REFRESH_COOKIE_MAX_AGE_MS

async function issueTokenPair(user) {
  const accessToken = signAccessToken({ sub: user.id, role: user.role })
  const refreshToken = generateRefreshToken()

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
    },
  })

  return { accessToken, refreshToken }
}

/**
 * Validate an incoming refresh token, revoke it, and mint a fresh pair.
 * Returns null when the token is unknown / expired / already used.
 */
async function rotateRefreshToken(rawToken) {
  if (!rawToken) return null

  const record = await prisma.refreshToken.findUnique({
    where: { tokenHash: hashToken(rawToken) },
    include: { user: true },
  })

  if (!record || record.revokedAt || record.expiresAt < new Date()) {
    return null
  }

  await prisma.refreshToken.update({
    where: { id: record.id },
    data: { revokedAt: new Date() },
  })

  const pair = await issueTokenPair(record.user)
  return { ...pair, user: record.user }
}

async function revokeRefreshToken(rawToken) {
  if (!rawToken) return
  await prisma.refreshToken.updateMany({
    where: { tokenHash: hashToken(rawToken), revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

async function revokeAllForUser(userId) {
  await prisma.refreshToken.updateMany({
    where: { userId, revokedAt: null },
    data: { revokedAt: new Date() },
  })
}

module.exports = {
  issueTokenPair,
  rotateRefreshToken,
  revokeRefreshToken,
  revokeAllForUser,
}
