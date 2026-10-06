import type { ArchGraph, ArchNode } from '@/data/architectures'

interface Props {
  graph: ArchGraph
  activeNodeId: string | null
  onSelect: (id: string | null) => void
}

const W = 760
const H = 570
const PAD_X = 40

// Oblique projection of the scene's abstract (x, y, z) layout into 2D.
function project(node: ArchNode) {
  const [x, y, z] = node.position
  return {
    x: PAD_X + ((x + 5.4) / 10.8) * (W - PAD_X * 2) + z * 12,
    y: H / 2 - y * 112 - z * 12,
  }
}

const boxWidth = (label: string) => Math.max(110, label.length * 9 + 34)

/** Static SVG schematic of the same graph. Pointer-only; the node list beside it is the keyboard path. */
export function ArchitectureDiagram({ graph, activeNodeId, onSelect }: Props) {
  const pos = new Map(graph.nodes.map((n) => [n.id, project(n)]))

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-full w-full"
      aria-hidden="true"
      focusable="false"
      onClick={() => onSelect(null)}
    >
      {graph.edges.map((e) => {
        const a = pos.get(e.from)
        const b = pos.get(e.to)
        if (!a || !b) return null
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2 - 18
        const color = e.fallback ? '#ff8a5c' : '#9a9d94'
        // Arrowhead on the curve at t = 0.62, rotated to the curve's tangent.
        const t = 0.62
        const px = (1 - t) ** 2 * a.x + 2 * (1 - t) * t * mx + t ** 2 * b.x
        const py = (1 - t) ** 2 * a.y + 2 * (1 - t) * t * my + t ** 2 * b.y
        const tx = 2 * (1 - t) * (mx - a.x) + 2 * t * (b.x - mx)
        const ty = 2 * (1 - t) * (my - a.y) + 2 * t * (b.y - my)
        const angle = (Math.atan2(ty, tx) * 180) / Math.PI
        return (
          <g key={`${e.from}-${e.to}`}>
            <path
              d={`M${a.x},${a.y} Q${mx},${my} ${b.x},${b.y}`}
              fill="none"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray={e.fallback ? '5 5' : undefined}
              opacity={0.8}
            />
            <polygon
              points="0,0 -9,-4.5 -9,4.5"
              transform={`translate(${px},${py}) rotate(${angle})`}
              fill={color}
            />
          </g>
        )
      })}
      {graph.nodes.map((n) => {
        const p = pos.get(n.id)!
        const w = boxWidth(n.label)
        const active = n.id === activeNodeId
        return (
          <g
            key={n.id}
            transform={`translate(${p.x - w / 2},${p.y - 20})`}
            style={{ cursor: 'pointer' }}
            onClick={(ev) => {
              ev.stopPropagation()
              onSelect(n.id)
            }}
          >
            <rect
              width={w}
              height={40}
              rx={3}
              fill={active ? '#4de0a0' : '#141816'}
              stroke={active ? '#4de0a0' : '#ece9df'}
              strokeOpacity={active ? 1 : 0.35}
            />
            <text
              x={w / 2}
              y={25}
              textAnchor="middle"
              fontFamily="'Geist Mono', ui-monospace, monospace"
              fontSize={14}
              fill={active ? '#0c0e0d' : '#ece9df'}
            >
              {n.label}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
