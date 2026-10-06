import {
  AmbientLight, Color, DirectionalLight, OrthographicCamera, Raycaster,
  Scene, Vector2, Vector3, WebGLRenderer,
} from 'three'
import type { ArchitectureSceneProps } from './ArchitectureScene'
import { buildGraph, type GraphVisual } from './build'
import { createGeometryLibrary, type GeometryLibrary } from './geometry'

export interface SceneController {
  update: (props: ArchitectureSceneProps) => void
  dispose: () => void
}

const duration = 0.7
const ease = (value: number) => value * value * (3 - 2 * value)

export function createScene(host: HTMLDivElement, unavailable: () => void): SceneController | null {
  const canvas = document.createElement('canvas')
  let renderer: WebGLRenderer
  let context: WebGL2RenderingContext | null = null
  try {
    context = canvas.getContext('webgl2', { alpha: false, antialias: true, powerPreference: 'low-power' })
    if (!context) { unavailable(); return null }
    renderer = new WebGLRenderer({ canvas, context, antialias: true, alpha: false })
  } catch {
    context?.getExtension('WEBGL_lose_context')?.loseContext()
    unavailable()
    return null
  }

  const scene = new Scene()
  const camera = new OrthographicCamera(-7, 7, 4, -4, 0.1, 100)
  const ambient = new AmbientLight()
  const light = new DirectionalLight()
  light.position.set(-3, 6, 8)
  scene.add(ambient, light)
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  const orbit = new Vector2()
  const center = new Vector3()
  const targetCenter = new Vector3()
  const eye = new Vector3()
  const origin = new Vector3()
  const stillPointer = new Vector2()
  let library: GeometryLibrary | null = null
  let current: GraphVisual | null = null
  let outgoing: GraphVisual | null = null
  let outgoingOpacity = 1
  let props: ArchitectureSceneProps | null = null
  let hover: string | null = null
  let transition = duration
  let time = 0
  let lastTime = 0
  let frameId: number | null = null
  let disposed = false
  let visible = typeof IntersectionObserver === 'undefined'
  let width = 0
  let height = 0
  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let pressed: { x: number; y: number; id: number } | null = null

  function stop() {
    if (frameId !== null) cancelAnimationFrame(frameId)
    frameId = null
    lastTime = 0
  }

  function dispose() {
    if (disposed) return
    disposed = true
    stop()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    document.removeEventListener('visibilitychange', visibilityChanged)
    canvas.removeEventListener('webglcontextlost', contextLost)
    canvas.removeEventListener('pointermove', pointerMoved)
    canvas.removeEventListener('pointerleave', pointerLeft)
    canvas.removeEventListener('pointerdown', pointerDown)
    canvas.removeEventListener('pointerup', pointerUp)
    canvas.removeEventListener('pointercancel', pointerCancelled)
    current?.dispose()
    outgoing?.dispose()
    library?.dispose()
    scene.clear()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }

  function fail() {
    if (disposed) return
    dispose()
    unavailable()
  }

  function canRender() {
    return !disposed && visible && !document.hidden && width > 0 && height > 0 && props !== null
  }

  function style() {
    if (!props) return
    current?.style(props.palette, props.activeNodeId, props.reducedMotion ? null : hover)
    outgoing?.style(props.palette, null, null)
  }

  function render(delta: number) {
    if (!props || !current) return
    const moving = !props.reducedMotion
    if (moving) time += delta
    transition = moving ? Math.min(duration, transition + delta) : duration
    const progress = ease(transition / duration)
    current.frame(time, progress, moving)
    if (outgoing) {
      outgoing.frame(time, outgoingOpacity * (1 - progress), moving)
      if (transition >= duration) { outgoing.dispose(); outgoing = null }
    }
    const active = current.nodes.find(node => node.id === props?.activeNodeId)
    targetCenter.copy(active?.base ?? origin).multiplyScalar(0.12)
    const damping = moving ? 1 - Math.exp(-delta * 5) : 1
    center.lerp(targetCenter, damping)
    orbit.lerp(moving ? pointer : stillPointer, damping)
    eye.set(1.1 + orbit.x * 2.2 + (moving ? Math.sin(time * 0.32) * 1.1 : 0), 2.3 + orbit.y * 1.1 + (moving ? Math.sin(time * 0.21) * 0.35 : 0), 12)
    camera.position.copy(center).add(eye)
    camera.lookAt(center)
    camera.updateMatrixWorld()
    renderer.render(scene, camera)
  }

  function tick(now: number) {
    frameId = null
    if (!canRender()) { lastTime = 0; return }
    const delta = lastTime ? Math.min((now - lastTime) / 1000, 0.05) : 1 / 60
    lastTime = now
    try { render(delta) } catch { fail(); return }
    if (!props?.reducedMotion && canRender()) frameId = requestAnimationFrame(tick)
  }

  function wake() {
    if (!canRender()) { stop(); return }
    if (props?.reducedMotion) {
      stop()
      try { render(0) } catch { fail() }
    } else if (frameId === null) {
      frameId = requestAnimationFrame(tick)
    }
  }

  function resize() {
    if (disposed) return
    width = host.clientWidth
    height = host.clientHeight
    if (!width || !height) { stop(); return }
    try {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
      renderer.setSize(width, height, false)
      const aspect = width / height
      // Includes the longest two-line label, the depth projection, and the focus offset.
      const span = Math.max(6.8, 13.4 / aspect)
      camera.left = -span * aspect / 2
      camera.right = span * aspect / 2
      camera.top = span / 2
      camera.bottom = -span / 2
      camera.updateProjectionMatrix()
      wake()
    } catch { fail() }
  }

  function visibilityChanged() { wake() }
  function contextLost(event: Event) { event.preventDefault(); fail() }

  function pick(event: PointerEvent) {
    if (!current || disposed || !width || !height) return null
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    const point = new Vector2((event.clientX - rect.left) / rect.width * 2 - 1,
      1 - (event.clientY - rect.top) / rect.height * 2)
    scene.updateMatrixWorld(true)
    raycaster.setFromCamera(point, camera)
    const hit = raycaster.intersectObjects(current.nodes.map(node => node.body), false)[0]
    return hit ? current.nodes.find(node => node.body === hit.object)?.id ?? null : null
  }

  function pointerMoved(event: PointerEvent) {
    if (disposed || !props) return
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return
    if (event.pointerType !== 'touch' && !props.reducedMotion) {
      pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
        1 - (event.clientY - rect.top) / rect.height * 2).clampScalar(-1, 1)
    }
    const next = pick(event)
    canvas.style.cursor = next ? 'pointer' : 'default'
    if (next !== hover) { hover = next; style() }
  }

  function pointerLeft() {
    hover = null
    pointer.set(0, 0)
    pressed = null
    canvas.style.cursor = 'default'
    style()
  }

  function pointerDown(event: PointerEvent) {
    if (event.isPrimary && event.button === 0) pressed = { x: event.clientX, y: event.clientY, id: event.pointerId }
  }

  function pointerUp(event: PointerEvent) {
    const start = pressed
    pressed = null
    if (start && start.id === event.pointerId && Math.hypot(event.clientX - start.x, event.clientY - start.y) < 6) {
      props?.onActiveNodeChange(pick(event))
    }
  }

  function pointerCancelled() { pressed = null }

  function update(next: ArchitectureSceneProps) {
    if (disposed || !library) return
    const changedGraph = props?.graph !== next.graph
    const changedVisual = changedGraph || props?.activeNodeId !== next.activeNodeId
      || props?.reducedMotion !== next.reducedMotion || !props
      || (Object.keys(next.palette) as (keyof typeof next.palette)[])
        .some(key => props?.palette[key] !== next.palette[key])
    props = next
    if (!changedVisual) return
    try {
      scene.background = new Color(next.palette.background)
      ambient.color.set(next.palette.ink)
      ambient.intensity = 2
      light.color.set(next.palette.ink)
      light.intensity = 2.2
      if (changedGraph) {
        const replacement = buildGraph(next.graph, library, next.palette, renderer.getPixelRatio())
        outgoing?.dispose()
        outgoing = current
        outgoingOpacity = outgoing?.opacity ?? 1
        current = replacement
        scene.add(current.root)
        transition = next.reducedMotion ? duration : 0
        hover = null
        canvas.style.cursor = 'default'
      }
      style()
      wake()
    } catch { fail() }
  }

  try {
    library = createGeometryLibrary()
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;'
    canvas.setAttribute('aria-hidden', 'true')
    host.appendChild(canvas)
    canvas.addEventListener('webglcontextlost', contextLost)
    canvas.addEventListener('pointermove', pointerMoved, { passive: true })
    canvas.addEventListener('pointerleave', pointerLeft, { passive: true })
    canvas.addEventListener('pointerdown', pointerDown, { passive: true })
    canvas.addEventListener('pointerup', pointerUp, { passive: true })
    canvas.addEventListener('pointercancel', pointerCancelled, { passive: true })
    document.addEventListener('visibilitychange', visibilityChanged)
    resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(host)
    if (typeof IntersectionObserver !== 'undefined') {
      intersectionObserver = new IntersectionObserver(entries => {
        visible = entries.some(entry => entry.isIntersecting)
        wake()
      })
      intersectionObserver.observe(host)
    }
    resize()
    return { update, dispose }
  } catch {
    fail()
    return null
  }
}
