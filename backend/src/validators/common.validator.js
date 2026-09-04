const { z } = require('zod')

// Reusable pieces shared across resource validators.
const uuid = z.string().uuid('Invalid id')

const idParamSchema = z.object({
  params: z.object({ id: uuid }),
})

const paginationQuery = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
})

module.exports = { uuid, idParamSchema, paginationQuery }
