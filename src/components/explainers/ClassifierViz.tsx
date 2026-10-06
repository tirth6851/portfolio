import { motion, useReducedMotion } from 'motion/react'

interface Props {
  threshold: number
}

const SAMPLES = [
  { label: 'Example A', verdict: 'below the line: allowed', p: 0.08, tokens: [0.1, 0.35, 0.05, 0.2, 0.12] },
  { label: 'Example B', verdict: 'above the line: flagged', p: 0.64, tokens: [0.55, 0.3, 0.7, 0.4, 0.6] },
]

/** TF-IDF weights, summed, squashed by a sigmoid, compared to a threshold. Values are illustrative. */
export function ClassifierViz({ threshold }: Props) {
  const reduce = useReducedMotion()
  return (
    <div className="grid h-full w-full gap-6 sm:grid-cols-2">
      {SAMPLES.map((s, k) => {
        const flagged = s.p >= threshold
        return (
          <div key={s.label} className="glass flex flex-col gap-4 p-5">
            <p className="mono-label text-ink-soft">{s.label} (illustrative values)</p>
            <div className="flex items-end gap-2" aria-hidden="true">
              {s.tokens.map((v, i) => (
                <div key={i} className="flex flex-1 flex-col items-center gap-1">
                  <motion.div
                    className="w-full rounded-sm bg-glow/70"
                    style={{ boxShadow: '0 0 14px rgba(110,168,255,0.55)' }}
                    initial={{ height: 0 }}
                    animate={{ height: 12 + v * 70 }}
                    transition={{ delay: reduce ? 0 : 0.15 * i + k * 0.4, duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1] }}
                  />
                  <span className="mono-label text-[0.58rem] text-ink-soft">w{i + 1}</span>
                </div>
              ))}
            </div>
            <p className="mono-label text-[0.65rem] text-ink-soft">sum of weight x tf-idf, then sigmoid</p>
            <div className="relative h-3 rounded-full bg-white/10">
              <motion.div
                className={`absolute inset-y-0 left-0 rounded-full ${flagged ? 'bg-coral' : 'bg-accent'}`}
                style={{ boxShadow: `0 0 18px ${flagged ? 'rgba(255,138,92,0.7)' : 'rgba(77,224,160,0.7)'}` }}
                initial={{ width: 0 }}
                animate={{ width: `${s.p * 100}%` }}
                transition={{ delay: reduce ? 0 : 0.9 + k * 0.4, duration: reduce ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
              <div className="absolute -top-1.5 h-6 w-0.5 bg-ink" style={{ left: `${threshold * 100}%` }} />
              <span
                className="mono-label absolute -top-6 -translate-x-1/2 text-[0.6rem] text-ink"
                style={{ left: `${threshold * 100}%` }}
              >
                {threshold.toFixed(2)}
              </span>
            </div>
            <p className={`text-sm font-medium ${flagged ? 'text-coral' : 'text-accent'}`}>
              probability {s.p.toFixed(2)}, {s.verdict}
            </p>
          </div>
        )
      })}
    </div>
  )
}
