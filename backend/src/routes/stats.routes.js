const express = require('express')
const { pool } = require('../db')
const { requireAuth } = require('../auth')

const router = express.Router()

// GET /api/stats  (admin) — dashboard summary
router.get('/', requireAuth, async (_req, res) => {
  try {
    const ordersResult = await pool.query('SELECT * FROM orders ORDER BY "createdAt" DESC')
    const orders = ordersResult.rows

    const productsResult = await pool.query('SELECT COUNT(*) FROM products')
    const productCount = parseInt(productsResult.rows[0].count)

    const paidOrders = orders.filter((o) => o.status !== 'cancelled')
    const totalRevenue = paidOrders.reduce((s, o) => s + Number(o.total || 0), 0)

    const byStatus = orders.reduce((acc, o) => {
      acc[o.status] = (acc[o.status] || 0) + 1
      return acc
    }, {})

    // Revenue for the last 7 calendar days
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setUTCHours(0, 0, 0, 0)
      d.setUTCDate(d.getUTCDate() - i)
      const key = d.toISOString().slice(0, 10)
      const dayRevenue = paidOrders
        .filter((o) => {
          const orderDate = new Date(o.createdAt)
          return orderDate.toISOString().slice(0, 10) === key
        })
        .reduce((s, o) => s + Number(o.total || 0), 0)
      days.push({ date: key, revenue: dayRevenue })
    }

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      pendingOrders: byStatus.pending || 0,
      productCount,
      ordersByStatus: byStatus,
      revenueByDay: days,
      recentOrders: orders.slice(0, 6).map((o) => ({
        ...o,
        customer: {
          email: o.customer_email,
          firstName: o.customer_firstName,
          lastName: o.customer_lastName
        }
      })),
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
