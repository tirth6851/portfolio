import { skillCategories } from '@/data/content'
import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

export function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <span id="skills" aria-hidden="true" className="block scroll-mt-14" />
      <div className="aurora" aria-hidden="true" />
      <div className="wrap relative z-10">
        <SectionHead index="04" kicker="Stack" title="Tools I" accent="reach for." className="mb-14" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillCategories.map((cat, ci) => (
            <Reveal key={cat.title} delay={0.05 * ci}>
              <section aria-labelledby={`stack-heading-${ci}`} className="glass glow-border h-full p-6">
                <h3 id={`stack-heading-${ci}`} className="mono-label text-accent">
                  {cat.title}
                </h3>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {cat.skills.map((s) => (
                    <li
                      key={s.name}
                      className={`rounded-full border px-3.5 py-1.5 text-sm transition duration-300 hover:-translate-y-0.5 ${
                        s.tier === 'Primary'
                          ? 'border-accent/60 bg-accent/10 font-medium text-ink shadow-[0_0_20px_rgba(77,224,160,0.22)] hover:shadow-[0_0_30px_rgba(77,224,160,0.4)]'
                          : 'border-line-strong bg-white/[0.03] text-ink-soft hover:border-glow/60 hover:text-ink'
                      }`}
                      title={s.tier}
                    >
                      {s.name}
                      <span className="sr-only"> ({s.tier})</span>
                    </li>
                  ))}
                </ul>
              </section>
            </Reveal>
          ))}
        </div>
        <p className="mono-label mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-[0.66rem] text-ink-soft">
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(77,224,160,0.9)]" aria-hidden="true" /> Primary: used across projects
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full border border-line-strong" aria-hidden="true" /> Familiar: used in at least one project
          </span>
        </p>
      </div>
    </section>
  )
}
