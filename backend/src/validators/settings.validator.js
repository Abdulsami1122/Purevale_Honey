const { z } = require('zod')

const navCategory = z.object({
  label: z.string().trim().max(60),
  href: z.string().trim().max(200),
  icon: z.string().trim().max(40).optional(),
  badge: z.string().trim().max(30).optional().or(z.literal('')),
  badgeTone: z.string().trim().max(20).optional(),
  enabled: z.boolean().optional(),
})

// Every section is optional — the controller deep-merges into the stored doc.
const updateSettingsSchema = z.object({
  body: z
    .object({
      announcements: z.array(z.string().max(200)).max(20),
      hero: z.object({
        videoUrl: z.string().max(2000),
        subtitle: z.string().max(200),
        title: z.string().max(200),
        description: z.string().max(600),
      }).partial(),
      extraNavCategories: z.array(navCategory).max(30),
      disabledCategories: z.array(z.string().max(200)).max(30),
      story: z.object({ image: z.string().max(2000) }).partial(),
      contact: z.object({
        phone: z.string().max(60),
        whatsapp: z.string().max(40),
        email: z.string().max(160),
        address: z.string().max(300),
      }).partial(),
      socials: z.object({
        facebook: z.string().max(300),
        instagram: z.string().max(300),
        youtube: z.string().max(300),
        tiktok: z.string().max(300),
      }).partial(),
    })
    .partial()
    .refine((v) => Object.keys(v).length > 0, { message: 'No settings provided' }),
})

module.exports = { updateSettingsSchema }
