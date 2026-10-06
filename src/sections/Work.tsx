import { projects } from '@/data/content'
import { architectures } from '@/data/architectures'
import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

interface Props {
  onViewArchitecture: (graphId: string) => void
}

export function Work({ onViewArchitecture }: Props) {
  return (
    <section id="work" className="py-24 md:py-32">
      <div className="wrap">
        <SectionHead index="02" kicker="Case studies" title="What I built, and how it works." className="mb-14" />

        <div>
          {projects.map((project, i) => {
            const arch = architectures.find((a) => a.project === project.title)
            return (
              <Reveal key={project.title}>
                <article className="grid gap-6 border-t border-ink py-10 md:grid-cols-12 md:gap-10 md:py-14">
                  <div className="md:col-span-4">
                    <p aria-hidden="true" className="font-display text-6xl leading-none text-ink/25">
                      {String(i + 1).padStart(2, '0')}
                    </p>
                    <h3 className="mt-3 font-display text-4xl leading-tight">{project.title}</h3>
                    <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
                      {project.tags.map((tag) => (
                        <li key={tag} className="mono-label border border-rule px-2 py-1 text-ink-soft">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="md:col-span-8">
                    <ul className="space-y-5">
                      {project.details.map((d) => (
                        <li key={d} className="border-l border-rule pl-5 leading-relaxed text-ink-soft">
                          {d}
                        </li>
                      ))}
                    </ul>
                    <div className="mono-label mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
                      {arch && (
                        <button
                          type="button"
                          onClick={() => onViewArchitecture(arch.id)}
                          className="mono-label bg-ink px-4 py-2 text-paper transition-colors hover:bg-accent"
                        >
                          View architecture ↑
                        </button>
                      )}
                      {project.links.map((l) => (
                        <a
                          key={l.href}
                          href={l.href}
                          target="_blank"
                          rel="noreferrer"
                          className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent"
                        >
                          {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}
