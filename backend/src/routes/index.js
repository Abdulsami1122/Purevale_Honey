// Route table only — no logic lives here.
const router = require('express').Router()

router.use('/auth', require('./auth.routes'))
router.use('/products', require('./product.routes'))
router.use('/categories', require('./category.routes'))
router.use('/cart', require('./cart.routes'))
router.use('/orders', require('./order.routes'))
router.use('/reviews', require('./review.routes'))
router.use('/settings', require('./settings.routes'))
router.use('/submissions', require('./submission.routes'))
router.use('/uploads', require('./upload.routes'))
router.use('/admin', require('./admin.routes'))

module.exports = router
