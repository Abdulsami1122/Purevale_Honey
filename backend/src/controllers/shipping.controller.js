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
    // Country: "*" always applies; otherwise it must match the chosen country.
    // (If the customer hasn't picked a country yet, only "*" rates apply.)
    const countryOk = r.country === '*' || (country ? eq(r.country, country) : false)
    if (!countryOk) return false

    // City only *narrows* the list — and only once we actually know the city.
    // A city-specific rate is still offered while the city field is blank, so a
    // method the admin just created always shows up at checkout.
    if (r.city === '*') return true
    if (!city) return true
    return eq(r.city, city)
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

// Pick the nicest display spelling for a set of same-name-different-case values
// e.g. ["pakistan", "Pakistan"] -> "Pakistan".
const canonical = (values) =>
  [...values].sort((a, b) => {
    const ups = (s) => (s.match(/[A-Z]/g) || []).length
    return ups(b) - ups(a) || a.localeCompare(b)
  })[0]

// GET /api/shipping/locations   (public) — the countries + cities the admin has
// configured active rates for, so the checkout can show them as dropdowns.
// Grouping is case-insensitive so "pakistan" and "Pakistan" collapse into one.
const listLocations = asyncHandler(async (_req, res) => {
  const rates = await prisma.shippingRate.findMany({
    where: { active: true },
    orderBy: [{ sortOrder: 'asc' }, { price: 'asc' }],
  })

  // lowercase country -> { names:Set, cities: Map(lowercase city -> { names:Set, price:number }) }
  const acc = new Map()
  for (const r of rates) {
    if (r.country === '*' || r.city === '*') continue
    const ck = r.country.trim().toLowerCase()
    if (!acc.has(ck)) acc.set(ck, { names: new Set(), cities: new Map() })
    const entry = acc.get(ck)
    entry.names.add(r.country.trim())

    const tk = r.city.trim().toLowerCase()
    const price = Number(r.price)
    if (!entry.cities.has(tk)) entry.cities.set(tk, { names: new Set(), price })
    const cityEntry = entry.cities.get(tk)
    cityEntry.names.add(r.city.trim())
    if (price < cityEntry.price) cityEntry.price = price
  }

  const countries = []
  const citiesByCountry = {}
  for (const { names, cities } of acc.values()) {
    const countryName = canonical(names)
    countries.push(countryName)
    citiesByCountry[countryName] = [...cities.values()]
      .map((c) => ({ city: canonical(c.names), price: c.price }))
      .sort((a, b) => a.city.localeCompare(b.city))
  }
  countries.sort((a, b) => a.localeCompare(b))

  sendSuccess(res, 200, 'Shipping locations', { countries, citiesByCountry })
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

module.exports = { listMethods, listLocations, adminList, createRate, updateRate, deleteRate }
