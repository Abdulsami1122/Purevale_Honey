// Centralised error handler — the ONLY place that formats an error for the
// client. Never leaks stack traces or DB internals in production.
const { Prisma } = require('@prisma/client')
const { ZodError } = require('zod')
const ApiError = require('../utils/ApiError')
const logger = require('../utils/logger')
const env = require('../config/env')

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  let statusCode = 500
  let message = 'Internal server error'
  let errors

  if (err instanceof ApiError) {
    statusCode = err.statusCode
    message = err.message
    errors = err.details
  } else if (err instanceof ZodError) {
    statusCode = 400
    message = 'Validation failed'
    errors = err.flatten().fieldErrors
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      statusCode = 409
      const target = Array.isArray(err.meta?.target) ? err.meta.target.join(', ') : err.meta?.target
      message = `A record with this ${target || 'value'} already exists`
    } else if (err.code === 'P2025') {
      statusCode = 404
      message = 'Resource not found'
    } else {
      statusCode = 400
      message = 'Invalid database request'
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400
    message = 'Invalid database request'
  } else if (err.type === 'entity.parse.failed') {
    statusCode = 400
    message = 'Malformed JSON in request body'
  } else if (err.message === 'Not allowed by CORS') {
    statusCode = 403
    message = 'Origin not allowed'
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl}`, err)
  } else {
    logger.warn(`${req.method} ${req.originalUrl} -> ${statusCode} ${message}`)
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(errors ? { errors } : {}),
    ...(!env.isProd && statusCode >= 500 ? { stack: err.stack } : {}),
  })
}
