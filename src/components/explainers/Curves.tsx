import { motion } from 'motion/react'

const W = 640
const H = 320
const PAD = 28
const HUES = ['#4de0a0', '#6ea8ff', '#a78bfa', '#f5c04a', '#ff8a5c', '#f472b6', '#38bdf8', '#e2e8f0']

const FUNCS: Record<string, (n: number) => number> = {
  'O(1)': () => 1,
  'O(log n)': (n) => Math.log2(n),
  'O(n)': (n) => n,
  'O(n log n)': (n) => n * Math.log2(n),
  'O(n²)': (n) => n * n,
  'O(n³)': (n) => n * n * n,
  'O(2ⁿ)': (n) => 2 ** n,
  'O(n!)': (n) => {
    let f = 1
    for (let i = 2; i <= Math.round(n); i++) f *= i
    return f
  },
}

const MAX = Math.log10(1 + 1e6)

/** Growth of each complexity class with n (log-scaled axis, so the curves stay distinguishable). */
export function GrowthCurves({ classes }: { classes: string[] }) {
  const paths = classes.map((name) => {
    const f = FUNCS[name]
    if (!f) return ''
    const pts: string[] = []
    for (let n = 1; n <= 10.001; n += 0.25) {
      const y = Math.min(Math.log10(1 + f(n)) / MAX, 1)
      const px = PAD + ((n - 1) / 9) * (W - PAD * 2)
      const py = H - PAD - y * (H - PAD * 2)
      pts.push(`${pts.length ? 'L' : 'M'}${px.toFixed(1)},${py.toFixed(1)}`)
    }
    return pts.join(' ')
  })

  return (
    <div className="flex h-full flex-col justify-center gap-4">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img" aria-label="Growth curves for eight complexity classes, from O(1) to O(n!), plotted against input size">
        {[0.25, 0.5, 0.75].map((g) => (
          <line key={g} x1={PAD} x2={W - PAD} y1={PAD + g * (H - PAD * 2)} y2={PAD + g * (H - PAD * 2)} stroke="rgba(255,255,255,0.07)" />
        ))}
        <line x1={PAD} y1={H - PAD} x2={W - PAD} y2={H - PAD} stroke="rgba(255,255,255,0.25)" />
        <line x1={PAD} y1={PAD} x2={PAD} y2={H - PAD} stroke="rgba(255,255,255,0.25)" />
        <text x={W - PAD} y={H - 8} textAnchor="end" fill="#a3b0aa" fontSize="11" fontFamily="Geist Mono, monospace">input size n</text>
        <text x={PAD + 6} y={PAD + 4} fill="#a3b0aa" fontSize="11" fontFamily="Geist Mono, monospace">operations (log scale)</text>
        {paths.map((d, i) => (
          <motion.path
            key={classes[i]}
            d={d}
            fill="none"
            stroke={HUES[i % HUES.length]}
            strokeWidth="2.4"
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 5px ${HUES[i % HUES.length]})` }}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: 0.12 * i, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          />
        ))}
      </svg>
      <ul className="flex flex-wrap gap-x-4 gap-y-2">
        {classes.map((c, i) => (
          <li key={c} className="mono-label flex items-center gap-2 text-[0.65rem] text-ink">
            <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: HUES[i % HUES.length], boxShadow: `0 0 8px ${HUES[i % HUES.length]}` }} aria-hidden="true" />
            {c}
          </li>
        ))}
      </ul>
    </div>
  )
}
