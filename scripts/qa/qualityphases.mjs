import { chromium } from 'playwright'
const base = process.argv[2]
const b = await chromium.launch({ channel: 'chrome', headless: true, args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const page = await (await b.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await page.goto(base + '/', { waitUntil: 'load' }); await page.waitForTimeout(1500)
await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
await page.waitForTimeout(4500)
const q = () => page.locator('[data-quality]').getAttribute('data-quality')
const fps = (ms = 2500) => page.evaluate((ms) => new Promise((res) => { let n = 0; const t0 = performance.now(); const l = () => { n++; if (performance.now() - t0 < ms) requestAnimationFrame(l); else res(+(n / ((performance.now() - t0) / 1000)).toFixed(0)) }; requestAnimationFrame(l) }), ms)
const R = {}
R.idle = { fps: await fps(), q: await q() }
await page.mouse.click(963, 385)        // open the Groq LLM explainer from the canvas
await page.waitForTimeout(1200)
R.modalOpening = { fps: await fps(1500), q: await q() }
await page.waitForTimeout(4000)
R.modalHeld5s = { fps: await fps(1500), q: await q() }
await page.keyboard.press('Escape'); await page.waitForTimeout(1800)
R.afterClose = { fps: await fps(), q: await q() }
await page.getByRole('button', { name: /Trace the data flow/ }).click()
await page.waitForTimeout(3000)
R.tracing = { fps: await fps(2000), q: await q() }
await page.waitForTimeout(6000)
R.afterTrace = { fps: await fps(), q: await q() }
console.log(JSON.stringify(R))
await b.close()
