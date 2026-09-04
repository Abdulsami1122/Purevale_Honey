// Request validation middleware. Pass a Zod schema shaped like
//   z.object({ body?: ..., query?: ..., params?: ... })
// Parsed + coerced values replace the raw input (query is exposed as
// req.validatedQuery because Express 5 makes req.query read-only).
const asyncHandler = require('../utils/asyncHandler')

module.exports = (schema) =>
  asyncHandler(async (req, _res, next) => {
    const parsed = await schema.parseAsync({
      body: req.body,
      query: req.query,
      params: req.params,
    })

    if (parsed.body !== undefined) req.body = parsed.body
    if (parsed.params !== undefined) Object.assign(req.params, parsed.params)
    if (parsed.query !== undefined) req.validatedQuery = parsed.query

    next()
  })
