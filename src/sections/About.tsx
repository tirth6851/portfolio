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
    <section id="about" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div className="aurora" aria-hidden="true" />
      <div className="wrap relative z-10 grid gap-12 lg:grid-cols-12">
        <SectionHead index="02" kicker="About" title="Clear explanations," accent="carried into code." className="lg:col-span-5" />
        <div className="lg:col-span-7">
          <Reveal>
            <div className="space-y-6 text-lg leading-relaxed text-ink-soft">
              <p>
                I'm a CS student building full-stack and backend applications with Python, Java, TypeScript, and SQL:
                deployed web platforms, REST APIs with automated test suites, and Next.js apps, built with Flask,
                Spring Boot, Supabase, and PostgreSQL.
              </p>
              <p>
                As a STEM Peer Teacher I explain hard problems simply every day, a skill that transfers directly to
                writing clear, maintainable code. I'm looking for a Summer 2027 software engineering internship or
                co-op where I can ship real things from day one.
              </p>
            </div>
          </Reveal>
          <dl className="mt-10 grid gap-3 sm:grid-cols-2">
            {facts.map(([term, desc], i) => (
              <Reveal key={term} delay={0.06 * i}>
                <div className="glass glow-border h-full p-5 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_44px_rgba(77,224,160,0.18)]">
                  <dt className="mono-label text-accent">{term}</dt>
                  <dd className="mt-2 text-ink">{desc}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
