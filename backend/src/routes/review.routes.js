const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const {
  productIdParamSchema,
  upsertReviewSchema,
  reviewIdParamSchema,
} = require('../validators/review.validator')
const ctrl = require('../controllers/review.controller')

router.get('/product/:productId', validate(productIdParamSchema), ctrl.listProductReviews)
router.put(
  '/product/:productId',
  isAuthenticated,
  validate(upsertReviewSchema),
  ctrl.upsertReview,
)
router.delete('/:id', isAuthenticated, validate(reviewIdParamSchema), ctrl.deleteReview)

module.exports = router
