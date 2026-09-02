const express = require('express')
const { pool, genId } = require('../db')
const { requireAuth } = require('../auth')

const router = express.Router()

const STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

// POST /api/orders  (public) — placed from checkout
router.post('/', async (req, res) => {
  const b = req.body || {}
  const items = Array.isArray(b.items) ? b.items : []

  if (items.length === 0) {
    return res.status(400).json({ error: 'Order must contain at least one item' })
  }
  if (!b.customer || !b.customer.email) {
    return res.status(400).json({ error: 'Customer email is required' })
  }

  const cleanItems = items.map((it) => ({
    productId: it.productId || null,
    title: String(it.title || 'Item'),
    variant: it.variant || null,
    price: Number(it.price) || 0,
    quantity: Math.max(1, Number(it.quantity) || 1),
    image: it.image || null,
  }))

  const subtotal = cleanItems.reduce((s, it) => s + it.price * it.quantity, 0)
  const shipping = Number(b.shippingCost) || 0
  const total = subtotal + shipping

  const orderId = genId('DH').toUpperCase()
  
  const client = await pool.connect()
  try {
    await client.query('BEGIN')

    const orderQuery = `
      INSERT INTO orders (
        id, status, customer_email, "customer_firstName", "customer_lastName", customer_phone,
        shipping_country, shipping_address, shipping_apartment, shipping_city, shipping_postalCode,
        "paymentMethod", "billingSameAsShipping", subtotal, "shippingCost", total
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
      RETURNING *
    `
    const orderValues = [
      orderId, 'pending', String(b.customer.email), b.customer.firstName || '',
      b.customer.lastName || '', b.customer.phone || '', b.shipping?.country || '',
      b.shipping?.address || '', b.shipping?.apartment || '', b.shipping?.city || '',
      b.shipping?.postalCode || '', b.paymentMethod === 'bank' ? 'bank' : 'cod',
      b.billingSameAsShipping !== false, subtotal, shipping, total
    ]
    
    const result = await client.query(orderQuery, orderValues)
    const order = result.rows[0]
    order.items = []

    for (const item of cleanItems) {
      const itemQuery = `
        INSERT INTO order_items (order_id, "productId", title, variant, price, quantity, image)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `
      const itemValues = [
        orderId, item.productId, item.title, item.variant, item.price, item.quantity, item.image
      ]
      const itemResult = await client.query(itemQuery, itemValues)
      order.items.push(itemResult.rows[0])
    }

    await client.query('COMMIT')
    
    // Formatting to match previous nested structure
    const formattedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      status: order.status,
      customer: {
        email: order.customer_email,
        firstName: order.customer_firstName,
        lastName: order.customer_lastName,
        phone: order.customer_phone
      },
      shipping: {
        country: order.shipping_country,
        address: order.shipping_address,
        apartment: order.shipping_apartment,
        city: order.shipping_city,
        postalCode: order.shipping_postalCode
      },
      paymentMethod: order.paymentMethod,
      billingSameAsShipping: order.billingSameAsShipping,
      items: order.items,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total
    }
    
    res.status(201).json(formattedOrder)
  } catch (err) {
    await client.query('ROLLBACK')
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  } finally {
    client.release()
  }
})

// GET /api/orders  (admin)
router.get('/', requireAuth, async (req, res) => {
  try {
    const { status, q } = req.query
    let query = 'SELECT * FROM orders'
    let values = []
    let conditions = []
    
    if (status && STATUSES.includes(status)) {
      conditions.push(`status = $${values.length + 1}`)
      values.push(status)
    }
    
    if (q) {
      const needle = `%${String(q).toLowerCase()}%`
      conditions.push(`(
        LOWER(id) LIKE $${values.length + 1} OR 
        LOWER(customer_email) LIKE $${values.length + 1} OR 
        LOWER("customer_firstName" || ' ' || "customer_lastName") LIKE $${values.length + 1}
      )`)
      values.push(needle)
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ')
    }
    
    query += ' ORDER BY "createdAt" DESC'
    
    const result = await pool.query(query, values)
    
    // Format rows to match the old structure
    const formattedOrders = result.rows.map(order => ({
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      status: order.status,
      customer: {
        email: order.customer_email,
        firstName: order.customer_firstName,
        lastName: order.customer_lastName,
        phone: order.customer_phone
      },
      shipping: {
        country: order.shipping_country,
        address: order.shipping_address,
        apartment: order.shipping_apartment,
        city: order.shipping_city,
        postalCode: order.shipping_postalCode
      },
      paymentMethod: order.paymentMethod,
      billingSameAsShipping: order.billingSameAsShipping,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total
    }))
    
    res.json(formattedOrders)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/orders/:id  (admin)
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Order not found' })
    
    const order = result.rows[0]
    
    const itemsResult = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [order.id])
    
    const formattedOrder = {
      id: order.id,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      status: order.status,
      customer: {
        email: order.customer_email,
        firstName: order.customer_firstName,
        lastName: order.customer_lastName,
        phone: order.customer_phone
      },
      shipping: {
        country: order.shipping_country,
        address: order.shipping_address,
        apartment: order.shipping_apartment,
        city: order.shipping_city,
        postalCode: order.shipping_postalCode
      },
      paymentMethod: order.paymentMethod,
      billingSameAsShipping: order.billingSameAsShipping,
      items: itemsResult.rows,
      subtotal: order.subtotal,
      shippingCost: order.shippingCost,
      total: order.total
    }
    
    res.json(formattedOrder)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PATCH /api/orders/:id  (admin) — update status
router.patch('/:id', requireAuth, async (req, res) => {
  try {
    const { status } = req.body || {}
    if (!STATUSES.includes(status)) {
      return res.status(400).json({ error: `status must be one of: ${STATUSES.join(', ')}` })
    }
    
    const result = await pool.query(
      'UPDATE orders SET status = $1, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id]
    )
    
    if (result.rowCount === 0) return res.status(404).json({ error: 'Order not found' })
    
    // Keep it simple and return the raw row + nested structure
    const order = result.rows[0]
    res.json({
      ...order,
      customer: {
        email: order.customer_email,
        firstName: order.customer_firstName,
        lastName: order.customer_lastName,
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
module.exports.STATUSES = STATUSES
