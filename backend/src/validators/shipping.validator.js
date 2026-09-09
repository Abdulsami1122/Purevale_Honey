const { z } = require('zod')
const { uuid } = require('./common.validator')

const body = z.object({
  name: z.string().trim().min(2).max(80),
  country: z.string().trim().min(1).max(80).default('*'),
  city: z.string().trim().min(1).max(80).default('*'),
  price: z.coerce.number().nonnegative().default(0),
  active: z.coerce.boolean().default(true),
  sortOrder: z.coerce.number().int().default(0),
})

const listRatesQuerySchema = z.object({
  query: z.object({
    country: z.string().trim().max(80).optional(),
    city: z.string().trim().max(80).optional(),
  }),
})

const createRateSchema = z.object({ body })

const updateRateSchema = z.object({
  params: z.object({ id: uuid }),
  body: body.partial().refine((v) => Object.keys(v).length > 0, {
    message: 'Provide at least one field to update',
  }),
})

const rateIdParamSchema = z.object({ params: z.object({ id: uuid }) })

module.exports = { listRatesQuerySchema, createRateSchema, updateRateSchema, rateIdParamSchema }
