const bcrypt = require('bcryptjs')
const prisma = require('../config/db')
const ApiError = require('../utils/ApiError')

const SALT_ROUNDS = 12

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

module.exports = {
  registerUser,
  verifyCredentials,
  changePassword,
  SALT_ROUNDS,
  PUBLIC_USER_FIELDS,
}
