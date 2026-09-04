const { z } = require('zod')
const { uuid } = require('./common.validator')

const addItemSchema = z.object({
  body: z.object({
    productId: uuid,
    variant: z.string().trim().max(80).default(''),
    quantity: z.coerce.number().int().positive().max(999).default(1),
  }),
})

const updateItemSchema = z.object({
  params: z.object({ itemId: uuid }),
  body: z.object({
    quantity: z.coerce.number().int().min(0).max(999),
  }),
})

const itemIdParamSchema = z.object({
  params: z.object({ itemId: uuid }),
})

module.exports = { addItemSchema, updateItemSchema, itemIdParamSchema }
