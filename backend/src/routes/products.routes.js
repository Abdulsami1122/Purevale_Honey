const express = require('express')
const { pool, genId } = require('../db')
const { requireAuth } = require('../auth')

const router = express.Router()

const COLLECTIONS = ['honey', 'dates', 'jaggery', 'shilajit', 'cosmetics']

function normalize(body, existing = {}) {
  const title = (body.title ?? existing.title ?? '').toString().trim()
  const collection = COLLECTIONS.includes(body.collection)
    ? body.collection
    : existing.collection || 'honey'

  const variants = Array.isArray(body.variants)
    ? body.variants
    : typeof body.variants === 'string'
      ? body.variants.split(',').map((v) => v.trim()).filter(Boolean)
      : existing.variants || ['Default']

  const priceMin = Number(body.priceMin ?? existing.priceMin) || 0
  const priceMaxRaw = body.priceMax ?? existing.priceMax
  const priceMax = priceMaxRaw === '' || priceMaxRaw == null ? null : Number(priceMaxRaw)

  return {
    title: title || 'Untitled Product',
    collection,
    image: (body.image ?? existing.image ?? '').toString().trim() || '/honey-jar.jpg',
    priceMin,
    priceMax,
    variants: variants.length ? variants : ['Default'],
    rating: Number(body.rating ?? existing.rating) || 0,
    reviews: Number(body.reviews ?? existing.reviews) || 0,
    available: body.available === undefined ? existing.available !== false : body.available !== false,
    featured: Number(body.featured ?? existing.featured) || 0,
    isCustom: true,
  }
}

// GET /api/products  (public) — admin-managed catalogue
router.get('/', async (_req, res) => {
  try {
    const result = await pool.query('SELECT * FROM products ORDER BY "createdAt" DESC')
    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// POST /api/products  (admin)
router.post('/', requireAuth, async (req, res) => {
  if (!req.body || !String(req.body.title || '').trim()) {
    return res.status(400).json({ error: 'Product title is required' })
  }
  
  try {
    const product = { id: genId('prod'), ...normalize(req.body) }
    
    const query = `
      INSERT INTO products (
        id, title, collection, image, "priceMin", "priceMax", variants, 
        rating, reviews, available, featured, "isCustom"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `
    const values = [
      product.id, product.title, product.collection, product.image,
      product.priceMin, product.priceMax, JSON.stringify(product.variants),
      product.rating, product.reviews, product.available, product.featured, product.isCustom
    ]
    
    const result = await pool.query(query, values)
    res.status(201).json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// PUT /api/products/:id  (admin)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const existing = await pool.query('SELECT * FROM products WHERE id = $1', [req.params.id])
    if (existing.rowCount === 0) return res.status(404).json({ error: 'Product not found' })

    const updated = normalize(req.body, existing.rows[0])
    
    const query = `
      UPDATE products SET
        title = $1, collection = $2, image = $3, "priceMin" = $4, "priceMax" = $5,
        variants = $6, rating = $7, reviews = $8, available = $9, featured = $10,
        "isCustom" = $11, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $12
      RETURNING *
    `
    const values = [
      updated.title, updated.collection, updated.image, updated.priceMin, updated.priceMax,
      JSON.stringify(updated.variants), updated.rating, updated.reviews, updated.available,
      updated.featured, updated.isCustom, req.params.id
    ]
    
    const result = await pool.query(query, values)
    res.json(result.rows[0])
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

// DELETE /api/products/:id  (admin)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM products WHERE id = $1', [req.params.id])
    if (result.rowCount === 0) return res.status(404).json({ error: 'Product not found' })
    res.json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Server error' })
  }
})

module.exports = router
