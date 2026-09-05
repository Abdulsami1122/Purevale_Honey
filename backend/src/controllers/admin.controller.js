const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { prisma, paginate, paginatedResult } = require('../models')

const DAY_MS = 24 * 60 * 60 * 1000
const PAID_STATUSES = ['paid', 'shipped', 'delivered']

// Revenue for each of the last 7 days (today inclusive), zero-filled.
async function getRevenueByDay() {
  const since = new Date(Date.now() - 6 * DAY_MS)
  since.setHours(0, 0, 0, 0)

  const orders = await prisma.order.findMany({
    where: { status: { in: PAID_STATUSES }, createdAt: { gte: since } },
    select: { total: true, createdAt: true },
  })

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(since.getTime() + i * DAY_MS).toISOString().slice(0, 10)
    return { date, revenue: 0 }
  })
  const byDate = Object.fromEntries(days.map((d) => [d.date, d]))

  for (const order of orders) {
    const key = order.createdAt.toISOString().slice(0, 10)
    if (byDate[key]) byDate[key].revenue += Number(order.total)
  }

  return days
}

// GET /api/admin/stats
const dashboardStats = asyncHandler(async (_req, res) => {
  const [
    userCount,
    productCount,
    orderCount,
    pendingOrders,
    revenueAgg,
    productStock,
    recentOrders,
    revenueByDay,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'pending' } }),
    prisma.order.aggregate({
      where: { status: { in: PAID_STATUSES } },
      _sum: { total: true },
    }),
    prisma.product.findMany({
      orderBy: { stock: 'asc' },
      select: {
        id: true,
        name: true,
        stock: true,
        images: true,
        category: { select: { name: true } },
      },
    }),
    prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { user: { select: { id: true, name: true, email: true } } },
    }),
    getRevenueByDay(),
  ])

  sendSuccess(res, 200, 'Dashboard stats', {
    stats: {
      users: userCount,
      products: productCount,
      orders: orderCount,
      pendingOrders,
      revenue: Number(revenueAgg._sum.total || 0),
      productStock,
      recentOrders,
      revenueByDay,
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
