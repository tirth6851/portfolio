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
    <section id="top" className="relative overflow-hidden pb-20 pt-24 md:pb-28">
      <div className="aurora" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />

      <div className="wrap relative z-10 grid items-center gap-12 lg:min-h-[calc(100svh-9rem)] lg:grid-cols-12 lg:gap-10">
        <div className="lg:col-span-7">
          <Reveal>
            <p className="mono-label text-ink-soft">B.S. Computer Science · Cleveland State University</p>
            <p className="mono-label mt-4 inline-flex items-center gap-2.5 rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-accent shadow-[0_0_30px_rgba(77,224,160,0.2)]">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-70 motion-safe:animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              Open to Summer 2027 internships and co-ops
            </p>
          </Reveal>

          <KineticHeadline
            words={headline}
            className="mt-6 text-[clamp(2.6rem,5.3vw,5rem)] font-bold leading-[1.02] tracking-tight"
          />

          <Reveal delay={0.5}>
            <p className="mt-8 max-w-xl text-lg text-ink-soft">
              I'm Tirth Patel. I build backend and full-stack applications in Python, Java, and TypeScript:
              REST APIs with automated test suites, deployed platforms, and data pipelines.
            </p>
            <div className="mono-label mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <a
                href="#projects"
                className="rounded-full bg-accent px-7 py-3.5 text-[#03130c] shadow-[0_0_36px_rgba(77,224,160,0.55)] transition hover:-translate-y-0.5 hover:brightness-110"
              >
                Explore the projects ↓
              </a>
              <a
                href={`${base}${profile.resume}`}
                className="rounded-full border border-line-strong px-6 py-3.5 text-ink transition hover:border-accent hover:text-accent hover:shadow-[0_0_28px_rgba(77,224,160,0.25)]"
              >
                Resume (PDF)
              </a>
              <a href="#contact" className="text-ink-soft underline decoration-accent/50 underline-offset-8 transition hover:text-accent">
                Contact →
              </a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25} className="lg:col-span-5">
          <figure className="relative mx-auto max-w-sm lg:max-w-none">
            <div
              aria-hidden="true"
              className="absolute -inset-6 rounded-[2rem] bg-[conic-gradient(from_180deg,rgba(77,224,160,0.55),rgba(110,168,255,0.4),rgba(167,139,250,0.5),rgba(77,224,160,0.55))] opacity-60 blur-3xl motion-safe:animate-[spin_24s_linear_infinite]"
            />
            <TiltCard className="relative">
              <img
                src={`${base}${profile.photo}`}
                alt="Portrait of Tirth Patel"
                width={640}
                height={800}
                className="relative aspect-[4/5] w-full rounded-3xl border border-line-strong object-cover shadow-[0_0_80px_rgba(77,224,160,0.2)]"
              />
              <figcaption className="glass mono-label absolute -bottom-4 left-4 px-4 py-2 text-[0.66rem] text-ink">
                <span className="text-accent">●</span> Cleveland, Ohio
              </figcaption>
            </TiltCard>
          </figure>
        </Reveal>
      </div>

      <div className="wrap relative z-10 mt-16">
        <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="glass glow-border p-5">
              <dt className="mono-label text-ink-soft">{s.label}</dt>
              <dd className="mt-2 text-5xl font-bold leading-none md:text-6xl">
                <span className="gradient-text">
                  <CountUp value={s.value} decimals={s.decimals} prefix={s.prefix} suffix={s.suffix} />
                </span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mono-label mt-4 text-[0.64rem] text-ink-soft">
          Test count is declared test cases across the repositories, counted from source.
        </p>
      </div>
    </section>
  )
}
