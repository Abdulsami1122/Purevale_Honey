const { z } = require('zod')
const { uuid, paginationQuery } = require('./common.validator')

const variant = z.object({
  label: z.string().trim().min(1),
  price: z.coerce.number().nonnegative().optional(),
})

// An image reference can be a hosted URL (Cloudinary), an inline data URI, or a
// site-relative asset path like "/honey-jar.jpg" that ships with the frontend.
const imageRef = z
  .string()
  .trim()
  .min(1)
  .max(2000)
  .refine(
    (s) => /^https?:\/\//i.test(s) || s.startsWith('/') || s.startsWith('data:image/'),
    { message: 'Each image must be a URL or an uploaded file path' },
  )

const productBody = z.object({
  name: z.string().trim().min(2).max(160),
  description: z.string().trim().max(5000).default(''),
  price: z.coerce.number().nonnegative(),
  // Upper end of a displayed price range (e.g. "Rs.500 - Rs.1500"). Omit to
  // leave unchanged, or send null to clear it back to a single fixed price.
  priceMax: z.coerce.number().nonnegative().optional().nullable(),
  discountPercent: z.coerce.number().int().min(0).max(95).default(0),
  rating: z.coerce.number().min(0).max(5).default(0),
  reviewCount: z.coerce.number().int().min(0).default(0),
  stock: z.coerce.number().int().nonnegative().default(0),
  categoryId: uuid.nullish(),
  images: z.array(imageRef).max(12).default([]),
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

const priceRangeOk = (v) =>
  v.priceMax == null || v.price === undefined || v.priceMax >= v.price

const createProductSchema = z.object({
  body: productBody.refine(priceRangeOk, {
    message: 'Price to must be greater than or equal to the price',
    path: ['priceMax'],
  }),
})

const updateProductSchema = z.object({
  params: z.object({ id: uuid }),
  body: productBody
    .partial()
    .refine((v) => Object.keys(v).length > 0, { message: 'Provide at least one field to update' })
    .refine(priceRangeOk, { message: 'Price to must be greater than or equal to the price', path: ['priceMax'] }),
})

module.exports = { listProductsSchema, createProductSchema, updateProductSchema }
