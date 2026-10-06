import type { ArchGraph, ArchNode } from '@/data/architectures'
import { COLORS } from '@/theme'

interface Props {
  graph: ArchGraph
  highlightNodeId: string | null
  /** Index of the edge currently being traced, if any. */
  activeEdge: number | null
  onOpen: (nodeId: string) => void
}

const W = 760
const H = 480
const PAD_X = 50

// Oblique projection of the scene's abstract (x, y, z) layout into 2D.
function project(node: ArchNode) {
  const [x, y, z] = node.position
  return {
    x: PAD_X + ((x + 5.6) / 11.2) * (W - PAD_X * 2) + z * 12,
    y: H / 2 - y * 92 - z * 12,
  }
}

const boxWidth = (label: string) => Math.max(104, label.length * 8.6 + 32)

/** Glowing SVG schematic of a graph. Pointer-only; the component list is the keyboard path. */
export function ArchitectureDiagram({ graph, highlightNodeId, activeEdge, onOpen }: Props) {
  const pos = new Map(graph.nodes.map((n) => [n.id, project(n)]))

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full" aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid meet">
      <defs>
        <filter id="glow-soft" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="4" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {graph.edges.map((e, i) => {
        const a = pos.get(e.from)
        const b = pos.get(e.to)
        if (!a || !b) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2 - 18
        const active = activeEdge === i
        const color = e.fallback ? COLORS.coral : active ? COLORS.amber : COLORS.glow
        const t = 0.62
        const px = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t ** 2 * b.x
        const py = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t ** 2 * b.y
        const tx = 2 * (1 - t) * (mx - a.x) + 2 * t * (b.x - mx)
        const ty = 2 * (1 - t) * (my - a.y) + 2 * t * (b.y - my)
        const angle = (Math.atan2(ty, tx) * 180) / Math.PI
        return (
          <g key={`${e.from}-${e.to}`} opacity={activeEdge === null || active ? 1 : 0.35}>
            <path
              d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
              fill="none"
              stroke={color}
              strokeWidth={active ? 3 : 1.6}
              strokeDasharray={e.fallback || active ? '6 6' : undefined}
              filter="url(#glow-soft)"
              className={active ? 'motion-safe:animate-[flow-dash_0.6s_linear_infinite]' : undefined}
            />
            <polygon points="0,0 -9,-4.5 -9,4.5" transform={`translate(${px},${py}) rotate(${angle})`} fill={color} />
          </g>
        )
      })}
      {graph.nodes.map((n) => {
        const p = pos.get(n.id)!
        const w = boxWidth(n.label)
        const lit = n.id === highlightNodeId
        return (
          <g key={n.id} transform={`translate(${p.x - w / 2},${p.y - 21})`} style={{ cursor: 'pointer' }} onClick={() => onOpen(n.id)}>
            <rect
              width={w}
              height={42}
              rx={9}
              fill={lit ? 'rgba(77,224,160,0.28)' : 'rgba(12,18,24,0.88)'}
              stroke={lit ? COLORS.accent : 'rgba(110,168,255,0.55)'}
              strokeWidth={lit ? 2.2 : 1.4}
              filter="url(#glow-soft)"
            />
            <text x={w / 2} y={26} textAnchor="middle" fontFamily="'Geist Mono', ui-monospace, monospace" fontSize={13.5} fill={COLORS.ink}>
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
