const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const {
  addItemSchema,
  updateItemSchema,
  itemIdParamSchema,
} = require('../validators/cart.validator')
const ctrl = require('../controllers/cart.controller')

// Every cart route requires a logged-in user.
router.use(isAuthenticated)

router.get('/', ctrl.getCart)
router.delete('/', ctrl.clearCart)
router.post('/items', validate(addItemSchema), ctrl.addItem)
router.patch('/items/:itemId', validate(updateItemSchema), ctrl.updateItem)
router.delete('/items/:itemId', validate(itemIdParamSchema), ctrl.removeItem)

module.exports = router
