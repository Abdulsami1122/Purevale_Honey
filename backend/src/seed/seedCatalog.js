/**
 * Seeds the 5 storefront categories and their starter products so the shop,
 * cart and checkout work end-to-end against real product IDs.
 *
 *   npm run seed:catalog          # no-op if products already exist
 *   npm run seed:catalog -- --force   # wipe products + reseed
 */
require('dotenv').config()
const prisma = require('../config/db')

const CATALOG = {
  Honey: [
    ['Multi Flower Honey', 850, ['250g', '500g', '1kg'], 30],
    ['Forest Sidr Squeeze Jar', 3500, ['500g'], 18],
    ['Multi Flower Honey Squeeze Jar', 700, ['250g', '500g'], 25],
    ['Robinia Honey', 2500, ['500g'], 12],
    ['Premium Honey Nuts', 2000, ['300g'], 20],
    ['Royal Jelly Liquid', 9500, ['250g'], 8],
    ['Sidr Beri Honey', 4200, ['500g', '1kg'], 22],
    ['Acacia Honey', 1800, ['250g', '500g'], 26],
    ['Black Seed Honey', 3200, ['500g'], 14],
    ['Orange Blossom Honey', 2750, ['500g'], 0],
    ['Natural Honey Comb', 5500, ['400g'], 9],
    ['Himalayan Wildflower Honey', 3100, ['500g', '1kg'], 16],
  ],
  Dates: [
    ['Ajwa Dates Premium (Madinah)', 2800, ['500g', '1kg'], 21],
    ['Medjool Jumbo Dates', 1900, ['500g', '1kg'], 18],
    ['Organic Kalmi Dates', 900, ['500g'], 24],
    ['Khudri Dates Gift Box', 3400, ['1kg Box'], 10],
    ['Stuffed Dates with Almond & Honey', 2200, ['400g'], 13],
    ['Natural Organic Date Syrup', 1300, ['350ml'], 15],
  ],
  Jaggery: [
    ['Traditional Desi Jaggery (Gur) Cubes', 650, ['500g', '1kg'], 30],
    ['Dry Fruit & Almond Masala Gur', 1250, ['500g', '1kg'], 24],
    ['Pure Organic Shakkar (Jaggery Powder)', 550, ['500g', '1kg'], 28],
    ['Ginger & Fennel Herbal Detox Gur', 750, ['500g'], 12],
    ['Raw Unrefined Sugarcane Gur Block', 800, ['1kg Block'], 15],
  ],
  Shilajit: [
    ['Himalayan Shilajit Resin', 4500, ['20g', '50g'], 27],
    ['Shilajit Honey Blend', 3800, ['250g'], 11],
    ['Shilajit Capsules', 2600, ['60 caps'], 7],
    ['Gold Grade Shilajit', 9800, ['30g'], 6],
    ['Shilajit Liquid Drops', 3100, ['100ml'], 9],
    ['Shilajit Trial Pack', 1500, ['10g'], 0],
  ],
  Cosmetics: [
    ['Beeswax Repair Cream (Royal Jelly & Propolis)', 1850, ['50ml', '100ml'], 19],
    ['Propolis Renewal Serum (Honey & Botanicals)', 2400, ['30ml'], 28],
    ['Pure Sidr Honey Face Glow & Detox Mask', 1650, ['100g', '200g'], 14],
    ['Natural Honey & Vitamin E Beeswax Lip Balm', 550, ['15g'], 32],
    ['Organic Black Seed & Honey Hair Elixir', 1450, ['100ml', '200ml'], 11],
    ['Bee Propolis Intensive Skin Healing Salve', 1250, ['50g'], 9],
  ],
}

const IMAGE = {
  Honey: '/honey-jar.jpg',
  Dates: '/dates.jpg',
  Jaggery: '/jaggery.jpg',
  Shilajit: '/honey-jar.jpg',
  Cosmetics: '/cosmetics.jpg',
}

async function main() {
  const force = process.argv.includes('--force')
  const existing = await prisma.product.count()

  if (existing > 0 && !force) {
    console.log(`${existing} products already exist — skipping. Use --force to reseed.`)
    return
  }
  if (force) {
    await prisma.orderItem.updateMany({ data: { productId: null } })
    await prisma.cartItem.deleteMany({})
    await prisma.review.deleteMany({})
    await prisma.product.deleteMany({})
    console.log('Existing products cleared.')
  }

  for (const [categoryName, items] of Object.entries(CATALOG)) {
    const category = await prisma.category.upsert({
      where: { name: categoryName },
      create: { name: categoryName },
      update: {},
    })

    for (const [name, price, variants, stock] of items) {
      await prisma.product.create({
        data: {
          name,
          description: `${name} — 100% pure and natural, sourced with integrity by Purevale Honey.`,
          price,
          stock,
          images: [IMAGE[categoryName]],
          variants: variants.map((label) => ({ label })),
          categoryId: category.id,
        },
      })
    }
    console.log(`Seeded ${items.length} products in "${categoryName}".`)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
