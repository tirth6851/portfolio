import { useEffect, useEffectEvent, useRef } from 'react'
import type { ArchGraph } from '@/data/architectures'
import { createScene, type SceneController } from './runtime'

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

export default function ArchitectureScene(props: ArchitectureSceneProps) {
  const container = useRef<HTMLDivElement>(null)
  const controller = useRef<SceneController | null>(null)
  const unavailable = useEffectEvent(() => props.onUnavailable?.())

  useEffect(() => {
    if (!container.current) return
    const scene = createScene(container.current, () => unavailable())
    controller.current = scene
    return () => {
      controller.current = null
      scene?.dispose()
    }
  }, [])

  useEffect(() => {
    controller.current?.update(props)
  }, [props])

  return <div ref={container} className={props.className} aria-hidden="true"
    style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
}
