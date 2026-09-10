const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const {
  listRatesQuerySchema,
  createRateSchema,
  updateRateSchema,
  rateIdParamSchema,
} = require('../validators/shipping.validator')
const ctrl = require('../controllers/shipping.controller')

// Public — options for the checkout dropdowns
router.get('/methods', validate(listRatesQuerySchema), ctrl.listMethods)
router.get('/locations', ctrl.listLocations)

// Admin CRUD
router.get('/', isAuthenticated, isAdmin, ctrl.adminList)
router.post('/', isAuthenticated, isAdmin, validate(createRateSchema), ctrl.createRate)
router.patch('/:id', isAuthenticated, isAdmin, validate(updateRateSchema), ctrl.updateRate)
router.delete('/:id', isAuthenticated, isAdmin, validate(rateIdParamSchema), ctrl.deleteRate)

module.exports = router
