import type { ArchGraph } from '@/data/architectures'

export interface ScenePalette {
  background: string
  ink: string
  muted: string
  accent: string
  /** Secondary glow colour (cool contrast to accent). */
  glow: string
  packet: string
  fallback: string
}

/** 'high' = bloom + particles; 'low' = halo sprites, no post-processing. The scene may degrade itself. */
export type SceneQuality = 'high' | 'low'

export interface ZoomTarget {
  graphId: string
  nodeId: string
}

export interface ConstellationSceneProps {
  /** Stable module-level constant. Build the world ONCE; never rebuild on re-render. */
  graphs: ArchGraph[]
  /** Controlled slide index into `graphs`. */
  index: number
  /** Called when a user drag, swipe, or horizontal wheel settles on a new slide. */
  onIndexChange: (index: number) => void
  /** Node of the CURRENT graph highlighted from the DOM list (hover/focus). */
  highlightNodeId: string | null
  /** User tapped/clicked a node (not a drag). The parent starts the zoom + explainer. */
  onNodeOpen: (graphId: string, nodeId: string) => void
  /** Camera dollies to this node and dims the rest; null returns to the overview. */
  zoomTarget: ZoomTarget | null
  /** Increment to run a request-trace over the current graph's edges, in declared order. */
  traceToken: number
  onTraceStep?: (edgeIndex: number) => void
  onTraceEnd?: () => void
  palette: ScenePalette
  reducedMotion: boolean
  /** Starting tier. The scene reports downgrades through onQualityChange. */
  quality: SceneQuality
  onQualityChange?: (quality: SceneQuality) => void
  /** First frame rendered. */
  onReady?: () => void
  /** WebGL unavailable or context lost; the parent shows the DOM/SVG fallback. */
  onUnavailable?: () => void
  className?: string
}
