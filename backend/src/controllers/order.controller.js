const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const { prisma, paginate, paginatedResult } = require('../models')
const { sendOrderConfirmationEmail } = require('../services/email.service')

const ORDER_INCLUDE = {
  items: true,
  user: { select: { id: true, name: true, email: true } },
}

async function resolveCoupon(code) {
  if (!code) return null
  const coupon = await prisma.coupon.findUnique({ where: { code } })
  if (!coupon || !coupon.active) throw ApiError.badRequest('Invalid coupon code')
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    throw ApiError.badRequest('This coupon has expired')
  }
  return coupon
}

// POST /api/orders  — creates an order from the caller's cart
const createOrder = asyncHandler(async (req, res) => {
  const { shipping, couponCode, shippingCost } = req.body

  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: { include: { product: true } } },
  })
  if (!cart || cart.items.length === 0) {
    throw ApiError.badRequest('Your cart is empty')
  }

  const coupon = await resolveCoupon(couponCode)

  const order = await prisma.$transaction(async (tx) => {
    let subtotal = 0
    const itemsData = []

    for (const line of cart.items) {
      // Re-read stock inside the transaction to avoid overselling.
      const product = await tx.product.findUnique({ where: { id: line.productId } })
      if (!product) throw ApiError.badRequest(`"${line.product.name}" is no longer available`)
      if (line.quantity > product.stock) {
        throw ApiError.conflict(`Only ${product.stock} unit(s) of "${product.name}" left in stock`)
      }

      const unitPrice = Number(product.price)
      subtotal += unitPrice * line.quantity
      itemsData.push({
        productId: product.id,
        name: product.name,
        variant: line.variant || '',
        price: unitPrice,
        quantity: line.quantity,
      })

      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: line.quantity } },
      })
    }

    subtotal = Number(subtotal.toFixed(2))
    const discount = coupon
      ? Number(((subtotal * coupon.discountPercent) / 100).toFixed(2))
      : 0
    const total = Number((subtotal - discount + Number(shippingCost || 0)).toFixed(2))

    const created = await tx.order.create({
      data: {
        userId: req.user.id,
        status: 'pending',
        subtotal,
        discount,
        shippingCost: Number(shippingCost || 0),
        total,
        shippingName: shipping.name,
        shippingPhone: shipping.phone,
        shippingAddress: shipping.address,
        shippingCity: shipping.city,
        shippingCountry: shipping.country,
        couponCode: coupon?.code ?? null,
        items: { create: itemsData },
      },
      include: ORDER_INCLUDE,
    })

    await tx.cartItem.deleteMany({ where: { cartId: cart.id } })
    return created
  })

  sendOrderConfirmationEmail(req.user, order).catch(() => {})
  sendSuccess(res, 201, 'Order placed', { order })
})

// GET /api/orders  — caller's own orders
const listMyOrders = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = paginate(req.validatedQuery || {})
  const where = { userId: req.user.id }
  if (req.validatedQuery?.status) where.status = req.validatedQuery.status

  const [rows, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, include: { items: true } }),
    prisma.order.count({ where }),
  ])
  sendSuccess(res, 200, 'Orders', paginatedResult(rows, total, { page, limit }))
})

// GET /api/orders/:id  — caller's own order
const getMyOrder = asyncHandler(async (req, res) => {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { items: true },
  })
  if (!order || order.userId !== req.user.id) throw ApiError.notFound('Order not found')
  sendSuccess(res, 200, 'Order', { order })
})

// GET /api/orders/admin/all  (admin)
const listAllOrders = asyncHandler(async (req, res) => {
  const { skip, take, page, limit } = paginate(req.validatedQuery || {})
  const where = {}
  if (req.validatedQuery?.status) where.status = req.validatedQuery.status

  const [rows, total] = await Promise.all([
    prisma.order.findMany({ where, orderBy: { createdAt: 'desc' }, skip, take, include: ORDER_INCLUDE }),
    prisma.order.count({ where }),
  ])
  sendSuccess(res, 200, 'All orders', paginatedResult(rows, total, { page, limit }))
})

// PATCH /api/orders/:id/status  (admin)
const updateOrderStatus = asyncHandler(async (req, res) => {
  const order = await prisma.order.update({
    where: { id: req.params.id },
    data: { status: req.body.status },
    include: ORDER_INCLUDE,
  })
  sendSuccess(res, 200, 'Order status updated', { order })
})

module.exports = {
  createOrder,
  listMyOrders,
  getMyOrder,
  listAllOrders,
  updateOrderStatus,
}
