import { chromium } from 'playwright'

const base = process.argv[2]
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const R = {}

async function open(opts = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...opts })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)))
  await page.goto(base + '/', { waitUntil: 'load' })
  await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
  await page.waitForTimeout(4500)
  return { ctx, page, errors }
}
const dialogs = (page) => page.locator('[role=dialog]').count()
const clickList = (page, text, nth = 0) => page.evaluate(([t, n]) => [...document.querySelectorAll('#stage-details ul button')].filter((b) => b.textContent.includes(t))[n].click(), [text, nth])

// 1. double open within 650 ms => one history entry; Esc closes cleanly
{
  const { ctx, page, errors } = await open()
  const h0 = await page.evaluate(() => history.length)
  await page.evaluate(() => { const b = [...document.querySelectorAll('#stage-details ul button')]; b[1].click(); b[2].click() })
  await page.waitForTimeout(2200)
  const h1 = await page.evaluate(() => history.length)
  const opened = await dialogs(page)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1500)
  R.doubleOpen = { historyAdded: h1 - h0, opened, closedAfterEsc: (await dialogs(page)) === 0, zoom: await page.evaluate(() => document.querySelector('.stage-zoom').dataset.zoom), errors }
  await ctx.close()
}
// 2. switching project during the pending open cancels it
{
  const { ctx, page } = await open()
  await page.evaluate(() => { document.querySelector('#stage-details ul button').click(); document.getElementById('stage-tab-watchnextai').click() })
  await page.waitForTimeout(2000)
  R.switchDuringOpen = { dialogOpened: await dialogs(page), zoom: await page.evaluate(() => document.querySelector('.stage-zoom').dataset.zoom), tab: (await page.locator('#projects [role=tab][aria-selected=true]').innerText()).replace(/\s+/g, ' ') }
  await ctx.close()
}
// 3+4. trace: primary edges only; Stop really stops the 3D trace
{
  const { ctx, page } = await open()
  await page.getByRole('button', { name: /Trace the data flow/ }).click()
  await page.waitForTimeout(1800)
  const during = (await page.locator('#projects [aria-live=polite]').first().innerText()).slice(0, 40)
  await page.getByRole('button', { name: /^Stop$/ }).click()
  await page.waitForTimeout(3500)
  R.trace = { during, afterStopText: await page.locator('#projects [aria-live=polite]').first().innerText(), button: await page.getByRole('button', { name: /Trace the data flow|Stop/ }).first().innerText() }
  await ctx.close()
}
// 5. reduced motion: stage is not permanently dimmed
{
  const { ctx, page } = await open({ reducedMotion: 'reduce' })
  R.reducedMotion = await page.evaluate(() => ({ filter: getComputedStyle(document.querySelector('.stage-zoom')).filter, cursorGlow: !!document.querySelector('.mix-blend-screen') }))
  await ctx.close()
}
// 6. global pause also freezes the explainer animation
{
  const { ctx, page } = await open()
  await page.getByRole('button', { name: /Pause animation/ }).first().click()
  await clickList(page, 'Groq LLM')
  await page.waitForTimeout(2200)
  const raf = await page.evaluate(async () => { let n = 0; const o = window.requestAnimationFrame; window.requestAnimationFrame = (cb) => { n++; return o(cb) }; await new Promise((r) => setTimeout(r, 2000)); window.requestAnimationFrame = o; return n })
  R.pause = { htmlAttr: await page.evaluate(() => document.documentElement.dataset.motion), modalButton: await page.locator('[role=dialog]').getByRole('button', { name: /Play animation|Pause animation/ }).innerText(), rafIn2s: raf }
  await ctx.close()
}
// 7+8. back/forward then reopen: Esc still closes; focus returns to the opener
{
  const { ctx, page } = await open()
  await page.locator('#stage-details ul button', { hasText: 'Groq LLM' }).first().focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2000)
  await page.goBack(); await page.waitForTimeout(1200)
  const closedByBack = (await dialogs(page)) === 0
  await page.goForward(); await page.waitForTimeout(1200)
  const staleOpen = await dialogs(page)
  await page.locator('#stage-details ul button', { hasText: 'Groq LLM' }).first().focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(2000)
  const reopened = await dialogs(page)
  await page.keyboard.press('Escape'); await page.waitForTimeout(1500)
  R.backForward = { closedByBack, staleOpen, reopened, closedAfterEsc: (await dialogs(page)) === 0, focus: await page.evaluate(() => document.activeElement?.textContent?.trim().slice(0, 24)) }
  await ctx.close()
}
// 9. cursor glow on desktop, absent on touch
{
  const { ctx, page } = await open()
  await page.mouse.move(600, 400); await page.mouse.move(640, 420); await page.waitForTimeout(400)
  R.cursorGlow = await page.evaluate(() => { const el = document.querySelector('.mix-blend-screen'); return el ? { exists: true, opacity: getComputedStyle(el).opacity, pointerEvents: getComputedStyle(el).pointerEvents, z: getComputedStyle(el).zIndex } : { exists: false } })
  await page.screenshot({ path: './qa-shots/cursor-glow.png', clip: { x: 440, y: 300, width: 400, height: 240 } })
  await ctx.close()
  const t = await open({ hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } })
  R.cursorGlowTouch = await t.page.evaluate(() => !!document.querySelector('.mix-blend-screen'))
  await t.ctx.close()
}
console.log(JSON.stringify(R, null, 1))
await browser.close()
