// Email delivery. Stubbed for now — wire an SMTP / provider SDK here later.
// Kept as a service so controllers never import a mail library directly.
const logger = require('../utils/logger')

async function sendEmail({ to, subject, text }) {
  logger.info(`[email:stub] -> ${to} | ${subject} | ${text?.slice(0, 80) || ''}`)
  return { queued: true }
}

const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to Purevale Honey',
    text: `Hi ${user.name}, your account is ready.`,
  })

const sendOrderConfirmationEmail = (user, order) =>
  sendEmail({
    to: user.email,
    subject: `Order ${order.id} received`,
    text: `Thanks ${user.name}, we've received your order totalling ${order.total}.`,
  })

module.exports = { sendEmail, sendWelcomeEmail, sendOrderConfirmationEmail }
