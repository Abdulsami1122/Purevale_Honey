const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { pool, genId } = require('./db')

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/** Create the seed admin from env vars the first time the server runs. */
async function ensureSeedAdmin() {
  const result = await pool.query('SELECT COUNT(*) FROM admins')
  if (parseInt(result.rows[0].count) > 0) return

  const email = (process.env.ADMIN_EMAIL || 'admin@durraniharvest.com').toLowerCase()
  const password = process.env.ADMIN_PASSWORD || 'admin12345'
  const passwordHash = bcrypt.hashSync(password, 10)

  await pool.query(
    'INSERT INTO admins (id, email, "passwordHash") VALUES ($1, $2, $3)',
    [genId('admin'), email, passwordHash]
  )
  console.log(`[auth] Seed admin created: ${email}`)
}

async function findAdminByEmail(email) {
  const result = await pool.query('SELECT * FROM admins WHERE email = $1', [String(email).toLowerCase()])
  return result.rows[0]
}

function verifyPassword(plain, hash) {
  return bcrypt.compareSync(plain, hash)
}

function issueToken(admin) {
  return jwt.sign({ sub: admin.id, email: admin.email }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  })
}

async function updateAdminPassword(id, newPassword) {
  const passwordHash = bcrypt.hashSync(newPassword, 10)
  const result = await pool.query(
    'UPDATE admins SET "passwordHash" = $1 WHERE id = $2 RETURNING id',
    [passwordHash, id]
  )
  return result.rowCount > 0
}

/** Express middleware — rejects unless a valid Bearer token is present. */
function requireAuth(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Authentication required' })

  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.admin = { id: payload.sub, email: payload.email }
    next()
  } catch {
    res.status(401).json({ error: 'Invalid or expired session' })
  }
}

module.exports = {
  ensureSeedAdmin,
  findAdminByEmail,
  verifyPassword,
  issueToken,
  updateAdminPassword,
  requireAuth,
}
