import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import type { ArchGraph } from '@/data/architectures'
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import { PathList } from '@/components/PathList'

interface Props {
  graphs: ArchGraph[]
  index: number
  onIndexChange: (index: number) => void
  highlightNodeId: string | null
  activeEdge: number | null
  onOpen: (graphId: string, nodeId: string) => void
  /** Phones get the readable path list; larger screens get the glowing diagram. */
  narrow: boolean
}

/** Native swipeable slider used when WebGL is unavailable (CSS scroll-snap, no JS drag handling). */
export function FallbackCarousel({ graphs, index, onIndexChange, highlightNodeId, activeEdge, onOpen, narrow }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const settle = useRef<number | undefined>(undefined)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = track.current
    if (!el) return
    const target = index * el.clientWidth
    if (Math.abs(el.scrollLeft - target) > 4) el.scrollTo({ left: target, behavior: reduce ? 'auto' : 'smooth' })
  }, [index, reduce])

  const onScroll = () => {
    window.clearTimeout(settle.current)
    settle.current = window.setTimeout(() => {
      const el = track.current
      if (!el || el.clientWidth === 0) return
      const i = Math.round(el.scrollLeft / el.clientWidth)
      if (i !== index && i >= 0 && i < graphs.length) onIndexChange(i)
    }, 90)
  }

  return (
    <div ref={track} onScroll={onScroll} className="flex h-full w-full snap-x snap-mandatory overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {graphs.map((g, i) => (
        <div key={g.id} className="grid h-full w-full shrink-0 snap-center place-items-center px-4 pb-[27rem] pt-32 sm:px-16 lg:pb-24 lg:pl-[34rem] lg:pr-14 lg:pt-36" aria-hidden={i !== index}>
          {narrow ? (
            <div className="glass w-full max-w-md overflow-hidden">
              <PathList graph={g} activeEdge={i === index ? activeEdge : null} />
            </div>
          ) : (
            <div className="h-full w-full max-w-5xl">
              <ArchitectureDiagram graph={g} highlightNodeId={i === index ? highlightNodeId : null} activeEdge={i === index ? activeEdge : null} onOpen={(nodeId) => onOpen(g.id, nodeId)} />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
