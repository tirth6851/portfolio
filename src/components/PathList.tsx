import type { ArchGraph } from '@/data/architectures'

interface Props {
  graph: ArchGraph
  activeEdge: number | null
  className?: string
}

/** The request path as plain text: source to destination per edge, fallbacks marked. */
export function PathList({ graph, activeEdge, className = '' }: Props) {
  const nameOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id
  return (
    <ol className={`divide-y divide-line ${className}`}>
      {graph.edges.map((e, i) => (
        <li
          key={`${e.from}-${e.to}`}
          aria-current={activeEdge === i ? 'step' : undefined}
          className={`px-4 py-3 text-sm transition-colors ${activeEdge === i ? 'bg-amber/10' : ''}`}
        >
          <span className="font-medium text-ink">{nameOf(e.from)}</span>
          <span aria-hidden="true" className="mx-2 text-ink-soft">→</span>
          <span className="sr-only"> to </span>
          <span className="font-medium text-ink">{nameOf(e.to)}</span>
          {(e.label || e.fallback) && (
            <span className="mono-label mt-1 block text-ink-soft">
              {e.label}
              {e.label && e.fallback && ' · '}
              {e.fallback && <span className="text-coral">fallback path</span>}
            </span>
          )}
        </li>
      ))}
    </ol>
  )
}
