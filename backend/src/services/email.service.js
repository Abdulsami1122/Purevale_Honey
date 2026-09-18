// Email delivery via SMTP (nodemailer) — works with Gmail, Outlook, or any
// SMTP provider. If SMTP_* isn't configured, every send is logged instead of
// sent, so the app keeps working during local dev / before setup.
const nodemailer = require('nodemailer')
const env = require('../config/env')
const logger = require('../utils/logger')

let transporter = null
if (env.EMAIL_ENABLED) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE, // true for port 465, false for 587/25 (STARTTLS)
    auth: { user: env.SMTP_USER, pass: env.SMTP_PASS },
  })
}

async function sendEmail({ to, subject, text }) {
  if (!transporter) {
    logger.info(`[email:stub] -> ${to} | ${subject} | ${text?.slice(0, 80) || ''}`)
    return { queued: false, stub: true }
  }
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM || env.SMTP_USER,
      to,
      subject,
      text,
    })
    return { queued: true }
  } catch (err) {
    // Email is best-effort — never let a delivery failure break the request
    // that triggered it (placing an order, changing its status, etc.).
    logger.error(`[email] failed to send "${subject}" to ${to}`, err)
    return { queued: false, error: true }
  }
}

const sendWelcomeEmail = (user) =>
  sendEmail({
    to: user.email,
    subject: 'Welcome to Durrani Harvest',
    text: `Hi ${user.name}, your account is ready.`,
  })

const sendOrderConfirmationEmail = (user, order) =>
  sendEmail({
    to: user.email,
    subject: `Order ${order.id.slice(0, 8)} received — Durrani Harvest`,
    text: `Hi ${user.name},\n\nThanks for your order! We've received order ${order.id.slice(0, 8)} totalling Rs. ${order.total}.\n\nWe'll email you again as soon as it's confirmed and on its way.\n\n— Durrani Harvest`,
  })

// Friendly, per-status wording for the order-status-change email the admin
// triggers by changing an order's status in the dashboard.
const STATUS_TEXT = {
  pending: 'is pending confirmation',
  paid: 'has been paid and confirmed',
  shipped: 'has been shipped and is on its way to you',
  delivered: 'has been delivered',
  cancelled: 'has been cancelled',
}

const sendOrderStatusEmail = (user, order, status) => {
  const phrase = STATUS_TEXT[status] || `is now "${status}"`
  return sendEmail({
    to: user.email,
    subject: `Order ${order.id.slice(0, 8)} ${status} — Durrani Harvest`,
    text: `Hi ${user.name},\n\nYour order ${order.id.slice(0, 8)} ${phrase}.\n\nOrder total: Rs. ${order.total}\n\nYou can view your order any time at ${env.APP_URL}/orders.\n\n— Durrani Harvest`,
  })
}

const sendPasswordResetEmail = (user, resetUrl) =>
  sendEmail({
    to: user.email,
    subject: 'Reset your Durrani Harvest password',
    text: `Hi ${user.name}, use this link to reset your password (valid for 1 hour): ${resetUrl}`,
  })

module.exports = {
  sendEmail,
  sendWelcomeEmail,
  sendOrderConfirmationEmail,
  sendOrderStatusEmail,
  sendPasswordResetEmail,
}
