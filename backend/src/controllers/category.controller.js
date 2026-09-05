const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

// GET /api/categories  (public)
const listCategories = asyncHandler(async (_req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  })
  sendSuccess(res, 200, 'Categories', { categories })
})

// POST /api/categories  (admin)
const createCategory = asyncHandler(async (req, res) => {
  const name = req.body.name.trim()
  // Case-insensitive existence check — Postgres unique constraints are
  // case-sensitive, so without this "Jams" and "jams" would both be created.
  const existing = await prisma.category.findFirst({
    where: { name: { equals: name, mode: 'insensitive' } },
  })
  if (existing) return sendSuccess(res, 200, 'Category already exists', { category: existing })

  const category = await prisma.category.create({ data: { name } })
  sendSuccess(res, 201, 'Category created', { category })
})

// PATCH /api/categories/:id  (admin)
const updateCategory = asyncHandler(async (req, res) => {
  const category = await prisma.category.update({
    where: { id: req.params.id },
    data: { name: req.body.name },
  })
  sendSuccess(res, 200, 'Category updated', { category })
})

// DELETE /api/categories/:id  (admin)
const deleteCategory = asyncHandler(async (req, res) => {
  const inUse = await prisma.product.count({ where: { categoryId: req.params.id } })
  if (inUse > 0) {
    throw ApiError.conflict(`Cannot delete: ${inUse} product(s) still use this category`)
  }
  await prisma.category.delete({ where: { id: req.params.id } })
  sendSuccess(res, 200, 'Category deleted')
})

module.exports = { listCategories, createCategory, updateCategory, deleteCategory }
