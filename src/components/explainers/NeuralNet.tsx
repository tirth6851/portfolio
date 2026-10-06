import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { COLORS } from '@/theme'
import { useMotionPaused } from '@/lib/motion'

const LAYERS = [5, 8, 10, 10, 8, 5]
const COLUMN_LABELS = ['tokens', 'embed', 'attention', 'attention', 'mlp', 'next token']

interface Pulse {
  layer: number
  from: number
  to: number
  t: number
  speed: number
}

/** Illustrative language-model network: signals hop layer to layer and light up nodes. */
export function NeuralNet() {
  const ref = useRef<HTMLCanvasElement>(null)
  const osReduced = useReducedMotion()
  const paused = useMotionPaused()
  const reduce = osReduced || paused

  useEffect(() => {
    const canvas = ref.current
    const c2d = canvas?.getContext('2d')
    if (!canvas || !c2d) return
    const ctx: CanvasRenderingContext2D = c2d

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const resize = () => {
      const r = canvas.getBoundingClientRect()
      w = r.width
      h = r.height
      canvas.width = Math.max(1, Math.round(w * dpr))
      canvas.height = Math.max(1, Math.round(h * dpr))
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    const ro = new ResizeObserver(() => {
      resize()
      if (reduce) draw(0)
    })
    ro.observe(canvas)

    const act = LAYERS.map((n) => new Array<number>(n).fill(0))
    const pulses: Pulse[] = []
    let spawnTimer = 0
    let last = performance.now()
    let raf = 0

    const pos = (l: number, i: number) => {
      const n = LAYERS[l]
      return [w * (0.07 + 0.86 * (l / (LAYERS.length - 1))), h * (0.1 + 0.8 * ((i + 0.5) / n))] as const
    }

    function draw(dt: number) {
      ctx.clearRect(0, 0, w, h)
      ctx.lineWidth = 1
      for (let l = 0; l < LAYERS.length - 1; l++) {
        for (let i = 0; i < LAYERS[l]; i++) {
          for (let j = 0; j < LAYERS[l + 1]; j++) {
            const [x1, y1] = pos(l, i)
            const [x2, y2] = pos(l + 1, j)
            const lit = Math.max(act[l][i], act[l + 1][j])
            ctx.strokeStyle = `rgba(110,168,255,${0.05 + lit * 0.18})`
            ctx.beginPath()
            ctx.moveTo(x1, y1)
            ctx.lineTo(x2, y2)
            ctx.stroke()
          }
        }
      }

      for (const p of pulses) {
        const [x1, y1] = pos(p.layer, p.from)
        const [x2, y2] = pos(p.layer + 1, p.to)
        const x = x1 + (x2 - x1) * p.t
        const y = y1 + (y2 - y1) * p.t
        ctx.shadowColor = COLORS.amber
        ctx.shadowBlur = 14
        ctx.fillStyle = COLORS.amber
        ctx.beginPath()
        ctx.arc(x, y, 2.6, 0, Math.PI * 2)
        ctx.fill()
      }

      for (let l = 0; l < LAYERS.length; l++) {
        for (let i = 0; i < LAYERS[l]; i++) {
          const [x, y] = pos(l, i)
          const a = act[l][i]
          ctx.shadowColor = COLORS.accent
          ctx.shadowBlur = 6 + a * 22
          ctx.fillStyle = a > 0.05 ? `rgba(77,224,160,${0.55 + a * 0.45})` : 'rgba(167,180,174,0.55)'
          ctx.beginPath()
          ctx.arc(x, y, 4.2 + a * 3.2, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      ctx.shadowBlur = 0

      for (const layer of act) for (let i = 0; i < layer.length; i++) layer[i] = Math.max(0, layer[i] - dt * 1.4)
    }

    if (reduce) {
      // One static frame with a few lit paths.
      for (let l = 0; l < LAYERS.length; l++) for (let i = 0; i < LAYERS[l]; i++) act[l][i] = (i * 7 + l * 3) % 5 === 0 ? 1 : 0
      draw(0)
      return () => ro.disconnect()
    }

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      spawnTimer -= dt
      if (spawnTimer <= 0 && pulses.length < 70) {
        const from = Math.floor(Math.random() * LAYERS[0])
        act[0][from] = 1
        pulses.push({ layer: 0, from, to: Math.floor(Math.random() * LAYERS[1]), t: 0, speed: 0.9 + Math.random() * 0.5 })
        spawnTimer = 0.18
      }
      for (let k = pulses.length - 1; k >= 0; k--) {
        const p = pulses[k]
        p.t += dt * p.speed
        if (p.t >= 1) {
          act[p.layer + 1][p.to] = 1
          pulses.splice(k, 1)
          if (p.layer + 1 < LAYERS.length - 1) {
            const branches = Math.random() < 0.45 ? 2 : 1
            for (let b = 0; b < branches; b++) {
              pulses.push({ layer: p.layer + 1, from: p.to, to: Math.floor(Math.random() * LAYERS[p.layer + 2]), t: 0, speed: p.speed })
            }
          }
        }
      }
      draw(dt)
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [reduce])

  return (
    <div className="relative h-full min-h-[260px] w-full">
      <canvas ref={ref} className="absolute inset-0 h-full w-full" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-5" aria-hidden="true">
        {COLUMN_LABELS.map((label, i) => (
          <span
            key={`${label}-${i}`}
            className={`mono-label absolute -translate-x-1/2 whitespace-nowrap text-[0.58rem] text-ink-soft ${i === 0 || i === COLUMN_LABELS.length - 1 ? '' : 'max-sm:hidden'}`}
            style={{ left: `${(0.07 + 0.86 * (i / (LAYERS.length - 1))) * 100}%` }}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  )
}
