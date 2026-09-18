// Loads and validates environment variables ONCE at startup.
// Nothing in the codebase reads process.env directly — everything goes through here.
require('dotenv').config()

const { z } = require('zod')

const schema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),

  // Prisma connection string, e.g. postgresql://user:pass@host:5432/db?schema=public
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  // Secrets — must be long random strings. Generate with:
  //   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  REFRESH_TOKEN_TTL_DAYS: z.coerce.number().int().positive().default(7),

  // Comma-separated whitelist of allowed browser origins for CORS.
  CORS_ORIGINS: z.string().default('http://localhost:5173'),
  COOKIE_DOMAIN: z.string().optional(),
  // Public URL of the storefront — used to build password-reset links in emails.
  APP_URL: z.string().url().default('http://localhost:5173'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(15 * 60 * 1000),
  RATE_LIMIT_MAX: z.coerce.number().int().positive().default(100),

  // Optional — media uploads are disabled if these are not set.
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),

  // Optional — order/account emails (order placed, status changed, password
  // reset) are logged instead of sent if these are not set. Works with any
  // SMTP provider, including Gmail (host smtp.gmail.com, port 587, an App
  // Password as SMTP_PASS — not the normal account password).
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().positive().default(587),
  // z.coerce.boolean() would turn the *string* "false" into JS true (any
  // non-empty string is truthy) — parse the literal word instead.
  SMTP_SECURE: z.enum(['true', 'false']).default('false').transform((v) => v === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().optional(),
})

const parsed = schema.safeParse(process.env)

if (!parsed.success) {
  const details = JSON.stringify(parsed.error.flatten().fieldErrors, null, 2)
  // Throw (don't process.exit) so the reason is visible in serverless logs
  // instead of an opaque FUNCTION_INVOCATION_FAILED.
  throw new Error(`Invalid environment configuration:\n${details}`)
}

const env = Object.freeze({
  ...parsed.data,
  isProd: parsed.data.NODE_ENV === 'production',
  CORS_ORIGIN_LIST: parsed.data.CORS_ORIGINS.split(',')
    .map((o) => o.trim())
    .filter(Boolean),
  ACCESS_COOKIE_MAX_AGE_MS: 15 * 60 * 1000,
  REFRESH_COOKIE_MAX_AGE_MS: parsed.data.REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000,
  UPLOADS_ENABLED: Boolean(
    parsed.data.CLOUDINARY_CLOUD_NAME &&
      parsed.data.CLOUDINARY_API_KEY &&
      parsed.data.CLOUDINARY_API_SECRET,
  ),
  EMAIL_ENABLED: Boolean(parsed.data.SMTP_HOST && parsed.data.SMTP_USER && parsed.data.SMTP_PASS),
})

module.exports = env
