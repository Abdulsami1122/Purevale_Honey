const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

const CART_INCLUDE = {
  items: {
    orderBy: { id: 'asc' },
    include: {
      product: {
        select: { id: true, name: true, price: true, images: true, stock: true },
      },
    },
  },
}

async function getOrCreateCart(userId) {
  return prisma.cart.upsert({
    where: { userId },
    create: { userId },
    update: {},
    include: CART_INCLUDE,
  })
}

function serialiseCart(cart) {
  const items = cart.items.map((item) => {
    const unitPrice = Number(item.product.price)
    return {
      id: item.id,
      productId: item.productId,
      name: item.product.name,
      image: item.product.images?.[0] || null,
      variant: item.variant || null,
      unitPrice,
      quantity: item.quantity,
      lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
      inStock: item.product.stock,
    }
  })
  const subtotal = Number(items.reduce((sum, i) => sum + i.lineTotal, 0).toFixed(2))
  return { id: cart.id, items, subtotal, itemCount: items.reduce((n, i) => n + i.quantity, 0) }
}

// GET /api/cart
const getCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id)
  sendSuccess(res, 200, 'Cart', { cart: serialiseCart(cart) })
})

// POST /api/cart/items
const addItem = asyncHandler(async (req, res) => {
  const { productId, variant, quantity } = req.body

  const product = await prisma.product.findUnique({ where: { id: productId } })
  if (!product) throw ApiError.notFound('Product not found')

  const cart = await prisma.cart.upsert({
    where: { userId: req.user.id },
    create: { userId: req.user.id },
    update: {},
  })

  const existing = await prisma.cartItem.findUnique({
    where: { cartId_productId_variant: { cartId: cart.id, productId, variant } },
  })
  const nextQty = (existing?.quantity || 0) + quantity
  if (nextQty > product.stock) {
    throw ApiError.badRequest(`Only ${product.stock} unit(s) of "${product.name}" in stock`)
  }

  await prisma.cartItem.upsert({
    where: { cartId_productId_variant: { cartId: cart.id, productId, variant } },
    create: { cartId: cart.id, productId, variant, quantity },
    update: { quantity: nextQty },
  })

  const fresh = await prisma.cart.findUnique({ where: { id: cart.id }, include: CART_INCLUDE })
  sendSuccess(res, 200, 'Item added to cart', { cart: serialiseCart(fresh) })
})

// PATCH /api/cart/items/:itemId   (quantity 0 removes the line)
const updateItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body

  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.itemId },
    include: { cart: true, product: true },
  })
  if (!item || item.cart.userId !== req.user.id) throw ApiError.notFound('Cart item not found')

  if (quantity === 0) {
    await prisma.cartItem.delete({ where: { id: item.id } })
  } else {
    if (quantity > item.product.stock) {
      throw ApiError.badRequest(`Only ${item.product.stock} unit(s) in stock`)
    }
    await prisma.cartItem.update({ where: { id: item.id }, data: { quantity } })
  }

  const fresh = await prisma.cart.findUnique({ where: { id: item.cartId }, include: CART_INCLUDE })
  sendSuccess(res, 200, 'Cart updated', { cart: serialiseCart(fresh) })
})

// DELETE /api/cart/items/:itemId
const removeItem = asyncHandler(async (req, res) => {
  const item = await prisma.cartItem.findUnique({
    where: { id: req.params.itemId },
    include: { cart: true },
  })
  if (!item || item.cart.userId !== req.user.id) throw ApiError.notFound('Cart item not found')

  await prisma.cartItem.delete({ where: { id: item.id } })
  const fresh = await prisma.cart.findUnique({ where: { id: item.cartId }, include: CART_INCLUDE })
  sendSuccess(res, 200, 'Item removed', { cart: serialiseCart(fresh) })
})

// DELETE /api/cart
const clearCart = asyncHandler(async (req, res) => {
  const cart = await getOrCreateCart(req.user.id)
  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } })
  sendSuccess(res, 200, 'Cart cleared', { cart: { id: cart.id, items: [], subtotal: 0, itemCount: 0 } })
})

module.exports = {
  getOrCreateCart,
  serialiseCart,
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
}
