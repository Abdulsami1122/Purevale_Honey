// Payment provider integration. Stubbed — replace initiatePayment /
// verifyPayment with a real gateway (Stripe, etc.) without changing callers.
const crypto = require('crypto')
const logger = require('../utils/logger')

async function initiatePayment({ orderId, amount, currency = 'PKR' }) {
  const reference = `pay_${crypto.randomBytes(8).toString('hex')}`
  logger.info(`[payment:stub] initiate ${reference} order=${orderId} amount=${amount} ${currency}`)
  return { reference, status: 'requires_confirmation', amount, currency }
}

async function verifyPayment(reference) {
  logger.info(`[payment:stub] verify ${reference}`)
  return { reference, status: 'succeeded' }
}

module.exports = { initiatePayment, verifyPayment }
