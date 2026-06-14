import type { Project } from '@/data/content'
import { Reveal } from './Reveal'

/** A single featured-project card (data-driven). */
export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal
      variant="flip"
      asItem
      className="group rounded-xl border border-accent-primary bg-bg-card/85 p-8 transition-all duration-300 hover:-translate-y-1.5 hover:border-accent-secondary hover:shadow-[0_10px_40px_rgba(25,135,84,0.2)]"
    >
      <h3 className="mb-3 text-xl font-semibold text-accent-secondary">{project.title}</h3>

      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md border border-accent-primary bg-accent-primary/30 px-2.5 py-1 text-xs text-accent-secondary"
          >
            {tag}
          </span>
        ))}
      </div>

      <ul className="mb-6 space-y-2 text-text-secondary">
        {project.details.map((detail, i) => (
          <li key={i} className="relative pl-6 leading-relaxed">
            <span className="absolute left-0 font-bold text-accent-secondary">✓</span>
            {detail}
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-5">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="font-semibold text-accent-gold transition-colors hover:text-accent-secondary"
          >
            {link.label} →
          </a>
        ))}
      </div>
    </Reveal>
  )
}
