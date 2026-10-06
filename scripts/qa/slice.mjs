import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2]
const query = process.argv[3] ?? '?webgl=0'
const out = './qa-shots'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 200)))
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text().slice(0, 200)) })

for (let i = 0; i < 20; i++) { try { await page.goto(base + '/' + query, { waitUntil: 'load', timeout: 4000 }); break } catch { await page.waitForTimeout(1000) } }
await page.waitForTimeout(1500)
await page.evaluate(() => document.getElementById('projects').scrollIntoView())
await page.waitForTimeout(1500)
await page.screenshot({ path: `${out}/s1-stage.png` })

const info = {}
const openBtn = page.locator('#stage-details ul button', { hasText: 'Groq LLM' }).first()
await openBtn.scrollIntoViewIfNeeded()
await openBtn.focus()
await page.keyboard.press('Enter')
await page.waitForTimeout(250)
info.zoomAttr = await page.evaluate(() => document.querySelector('.stage-zoom')?.getAttribute('data-zoom'))
await page.waitForTimeout(1900)
await page.screenshot({ path: `${out}/s2-modal-neural.png` })
info.modal = await page.evaluate(() => ({
  dialog: !!document.querySelector('[role=dialog][aria-modal=true]'),
  labelled: !!document.querySelector('[role=dialog]')?.getAttribute('aria-labelledby'),
  rootInert: document.getElementById('root')?.hasAttribute('inert'),
  scrollLocked: document.documentElement.style.overflow,
  focusIn: document.querySelector('[role=dialog]')?.contains(document.activeElement),
  title: document.querySelector('[role=dialog] h2')?.textContent,
  canvases: document.querySelectorAll('[role=dialog] canvas').length,
  histState: JSON.stringify(history.state),
}))

await page.keyboard.press('Escape')
await page.waitForTimeout(1500)
info.afterEsc = await page.evaluate(() => ({
  dialog: !!document.querySelector('[role=dialog]'),
  rootInert: document.getElementById('root')?.hasAttribute('inert'),
  scrollLocked: document.documentElement.style.overflow,
  zoom: document.querySelector('.stage-zoom')?.getAttribute('data-zoom'),
  focusedText: document.activeElement?.textContent?.trim().slice(0, 30),
  histState: JSON.stringify(history.state),
}))

// open again, close with browser back
await page.locator('#stage-details ul button', { hasText: 'Groq LLM' }).first().click()
await page.waitForTimeout(2000)
const openAgain = await page.evaluate(() => !!document.querySelector('[role=dialog]'))
await page.goBack()
await page.waitForTimeout(1500)
info.backButton = { openedAgain: openAgain, closedByBack: await page.evaluate(() => !document.querySelector('[role=dialog]')), stillOnSite: page.url().startsWith(base) }

fs.writeFileSync(`${out}/slice.json`, JSON.stringify({ info, errors }, null, 1))
console.log(JSON.stringify({ info, errors }, null, 1))
await browser.close()
