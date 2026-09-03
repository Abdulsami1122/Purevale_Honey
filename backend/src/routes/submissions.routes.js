const express = require('express')
const { pool, genId } = require('../db')
const { requireAuth } = require('../auth')

const router = express.Router()

async function listSubmissions(table) {
  const columns = await pool.query(
    'SELECT column_name FROM information_schema.columns WHERE table_name = $1',
    [table]
  )
  const columnNames = new Set(columns.rows.map((row) => row.column_name))
  const createdColumn = columnNames.has('createdAt') ? '"createdAt"' : 'created_at'
  const result = await pool.query(`SELECT * FROM ${table} ORDER BY ${createdColumn} DESC`)
  return result.rows.map(({ created_at: snakeDate, createdAt: camelDate, ...row }) => ({
    ...row,
    createdAt: camelDate || snakeDate,
  }))
}

router.post('/export', async (req, res) => {
  const { companyName, email, destination, product, message } = req.body || {}
  if (!String(companyName || '').trim() || !String(email || '').trim() || !String(destination || '').trim() || !String(product || '').trim()) {
    return res.status(400).json({ error: 'Company, email, destination, and product are required' })
  }
  try {
    const result = await pool.query(
      `INSERT INTO export_inquiries (id, "companyName", email, destination, product, message)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [genId('inquiry'), companyName.trim(), email.trim().toLowerCase(), destination.trim(), product.trim(), String(message || '').trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save export inquiry' })
  }
})

router.post('/contact', async (req, res) => {
  const { name, phone, email, message } = req.body || {}
  if (!String(name || '').trim() || !String(phone || '').trim() || !String(email || '').trim() || !String(message || '').trim()) {
    return res.status(400).json({ error: 'Name, phone, email, and message are required' })
  }
  try {
    const result = await pool.query(
      `INSERT INTO contact_submissions (id, name, phone, email, message)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [genId('contact'), name.trim(), phone.trim(), email.trim().toLowerCase(), message.trim()]
    )
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save contact message' })
  }
})

router.get('/export', requireAuth, async (_req, res) => {
  try {
    res.json(await listSubmissions('export_inquiries'))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load export inquiries' })
  }
})

router.get('/contact', requireAuth, async (_req, res) => {
  try {
    res.json(await listSubmissions('contact_submissions'))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load contact messages' })
  }
})

module.exports = router
