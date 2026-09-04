const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const { authLimiter } = require('../middlewares/rateLimiter')
const {
  contactSchema,
  exportSchema,
  listSchema,
} = require('../validators/submission.validator')
const ctrl = require('../controllers/submission.controller')

// Public form posts — rate limited to curb spam.
router.post('/contact', authLimiter, validate(contactSchema), ctrl.createContact)
router.post('/export', authLimiter, validate(exportSchema), ctrl.createExport)

// Admin inbox
router.get('/', isAuthenticated, isAdmin, validate(listSchema), ctrl.listSubmissions)

module.exports = router
