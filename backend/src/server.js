const app = require('./app')
const env = require('./config/env')
const prisma = require('./config/db')
const logger = require('./utils/logger')

async function start() {
  // Fail fast if the database is unreachable.
  await prisma.$connect()
  logger.info('Database connected')

  const server = app.listen(env.PORT, () => {
    logger.info(`API listening on http://localhost:${env.PORT} (${env.NODE_ENV})`)
  })

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      logger.error(
        `Port ${env.PORT} is already in use — another server is still running. ` +
          `Stop it (Windows: npx kill-port ${env.PORT}) or set PORT to a free value in .env.`,
      )
    } else {
      logger.error('HTTP server error', err)
    }
    prisma.$disconnect().finally(() => process.exit(1))
  })

  const shutdown = (signal) => {
    logger.info(`${signal} received — shutting down`)
    server.close(async () => {
      await prisma.$disconnect()
      process.exit(0)
    })
    setTimeout(() => process.exit(1), 10_000).unref()
  }

  ;['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => shutdown(sig)))
}

process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled promise rejection', reason)
})
process.on('uncaughtException', (err) => {
  logger.error('Uncaught exception', err)
  process.exit(1)
})

start().catch(async (err) => {
  logger.error('Failed to start server', err)
  await prisma.$disconnect().catch(() => {})
  process.exit(1)
})
