import { experiences } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { Reveal } from '@/components/Reveal'

export function Experience() {
  return (
    <section id="experience" className="bg-bg-secondary/93 py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle label="experience">Where I've Worked</SectionTitle>

        {/* Timeline container */}
        <div className="mx-auto max-w-3xl">
          <div className="relative space-y-6">
            {/* Vertical line */}
            <div className="absolute left-[15px] top-3 h-[calc(100%-24px)] w-px bg-gradient-to-b from-accent-secondary/30 via-accent-secondary/15 to-transparent" />

            {experiences.map((exp) => (
              <Reveal key={exp.role} variant="up">
                <div className="relative pl-12">
                  {/* Timeline dot */}
                  <span className="absolute left-[9px] top-6 h-[13px] w-[13px] rounded-full bg-accent-secondary ring-4 ring-bg-secondary" />

                  <article className="rounded-xl bg-bg-card/50 p-6 ring-1 ring-accent-secondary/10 backdrop-blur-sm transition-all duration-300 hover:ring-accent-secondary/20 hover:shadow-[0_8px_32px_rgba(0,230,118,0.06)]">
                    {/* Header row */}
                    <div className="mb-3 flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-text-primary">{exp.role}</h3>
                        <p className="text-sm font-medium text-accent-secondary">{exp.company}</p>
                      </div>
                      <span className="shrink-0 rounded-full border border-accent-secondary/15 bg-accent-secondary/5 px-3 py-0.5 font-mono text-xs text-text-muted">
                        {exp.date}
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-sm text-text-secondary">
                      {exp.bullets.map((bullet, j) => (
                        <li key={j} className="relative pl-4 leading-relaxed">
                          <span className="absolute left-0 text-accent-secondary/50">▸</span>
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
