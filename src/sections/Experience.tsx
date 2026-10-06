import { experiences } from '@/data/content'
import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead index="04" kicker="Experience" title="Where I've worked." className="mb-14" />
        <div>
          {experiences.map((exp) => (
            <Reveal key={exp.role}>
              <article className="grid gap-4 border-t border-ink py-10 md:grid-cols-12 md:gap-10">
                <p className="mono-label text-ink-soft md:col-span-3">{exp.date}</p>
                <div className="md:col-span-9">
                  <h3 className="font-display text-3xl leading-tight md:text-4xl">{exp.role}</h3>
                  <p className="mono-label mt-2 text-ink-soft">{exp.company}</p>
                  <ul className="mt-6 list-disc space-y-3 pl-5 leading-relaxed text-ink-soft marker:text-ink/40">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
