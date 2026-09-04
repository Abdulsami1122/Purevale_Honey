const { z } = require('zod')
const { uuid } = require('./common.validator')

const productIdParamSchema = z.object({
  params: z.object({ productId: uuid }),
})

const upsertReviewSchema = z.object({
  params: z.object({ productId: uuid }),
  body: z.object({
    rating: z.coerce.number().int().min(1).max(5),
    comment: z.string().trim().max(2000).optional(),
  }),
})

const reviewIdParamSchema = z.object({
  params: z.object({ id: uuid }),
})

module.exports = { productIdParamSchema, upsertReviewSchema, reviewIdParamSchema }
