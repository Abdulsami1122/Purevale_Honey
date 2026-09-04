const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const { idParamSchema } = require('../validators/common.validator')
const {
  createCategorySchema,
  updateCategorySchema,
} = require('../validators/category.validator')
const ctrl = require('../controllers/category.controller')

router.get('/', ctrl.listCategories)

router.post('/', isAuthenticated, isAdmin, validate(createCategorySchema), ctrl.createCategory)
router.patch('/:id', isAuthenticated, isAdmin, validate(updateCategorySchema), ctrl.updateCategory)
router.delete('/:id', isAuthenticated, isAdmin, validate(idParamSchema), ctrl.deleteCategory)

module.exports = router
