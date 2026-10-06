import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2]
const query = process.argv[3] ?? '?webgl=0'
const w = Number(process.argv[4] ?? 1440)
const h = Number(process.argv[5] ?? 900)
const tag = process.argv[6] ?? 'd'
const out = './qa-shots'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const page = await (await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700 })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)) })
await page.goto(base + '/' + query, { waitUntil: 'load' })
await page.waitForTimeout(3500)
await page.screenshot({ path: `${out}/${tag}-hero.png` })

const ids = ['projects', 'also', 'about', 'experience', 'stack', 'contact']
for (const id of ids) {
  await page.evaluate((i) => {
    const el = document.getElementById(i)
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' })
  }, id)
  await page.waitForTimeout(id === 'projects' ? 2500 : 1800)
  if (id === 'experience' || id === 'about' || id === 'stack') {
    await page.mouse.wheel(0, 250)
    await page.waitForTimeout(900)
  }
  await page.screenshot({ path: `${out}/${tag}-${id}.png` })
}
const metrics = await page.evaluate(() => ({ scrollW: document.documentElement.scrollWidth, innerW: innerWidth }))
console.log(JSON.stringify({ metrics, errors }))
await browser.close()
