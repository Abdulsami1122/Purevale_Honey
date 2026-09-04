const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { prisma, paginate, paginatedResult } = require('../models')

const SORT_MAP = {
  newest: { createdAt: 'desc' },
  price_asc: { price: 'asc' },
  price_desc: { price: 'desc' },
}

// GET /api/products  (public)
const listProducts = asyncHandler(async (req, res) => {
  const q = req.validatedQuery || {}
  const { skip, take, page, limit } = paginate(q)

  const where = {}
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: 'insensitive' } },
      { description: { contains: q.search, mode: 'insensitive' } },
    ]
  }
  if (q.category) {
    where.category = { OR: [{ id: q.category }, { name: { equals: q.category, mode: 'insensitive' } }] }
  }

  const [rows, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy: SORT_MAP[q.sort] || SORT_MAP.newest,
      skip,
      take,
      include: {
        category: { select: { id: true, name: true } },
        _count: { select: { reviews: true } },
      },
    }),
    prisma.product.count({ where }),
  ])

  sendSuccess(res, 200, 'Products', paginatedResult(rows, total, { page, limit }))
})

// GET /api/products/:id  (public)
const getProduct = asyncHandler(async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: {
      category: { select: { id: true, name: true } },
      reviews: {
        orderBy: { createdAt: 'desc' },
        take: 20,
        include: { user: { select: { id: true, name: true } } },
      },
    },
  })
  if (!product) throw ApiError.notFound('Product not found')

  const agg = await prisma.review.aggregate({
    where: { productId: product.id },
    _avg: { rating: true },
    _count: true,
  })

  sendSuccess(res, 200, 'Product', {
    product: {
      ...product,
      ratingAverage: agg._avg.rating ? Number(agg._avg.rating.toFixed(2)) : 0,
      ratingCount: agg._count,
    },
  })
})

// POST /api/products  (admin)
const createProduct = asyncHandler(async (req, res) => {
  const { categoryId, ...rest } = req.body
  if (categoryId) {
    const exists = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!exists) throw ApiError.badRequest('categoryId does not reference an existing category')
  }
  const product = await prisma.product.create({
    data: { ...rest, categoryId: categoryId ?? null },
  })
  sendSuccess(res, 201, 'Product created', { product })
})

// PATCH /api/products/:id  (admin)
const updateProduct = asyncHandler(async (req, res) => {
  const { categoryId, ...rest } = req.body
  if (categoryId) {
    const exists = await prisma.category.findUnique({ where: { id: categoryId } })
    if (!exists) throw ApiError.badRequest('categoryId does not reference an existing category')
  }
  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { ...rest, ...(categoryId !== undefined ? { categoryId } : {}) },
  })
  sendSuccess(res, 200, 'Product updated', { product })
})

// DELETE /api/products/:id  (admin)
const deleteProduct = asyncHandler(async (req, res) => {
  await prisma.product.delete({ where: { id: req.params.id } })
  sendSuccess(res, 200, 'Product deleted')
})

module.exports = {
  listProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
}
