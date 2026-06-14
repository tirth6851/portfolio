import { experiences } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { Reveal } from '@/components/Reveal'

export function Experience() {
  return (
    <section id="experience" className="bg-bg-secondary/65 py-20">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle>Experience</SectionTitle>

        <div className="mx-auto max-w-3xl space-y-8">
          {experiences.map((exp, i) => (
            <Reveal key={exp.role} variant={i % 2 === 0 ? 'left' : 'right'}>
              <article className="rounded-xl border border-accent-primary bg-bg-card p-8 transition-all duration-300 hover:border-accent-secondary hover:shadow-[0_10px_40px_rgba(25,135,84,0.15)]">
                <h3 className="text-lg font-semibold text-accent-secondary">{exp.role}</h3>
                <p className="font-semibold text-accent-gold">{exp.company}</p>
                <p className="mb-3 text-sm text-text-muted">{exp.date}</p>
                <ul className="ml-5 list-disc space-y-2 text-text-secondary">
                  {exp.bullets.map((bullet, j) => (
                    <li key={j} className="leading-relaxed">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
