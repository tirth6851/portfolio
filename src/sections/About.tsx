import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

const facts = [
  ['Education', 'B.S. Computer Science, minor in Mathematics. Cleveland State University, expected May 2028. GPA 3.52, Dean’s List.'],
  ['Teaching', 'STEM Peer Teacher for Precalculus I, supporting about 30 students per session.'],
  ['Leadership', 'Secretary, CSU Billiards Club.'],
  ['Based in', 'Cleveland, Ohio.'],
]

export function About() {
  return (
    <section id="about" className="border-t border-ink bg-paper-2 py-24 md:py-32">
      <div className="wrap grid gap-12 lg:grid-cols-12">
        <SectionHead
          index="03"
          kicker="About"
          title="Clear explanations, carried into code."
          className="lg:col-span-5"
        />
        <Reveal className="lg:col-span-7">
          <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
            <p>
              I'm a CS student building full-stack and backend applications with Python, Java,
              TypeScript, and SQL: deployed web platforms, REST APIs with automated test suites,
              and Next.js apps, built with Flask, Spring Boot, Supabase, and PostgreSQL.
            </p>
            <p>
              As a STEM Peer Teacher I explain hard problems simply every day, a skill that
              transfers directly to writing clear, maintainable code. I'm looking for a Summer 2027
              software engineering internship or co-op where I can ship real things from day one.
            </p>
          </div>
          <dl className="mt-12 border-t border-ink">
            {facts.map(([term, desc]) => (
              <div key={term} className="grid gap-1 border-b border-rule py-4 sm:grid-cols-4 sm:gap-6">
                <dt className="mono-label pt-1 text-ink-soft">{term}</dt>
                <dd className="sm:col-span-3">{desc}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  )
}
