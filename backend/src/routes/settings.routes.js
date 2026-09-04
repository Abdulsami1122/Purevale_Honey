const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const { updateSettingsSchema } = require('../validators/settings.validator')
const ctrl = require('../controllers/settings.controller')

router.get('/', ctrl.getSettings)
router.put('/', isAuthenticated, isAdmin, validate(updateSettingsSchema), ctrl.updateSettings)

module.exports = router
