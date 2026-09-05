const router = require('express').Router()
const validate = require('../middlewares/validate')
const { isAuthenticated } = require('../middlewares/auth')
const { isAdmin } = require('../middlewares/role')
const {
  createTestimonialSchema,
  updateTestimonialSchema,
  testimonialIdParamSchema,
} = require('../validators/testimonial.validator')
const ctrl = require('../controllers/testimonial.controller')

router.get('/', ctrl.listTestimonials)
router.post('/', isAuthenticated, isAdmin, validate(createTestimonialSchema), ctrl.createTestimonial)
router.patch('/:id', isAuthenticated, isAdmin, validate(updateTestimonialSchema), ctrl.updateTestimonial)
router.delete('/:id', isAuthenticated, isAdmin, validate(testimonialIdParamSchema), ctrl.deleteTestimonial)

module.exports = router
