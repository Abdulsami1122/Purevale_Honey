// Single shared Prisma client. Importing this module anywhere returns the same
// instance, so we never open more connection pools than necessary.
//
// On a serverless host (Vercel) the module is re-evaluated on cold starts but
// reused on warm invocations, so we cache the client on `globalThis` to avoid
// opening a new pool for every request.
const { PrismaClient } = require('@prisma/client')
const env = require('./env')

const globalForPrisma = globalThis

const prisma =
  globalForPrisma.__purevalePrisma ||
  new PrismaClient({
    log: env.isProd ? ['error'] : ['warn', 'error'],
  })

if (!globalForPrisma.__purevalePrisma) {
  globalForPrisma.__purevalePrisma = prisma
}

module.exports = prisma
