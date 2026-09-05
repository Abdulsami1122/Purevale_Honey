const { z } = require('zod')
const { uuid } = require('./common.validator')

const testimonialBody = z.object({
  name: z.string().trim().min(2).max(120),
  image: z.string().trim().url().nullish(),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  message: z.string().trim().min(10, 'Please write at least 10 characters').max(1000),
  sortOrder: z.coerce.number().int().default(0),
})

const createTestimonialSchema = z.object({ body: testimonialBody })

const updateTestimonialSchema = z.object({
  params: z.object({ id: uuid }),
  body: testimonialBody.partial().refine((v) => Object.keys(v).length > 0, {
    message: 'Provide at least one field to update',
  }),
})

const testimonialIdParamSchema = z.object({
  params: z.object({ id: uuid }),
})

module.exports = { createTestimonialSchema, updateTestimonialSchema, testimonialIdParamSchema }
