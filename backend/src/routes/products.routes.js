const express = require('express')
const { pool, genId } = require('../db')
const { requireAuth } = require('../auth')
const cloudinary = require('../cloudinary')

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
  const discountPercent = Math.min(100, Math.max(0, Number(body.discountPercent ?? existing.discountPercent) || 0))

  const image = (body.image ?? existing.image ?? '').toString().trim()
  if (image.startsWith('data:image/') && image.length > 4 * 1024 * 1024) {
    throw new Error('Product image is too large')
  }

  return {
    title: title || 'Untitled Product',
    collection,
    image: image || '/honey-jar.jpg',
    priceMin,
    priceMax,
    discountPercent,
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

// POST /api/products/upload-image (admin) — stores product images in Cloudinary
router.post('/upload-image', requireAuth, async (req, res) => {
  const image = typeof req.body?.image === 'string' ? req.body.image : ''
  if (!image.startsWith('data:image/')) {
    return res.status(400).json({ error: 'A valid image is required' })
  }

  try {
    const result = await cloudinary.uploader.upload(image, {
      folder: 'practice-images',
      resource_type: 'image',
    })
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('[cloudinary] Image upload failed', err)
    res.status(502).json({ error: 'Could not upload image to Cloudinary' })
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
        id, title, collection, image, "priceMin", "priceMax", "discountPercent", variants, 
        rating, reviews, available, featured, "isCustom"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `
    const values = [
      product.id, product.title, product.collection, product.image,
      product.priceMin, product.priceMax, product.discountPercent, JSON.stringify(product.variants),
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
        "discountPercent" = $6, variants = $7, rating = $8, reviews = $9, available = $10, featured = $11,
        "isCustom" = $12, "updatedAt" = CURRENT_TIMESTAMP
      WHERE id = $13
      RETURNING *
    `
    const values = [
      updated.title, updated.collection, updated.image, updated.priceMin, updated.priceMax, updated.discountPercent,
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
