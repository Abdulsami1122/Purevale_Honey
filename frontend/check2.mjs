import { chromium } from 'playwright'
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 260 } })
await page.goto('http://localhost:5174', { waitUntil: 'networkidle' })
const info = await page.evaluate(() => {
  const mq = window.matchMedia('(max-width: 1200px)').matches
  const w = window.innerWidth
  const el = document.querySelector('.nav-burger')
  const rules = []
  for (const sheet of document.styleSheets) {
    try {
      for (const rule of sheet.cssRules) {
        if (rule.selectorText && rule.selectorText.includes('nav-burger')) {
          rules.push(rule.cssText)
        }
        if (rule.media && rule.cssText.includes('nav-burger')) {
          rules.push(rule.cssText)
        }
      }
    } catch (e) {}
  }
  return { mq, w, rules }
})
console.log(JSON.stringify(info, null, 2))
await browser.close()
