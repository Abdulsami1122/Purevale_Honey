const { z } = require('zod')

const email = z.string().trim().toLowerCase().email('A valid email is required')
const password = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2, 'Name is too short').max(80),
    email,
    password,
  }),
})

const loginSchema = z.object({
  body: z.object({
    email,
    password: z.string().min(1, 'Password is required'),
  }),
})

const changePasswordSchema = z.object({
  body: z.object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: password,
  }),
})

const forgotPasswordSchema = z.object({
  body: z.object({ email }),
})

const resetPasswordSchema = z.object({
  body: z.object({
    token: z.string().min(16, 'Invalid reset token'),
    password,
  }),
})

module.exports = {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
}
