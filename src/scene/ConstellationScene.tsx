import { useEffect, useEffectEvent, useRef } from 'react'
import type { ConstellationSceneProps } from './types'
import { createScene } from './runtime'
import type { SceneController } from './runtime'

export default function ConstellationScene(props: ConstellationSceneProps) {
  const host = useRef<HTMLDivElement>(null)
  const controller = useRef<SceneController | null>(null)
  const latest = useEffectEvent(() => props)

  useEffect(() => {
    if (!host.current) return
    const scene = createScene(host.current, latest())
    controller.current = scene
    return () => { controller.current = null; scene?.dispose() }
  }, [])

  useEffect(() => { controller.current?.sync(props) }, [props])

  return <div ref={host} className={props.className} aria-hidden="true"
    style={{ width: '100%', height: '100%', overflow: 'hidden' }} />
}
