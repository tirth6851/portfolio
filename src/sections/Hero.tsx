import { profile, stats } from '@/data/content'
import { Reveal } from '@/components/Reveal'
import { KineticHeadline, type HeadlineWord } from '@/components/KineticHeadline'
import { TiltCard } from '@/components/TiltCard'
import { CountUp } from '@/components/CountUp'

const base = import.meta.env.BASE_URL

const headline: HeadlineWord[] = [
  { text: 'Backend' },
  { text: 'systems,' },
  { text: 'built' },
  { text: 'to' },
  { text: 'be' },
  { text: 'tested', accent: true },
  { text: 'and' },
  { text: 'explained.' },
]

export function Hero() {
  return (
    <section id="top" className="pb-20 pt-28 md:pb-28 md:pt-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-8">
          <Reveal>
            <p className="mono-label text-ink-soft">
              B.S. Computer Science · Cleveland State University
            </p>
            <p className="mono-label mt-2 text-accent">
              <span aria-hidden="true">● </span>Open to Summer 2027 internships and co-ops
            </p>
          </Reveal>
          <KineticHeadline
            words={headline}
            className="mt-6 font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.95] tracking-tight"
          />
          <Reveal delay={0.5}>
            <p className="mt-8 max-w-xl text-lg text-ink-soft">
              I'm Tirth Patel. I build backend and full-stack applications in Python, Java, and
              TypeScript: REST APIs with automated test suites, deployed platforms, and data
              pipelines.
            </p>
            <div className="mono-label mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
              <a
                href="#systems"
                className="bg-ink px-6 py-3 text-paper transition-colors hover:bg-accent"
              >
                See the systems ↓
              </a>
              <a
                href={`${base}${profile.resume}`}
                className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent"
              >
                Resume (PDF)
              </a>
              <a href="#contact" className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent">
                Contact →
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="lg:col-span-4">
          <figure>
            <TiltCard className="max-w-sm lg:max-w-none">
              <img
                src={`${base}${profile.photo}`}
                alt="Portrait of Tirth Patel"
                width={640}
                height={800}
                className="aspect-[4/5] w-full border border-rule object-cover"
              />
            </TiltCard>
            <figcaption className="mono-label mt-3 text-ink-soft">
              Tirth Patel · Cleveland, Ohio
            </figcaption>
          </figure>
        </Reveal>
      </div>

      <div className="wrap mt-16 md:mt-24">
        <dl className="grid grid-cols-2 border-t border-ink md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="border-b border-rule py-6 pr-4 md:border-b-0 md:border-r md:px-6 md:first:pl-0 md:last:border-r-0"
            >
              <dt className="mono-label text-ink-soft">{s.label}</dt>
              <dd className="mt-2 font-display text-5xl leading-none md:text-6xl">
                <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
              </dd>
            </div>
          ))}
        </dl>
        <p className="mono-label mt-4 text-ink-soft">
          Test count is declared test cases across the repositories, counted from source.
        </p>
      </div>
    </section>
  )
}
