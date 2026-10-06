import { motion } from 'motion/react'

interface Props {
  label: string
  from: string[]
  to: string[]
}

/** Fallback visual for components without a bespoke explainer: a pulsing core with its real neighbors. */
export function GenericViz({ label, from, to }: Props) {
  return (
    <div className="grid h-full min-h-[240px] grid-cols-[1fr_auto_1fr] items-center gap-4">
      <ul className="space-y-2 text-right">
        {from.length === 0 && <li className="mono-label text-[0.65rem] text-ink-soft">entry point</li>}
        {from.map((n, i) => (
          <motion.li key={n} className="glass inline-block px-3 py-1.5 text-sm" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.6 }}>
            {n}
          </motion.li>
        ))}
      </ul>
      <div className="relative grid h-40 w-40 place-items-center" aria-hidden="true">
        {[0, 1, 2].map((r) => (
          <span
            key={r}
            className="absolute inset-0 rounded-full border border-accent/60 motion-safe:animate-[pulse-ring_3s_ease-out_infinite]"
            style={{ animationDelay: `${r}s` }}
          />
        ))}
        <span className="grid h-20 w-20 place-items-center rounded-full bg-accent/15 text-center text-xs font-medium leading-tight text-ink" style={{ boxShadow: '0 0 40px rgba(77,224,160,0.5), inset 0 0 20px rgba(77,224,160,0.25)' }}>
          {label}
        </span>
      </div>
      <ul className="space-y-2">
        {to.length === 0 && <li className="mono-label text-[0.65rem] text-ink-soft">end of the path</li>}
        {to.map((n, i) => (
          <motion.li key={n} className="glass inline-block px-3 py-1.5 text-sm" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i, duration: 0.6 }}>
            {n}
          </motion.li>
        ))}
      </ul>
    </div>
  )
}
