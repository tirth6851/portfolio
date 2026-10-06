import { chromium } from 'playwright'
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const page = await (await browser.newContext({ viewport: { width: 1440, height: 900 } })).newPage()
await page.goto(process.argv[2] + '/', { waitUntil: 'load' })
await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
await page.waitForTimeout(3500)
await page.evaluate(() => [...document.querySelectorAll('#stage-details ul button')].find((b) => b.textContent.includes('Groq LLM')).click())
await page.waitForTimeout(1800)
const rows = await page.evaluate(() => new Promise((res) => {
  const panel = document.querySelector('[role=dialog]')
  const canvas = panel.querySelector('canvas')
  const box = canvas.parentElement
  const log = []
  let n = 0
  const tick = () => {
    const pr = panel.getBoundingClientRect(), cr = canvas.getBoundingClientRect(), br = box.getBoundingClientRect()
    log.push({ f: n, panelH: Math.round(pr.height), panelClientW: panel.clientWidth, panelScrollW: panel.scrollWidth, panelClientH: panel.clientHeight, panelScrollH: panel.scrollHeight, canvasCss: `${cr.width.toFixed(1)}x${cr.height.toFixed(1)}`, canvasAttr: `${canvas.width}x${canvas.height}`, boxCss: `${br.width.toFixed(1)}x${br.height.toFixed(1)}` })
    if (++n < 14) requestAnimationFrame(tick); else res(log)
  }
  requestAnimationFrame(tick)
}))
for (const r of rows) console.log(JSON.stringify(r))
await browser.close()
