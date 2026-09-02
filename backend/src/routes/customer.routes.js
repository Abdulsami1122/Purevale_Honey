const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool } = require('../db')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

const router = express.Router()

// POST /api/customer/register
router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body || {}
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const username = `${firstName || ''} ${lastName || ''}`.trim() || 'User'
    const lowerEmail = String(email).toLowerCase()

    // Check if user exists
    const existing = await pool.query('SELECT * FROM users WHERE email = $1', [lowerEmail])
    if (existing.rowCount > 0) {
      return res.status(400).json({ error: 'Email is already registered' })
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const result = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email, created_at',
      [username, lowerEmail, passwordHash]
    )

    const user = result.rows[0]

    // We can issue a token immediately upon registration if we want to auto-login
    const token = jwt.sign({ sub: user.id, email: user.email, role: 'customer' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    res.status(201).json({ token, user })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/customer/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const lowerEmail = String(email).toLowerCase()

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [lowerEmail])
    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const user = result.rows[0]

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = jwt.sign({ sub: user.id, email: user.email, role: 'customer' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    res.json({ token, user: { id: user.id, username: user.username, email: user.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
