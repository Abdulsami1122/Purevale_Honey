// Editable site content — one JSON row (key = "site"). GET merges the stored
// document over DEFAULTS so the storefront always receives every field.
const prisma = require('../config/db')

const KEY = 'site'

const DEFAULTS = {
  announcements: ['Welcome to Purevale Honey', 'Limited Time Offer Upto 25% Off'],
  hero: {
    videoUrl: '/banner-vedio.mp4',
    subtitle: 'Pure Nature. Trusted Worldwide.',
    title: 'Nature, Sourced with Integrity.',
    description: 'Premium natural products from Pakistan, delivered to the world.',
  },
  // Built-in nav categories are fixed on the client; only extras + disabled here.
  extraNavCategories: [],
  disabledCategories: [],
  story: { image: '/hero-bg.jpg' },
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

// Arrays replace wholesale; plain objects merge key by key.
function deepMerge(base, override) {
  if (override === undefined || override === null) return base
  if (Array.isArray(override) || Array.isArray(base)) return override
  if (typeof override === 'object' && typeof base === 'object') {
    const out = { ...base }
    for (const k of Object.keys(override)) out[k] = deepMerge(base[k], override[k])
    return out
  }
  return override
}

async function readStored() {
  const row = await prisma.siteSetting.findUnique({ where: { key: KEY } })
  return row?.data || {}
}

async function getSettings() {
  return deepMerge(DEFAULTS, await readStored())
}

// Nav categories are just links, but admins think of them as "creating a
// category" — so make sure a real Category row exists for each one, which is
// what the product-form dropdown and /:slug storefront pages read from.
async function syncCategoriesFromNav(extraNavCategories) {
  if (!Array.isArray(extraNavCategories)) return
  const names = [...new Set(extraNavCategories.map((c) => c?.label?.trim()).filter(Boolean))]
  // Sequential + case-insensitive lookup so "Jams" doesn't create a duplicate
  // of an existing "jams" (Postgres unique constraints are case-sensitive).
  for (const name of names) {
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
    })
    if (!existing) {
      await prisma.category.create({ data: { name } }).catch(() => {})
    }
  }
}

async function updateSettings(patch) {
  const next = deepMerge(await readStored(), patch && typeof patch === 'object' ? patch : {})
  await prisma.siteSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, data: next },
    update: { data: next },
  })
  if (patch && Array.isArray(patch.extraNavCategories)) {
    await syncCategoriesFromNav(patch.extraNavCategories)
  }
  return deepMerge(DEFAULTS, next)
}

module.exports = { DEFAULTS, getSettings, updateSettings }
