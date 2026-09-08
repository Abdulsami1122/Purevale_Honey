const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const {
  listUsersSchema,
  updateUserRoleSchema,
  userIdParamSchema,
  statsSchema,
} = require('../validators/admin.validator')
const ctrl = require('../controllers/admin.controller')

// Whole namespace is admin-only.
router.use(isAuthenticated, isAdmin)

router.get('/stats', validate(statsSchema), ctrl.dashboardStats)
router.get('/users', validate(listUsersSchema), ctrl.listUsers)
router.get('/users/:id', validate(userIdParamSchema), ctrl.getUser)
router.patch('/users/:id/role', validate(updateUserRoleSchema), ctrl.updateUserRole)
router.delete('/users/:id', validate(userIdParamSchema), ctrl.deleteUser)

module.exports = router
