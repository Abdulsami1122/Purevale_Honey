const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

// GET /api/reviews/product/:productId  (public)
const listProductReviews = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.productId } })
  if (!product) throw ApiError.notFound('Product not found')

  const [reviews, agg] = await Promise.all([
    prisma.review.findMany({
      where: { productId: product.id },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    }),
    prisma.review.aggregate({
      where: { productId: product.id },
      _avg: { rating: true },
      _count: true,
    }),
  ])

  sendSuccess(res, 200, 'Product reviews', {
    reviews,
    summary: {
      average: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0,
      count: agg._count,
    },
  })
})

// PUT /api/reviews/product/:productId  (auth) — one review per user, upserted
const upsertReview = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({ where: { id: req.params.productId } })
  if (!product) throw ApiError.notFound('Product not found')

  const review = await prisma.review.upsert({
    where: { productId_userId: { productId: product.id, userId: req.user.id } },
    create: {
      productId: product.id,
      userId: req.user.id,
      rating: req.body.rating,
      comment: req.body.comment ?? null,
    },
    update: { rating: req.body.rating, comment: req.body.comment ?? null },
    include: { user: { select: { id: true, name: true } } },
  })

  sendSuccess(res, 200, 'Review saved', { review })
})

// DELETE /api/reviews/:id  (auth — owner or admin)
const deleteReview = asyncHandler(async (req, res) => {
  const review = await prisma.review.findUnique({ where: { id: req.params.id } })
  if (!review) throw ApiError.notFound('Review not found')
  if (review.userId !== req.user.id && req.user.role !== 'admin') {
    throw ApiError.forbidden()
  }
  await prisma.review.delete({ where: { id: review.id } })
  sendSuccess(res, 200, 'Review deleted')
})

module.exports = { listProductReviews, upsertReview, deleteReview }
