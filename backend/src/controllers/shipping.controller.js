const asyncHandler = require('../utils/asyncHandler')
const ApiError = require('../utils/ApiError')
const { sendSuccess } = require('../utils/apiResponse')
const prisma = require('../config/db')

const eq = (a, b) => String(a).trim().toLowerCase() === String(b).trim().toLowerCase()

// GET /api/shipping/methods?country=&city=   (public) — options for a destination
const listMethods = asyncHandler(async (req, res) => {
  const country = (req.validatedQuery?.country || '').trim()
  const city = (req.validatedQuery?.city || '').trim()

  const rates = await prisma.shippingRate.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { price: 'asc' }],
  })

  const matches = rates.filter((r) => {
    const countryOk = r.country === '*' || (country && eq(r.country, country))
    const cityOk = r.city === '*' || (city && eq(r.city, city))
    return countryOk && cityOk
  })

  // If several rates share a name, keep the most specific (city > country > any).
  const specificity = (r) => (r.city !== '*' ? 2 : 0) + (r.country !== '*' ? 1 : 0)
  const byName = new Map()
  for (const r of matches) {
    const cur = byName.get(r.name)
    if (!cur || specificity(r) > specificity(cur)) byName.set(r.name, r)
  }

  const methods = [...byName.values()]
    .sort((a, b) => a.sortOrder - b.sortOrder || Number(a.price) - Number(b.price))
    .map((r) => ({ id: r.id, name: r.name, price: Number(r.price) }))

  sendSuccess(res, 200, 'Shipping methods', { methods })
})

// GET /api/shipping   (admin) — every rate
const adminList = asyncHandler(async (_req, res) => {
  const rates = await prisma.shippingRate.findMany({
    orderBy: [{ country: 'asc' }, { city: 'asc' }, { sortOrder: 'asc' }],
  })
  sendSuccess(res, 200, 'Shipping rates', {
    rates: rates.map((r) => ({ ...r, price: Number(r.price) })),
  })
})

const createRate = asyncHandler(async (req, res) => {
  const rate = await prisma.shippingRate.create({ data: req.body })
  sendSuccess(res, 201, 'Shipping rate created', { rate: { ...rate, price: Number(rate.price) } })
})

const updateRate = asyncHandler(async (req, res) => {
  const rate = await prisma.shippingRate.update({ where: { id: req.params.id }, data: req.body })
  sendSuccess(res, 200, 'Shipping rate updated', { rate: { ...rate, price: Number(rate.price) } })
})

const deleteRate = asyncHandler(async (req, res) => {
  const existing = await prisma.shippingRate.findUnique({ where: { id: req.params.id } })
  if (!existing) throw ApiError.notFound('Shipping rate not found')
  await prisma.shippingRate.delete({ where: { id: existing.id } })
  sendSuccess(res, 200, 'Shipping rate deleted')
})

module.exports = { listMethods, adminList, createRate, updateRate, deleteRate }
