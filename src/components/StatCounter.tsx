import { useCountUp } from '@/hooks/useCountUp'
import type { Stat } from '@/data/content'

/** Animated metric tile that counts up when scrolled into view. */
export function StatCounter({ stat }: { stat: Stat }) {
  const { ref, display } = useCountUp(stat.value, stat.decimals ?? 0)

  return (
    <div className="rounded-xl border border-accent-primary/60 bg-bg-card/70 px-6 py-7 text-center backdrop-blur">
      <span ref={ref} className="block font-mono text-4xl font-bold text-accent-secondary">
        {stat.prefix}
        {display}
        {stat.suffix}
      </span>
      <span className="mt-2 block text-sm text-text-muted">{stat.label}</span>
    </div>
  )
}
