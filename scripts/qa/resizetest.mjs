import { chromium } from 'playwright'

const base = process.argv[2]
const only = process.argv[3] // optional substring filter for node label
const sizes = [[1280, 720], [1366, 768], [1440, 900], [1536, 864], [1920, 1080], [1024, 768], [820, 1180], [390, 844]]
const nodes = [['Groq LLM', 0], ['Heuristic engine', 0], ['Supabase', 0], ['Complexity class', 0], ['Clerk', 0]]
const dsf = Number(process.env.DSF ?? 1)
const browser = await chromium.launch({ channel: 'chrome', headless: true, ignoreDefaultArgs: ['--hide-scrollbars'], args: ['--ignore-gpu-blocklist', '--use-angle=d3d11'] })
const out = []

for (const [w, h] of sizes) {
  for (const [label] of nodes) {
    if (only && !label.includes(only)) continue
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: w < 900, deviceScaleFactor: dsf })
    const page = await ctx.newPage()
    await page.goto(base + '/', { waitUntil: 'load' })
    await page.evaluate(() => { const el = document.getElementById('projects'); window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 56, behavior: 'instant' }) })
    await page.waitForTimeout(3500)
    await page.evaluate((l) => [...document.querySelectorAll('#stage-details ul button')].find((b) => b.textContent.includes(l)).click(), label)
    await page.waitForTimeout(1600) // let the entrance animation finish
    const res = await page.evaluate(
      () => new Promise((resolve) => {
        const panel = document.querySelector('[role=dialog]')
        if (!panel) return resolve({ error: 'no dialog' })
        const stageCanvas = document.querySelector('#projects canvas')
        let stageResizes = 0
        const ro = new ResizeObserver(() => stageResizes++)
        if (stageCanvas) ro.observe(stageCanvas.parentElement)
        let attrChanges = 0
        const mo = new MutationObserver((m) => { attrChanges += m.length })
        panel.querySelectorAll('canvas').forEach((c) => mo.observe(c, { attributes: true, attributeFilter: ['width', 'height'] }))
        const rects = new Set()
        let flips = 0
        let last = null
        let frames = 0
        const t0 = performance.now()
        const tick = () => {
          const r = panel.getBoundingClientRect()
          rects.add(`${Math.round(r.width)}x${Math.round(r.height)}`)
          const has = panel.scrollHeight > panel.clientHeight + 1
          if (last !== null && has !== last) flips++
          last = has
          frames++
          if (performance.now() - t0 < 3000) requestAnimationFrame(tick)
          else { ro.disconnect(); mo.disconnect(); resolve({ distinctPanelSizes: rects.size, sizes: [...rects].slice(0, 4), scrollbarFlips: flips, stageResizeEvents: stageResizes, canvasAttrChanges: attrChanges, frames }) }
        }
        requestAnimationFrame(tick)
      }),
    )
    out.push({ viewport: `${w}x${h}`, node: label, ...res })
    await ctx.close()
  }
}
const bad = out.filter((o) => o.error || o.distinctPanelSizes > 1 || o.scrollbarFlips > 0 || o.stageResizeEvents > 1 || o.canvasAttrChanges > 2)
console.log('TOTAL', out.length, 'PROBLEMATIC', bad.length)
console.log(JSON.stringify(bad.length ? bad : out.slice(0, 3), null, 0))
await browser.close()
