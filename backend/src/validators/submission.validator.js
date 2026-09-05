const { z } = require('zod')

const contactSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(4).max(40),
    message: z.string().trim().min(1).max(4000),
  }),
})

const exportSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2).max(120).optional(),
    company: z.string().trim().min(1).max(200),
    email: z.string().trim().toLowerCase().email(),
    phone: z.string().trim().min(4).max(40),
    destination: z.string().trim().min(1).max(120),
    product: z.string().trim().min(1).max(120),
    message: z.string().trim().max(4000).optional().or(z.literal('')),
  }),
})

const listSchema = z.object({
  query: z.object({
    type: z.enum(['contact', 'export']).optional(),
  }),
})

module.exports = { contactSchema, exportSchema, listSchema }
