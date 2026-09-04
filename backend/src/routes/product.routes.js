const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const { idParamSchema } = require('../validators/common.validator')
const {
  listProductsSchema,
  createProductSchema,
  updateProductSchema,
} = require('../validators/product.validator')
const ctrl = require('../controllers/product.controller')

// Public
router.get('/', validate(listProductsSchema), ctrl.listProducts)
router.get('/:id', validate(idParamSchema), ctrl.getProduct)

// Admin
router.post('/', isAuthenticated, isAdmin, validate(createProductSchema), ctrl.createProduct)
router.patch('/:id', isAuthenticated, isAdmin, validate(updateProductSchema), ctrl.updateProduct)
router.delete('/:id', isAuthenticated, isAdmin, validate(idParamSchema), ctrl.deleteProduct)

module.exports = router
