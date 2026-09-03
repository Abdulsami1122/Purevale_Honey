const express = require('express')
const { pool } = require('../db')
const { requireAuth } = require('../auth')
const cloudinary = require('../cloudinary')

const router = express.Router()

// Shipped defaults. Any key the admin has not overridden falls back to these,
// so the storefront always receives a complete document.
const DEFAULTS = {
  announcements: [
    'Welcome to Durrani Harvest',
    'Limited Time Offer Upto 25% Off',
  ],
  hero: {
    videoUrl: '/banner-vedio.mp4',
    subtitle: 'Pure Nature. Trusted Worldwide.',
    title: 'Nature, Sourced with Integrity.',
    description: 'Premium natural products from Pakistan, delivered to the world.',
  },
  // Built-in nav categories — always shown, not editable from admin.
  navCategories: [
    { label: 'Pure Honey', href: '/honey', icon: 'Gem', badge: 'premium', badgeTone: 'cyan' },
    { label: 'Dates', href: '/dates', icon: 'Gift', badge: 'Fresh', badgeTone: 'green' },
    { label: 'Jaggery (Gur)', href: '/jaggery', icon: 'Cookie', badge: 'Natural', badgeTone: 'amber' },
    { label: 'Shilajit', href: '/shilajit', icon: 'Mountain', badge: 'Gold', badgeTone: 'cyan' },
    { label: 'Cosmetics', href: '/cosmetics', icon: 'Sparkles', badge: 'new', badgeTone: 'amber' },
  ],
  // Admin-added categories — appended to the end of the nav, after the built-ins.
  // Each may carry `enabled: false` to hide it without deleting it.
  extraNavCategories: [],
  // hrefs of built-in categories the admin has switched off.
  disabledCategories: [],
  story: {
    image: '/hero-bg.jpg',
  },
  contact: {
    phone: '+92 333 9300672',
    whatsapp: '923339300672',
    email: 'support@durraniharvest.com',
    address: 'Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan',
  },
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
  },
}

// Arrays are replaced wholesale; plain objects are merged key by key.
function deepMerge(base, override) {
  if (override === undefined || override === null) return base
  if (Array.isArray(override) || Array.isArray(base)) return override
  if (typeof override === 'object' && typeof base === 'object') {
    const out = { ...base }
    for (const key of Object.keys(override)) {
      out[key] = deepMerge(base[key], override[key])
    }
    return out
  }
  return override
}

async function readStored() {
  const result = await pool.query(`SELECT data FROM site_settings WHERE id = 'site'`)
  return result.rows[0]?.data || {}
}

// GET /api/settings  (public)
router.get('/', async (_req, res) => {
  try {
    res.json(deepMerge(DEFAULTS, await readStored()))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not load site settings' })
  }
})

// PUT /api/settings  (admin) — merges the given patch into the stored document
router.put('/', requireAuth, async (req, res) => {
  const patch = req.body && typeof req.body === 'object' ? req.body : {}
  try {
    const next = deepMerge(await readStored(), patch)
    await pool.query(
      `INSERT INTO site_settings (id, data, "updatedAt")
       VALUES ('site', $1, CURRENT_TIMESTAMP)
       ON CONFLICT (id) DO UPDATE SET data = $1, "updatedAt" = CURRENT_TIMESTAMP`,
      [JSON.stringify(next)]
    )
    res.json(deepMerge(DEFAULTS, next))
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Could not save site settings' })
  }
})

// POST /api/settings/upload  (admin) — image or video, stored on Cloudinary
router.post('/upload', requireAuth, async (req, res) => {
  const file = typeof req.body?.file === 'string' ? req.body.file : ''
  const isImage = file.startsWith('data:image/')
  const isVideo = file.startsWith('data:video/')
  if (!isImage && !isVideo) {
    return res.status(400).json({ error: 'A valid image or video file is required' })
  }
  try {
    const result = await cloudinary.uploader.upload(file, {
      folder: 'site-content',
      resource_type: isVideo ? 'video' : 'image',
    })
    res.json({ url: result.secure_url, publicId: result.public_id })
  } catch (err) {
    console.error('[cloudinary] Site asset upload failed', err)
    res.status(502).json({ error: 'Could not upload file to Cloudinary' })
  }
})

module.exports = router
