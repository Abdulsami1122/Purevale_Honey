const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const { idParamSchema } = require('../validators/common.validator')
const {
  createOrderSchema,
  listOrdersSchema,
  updateOrderStatusSchema,
} = require('../validators/order.validator')
const ctrl = require('../controllers/order.controller')

router.use(isAuthenticated)

// Admin views (declared before "/:id" so they aren't captured by it)
router.get('/admin/all', isAdmin, validate(listOrdersSchema), ctrl.listAllOrders)
router.patch('/:id/status', isAdmin, validate(updateOrderStatusSchema), ctrl.updateOrderStatus)

// Customer
router.post('/', validate(createOrderSchema), ctrl.createOrder)
router.get('/', validate(listOrdersSchema), ctrl.listMyOrders)
router.get('/:id', validate(idParamSchema), ctrl.getMyOrder)

module.exports = router
