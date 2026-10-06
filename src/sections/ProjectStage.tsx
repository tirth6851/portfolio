import { lazy, Suspense, useEffect, useRef, useState, type KeyboardEvent } from 'react'
import { AnimatePresence, useInView, useReducedMotion } from 'motion/react'
import { architectures, type NodeKind } from '@/data/architectures'
import { projects } from '@/data/content'
import { projectChips } from '@/data/explainers'
import { scenePalette } from '@/theme'
import type { SceneQuality, ZoomTarget } from '@/scene/types'
import { FallbackCarousel } from '@/components/FallbackCarousel'
import { ExplainerModal } from '@/components/ExplainerModal'
import { PathList } from '@/components/PathList'
import { SceneBoundary } from '@/components/SceneBoundary'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { detectWebGL } from '@/lib/webgl'

// three.js stays in this lazy chunk and only loads once the stage is near the viewport.
const ConstellationScene = lazy(() => import('@/scene/ConstellationScene'))

const KIND_LABEL: Record<NodeKind, string> = {
  client: 'Client',
  api: 'API',
  service: 'Service',
  worker: 'Workers',
  store: 'Data store',
  external: 'External',
  security: 'Security',
}

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']
const TRACE_STEP_MS = 1300

export function ProjectStage() {
  const reducedOS = useMediaQuery('(prefers-reduced-motion: reduce)')
  const narrow = useMediaQuery('(max-width: 639px)')
  const reducedMotion = useReducedMotion() ?? false
  const [paused, setPaused] = useState(false)
  const reduced = reducedOS || paused

  const [index, setIndex] = useState(0)
  const graph = architectures[index]
  const project = projects.find((p) => p.title === graph.project)

  const [highlightNodeId, setHighlightNodeId] = useState<string | null>(null)
  const [open, setOpen] = useState<ZoomTarget | null>(null)
  const [zoomTarget, setZoomTarget] = useState<ZoomTarget | null>(null)
  const [traceToken, setTraceToken] = useState(0)
  const [traceStep, setTraceStep] = useState<number | null>(null)
  const [tracing, setTracing] = useState(false)

  const [webglOk] = useState(detectWebGL)
  const [sceneFailed, setSceneFailed] = useState(false)
  const [quality, setQuality] = useState<SceneQuality>(() =>
    window.matchMedia('(pointer: coarse)').matches || (navigator.hardwareConcurrency ?? 8) <= 4 ? 'low' : 'high',
  )

  const stageRef = useRef<HTMLDivElement>(null)
  const near = useInView(stageRef, { once: true, margin: '0px 0px 600px 0px' })
  const use3D = webglOk && near && !sceneFailed

  const openTimer = useRef<number | undefined>(undefined)
  const traceTimers = useRef<number[]>([])

  const stopTrace = () => {
    traceTimers.current.forEach((t) => window.clearTimeout(t))
    traceTimers.current = []
    setTracing(false)
    setTraceStep(null)
  }

  const goTo = (i: number) => {
    if (i < 0 || i >= architectures.length) return
    stopTrace()
    setHighlightNodeId(null)
    setIndex(i)
  }

  const startTrace = () => {
    stopTrace()
    setTracing(true)
    if (use3D) {
      setTraceToken((t) => t + 1)
      return
    }
    graph.edges.forEach((_, i) => {
      traceTimers.current.push(window.setTimeout(() => setTraceStep(i), i * TRACE_STEP_MS))
    })
    traceTimers.current.push(
      window.setTimeout(() => {
        setTracing(false)
        setTraceStep(null)
      }, graph.edges.length * TRACE_STEP_MS + 500),
    )
  }

  const openNode = (graphId: string, nodeId: string) => {
    const i = architectures.findIndex((g) => g.id === graphId)
    if (i < 0) return
    stopTrace()
    setIndex(i)
    setZoomTarget({ graphId, nodeId })
    history.pushState({ stageOpen: true }, '')
    window.clearTimeout(openTimer.current)
    openTimer.current = window.setTimeout(() => setOpen({ graphId, nodeId }), reducedMotion ? 0 : 650)
  }

  const closeNode = () => {
    if ((history.state as { stageOpen?: boolean } | null)?.stageOpen) {
      history.back() // the popstate handler below performs the close
      return
    }
    window.clearTimeout(openTimer.current)
    setOpen(null)
    setZoomTarget(null)
  }

  useEffect(() => {
    const onPop = () => {
      if ((history.state as { stageOpen?: boolean } | null)?.stageOpen) return
      window.clearTimeout(openTimer.current)
      setOpen(null)
      setZoomTarget(null)
    }
    window.addEventListener('popstate', onPop)
    return () => {
      window.removeEventListener('popstate', onPop)
      window.clearTimeout(openTimer.current)
      traceTimers.current.forEach((t) => window.clearTimeout(t))
    }
  }, [])

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = architectures.length
    const moves: Record<string, number> = {
      ArrowRight: Math.min(index + 1, count - 1),
      ArrowDown: Math.min(index + 1, count - 1),
      ArrowLeft: Math.max(index - 1, 0),
      ArrowUp: Math.max(index - 1, 0),
      Home: 0,
      End: count - 1,
    }
    const next = moves[e.key]
    if (next === undefined) return
    e.preventDefault()
    goTo(next)
    document.getElementById(`stage-tab-${architectures[next].id}`)?.focus()
  }

  const nameOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id
  const step = traceStep !== null ? graph.edges[traceStep] : null
  const stepTarget = step ? graph.nodes.find((n) => n.id === step.to) : null
  const chips = projectChips[graph.id] ?? []
  const openGraph = open ? architectures.find((g) => g.id === open.graphId) : undefined

  const fallbackNode = (
    <FallbackCarousel
      graphs={architectures}
      index={index}
      onIndexChange={goTo}
      highlightNodeId={highlightNodeId}
      activeEdge={traceStep}
      onOpen={openNode}
      narrow={narrow}
    />
  )

  return (
    <section id="projects" className="relative bg-bg">
      <span id="systems" aria-hidden="true" className="block scroll-mt-14" />
      <span id="work" aria-hidden="true" className="block scroll-mt-14" />

      <div className="stage-zoom" data-zoom={zoomTarget !== null}>
        <div ref={stageRef} data-quality={quality} data-mode={use3D ? 'webgl' : 'fallback'} className="relative h-[calc(100svh-3.5rem)] min-h-[680px] w-full overflow-hidden bg-bg">
          <div className="aurora" aria-hidden="true" />

          <div className="absolute inset-0">
            {use3D ? (
              <SceneBoundary onError={() => setSceneFailed(true)} fallback={fallbackNode}>
                <Suspense fallback={fallbackNode}>
                  <ConstellationScene
                    className="absolute inset-0"
                    graphs={architectures}
                    index={index}
                    onIndexChange={goTo}
                    highlightNodeId={highlightNodeId}
                    onNodeOpen={openNode}
                    zoomTarget={zoomTarget}
                    traceToken={traceToken}
                    onTraceStep={setTraceStep}
                    onTraceEnd={() => {
                      setTracing(false)
                      setTraceStep(null)
                    }}
                    palette={scenePalette}
                    reducedMotion={reduced}
                    quality={quality}
                    onQualityChange={setQuality}
                    onUnavailable={() => setSceneFailed(true)}
                  />
                </Suspense>
              </SceneBoundary>
            ) : (
              fallbackNode
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 bg-gradient-to-b from-bg via-bg/70 to-transparent pb-14 pt-8">
            <div className="wrap flex items-start justify-between gap-6">
              <div>
                <p className="mono-label text-accent">01 — Projects</p>
                <h2 className="mt-2 text-3xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
                  {COUNT_WORDS[architectures.length] ?? architectures.length} systems,{' '}
                  <span className="serif-italic gradient-text text-glow">drawn from the code.</span>
                </h2>
                <p className="mt-2 max-w-xl text-sm text-ink-soft sm:mt-3 sm:text-base">
                  <span className="sm:hidden">Swipe to slide. Tap a component to fly inside.</span>
                  <span className="hidden sm:inline">Drag to slide between projects. Tap any component to fly inside it.</span>
                </p>
              </div>
              <p className="mono-label hidden text-ink-soft sm:block" aria-hidden="true">
                <span className="text-3xl font-bold text-ink">{String(index + 1).padStart(2, '0')}</span> / {String(architectures.length).padStart(2, '0')}
              </p>
            </div>
          </div>

          {(['prev', 'next'] as const).map((dir) => {
            const target = dir === 'prev' ? index - 1 : index + 1
            const disabled = target < 0 || target >= architectures.length
            return (
              <button
                key={dir}
                type="button"
                disabled={disabled}
                onClick={() => goTo(target)}
                aria-label={dir === 'prev' ? 'Previous project' : 'Next project'}
                className={`glass pointer-events-auto absolute top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 sm:h-12 sm:w-12 place-items-center text-xl text-ink transition hover:border-accent hover:text-accent disabled:opacity-20 ${dir === 'prev' ? 'left-3 sm:left-6' : 'right-3 sm:right-6'}`}
                style={{ borderRadius: 9999 }}
              >
                <span aria-hidden="true">{dir === 'prev' ? '←' : '→'}</span>
              </button>
            )
          })}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-bg via-bg/85 to-transparent pb-5 pt-24 lg:bg-none lg:pt-0">
            <div className="wrap">
              <div className="glass glow-border pointer-events-auto max-w-md p-4 sm:p-6 lg:max-w-[30rem]">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold tracking-tight sm:text-3xl">{graph.project}</h3>
                  {project?.status && <span className="mono-label rounded-full border border-amber/60 px-2.5 py-0.5 text-[0.62rem] text-amber">{project.status}</span>}
                </div>
                <p className="mt-1.5 line-clamp-2 text-sm text-ink-soft sm:mt-2 sm:line-clamp-none sm:text-base">{graph.summary}</p>
                <ul className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible" aria-label="Key facts">
                  {chips.map((c) => (
                    <li key={c.label} className="mono-label shrink-0 rounded-full border border-line-strong bg-white/5 px-3 py-1 text-[0.64rem] text-ink">
                      <span className="text-accent">{c.value}</span> {c.label}
                    </li>
                  ))}
                </ul>
                <div className="mono-label mt-3 flex items-center gap-2 sm:mt-4 sm:flex-wrap sm:gap-3">
                  <button
                    type="button"
                    onClick={tracing ? stopTrace : startTrace}
                    className="rounded-full bg-accent px-4 py-2 text-[#03130c] sm:px-5 sm:py-2.5 shadow-[0_0_28px_rgba(77,224,160,0.5)] transition hover:brightness-110"
                  >
                    {tracing ? 'Stop' : 'Play request path'}
                  </button>
                  {use3D && !reducedOS && (
                    <button
                      type="button"
                      aria-pressed={paused}
                      onClick={() => setPaused((v) => !v)}
                      className="rounded-full border border-line-strong px-3.5 py-2 text-ink transition hover:border-accent hover:text-accent sm:px-4 sm:py-2.5"
                    >
                      {paused ? 'Play animation' : 'Pause animation'}
                    </button>
                  )}
                </div>
                <p aria-live="polite" className="mt-2 line-clamp-2 min-h-[1.25rem] text-sm text-amber sm:mt-3 sm:min-h-[1.5rem]">
                  {step && (
                    <>
                      <span className="mono-label mr-2">
                        Step {(traceStep ?? 0) + 1} of {graph.edges.length}
                      </span>
                      {nameOf(step.from)} to {nameOf(step.to)}
                      {step.label ? `: ${step.label}` : ''}
                      {stepTarget ? ` — ${stepTarget.detail}` : ''}
                    </>
                  )}
                </p>
              </div>

              <div role="tablist" aria-label="Projects" onKeyDown={onTabKeyDown} className="pointer-events-auto mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:mt-4 sm:flex-wrap sm:overflow-visible">
                {architectures.map((g, i) => {
                  const selected = i === index
                  const p = projects.find((x) => x.title === g.project)
                  return (
                    <button
                      key={g.id}
                      id={`stage-tab-${g.id}`}
                      type="button"
                      role="tab"
                      aria-selected={selected}
                      aria-controls="stage-details"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => goTo(i)}
                      className={`mono-label shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-[0.66rem] transition ${selected ? 'border-accent bg-accent/15 text-accent shadow-[0_0_24px_rgba(77,224,160,0.35)]' : 'border-line text-ink-soft hover:border-line-strong hover:text-ink'}`}
                    >
                      <span className="opacity-70">{String(i + 1).padStart(2, '0')}</span> {g.project}
                      {p?.status && <span className="ml-2 text-amber">·</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div id="stage-details" role="tabpanel" aria-labelledby={`stage-tab-${graph.id}`} className="wrap grid gap-8 py-16 lg:grid-cols-3">
        <div>
          <h3 className="mono-label text-accent">How it works</h3>
          <ul className="mt-4 space-y-4">
            {project?.details.map((d) => (
              <li key={d} className="border-l border-accent/40 pl-4 text-ink-soft">
                {d}
              </li>
            ))}
          </ul>
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project?.tags.map((t) => (
              <li key={t} className="mono-label rounded-full border border-line px-3 py-1 text-[0.62rem] text-ink-soft">
                {t}
              </li>
            ))}
          </ul>
          <div className="mono-label mt-5 flex flex-wrap gap-x-6 gap-y-2">
            {project?.links.map((l) => (
              <a key={l.href} href={l.href} target="_blank" rel="noreferrer" className="text-ink underline decoration-accent/60 underline-offset-8 transition hover:text-accent">
                {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mono-label text-accent">Components (tap to open)</h3>
          <ul className="mt-4 divide-y divide-line border-y border-line">
            {graph.nodes.map((n) => (
              <li key={n.id}>
                <button
                  type="button"
                  onClick={() => openNode(graph.id, n.id)}
                  onMouseEnter={() => setHighlightNodeId(n.id)}
                  onMouseLeave={() => setHighlightNodeId(null)}
                  onFocus={() => setHighlightNodeId(n.id)}
                  onBlur={() => setHighlightNodeId(null)}
                  className="group flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors hover:text-accent"
                >
                  <span className="font-medium">{n.label}</span>
                  <span className="mono-label shrink-0 text-ink-soft transition-colors group-hover:text-accent">
                    {KIND_LABEL[n.kind]} ↗
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mono-label text-accent">Request path</h3>
          <div className="glass mt-4 overflow-hidden">
            <PathList graph={graph} activeEdge={traceStep} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {open && openGraph && <ExplainerModal key={`${open.graphId}:${open.nodeId}`} graph={openGraph} nodeId={open.nodeId} onClose={closeNode} />}
      </AnimatePresence>
    </section>
  )
}
