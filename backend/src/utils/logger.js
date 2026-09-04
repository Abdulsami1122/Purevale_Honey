// Tiny structured-ish logger. Kept dependency-free on purpose; swap for pino
// later without touching call sites.
const env = require('../config/env')

const ts = () => new Date().toISOString()

const logger = {
  info: (...args) => console.log(`[${ts()}] [INFO ]`, ...args),
  warn: (...args) => console.warn(`[${ts()}] [WARN ]`, ...args),
  error: (...args) => console.error(`[${ts()}] [ERROR]`, ...args),
  debug: (...args) => {
    if (!env.isProd) console.debug(`[${ts()}] [DEBUG]`, ...args)
  },
}

module.exports = logger
