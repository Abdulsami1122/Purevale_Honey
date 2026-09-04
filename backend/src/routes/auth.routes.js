const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { authLimiter } = require('../middlewares/rateLimiter')
const {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require('../validators/auth.validator')
const ctrl = require('../controllers/auth.controller')

router.post('/register', authLimiter, validate(registerSchema), ctrl.register)
router.post('/login', authLimiter, validate(loginSchema), ctrl.login)
router.post('/refresh-token', authLimiter, ctrl.refresh)
router.post('/logout', ctrl.logout)
router.post('/forgot-password', authLimiter, validate(forgotPasswordSchema), ctrl.forgotPassword)
router.post('/reset-password', authLimiter, validate(resetPasswordSchema), ctrl.resetPassword)
router.get('/me', isAuthenticated, ctrl.me)
router.patch(
  '/password',
  isAuthenticated,
  validate(changePasswordSchema),
  ctrl.changePassword,
)

module.exports = router
