const crypto = require('crypto')
const bcrypt = require('bcryptjs')
const prisma = require('../config/db')
const ApiError = require('../utils/ApiError')
const { hashToken } = require('../utils/token')

const SALT_ROUNDS = 12
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000 // 1 hour

// A valid hash that no password matches — compared against when the email is
// unknown so login timing does not reveal whether an account exists.
const DUMMY_HASH = bcrypt.hashSync('unused-timing-equaliser', SALT_ROUNDS)

const PUBLIC_USER_FIELDS = {
  id: true,
  name: true,
  email: true,
  role: true,
  createdAt: true,
}

async function registerUser({ name, email, password }) {
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) throw ApiError.conflict('An account with this email already exists')

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)

  return prisma.user.create({
    data: { name, email, passwordHash },
    select: PUBLIC_USER_FIELDS,
  })
}

async function verifyCredentials({ email, password }) {
  const user = await prisma.user.findUnique({ where: { email } })
  // Always run a compare to keep timing roughly constant even for unknown emails.
  const ok = await bcrypt.compare(password, user?.passwordHash || DUMMY_HASH)

  if (!user || !ok) throw ApiError.unauthorized('Invalid email or password')

  return { id: user.id, name: user.name, email: user.email, role: user.role, createdAt: user.createdAt }
}

async function changePassword(userId, { currentPassword, newPassword }) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw ApiError.unauthorized('Account no longer exists')

  const ok = await bcrypt.compare(currentPassword, user.passwordHash)
  if (!ok) throw ApiError.badRequest('Current password is incorrect')

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS)
  await prisma.user.update({ where: { id: userId }, data: { passwordHash } })
}

/**
 * Issue a single-use password-reset token. Only customers may self-reset —
 * for an unknown email or an admin account this returns null and the caller
 * still responds with the same generic message (no account enumeration).
 */
async function createPasswordReset({ email }) {
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user || user.role !== 'customer') return null

  const rawToken = crypto.randomBytes(32).toString('hex')
  await prisma.passwordResetToken.create({
    data: {
      tokenHash: hashToken(rawToken),
      userId: user.id,
      expiresAt: new Date(Date.now() + RESET_TOKEN_TTL_MS),
    },
  })
  return { user, rawToken }
}

async function resetPasswordWithToken({ token, password }) {
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash: hashToken(token) },
    include: { user: true },
  })
  if (!record || record.usedAt || record.expiresAt < new Date()) {
    throw ApiError.badRequest('This reset link is invalid or has expired')
  }
  if (record.user.role !== 'customer') {
    throw ApiError.forbidden('This account cannot be reset here')
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS)
  await prisma.$transaction([
    prisma.user.update({ where: { id: record.userId }, data: { passwordHash } }),
    // burn this token and any other outstanding ones for the user
    prisma.passwordResetToken.updateMany({
      where: { userId: record.userId, usedAt: null },
      data: { usedAt: new Date() },
    }),
    // force re-login everywhere
    prisma.refreshToken.updateMany({
      where: { userId: record.userId, revokedAt: null },
      data: { revokedAt: new Date() },
    }),
  ])

  return record.user
}

module.exports = {
  registerUser,
  verifyCredentials,
  changePassword,
  createPasswordReset,
  resetPasswordWithToken,
  SALT_ROUNDS,
  PUBLIC_USER_FIELDS,
}
