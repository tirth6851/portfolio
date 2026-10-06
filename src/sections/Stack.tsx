import { skillCategories } from '@/data/content'
import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

export function Stack() {
  return (
    <section id="stack" className="border-t border-ink bg-paper-2 py-24 md:py-32">
      <span id="skills" aria-hidden="true" className="block scroll-mt-14" />
      <div className="wrap">
        <SectionHead index="05" kicker="Stack" title="Tools I reach for." className="mb-14" />
        <Reveal>
          <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {skillCategories.map((cat, ci) => (
              <section key={cat.title} aria-labelledby={`stack-heading-${ci}`}>
                <h3 id={`stack-heading-${ci}`} className="mono-label border-b border-ink pb-3 text-ink-soft">
                  {cat.title}
                </h3>
                <ul>
                  {cat.skills.map((s) => (
                    <li
                      key={s.name}
                      className="flex items-baseline justify-between gap-4 border-b border-rule py-2.5"
                    >
                      <span className={s.tier === 'Primary' ? 'font-semibold' : ''}>{s.name}</span>
                      <span className="mono-label text-ink-soft">{s.tier}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
          <p className="mono-label mt-10 text-ink-soft">
            Primary: used across projects · Familiar: used in at least one project
          </p>
        </Reveal>
      </div>
    </section>
  )
}
