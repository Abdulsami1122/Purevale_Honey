import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 260 } })
await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })
const display = await page.$eval('.nav-burger', el => getComputedStyle(el).display)
console.log('nav-burger display:', display)
await browser.close()
