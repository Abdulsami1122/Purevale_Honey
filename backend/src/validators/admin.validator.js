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

module.exports = { listUsersSchema, updateUserRoleSchema, userIdParamSchema }
