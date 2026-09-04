// Role-based access control. Must run after isAuthenticated.
const ApiError = require('../utils/ApiError')

const requireRole = (...allowed) => (req, _res, next) => {
  if (!req.user) return next(ApiError.unauthorized())
  if (!allowed.includes(req.user.role)) {
    return next(ApiError.forbidden())
  }
  next()
}

module.exports = {
  requireRole,
  isAdmin: requireRole('admin'),
}
