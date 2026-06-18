import { useCountUp } from '@/hooks/useCountUp'
import type { Stat } from '@/data/content'

export function StatCounter({ stat }: { stat: Stat }) {
  const { ref, display } = useCountUp(stat.value, stat.decimals ?? 0)

  return (
    <div className="rounded-xl border border-accent-secondary/10 bg-bg-card/50 px-6 py-7 text-center backdrop-blur-sm transition hover:border-accent-secondary/20 hover:shadow-[0_4px_20px_rgba(0,230,118,0.06)]">
      <span ref={ref} className="block font-mono text-4xl font-bold text-accent-secondary">
        {stat.prefix}
        {display}
        {stat.suffix}
      </span>
      <span className="mt-2 block text-sm text-text-muted">{stat.label}</span>
    </div>
  )
}
