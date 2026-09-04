// DB helpers that sit close to the schema. The Prisma client itself lives in
// config/db.js; re-exported here so callers can `require('../models')`.
const prisma = require('../config/db')

/**
 * Normalise pagination query params into Prisma `skip` / `take`.
 * @param {{ page?: number|string, limit?: number|string }} query
 */
function paginate(query = {}) {
  const limit = Math.min(Math.max(parseInt(query.limit, 10) || 20, 1), 500)
  const page = Math.max(parseInt(query.page, 10) || 1, 1)
  return { skip: (page - 1) * limit, take: limit, page, limit }
}

/** Shape a Prisma count + rows into a consistent paginated payload. */
function paginatedResult(rows, total, { page, limit }) {
  return {
    items: rows,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  }
}

module.exports = { prisma, paginate, paginatedResult }
