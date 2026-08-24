import { chromium } from 'playwright'

const url = process.argv[2] || 'http://localhost:5174'
const out = process.argv[3] || 'shot.png'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } })
page.on('console', (msg) => {
  if (msg.type() === 'error') console.log('ERR:', msg.text())
})
page.on('pageerror', (err) => console.log('PAGEERROR:', err.message))
await page.goto(url, { waitUntil: 'networkidle' })
await page.waitForTimeout(500)
await page.screenshot({ path: out, fullPage: true })
await browser.close()
