const ApiError = require('../utils/ApiError')

// Any request that falls through the router lands here.
module.exports = (req, res, next) => {
  next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`))
}
