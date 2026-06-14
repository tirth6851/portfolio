import { stats } from '@/data/content'
import { StatCounter } from '@/components/StatCounter'
import { RevealGroup, Reveal } from '@/components/Reveal'

/** Credibility strip of animated metrics. */
export function Highlights() {
  return (
    <section className="bg-bg-primary/65 py-16">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <RevealGroup className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
          {stats.map((stat) => (
            <Reveal key={stat.label} variant="up" asItem>
              <StatCounter stat={stat} />
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
