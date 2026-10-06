import { profile, stats } from '@/data/content'
import { Reveal } from '@/components/Reveal'

const base = import.meta.env.BASE_URL

export function Hero() {
  return (
    <section id="top" className="pt-28 md:pt-36">
      <div className="wrap grid gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-8">
          <p className="mono-label text-ink-soft">
            B.S. Computer Science · Cleveland State University
          </p>
          <h1 className="mt-6 font-display text-[clamp(3.25rem,9vw,8rem)] leading-[0.95] tracking-tight">
            Backend systems, built to be <em className="text-accent">tested</em> and explained.
          </h1>
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

        <Reveal delay={0.15} className="lg:col-span-4">
          <figure>
            <img
              src={`${base}${profile.photo}`}
              alt="Portrait of Tirth Patel"
              width={640}
              height={800}
              className="aspect-[4/5] w-full max-w-sm border border-rule object-cover lg:max-w-none"
            />
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
                {s.prefix}
                {s.value.toFixed(s.decimals ?? 0)}
                {s.suffix}
              </dd>
            </div>
          ))}
        </dl>
        <p className="mono-label mt-4 text-ink-soft">
          Test count is declared test cases across the four repositories, counted from source.
        </p>
      </div>
    </section>
  )
}
