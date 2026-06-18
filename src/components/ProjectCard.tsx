import type { Project } from '@/data/content'
import { Reveal } from './Reveal'

export function ProjectCard({ project }: { project: Project }) {
  return (
    <Reveal
      variant="up"
      asItem
      className="group relative flex flex-col rounded-xl bg-bg-card/50 p-6 ring-1 ring-accent-secondary/10 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:ring-accent-secondary/25 hover:shadow-[0_12px_40px_rgba(0,230,118,0.08)]"
    >
      {/* Top accent strip */}
      <div className="absolute inset-x-0 top-0 h-px rounded-t-xl bg-gradient-to-r from-accent-secondary/40 via-accent-secondary/15 to-transparent" />

      <h3 className="mb-3 text-lg font-semibold text-accent-secondary">{project.title}</h3>

      {/* Tech tags — pill shaped */}
      <div className="mb-4 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-accent-secondary/15 bg-bg-card px-2.5 py-0.5 font-mono text-xs text-text-muted"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Details */}
      <ul className="mb-6 flex-1 space-y-2 text-sm text-text-secondary">
        {project.details.map((detail, i) => (
          <li key={i} className="relative pl-5 leading-relaxed">
            <span className="absolute left-0 text-accent-secondary/60">▸</span>
            {detail}
          </li>
        ))}
      </ul>

      {/* Links */}
      <div className="flex flex-wrap gap-5">
        {project.links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            target="_blank"
            rel="noreferrer"
            className="group/link flex items-center gap-1 text-sm font-medium text-accent-secondary/80 transition-colors hover:text-accent-secondary"
          >
            {link.label}
            <span className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
              ↗
            </span>
          </a>
        ))}
      </div>
    </Reveal>
  )
}
