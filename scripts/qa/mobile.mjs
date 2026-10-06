import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2]
const out = './qa-shots'
fs.mkdirSync(out, { recursive: true })
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)))
page.on('console', (m) => { if (['error'].includes(m.type())) errors.push(m.text().slice(0, 200)) })
const cdp = await ctx.newCDPSession(page)
const touch = (type, x, y) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y, id: 1 }] })

await page.goto(base + '/', { waitUntil: 'load' })
await page.waitForTimeout(3500)
await page.screenshot({ path: `${out}/m-hero.png` })
await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
await page.waitForTimeout(5000)
const r = {}
const stage = page.locator('[data-mode]')
r.mode = await stage.getAttribute('data-mode')
r.quality = await stage.getAttribute('data-quality')
await page.screenshot({ path: `${out}/m-stage.png` })

const tab = () => page.locator('#projects [role=tab][aria-selected=true]').innerText().then((t) => t.replace(/\s+/g, ' '))
r.tab0 = await tab()
// horizontal swipe in the upper (scene) area
await touch('touchStart', 300, 330)
for (let i = 1; i <= 12; i++) { await touch('touchMove', 300 - i * 18, 332); await page.waitForTimeout(16) }
await touch('touchEnd')
await page.waitForTimeout(2200)
r.tabAfterSwipe = await tab()
await page.screenshot({ path: `${out}/m-slide2.png` })

// vertical swipe must still scroll the page (no scroll trap)
const y0 = await page.evaluate(() => window.scrollY)
await touch('touchStart', 200, 330)
for (let i = 1; i <= 10; i++) { await touch('touchMove', 200, 330 - i * 20); await page.waitForTimeout(16) }
await touch('touchEnd')
await page.waitForTimeout(700)
r.verticalScrolled = (await page.evaluate(() => window.scrollY)) > y0

// explainer on mobile via the component list
await page.evaluate(() => document.getElementById('stage-details').scrollIntoView({ behavior: 'instant' }))
await page.waitForTimeout(500)
await page.locator('#stage-details ul button', { hasText: 'Groq LLM' }).first().tap().catch(async () => { await page.locator('#stage-details ul button').nth(3).click() })
await page.waitForTimeout(2500)
r.dialog = await page.locator('[role=dialog]').count()
await page.screenshot({ path: `${out}/m-modal.png` })
r.closeVisible = await page.getByRole('button', { name: /Close/ }).isVisible()
await page.getByRole('button', { name: /Close/ }).click()
await page.waitForTimeout(1200)
r.closed = (await page.locator('[role=dialog]').count()) === 0
r.scrollW = await page.evaluate(() => [document.documentElement.scrollWidth, innerWidth])
r.errors = errors
console.log(JSON.stringify(r, null, 1))
await browser.close()
