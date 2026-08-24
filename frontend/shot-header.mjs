import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 260 } })
await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: 'shot-header.png' })
await browser.close()
