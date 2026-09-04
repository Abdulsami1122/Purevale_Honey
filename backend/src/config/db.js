// Single shared Prisma client. Importing this module anywhere returns the same
// instance, so we never open more connection pools than necessary.
const { PrismaClient } = require('@prisma/client')
const env = require('./env')

const prisma = new PrismaClient({
  log: env.isProd ? ['error'] : ['warn', 'error'],
})

module.exports = prisma
