const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

// GET /api/testimonials  (public) — carousel order, then most recent first
const listTestimonials = asyncHandler(async (_req, res) => {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
  })
  sendSuccess(res, 200, 'Testimonials', { testimonials })
})

// POST /api/testimonials  (admin)
const createTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.create({ data: req.body })
  sendSuccess(res, 201, 'Testimonial created', { testimonial })
})

// PATCH /api/testimonials/:id  (admin)
const updateTestimonial = asyncHandler(async (req, res) => {
  const testimonial = await prisma.testimonial.update({
    where: { id: req.params.id },
    data: req.body,
  })
  sendSuccess(res, 200, 'Testimonial updated', { testimonial })
})

// DELETE /api/testimonials/:id  (admin)
const deleteTestimonial = asyncHandler(async (req, res) => {
  const existing = await prisma.testimonial.findUnique({ where: { id: req.params.id } })
  if (!existing) throw ApiError.notFound('Testimonial not found')
  await prisma.testimonial.delete({ where: { id: existing.id } })
  sendSuccess(res, 200, 'Testimonial deleted')
})

module.exports = { listTestimonials, createTestimonial, updateTestimonial, deleteTestimonial }
