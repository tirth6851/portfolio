import { chromium } from 'playwright'
import fs from 'node:fs'

const base = process.argv[2]
const w = Number(process.argv[3] ?? 1440)
const h = Number(process.argv[4] ?? 900)
const tag = process.argv[5] ?? 'gl'
const out = './qa-shots'
fs.mkdirSync(out, { recursive: true })

const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11', '--enable-gpu-rasterization'] })
const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 700 })
const page = await ctx.newPage()
const errors = []
page.on('pageerror', (e) => errors.push('pageerror: ' + String(e).slice(0, 220)))
page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errors.push(m.type() + ': ' + m.text().slice(0, 220)) })

await page.goto(base + '/', { waitUntil: 'load' })
await page.waitForTimeout(1500)
await page.evaluate(() => {
  const el = document.getElementById('projects')
  window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' })
})
await page.waitForTimeout(5000)
const stage = page.locator('[data-mode]')
const r = {}
r.mode = await stage.getAttribute('data-mode')
r.quality0 = await stage.getAttribute('data-quality')
r.canvases = await page.locator('#projects canvas').count()
r.gpu = await page.evaluate(() => {
  const c = document.querySelector('#projects canvas')
  const gl = c?.getContext('webgl2')
  const d = gl?.getExtension('WEBGL_debug_renderer_info')
  return d ? gl.getParameter(d.UNMASKED_RENDERER_WEBGL) : 'n/a (context owned by scene)'
})
await page.screenshot({ path: `${out}/${tag}-overview.png` })

r.fps = await page.evaluate(
  () => new Promise((res) => {
    let n = 0
    const t0 = performance.now()
    const loop = () => { n++; if (performance.now() - t0 < 4000) requestAnimationFrame(loop); else res(+(n / ((performance.now() - t0) / 1000)).toFixed(1)) }
    requestAnimationFrame(loop)
  }),
)
await page.waitForTimeout(3000)
r.quality1 = await stage.getAttribute('data-quality')

// drag to the next slide
const selected = () => page.locator('#projects [role=tab][aria-selected=true]').innerText()
r.tabBefore = (await selected()).replace(/\s+/g, ' ')
await page.mouse.move(Math.round(w * 0.7), Math.round(h * 0.5))
await page.mouse.down()
await page.mouse.move(Math.round(w * 0.3), Math.round(h * 0.5), { steps: 14 })
await page.mouse.up()
await page.waitForTimeout(2200)
r.tabAfterDrag = (await selected()).replace(/\s+/g, ' ')
await page.screenshot({ path: `${out}/${tag}-slide2.png` })

// canvas click sweep: find a node by clicking a grid until the explainer opens
r.canvasClick = null
const xs = [0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8].map((f) => Math.round(w * f))
const ys = [0.3, 0.4, 0.5, 0.6, 0.7].map((f) => Math.round(h * f))
outer: for (const y of ys) {
  for (const x of xs) {
    await page.mouse.click(x, y)
    await page.waitForTimeout(1200)
    if (await page.locator('[role=dialog]').count()) { r.canvasClick = { x, y, title: await page.locator('[role=dialog] h2').innerText() }; break outer }
  }
}
if (r.canvasClick) {
  await page.waitForTimeout(800)
  await page.screenshot({ path: `${out}/${tag}-modal-from-canvas.png` })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(1500)
}

// request-path trace
await page.getByRole('button', { name: /Trace the data flow/ }).click()
await page.waitForTimeout(2600)
r.traceText = (await page.locator('#projects [aria-live=polite]').first().innerText()).slice(0, 140)
await page.screenshot({ path: `${out}/${tag}-trace.png` })
await page.waitForTimeout(9000)
r.traceAfter = (await page.locator('#projects [aria-live=polite]').first().innerText()).slice(0, 60)
r.tracingButton = await page.getByRole('button', { name: /Trace the data flow|Stop/ }).first().innerText()
r.quality2 = await stage.getAttribute('data-quality')
r.errors = errors
console.log(JSON.stringify(r, null, 1))
await browser.close()
