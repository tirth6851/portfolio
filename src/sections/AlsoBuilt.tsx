import { projects } from '@/data/content'
import { Reveal } from '@/components/Reveal'

const linkClass = 'text-ink underline decoration-accent/60 underline-offset-8 transition hover:text-accent'

export function AlsoBuilt() {
  const others = projects.filter((p) => !p.featured)
  if (others.length === 0) return null

  return (
    <section aria-labelledby="also-built" className="relative border-t border-line py-20">
      <div className="wrap">
        <Reveal>
          <h2 id="also-built" className="mono-label text-accent">
            Also built
          </h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2">
            {others.map((project) => (
              <li key={project.title} className="glass glow-border flex h-full flex-col p-6 transition duration-500 hover:-translate-y-1 hover:shadow-[0_0_44px_rgba(110,168,255,0.2)]">
                <h3 className="text-2xl font-bold tracking-tight">{project.title}</h3>
                <p className="mt-3 flex-1 leading-relaxed text-ink-soft">{project.details[0]}</p>
                <ul className="mono-label mt-5 flex flex-wrap gap-x-6 gap-y-2">
                  {project.links.map((l) => (
                    <li key={l.href}>
                      <a href={l.href} target="_blank" rel="noreferrer" className={linkClass}>
                        {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
