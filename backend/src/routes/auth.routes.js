const express = require('express')
const {
  findAdminByEmail,
  verifyPassword,
  issueToken,
  updateAdminPassword,
  requireAuth,
} = require('../auth')

const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body || {}
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    const admin = await findAdminByEmail(email)
    if (!admin || !verifyPassword(password, admin.passwordHash)) {
      return res.status(401).json({ error: 'Invalid email or password' })
    }

    const token = issueToken(admin)
    res.json({ token, admin: { id: admin.id, email: admin.email } })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({ admin: req.admin })
})

// POST /api/auth/change-password
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body || {}
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current and new password are required' })
    }
    if (String(newPassword).length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' })
    }

    const admin = await findAdminByEmail(req.admin.email)
    if (!admin || !verifyPassword(currentPassword, admin.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect' })
    }

    await updateAdminPassword(admin.id, newPassword)
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
