const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { prisma, paginate, paginatedResult } = require('../models')

const PAID_STATUSES = ['paid', 'shipped', 'delivered']

// Per-day activity between two local dates (inclusive), zero-filled.
// `from`/`to` are 'YYYY-MM-DD'; offsetMin aligns buckets to the admin's clock.
async function buildPeriod(from, to, offsetMin) {
  const localMidnightUTC = (ymd) => new Date(Date.parse(`${ymd}T00:00:00Z`) - offsetMin * 60000)
  const addDays = (ymd, n) => {
    const d = new Date(Date.parse(`${ymd}T00:00:00Z`))
    d.setUTCDate(d.getUTCDate() + n)
    return d.toISOString().slice(0, 10)
  }
  const localKey = (d) => new Date(d.getTime() + offsetMin * 60000).toISOString().slice(0, 10)

  const gte = localMidnightUTC(from)
  const lt = localMidnightUTC(addDays(to, 1))

  const [orders, submissions] = await Promise.all([
    prisma.order.findMany({
      where: { createdAt: { gte, lt } },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true,
        shippingName: true,
        user: { select: { name: true, email: true } },
      },
    }),
    prisma.submission.findMany({
      where: { createdAt: { gte, lt } },
      select: { type: true, createdAt: true },
    }),
  ])

  // day buckets
  const days = []
  for (let d = from; d <= to; d = addDays(d, 1)) {
    days.push({ date: d, orders: 0, revenue: 0, contacts: 0, exports: 0 })
  }
  const byDate = Object.fromEntries(days.map((x) => [x.date, x]))

  for (const o of orders) {
    const b = byDate[localKey(o.createdAt)]
    if (!b) continue
    b.orders += 1
    if (PAID_STATUSES.includes(o.status)) b.revenue += Number(o.total)
  }
  for (const s of submissions) {
    const b = byDate[localKey(s.createdAt)]
    if (!b) continue
    if (s.type === 'export') b.exports += 1
    else b.contacts += 1
  }

  const totals = days.reduce(
    (a, x) => ({
      orders: a.orders + x.orders,
      revenue: a.revenue + x.revenue,
      contacts: a.contacts + x.contacts,
      exports: a.exports + x.exports,
    }),
    { orders: 0, revenue: 0, contacts: 0, exports: 0 },
  )

  return {
    from,
    to,
    days,
    totals,
    orders: orders.slice(0, 30).map((o) => ({
      id: o.id,
      total: Number(o.total),
      status: o.status,
      createdAt: o.createdAt,
      customer: o.user?.email || o.shippingName || '—',
    })),
  }
}

// GET /api/admin/stats?from=YYYY-MM-DD&to=YYYY-MM-DD&offset=<min>
const dashboardStats = asyncHandler(async (req, res) => {
  const q = req.validatedQuery || {}
  const offsetMin = Number.isFinite(q.offset) ? q.offset : 0
  const todayLocal = new Date(Date.now() + offsetMin * 60000).toISOString().slice(0, 10)

  // default range = last 7 days; a lone from/to means a single day
  let from = q.from || q.to || null
  let to = q.to || q.from || null
  if (!from) {
    const d = new Date(Date.parse(`${todayLocal}T00:00:00Z`))
    d.setUTCDate(d.getUTCDate() - 6)
    from = d.toISOString().slice(0, 10)
    to = todayLocal
  }
  if (from > to) [from, to] = [to, from]

  const [
    userCount,
    productCount,
    orderCount,
    pendingOrders,
    revenueAgg,
    productStock,
    recentOrders,
    period,
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
    buildPeriod(from, to, offsetMin),
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
      // kept for backwards compat with older UI expectations
      revenueByDay: period.days.map((d) => ({ date: d.date, revenue: d.revenue })),
      period,
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
