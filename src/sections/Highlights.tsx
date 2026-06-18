import { stats } from '@/data/content'
import { StatCounter } from '@/components/StatCounter'
import { RevealGroup, Reveal } from '@/components/Reveal'

/** Credibility strip of animated metrics. */
export function Highlights() {
  return (
    <section className="py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        {/* Gradient divider above */}
        <div className="mb-12 h-px w-full bg-gradient-to-r from-transparent via-accent-secondary/20 to-transparent" />

        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <Reveal key={stat.label} variant="up" asItem>
              <StatCounter stat={stat} />
            </Reveal>
          ))}
        </RevealGroup>

        {/* Gradient divider below */}
        <div className="mt-12 h-px w-full bg-gradient-to-r from-transparent via-accent-secondary/20 to-transparent" />
      </div>
    </section>
  )
}
