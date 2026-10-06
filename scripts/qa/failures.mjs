import { chromium } from 'playwright'

const base = process.argv[2]
const browser = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const results = {}

async function open(ctxOpts, route) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, ...ctxOpts })
  const page = await ctx.newPage()
  const errors = []
  page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)))
  if (route) await page.route(route, (r) => r.abort())
  await page.goto(base + '/', { waitUntil: 'load' })
  await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
  await page.waitForTimeout(4500)
  return { ctx, page, errors }
}
const state = (page) => page.evaluate(() => ({
  mode: document.querySelector('[data-mode]')?.getAttribute('data-mode'),
  canvases: document.querySelectorAll('#projects canvas').length,
  svgs: document.querySelectorAll('#projects svg').length,
  listButtons: document.querySelectorAll('#stage-details ul button').length,
}))

// 1. blocked scene chunk
{
  const { ctx, page, errors } = await open({}, /ConstellationScene/)
  results.blockedChunk = { ...(await state(page)), appAlive: await page.locator('h1').count() > 0, uncaught: errors }
  await ctx.close()
}
// 2. forced context loss
{
  const { ctx, page, errors } = await open({})
  const before = await state(page)
  await page.evaluate(() => {
    const c = document.querySelector('#projects canvas')
    const gl = c.getContext('webgl2')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
  })
  await page.waitForTimeout(2500)
  results.contextLoss = { before, after: await state(page), uncaught: errors }
  await ctx.close()
}
// 3. reduced motion static
{
  const { ctx, page } = await open({ reducedMotion: 'reduce' })
  await page.waitForTimeout(1500)
  const raf = await page.evaluate(async () => { let n = 0; const o = window.requestAnimationFrame; window.requestAnimationFrame = (cb) => { n++; return o(cb) }; await new Promise((r) => setTimeout(r, 3000)); window.requestAnimationFrame = o; return n })
  results.reducedMotion = { ...(await state(page)), rafCallsIn3s: raf, pauseButtonShown: await page.getByRole('button', { name: /Pause animation/ }).count() }
  await ctx.close()
}
// 4. scrolled away: loop pauses offscreen
{
  const { ctx, page } = await open({})
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }))
  await page.waitForTimeout(1500)
  const raf = await page.evaluate(async () => { let n = 0; const o = window.requestAnimationFrame; window.requestAnimationFrame = (cb) => { n++; return o(cb) }; await new Promise((r) => setTimeout(r, 3000)); window.requestAnimationFrame = o; return n })
  results.offscreen = { rafCallsIn3s: raf, note: 'header progress bar and other page animations may also request frames' }
  await ctx.close()
}
console.log(JSON.stringify(results, null, 1))
await browser.close()
