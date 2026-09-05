const { z } = require('zod')
const { uuid, paginationQuery } = require('./common.validator')

const variant = z.object({
  label: z.string().trim().min(1),
  price: z.coerce.number().nonnegative().optional(),
})

const productBody = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(5000).default(''),
  price: z.coerce.number().nonnegative(),
  discountPercent: z.coerce.number().int().min(0).max(95).default(0),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  stock: z.coerce.number().int().nonnegative().default(0),
  categoryId: uuid.nullish(),
  images: z.array(z.string().url()).max(12).default([]),
  variants: z.array(variant).max(20).default([]),
})

const listProductsSchema = z.object({
  query: paginationQuery
    .extend({
      // storefront pulls the whole catalogue in one go
      limit: z.coerce.number().int().positive().max(500).optional(),
      search: z.string().trim().max(120).optional(),
      category: z.string().trim().optional(), // id or name
      sort: z.enum(['newest', 'price_asc', 'price_desc', 'rating']).optional(),
    }),
})

const createProductSchema = z.object({ body: productBody })

const updateProductSchema = z.object({
  params: z.object({ id: uuid }),
  body: productBody.partial().refine((v) => Object.keys(v).length > 0, {
    message: 'Provide at least one field to update',
  }),
})

module.exports = { listProductsSchema, createProductSchema, updateProductSchema }
