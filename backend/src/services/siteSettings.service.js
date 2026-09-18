// Editable site content — one JSON row (key = "site"). GET merges the stored
// document over DEFAULTS so the storefront always receives every field.
const prisma = require('../config/db')

const KEY = 'site'

const DEFAULTS = {
  // Brand mark used in the nav, footer, and admin sidebar/login.
  logoUrl: '/logo.png',
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
    email: 'durraniharvest@gmail.com',
    address: 'Hayatabad, Peshawar, Khyber Pakhtunkhwa, Pakistan',
  },
  socials: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    youtube: 'https://youtube.com',
    tiktok: 'https://tiktok.com',
  },
  // Certification images shown on the home page (admin-managed gallery).
  certifications: [],
  // Shown on checkout when the customer picks "Bank Deposit".
  bankDeposit: {
    bankName: '',
    accountTitle: '',
    accountNumber: '',
    iban: '',
    branch: '',
    whatsapp: '03339285792',
    instructions:
      'After placing your order, transfer the total to the account above and send a screenshot of the payment receipt to our WhatsApp number.',
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
// Removing a nav entry mirrors the deletion back onto that Category row, as
// long as no product still uses it (same safety rule as /admin/categories).
async function syncCategoriesFromNav(extraNavCategories, previousExtraNavCategories) {
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

  // Anything that dropped out of the list gets removed too, unless a product
  // still references it — mirrors "Cannot delete: N product(s) still use
  // this category" from the dedicated Categories page, just silent here.
  const currentSet = new Set(names.map((n) => n.toLowerCase()))
  const previousNames = Array.isArray(previousExtraNavCategories)
    ? [...new Set(previousExtraNavCategories.map((c) => c?.label?.trim()).filter(Boolean))]
    : []
  for (const name of previousNames) {
    if (currentSet.has(name.toLowerCase())) continue
    const existing = await prisma.category.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } },
      include: { _count: { select: { products: true } } },
    })
    if (existing && existing._count.products === 0) {
      await prisma.category.delete({ where: { id: existing.id } }).catch(() => {})
    }
  }
}

async function updateSettings(patch) {
  const previous = await readStored()
  const next = deepMerge(previous, patch && typeof patch === 'object' ? patch : {})
  await prisma.siteSetting.upsert({
    where: { key: KEY },
    create: { key: KEY, data: next },
    update: { data: next },
  })
  if (patch && Array.isArray(patch.extraNavCategories)) {
    await syncCategoriesFromNav(patch.extraNavCategories, previous.extraNavCategories)
  }
  return deepMerge(DEFAULTS, next)
}

module.exports = { DEFAULTS, getSettings, updateSettings }
