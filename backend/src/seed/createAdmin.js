/**
 * One-time admin bootstrap.
 *
 *   1. Put ADMIN_EMAIL + ADMIN_PASSWORD (and optional ADMIN_NAME) in .env
 *   2. npm run seed:admin
 *   3. Delete ADMIN_PASSWORD from .env
 *
 * After this, the admin signs in through the normal POST /api/auth/login route.
 * No credentials are ever hardcoded in source.
 */
require('dotenv').config()

const bcrypt = require('bcryptjs')
const { z } = require('zod')
const prisma = require('../config/db')

const schema = z.object({
  ADMIN_EMAIL: z.string().email(),
  ADMIN_PASSWORD: z
    .string()
    .min(10, 'ADMIN_PASSWORD must be at least 10 characters')
    .max(128),
  ADMIN_NAME: z.string().min(2).default('Administrator'),
})

async function main() {
  const parsed = schema.safeParse(process.env)
  if (!parsed.success) {
    console.error('\nSeed aborted — fix these env vars and retry:\n')
    console.error(parsed.error.flatten().fieldErrors)
    process.exit(1)
  }

  const email = parsed.data.ADMIN_EMAIL.toLowerCase()
  const { ADMIN_PASSWORD, ADMIN_NAME } = parsed.data

  const resetPassword = process.argv.includes('--reset-password')

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    const data = {}
    if (existing.role !== 'admin') data.role = 'admin'
    if (resetPassword) data.passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)

    if (Object.keys(data).length === 0) {
      console.log(`Admin "${email}" already exists — nothing to do (pass --reset-password to set the password from .env).`)
      return
    }

    await prisma.user.update({ where: { email }, data })
    console.log(
      `Admin "${email}" updated${data.role ? ' (promoted to admin)' : ''}${data.passwordHash ? ' (password reset from .env)' : ''}.`,
    )
    return
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12)
  await prisma.user.create({
    data: { name: ADMIN_NAME, email, passwordHash, role: 'admin' },
  })

  console.log(`\nAdmin "${email}" created.`)
  console.log('IMPORTANT: remove ADMIN_PASSWORD from .env now.\n')
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
