// Authentication guard. Reads the access token from the httpOnly cookie
// (falls back to an Authorization: Bearer header for non-browser clients),
// verifies it, and attaches the fresh user record to req.user.
const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const prisma = require('../config/db')
const { verifyAccessToken } = require('../utils/token')

const isAuthenticated = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization
  const token =
    req.cookies?.accessToken ||
    (header && header.startsWith('Bearer ') ? header.slice(7) : null)

  if (!token) throw ApiError.unauthorized('Authentication required')

  let payload
  try {
    payload = verifyAccessToken(token)
  } catch {
    throw ApiError.unauthorized('Session is invalid or has expired')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    select: { id: true, name: true, email: true, role: true },
  })
  if (!user) throw ApiError.unauthorized('Account no longer exists')

  req.user = user
  next()
})

module.exports = { isAuthenticated }
