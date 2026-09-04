const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { prisma, paginate, paginatedResult } = require('../models')

// GET /api/admin/stats
const dashboardStats = asyncHandler(async (_req, res) => {
  const [
    userCount,
    productCount,
    orderCount,
    pendingOrders,
    revenueAgg,
    lowStock,
    recentOrders,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({
      where: { status: { in: ['paid', 'shipped', 'delivered'] } },
      _sum: { total: true },
    }),
    prisma.product.findMany({
      where: { stock: { lte: 5 } },
      orderBy: { stock: 'asc' },
      take: 10,
      select: { id: true, name: true, stock: true },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
  ])

  sendSuccess(res, 200, 'Dashboard stats', {
    stats: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      pendingOrders,
      revenue: Number(revenueAgg._sum.total || 0),
      lowStock,
      recentOrders,
    },
  })
})

// GET /api/admin/users
const listUsers = asyncHandler(async (req, res) => {
  const q = req.validatedQuery || {}
  const { skip, take, page, limit } = paginate(q)

  const where = {}
  if (q.role) where.role = q.role
  if (q.search) {
    where.OR = [
      { name: { contains: q.search, mode: 'insensitive' } },
      { email: { contains: q.search, mode: 'insensitive' } },
    ]
  }

  const [rows, total] = await Promise.all([
    prisma.user.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip,
      take,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: { select: { orders: true } },
      },
    }),
    prisma.user.count({ where }),
  ])

  sendSuccess(res, 200, 'Users', paginatedResult(rows, total, { page, limit }))
})

// GET /api/admin/users/:id
const getUser = asyncHandler(async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.params.id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      orders: { orderBy: { createdAt: 'desc' }, take: 20, include: { items: true } },
    },
  })
  if (!user) throw ApiError.notFound('User not found')
  sendSuccess(res, 200, 'User', { user })
})

// PATCH /api/admin/users/:id/role
const updateUserRole = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id && req.body.role !== 'admin') {
    throw ApiError.badRequest('You cannot remove your own admin role')
  }
  const user = await prisma.user.update({
    where: { id: req.params.id },
    data: { role: req.body.role },
    select: { id: true, name: true, email: true, role: true },
  })
  sendSuccess(res, 200, 'User role updated', { user })
})

// DELETE /api/admin/users/:id
const deleteUser = asyncHandler(async (req, res) => {
  if (req.params.id === req.user.id) {
    throw ApiError.badRequest('You cannot delete your own account')
  }
  await prisma.user.delete({ where: { id: req.params.id } })
  sendSuccess(res, 200, 'User deleted')
})

module.exports = {
  dashboardStats,
  listUsers,
  getUser,
  updateUserRole,
  deleteUser,
}
