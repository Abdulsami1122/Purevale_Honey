const { z } = require('zod')
const { uuid } = require('./common.validator')

const createCategorySchema = z.object({
  body: z.object({ name: z.string().trim().min(2).max(80) }),
})

const updateCategorySchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ name: z.string().trim().min(2).max(80) }),
})

module.exports = { createCategorySchema, updateCategorySchema }
