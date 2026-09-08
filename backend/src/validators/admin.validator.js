const { z } = require('zod')
const { uuid, paginationQuery } = require('./common.validator')

const listUsersSchema = z.object({
  query: paginationQuery.extend({
    search: z.string().trim().max(120).optional(),
    role: z.enum(['customer', 'admin']).optional(),
  }),
})

const updateUserRoleSchema = z.object({
  params: z.object({ id: uuid }),
  body: z.object({ role: z.enum(['customer', 'admin']) }),
})

const userIdParamSchema = z.object({
  params: z.object({ id: uuid }),
})

const ymd = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date must be YYYY-MM-DD')

// Optional date-range + client tz offset for the dashboard's activity panel.
const statsSchema = z.object({
  query: z.object({
    from: ymd.optional(),
    to: ymd.optional(),
    offset: z.coerce.number().int().min(-720).max(840).optional(),
  }),
})

module.exports = {
  listUsersSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  statsSchema,
}
