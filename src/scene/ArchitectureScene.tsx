import type { ArchGraph } from '@/data/architectures'

export interface ScenePalette {
  background: string
  ink: string
  muted: string
  accent: string
  packet: string
  fallback: string
}

export interface ArchitectureSceneProps {
  graph: ArchGraph
  activeNodeId: string | null
  /** Called when the user picks a node in the canvas (null = cleared). */
  onActiveNodeChange: (id: string | null) => void
  palette: ScenePalette
  /** Render a single static frame and stop the animation loop. */
  reducedMotion: boolean
  /** Called if WebGL cannot start or the context is lost, so the parent can show the DOM fallback. */
  onUnavailable?: () => void
  className?: string
}

// Stub: replaced by the real implementation (owner: Codex, src/scene/** only).
export default function ArchitectureScene({ className }: ArchitectureSceneProps) {
  return <div className={className} aria-hidden="true" />
}
