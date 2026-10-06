import { ACESFilmicToneMapping, Raycaster, Vector2, WebGLRenderer } from 'three'
import type { ConstellationSceneProps, ScenePalette } from './types'
import { createCameraRig, GRAPH_SPACING } from './camera'
import { createBloom } from './effects'
import { createQuality } from './quality'
import { createWorld } from './world'
import type { NodeHit, TraceState, World } from './world'

export interface SceneController {
  sync(next: ConstellationSceneProps): void
  dispose(): void
}

export function createScene(host: HTMLDivElement, initial: ConstellationSceneProps): SceneController | null {
  let props = initial
  // The graph collection and starting quality are immutable for this mounted world.
  const graphs = initial.graphs
  const clampIndex = (index: number) => Math.max(0, Math.min(graphs.length - 1, Math.round(index)))
  const canvas = document.createElement('canvas')
  const rig = createCameraRig(clampIndex(initial.index))
  const quality = createQuality(initial.quality)
  const raycaster = new Raycaster()
  const pointer = new Vector2()
  let renderer: WebGLRenderer | null = null
  let world: World | null = null
  let bloom: ReturnType<typeof createBloom> | null = null
  let resizeObserver: ResizeObserver | null = null
  let intersectionObserver: IntersectionObserver | null = null
  let disposed = false
  let ready = false
  let visible = typeof IntersectionObserver === 'undefined'
  let width = 0
  let height = 0
  let raf: number | null = null
  let previousTime = 0
  let time = 0
  let hover: NodeHit | null = null
  let trace: TraceState | null = null
  let traceTimer: ReturnType<typeof setTimeout> | null = null
  let traceTimerStart = 0
  let traceRemaining = 700
  let wheelTime = -Infinity
  let pressed: { id: number; x: number; y: number; lastX: number; lastTime: number;
    startCamera: number; velocity: number; horizontal: boolean; vertical: boolean; distance: number } | null = null

  function canRender() { return !disposed && visible && !document.hidden && width > 0 && height > 0 }
  function clearTraceTimer() {
    if (traceTimer !== null) {
      clearTimeout(traceTimer)
      traceTimer = null
      traceRemaining = Math.max(0, traceRemaining - (performance.now() - traceTimerStart))
    }
  }
  function stop() {
    if (raf !== null) cancelAnimationFrame(raf)
    raf = null
    previousTime = 0
    quality.resetTiming()
    clearTraceTimer()
  }
  function style() { world?.style(clampIndex(props.index), props.highlightNodeId, hover, props.zoomTarget, trace) }
  function nextTraceStep() {
    if (!trace) return
    trace.edgeIndex++
    // Fallback edges run only when the primary step fails, so a normal request never plays them.
    while (trace.edgeIndex < graphs[trace.graphIndex].edges.length && graphs[trace.graphIndex].edges[trace.edgeIndex].fallback) trace.edgeIndex++
    trace.progress = 0
    traceRemaining = 700
    if (trace.edgeIndex >= graphs[trace.graphIndex].edges.length) {
      trace = null
      style()
      props.onTraceEnd?.()
    } else {
      style()
      props.onTraceStep?.(trace.edgeIndex)
    }
  }
  function scheduleTrace() {
    if (!trace || !props.reducedMotion || !canRender() || traceTimer !== null) return
    traceTimerStart = performance.now()
    traceTimer = setTimeout(() => {
      traceTimer = null
      if (disposed) return
      nextTraceStep()
      wake()
    }, traceRemaining)
  }
  function startTrace(token: number) {
    clearTraceTimer()
    trace = null
    traceRemaining = 700
    if (token > 0 && graphs[clampIndex(props.index)]) {
      trace = { graphIndex: clampIndex(props.index), edgeIndex: -1, progress: 0 }
      nextTraceStep()
    }
    style()
  }
  function render(dt: number) {
    if (!renderer || !world) return
    if (!props.reducedMotion) {
      time += dt
      if (trace) {
        trace.progress = Math.min(1, trace.progress + dt / 1.1)
        if (trace.progress >= 1) nextTraceStep()
      }
    }
    rig.frame(dt, props.reducedMotion)
    world.frame(time, !props.reducedMotion, rig.camera, height, !!props.zoomTarget)
    if (bloom) bloom.render()
    else renderer.render(world.scene, rig.camera)
    if (!ready) { ready = true; props.onReady?.() }
  }
  function tick(now: number) {
    raf = null
    if (!canRender()) { stop(); return }
    const elapsed = previousTime ? now - previousTime : 16.7
    previousTime = now
    try {
      if (quality.sample(elapsed)) {
        if (!quality.bloom) { bloom?.dispose(); bloom = null }
        world?.quality(quality.tier === 'low', !quality.bloom)
        resize()
        if (quality.tier === 'low') props.onQualityChange?.('low')
      }
      render(Math.min(elapsed / 1000, 0.05))
    } catch { fail(); return }
    if (canRender() && !props.reducedMotion && raf === null) raf = requestAnimationFrame(tick)
  }
  function wake() {
    if (!canRender()) { stop(); return }
    if (props.reducedMotion) {
      if (raf !== null) cancelAnimationFrame(raf)
      raf = null
      previousTime = 0
      try { render(0) } catch { fail(); return }
      scheduleTrace()
    } else if (raf === null) raf = requestAnimationFrame(tick)
  }
  function resize() {
    if (disposed || !renderer) return
    width = host.clientWidth
    height = host.clientHeight
    if (width === 0 || height === 0) { stop(); return }
    try {
      const dpr = Math.min(window.devicePixelRatio || 1, quality.dpr)
      renderer.setPixelRatio(dpr)
      renderer.setSize(width, height, false)
      rig.resize(width, height)
      world?.resize(width, height)
      bloom?.resize(width, height, dpr)
      wake()
    } catch { fail() }
  }
  function pick(event: PointerEvent): NodeHit | null {
    if (disposed || !world || !width || !height || props.zoomTarget) return null
    const rect = canvas.getBoundingClientRect()
    if (!rect.width || !rect.height) return null
    pointer.set((event.clientX - rect.left) / rect.width * 2 - 1,
      1 - (event.clientY - rect.top) / rect.height * 2)
    world.scene.updateMatrixWorld(true)
    raycaster.setFromCamera(pointer, rig.camera)
    const hit = raycaster.intersectObjects(world.pickables, false)
      .find(item => item.object.parent?.parent?.visible)
    return hit ? hit.object.userData.hit as NodeHit : null
  }
  function setHover(next: NodeHit | null) {
    if (next?.graphIndex === hover?.graphIndex && next?.nodeId === hover?.nodeId) return
    hover = next
    canvas.style.cursor = next ? 'pointer' : 'grab'
    style()
    wake()
  }
  function pointerDown(event: PointerEvent) {
    if (props.zoomTarget || !event.isPrimary || event.button !== 0) return
    pressed = { id: event.pointerId, x: event.clientX, y: event.clientY, lastX: event.clientX,
      lastTime: event.timeStamp, startCamera: rig.x, velocity: 0, horizontal: false, vertical: false, distance: 0 }
  }
  function pointerMove(event: PointerEvent) {
    if (props.zoomTarget || disposed) return
    if (pressed && pressed.id === event.pointerId) {
      const dx = event.clientX - pressed.x
      const dy = event.clientY - pressed.y
      pressed.distance = Math.max(pressed.distance, Math.hypot(dx, dy))
      if (!pressed.horizontal && !pressed.vertical && Math.max(Math.abs(dx), Math.abs(dy)) > 8) {
        if (Math.abs(dx) > Math.abs(dy) * 1.15) {
          pressed.horizontal = true
          canvas.setPointerCapture(event.pointerId)
          setHover(null)
        } else pressed.vertical = true
      }
      if (pressed.horizontal) {
        const elapsed = Math.max(8, event.timeStamp - pressed.lastTime)
        const units = rig.span / Math.max(1, width)
        pressed.velocity = -(event.clientX - pressed.lastX) * units / elapsed * 1000
        pressed.lastX = event.clientX
        pressed.lastTime = event.timeStamp
        rig.drag(Math.max(0, Math.min((graphs.length - 1) * GRAPH_SPACING, pressed.startCamera - dx * units)))
        canvas.style.cursor = 'grabbing'
        wake()
      }
      return
    }
    if (event.pointerType !== 'touch') setHover(pick(event))
  }
  function releaseCapture() {
    if (pressed && canvas.hasPointerCapture(pressed.id)) canvas.releasePointerCapture(pressed.id)
  }
  function pointerUp(event: PointerEvent) {
    if (!pressed || pressed.id !== event.pointerId) return
    const start = pressed
    releaseCapture()
    pressed = null
    canvas.style.cursor = hover ? 'pointer' : 'grab'
    if (props.zoomTarget) return
    if (start.horizontal) {
      // A drag of ~18% of the slide spacing, or a quick flick, moves one slide.
      const flick = event.timeStamp - start.lastTime < 120 ? start.velocity : 0
      const delta = rig.x - start.startCamera
      const origin = clampIndex(props.index)
      const moved = Math.abs(delta) > GRAPH_SPACING * 0.18 || Math.abs(flick) > 6
      const next = moved ? clampIndex(origin + Math.sign(Math.abs(delta) > 0.5 ? delta : flick)) : origin
      rig.slide(next)
      if (next !== clampIndex(props.index)) props.onIndexChange(next)
      wake()
    } else if (Math.max(start.distance, Math.hypot(event.clientX - start.x, event.clientY - start.y)) < 6) {
      const hit = pick(event)
      if (!hit) return
      if (hit.graphIndex !== clampIndex(props.index)) props.onIndexChange(hit.graphIndex)
      else props.onNodeOpen(graphs[hit.graphIndex].id, hit.nodeId)
    }
  }
  function pointerCancel() {
    if (props.zoomTarget || disposed) return
    releaseCapture()
    pressed = null
    rig.slide(clampIndex(props.index))
    setHover(null)
    wake()
  }
  function pointerLeave() { if (!props.zoomTarget && !pressed?.horizontal) setHover(null) }
  function wheel(event: WheelEvent) {
    if (props.zoomTarget || Math.abs(event.deltaX) <= Math.abs(event.deltaY) * 1.2 || Math.abs(event.deltaX) < 2) return
    event.preventDefault()
    const now = event.timeStamp
    const newGesture = now - wheelTime > 220
    wheelTime = now
    if (!newGesture) return
    const next = clampIndex(props.index + Math.sign(event.deltaX))
    if (next !== clampIndex(props.index)) props.onIndexChange(next)
  }
  function visibilityChanged() { wake() }
  function contextLost(event: Event) { event.preventDefault(); fail() }
  function fail() {
    if (disposed) return
    dispose()
    props.onUnavailable?.()
  }
  function dispose() {
    if (disposed) return
    disposed = true
    stop()
    resizeObserver?.disconnect()
    intersectionObserver?.disconnect()
    document.removeEventListener('visibilitychange', visibilityChanged)
    canvas.removeEventListener('webglcontextlost', contextLost)
    canvas.removeEventListener('pointerdown', pointerDown)
    canvas.removeEventListener('pointermove', pointerMove)
    canvas.removeEventListener('pointerleave', pointerLeave)
    window.removeEventListener('pointerup', pointerUp)
    canvas.removeEventListener('pointercancel', pointerCancel)
    canvas.removeEventListener('wheel', wheel)
    releaseCapture()
    pressed = null
    bloom?.dispose()
    world?.dispose()
    renderer?.dispose()
    renderer?.forceContextLoss()
    canvas.remove()
  }
  function sync(next: ConstellationSceneProps) {
    if (disposed) return
    const previous = props
    props = next // Callback-only renders are just this reference swap plus scalar comparisons.
    const slideChanged = previous.index !== next.index
    const zoomChanged = previous.zoomTarget?.graphId !== next.zoomTarget?.graphId
      || previous.zoomTarget?.nodeId !== next.zoomTarget?.nodeId
    const motionChanged = previous.reducedMotion !== next.reducedMotion
    const highlightChanged = previous.highlightNodeId !== next.highlightNodeId
    const traceChanged = previous.traceToken !== next.traceToken
    const paletteChanged = (Object.keys(next.palette) as (keyof ScenePalette)[])
      .some(key => previous.palette[key] !== next.palette[key])
    if (!slideChanged && !zoomChanged && !motionChanged && !highlightChanged && !traceChanged && !paletteChanged) return
    try {
      if (paletteChanged) world?.palette(next.palette)
      if (slideChanged) {
        releaseCapture()
        pressed = null
        hover = null
        rig.slide(clampIndex(next.index))
        clearTraceTimer()
        trace = null
      }
      if (zoomChanged) {
        releaseCapture()
        pressed = null
        hover = null
        canvas.style.cursor = next.zoomTarget ? 'default' : 'grab'
        rig.zoom(next.zoomTarget ? world?.nodePosition(next.zoomTarget) ?? null : null)
      }
      if (motionChanged) {
        clearTraceTimer()
        if (trace) {
          if (next.reducedMotion) traceRemaining = (1 - trace.progress) * 700
          else trace.progress = 1 - traceRemaining / 700
        }
        previousTime = 0
        quality.resetTiming()
      }
      if (traceChanged) startTrace(next.traceToken)
      style()
      wake()
    } catch { fail() }
  }

  let context: WebGL2RenderingContext | null = null
  try {
    context = canvas.getContext('webgl2', { alpha: false, antialias: initial.quality === 'low', powerPreference: 'high-performance' })
    if (!context) { fail(); return null }
    renderer = new WebGLRenderer({ canvas, context, alpha: false })
    renderer.toneMapping = ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05
    world = createWorld(graphs, initial.palette)
    if (quality.bloom) bloom = createBloom(renderer, world.scene, rig.camera)
    world.quality(quality.tier === 'low', !quality.bloom)
    if (initial.zoomTarget) rig.zoom(world.nodePosition(initial.zoomTarget))
    canvas.style.cssText = 'display:block;width:100%;height:100%;touch-action:pan-y;cursor:grab;'
    canvas.setAttribute('aria-hidden', 'true')
    host.appendChild(canvas)
    canvas.addEventListener('webglcontextlost', contextLost)
    canvas.addEventListener('pointerdown', pointerDown, { passive: true })
    canvas.addEventListener('pointermove', pointerMove, { passive: true })
    canvas.addEventListener('pointerleave', pointerLeave, { passive: true })
    window.addEventListener('pointerup', pointerUp, { passive: true })
    canvas.addEventListener('pointercancel', pointerCancel, { passive: true })
    canvas.addEventListener('wheel', wheel, { passive: false })
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
    startTrace(initial.traceToken)
    resize()
    return { sync, dispose }
  } catch {
    if (!renderer) context?.getExtension('WEBGL_lose_context')?.loseContext()
    fail()
    return null
  }
}
