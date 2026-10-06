import { motion } from 'motion/react'
import type { ExplainerSpec } from '@/data/explainers'

const ease = [0.16, 1, 0.3, 1] as const

type Spec<K extends ExplainerSpec['kind']> = Extract<ExplainerSpec, { kind: K }>

export function TableCards({ spec }: { spec: Spec<'tables'> }) {
  return (
    <div className="flex h-full flex-col gap-4">
      {spec.policy && (
        <p className="mono-label flex items-center gap-2 text-accent">
          <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="4" y="11" width="16" height="10" rx="2" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" />
          </svg>
          {spec.policy}
        </p>
      )}
      <ul className="grid gap-3 [grid-template-columns:repeat(auto-fit,minmax(170px,1fr))]">
        {spec.tables.map((t, i) => (
          <motion.li
            key={t.name}
            className="glass p-4"
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.06 * i, duration: 0.6, ease }}
          >
            <p className="font-mono text-sm text-ink">{t.name}</p>
            {t.note && <p className="mono-label mt-1 text-[0.6rem] text-ink-soft">{t.note}</p>}
            <div className="mt-3 space-y-1.5" aria-hidden="true">
              {[0, 1, 2].map((r) => (
                <div key={r} className="shimmer-row h-2 rounded-sm" style={{ animationDelay: `${r * 0.35 + i * 0.1}s`, width: `${90 - r * 14}%` }} />
              ))}
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export function RouteList({ spec }: { spec: Spec<'routes'> }) {
  return (
    <ul className="flex h-full flex-col justify-center gap-2.5">
      {spec.routes.map((r, i) => (
        <motion.li
          key={`${r.method ?? ''}${r.path}`}
          className="glass flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-3"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.07 * i, duration: 0.6, ease }}
        >
          {r.method && (
            <span className={`mono-label rounded px-2 py-0.5 text-[0.62rem] ${r.method === 'GET' ? 'bg-glow/20 text-glow' : 'bg-accent/20 text-accent'}`}>
              {r.method}
            </span>
          )}
          <span className="font-mono text-sm text-ink">{r.path}</span>
          {r.guarded && <span className="mono-label text-[0.6rem] text-amber">protected</span>}
          {r.note && <span className="text-sm text-ink-soft">{r.note}</span>}
          {r.limit && (
            <span className="ml-auto flex items-center gap-2">
              <span className="relative h-1.5 w-20 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full bg-amber"
                  style={{ boxShadow: '0 0 10px rgba(245,192,74,0.8)' }}
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ delay: 0.3 + 0.07 * i, duration: 1.1, ease }}
                />
              </span>
              <span className="mono-label text-[0.62rem] text-amber">{r.limit}</span>
            </span>
          )}
        </motion.li>
      ))}
    </ul>
  )
}

export function Pipeline({ spec }: { spec: Spec<'pipeline'> }) {
  const n = spec.steps.length
  return (
    <ol className="relative flex h-full flex-col justify-center gap-3">
      <span aria-hidden="true" className="absolute bottom-6 left-[1.05rem] top-6 w-px bg-gradient-to-b from-accent/60 via-glow/40 to-transparent" />
      {spec.steps.map((s, i) => (
        <motion.li
          key={s.label}
          className="relative flex items-start gap-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.6, ease }}
        >
          <span
            aria-hidden="true"
            className="mono-label relative z-10 grid h-9 w-9 shrink-0 place-items-center rounded-full border border-accent/50 bg-bg text-xs text-accent motion-safe:animate-[step-glow_var(--cycle)_ease-in-out_infinite]"
            style={{ ['--cycle' as string]: `${n * 1.1}s`, animationDelay: `${i * 1.1}s` }}
          >
            {i + 1}
          </span>
          <span className="pt-1.5">
            <span className="block text-ink">{s.label}</span>
            {s.note && <span className="mono-label mt-0.5 block text-[0.62rem] text-ink-soft">{s.note}</span>}
          </span>
        </motion.li>
      ))}
    </ol>
  )
}

export function WeightBars({ spec }: { spec: Spec<'weights'> }) {
  const total = spec.items.reduce((s, x) => s + x.value, 0)
  const hues = ['bg-accent', 'bg-glow', 'bg-violet', 'bg-amber']
  return (
    <div className="flex h-full flex-col justify-center gap-6">
      <div className="flex h-5 w-full overflow-hidden rounded-full bg-white/5" aria-hidden="true">
        {spec.items.map((it, i) => (
          <motion.div
            key={it.label}
            className={hues[i % hues.length]}
            style={{ boxShadow: '0 0 18px rgba(77,224,160,0.35)' }}
            initial={{ width: 0 }}
            animate={{ width: `${(it.value / total) * 100}%` }}
            transition={{ delay: 0.12 * i, duration: 1, ease }}
          />
        ))}
      </div>
      <ul className="space-y-3">
        {spec.items.map((it, i) => (
          <motion.li key={it.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i + 0.2, duration: 0.5, ease }}>
            <div className="flex justify-between text-sm">
              <span className="flex items-center gap-2">
                <span className={`inline-block h-2.5 w-2.5 rounded-full ${hues[i % hues.length]}`} aria-hidden="true" />
                {it.label}
              </span>
              <span className="font-mono text-ink">{it.value}%</span>
            </div>
          </motion.li>
        ))}
      </ul>
    </div>
  )
}

export function PoolLanes({ spec }: { spec: Spec<'pool'> }) {
  return (
    <ul className="flex h-full flex-col justify-center gap-4">
      {spec.lanes.map((lane, li) => (
        <li key={lane.label} className="glass p-4">
          <p className="text-sm text-ink">{lane.label}</p>
          {lane.note && <p className="mono-label mt-0.5 text-[0.6rem] text-amber">{lane.note}</p>}
          <div className="mt-3 flex gap-2" aria-label={`${lane.workers} workers`} role="img">
            {Array.from({ length: lane.workers }, (_, w) => (
              <motion.span
                key={w}
                className="h-6 flex-1 rounded-md border border-accent/40 bg-accent/10 motion-safe:animate-[step-glow_2.4s_ease-in-out_infinite]"
                style={{ animationDelay: `${w * 0.3 + li * 0.5}s` }}
                initial={{ opacity: 0, scaleY: 0.3 }}
                animate={{ opacity: 1, scaleY: 1 }}
                transition={{ delay: 0.1 * w + li * 0.2, duration: 0.5, ease }}
              />
            ))}
          </div>
          <p className="mono-label mt-2 text-[0.6rem] text-ink-soft">{lane.workers} workers</p>
        </li>
      ))}
    </ul>
  )
}

export function TokenAnatomy({ spec }: { spec: Spec<'token'> }) {
  return (
    <div className="flex h-full flex-col justify-center gap-5">
      <motion.p
        className="break-all font-mono text-lg leading-relaxed sm:text-2xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        aria-label="A JSON Web Token has three dot-separated parts: header, payload, and signature"
      >
        <span className="text-coral" style={{ textShadow: '0 0 18px rgba(255,138,92,.6)' }}>header</span>
        <span className="text-ink-soft">.</span>
        <span className="text-violet" style={{ textShadow: '0 0 18px rgba(167,139,250,.6)' }}>payload</span>
        <span className="text-ink-soft">.</span>
        <span className="text-glow" style={{ textShadow: '0 0 18px rgba(110,168,255,.6)' }}>signature</span>
      </motion.p>
      <ul className="space-y-2">
        {spec.claims.map((c, i) => (
          <motion.li
            key={c.key}
            className="glass flex items-baseline gap-3 px-4 py-2.5"
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i + 0.3, duration: 0.5, ease }}
          >
            <span className="mono-label w-12 text-accent">{c.key}</span>
            <span className="text-ink">{c.value}</span>
          </motion.li>
        ))}
      </ul>
      <p className="mono-label text-[0.65rem] text-amber">{spec.secretNote}</p>
    </div>
  )
}
