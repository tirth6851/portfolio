import { lazy, Suspense, useRef, useState, type KeyboardEvent } from 'react'
import { useInView, useReducedMotion } from 'motion/react'
import { architectures, type NodeKind } from '@/data/architectures'
import { projects } from '@/data/content'
import { ArchitectureDiagram } from '@/components/ArchitectureDiagram'
import { useMediaQuery } from '@/hooks/useMediaQuery'
import { detectWebGL } from '@/lib/webgl'
import type { ScenePalette } from '@/scene/ArchitectureScene'

// three.js stays in this lazy chunk and only loads once the stage is near the viewport.
const ArchitectureScene = lazy(() => import('@/scene/ArchitectureScene'))

const PALETTE: ScenePalette = {
  background: '#141816',
  ink: '#ece9df',
  muted: '#7d8079',
  accent: '#4de0a0',
  packet: '#f5c04a',
  fallback: '#ff8a5c',
}

const COUNT_WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight']

const KIND_LABEL: Record<NodeKind, string> = {
  client: 'Client',
  api: 'API',
  service: 'Service',
  worker: 'Workers',
  store: 'Data store',
  external: 'External service',
  security: 'Security',
}

interface Props {
  graphId: string
  onGraphChange: (id: string) => void
}

export function Systems({ graphId, onGraphChange }: Props) {
  const graph = architectures.find((g) => g.id === graphId) ?? architectures[0]
  const [sel, setSel] = useState<{ graphId: string; nodeId: string | null }>({
    graphId,
    nodeId: null,
  })
  const activeNodeId = sel.graphId === graph.id ? sel.nodeId : null
  const activeNode = graph.nodes.find((n) => n.id === activeNodeId) ?? null
  const select = (nodeId: string | null) => setSel({ graphId: graph.id, nodeId })

  const [webglOk] = useState(detectWebGL)
  const [sceneFailed, setSceneFailed] = useState(false)
  const wide = useMediaQuery('(min-width: 640px)')
  const reduced = useReducedMotion() ?? false
  const stageRef = useRef<HTMLDivElement>(null)
  const near = useInView(stageRef, { once: true, margin: '0px 0px 400px 0px' })
  const use3D = webglOk && wide && near && !sceneFailed

  const nameOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id
  const receives = activeNode
    ? graph.edges.filter((e) => e.to === activeNode.id).map((e) => nameOf(e.from))
    : []
  const sends = activeNode
    ? graph.edges.filter((e) => e.from === activeNode.id).map((e) => nameOf(e.to))
    : []
  const hasFallback = graph.edges.some((e) => e.fallback)

  const onTabKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const count = architectures.length
    const i = architectures.findIndex((g) => g.id === graph.id)
    const moves: Record<string, number> = {
      ArrowRight: (i + 1) % count,
      ArrowDown: (i + 1) % count,
      ArrowLeft: (i - 1 + count) % count,
      ArrowUp: (i - 1 + count) % count,
      Home: 0,
      End: count - 1,
    }
    const next = moves[e.key]
    if (next === undefined) return
    e.preventDefault()
    onGraphChange(architectures[next].id)
    document.getElementById(`tab-${architectures[next].id}`)?.focus()
  }

  return (
    <section id="systems" className="on-stage bg-stage py-24 text-stage-ink md:py-32">
      <div className="wrap">
        <header className="mb-12 max-w-3xl">
          <p className="mono-label text-stage-soft">01 — Architecture</p>
          <h2 className="mt-4 font-display text-5xl leading-[1.02] md:text-7xl">
            {COUNT_WORDS[architectures.length] ?? architectures.length} systems, drawn from the&nbsp;code.
          </h2>
          <p className="mt-6 max-w-xl text-stage-soft">
            Each diagram comes from the repository: real modules, real request paths, and the
            fallbacks that exist in the source. Pick a project, then a component.
          </p>
        </header>

        <div
          role="tablist"
          aria-label="Projects"
          onKeyDown={onTabKeyDown}
          className="mb-8 flex flex-wrap pl-px pt-px"
        >
          {architectures.map((g, i) => {
            const selected = g.id === graph.id
            return (
              <button
                key={g.id}
                id={`tab-${g.id}`}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="systems-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => onGraphChange(g.id)}
                className={`-ml-px -mt-px flex min-w-[10.5rem] flex-1 basis-[10.5rem] flex-col items-start gap-1 border border-stage-rule px-4 py-4 text-left transition-colors ${
                  selected
                    ? 'bg-stage-2 text-stage-accent'
                    : 'bg-stage text-stage-soft hover:text-stage-ink'
                }`}
              >
                <span className="mono-label opacity-70">{String(i + 1).padStart(2, '0')}</span>
                <span className="text-sm font-medium leading-snug">{g.project}</span>
                {projects.find((p) => p.title === g.project)?.status && (
                  <span className="mono-label text-[0.62rem] opacity-70">In progress</span>
                )}
              </button>
            )
          })}
        </div>

        <div id="systems-panel" role="tabpanel" aria-labelledby={`tab-${graph.id}`} className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div
              ref={stageRef}
              className="relative w-full overflow-hidden border border-stage-rule bg-stage-2 sm:aspect-[4/3]"
            >
              {!wide ? (
                <ol className="divide-y divide-stage-rule">
                  {graph.edges.map((e) => (
                    <li key={`${e.from}-${e.to}`} className="px-4 py-3 text-sm">
                      <span className="font-medium">{nameOf(e.from)}</span>
                      <span aria-hidden="true" className="mx-2 text-stage-soft">→</span>
                      <span className="sr-only"> to </span>
                      <span className="font-medium">{nameOf(e.to)}</span>
                      {(e.label || e.fallback) && (
                        <span className="mono-label mt-1 block text-stage-soft">
                          {e.label}
                          {e.label && e.fallback && ' · '}
                          {e.fallback && <span className="text-[#ff8a5c]">fallback</span>}
                        </span>
                      )}
                    </li>
                  ))}
                </ol>
              ) : use3D ? (
                <Suspense
                  fallback={
                    <ArchitectureDiagram graph={graph} activeNodeId={activeNodeId} onSelect={select} />
                  }
                >
                  <ArchitectureScene
                    className="absolute inset-0"
                    graph={graph}
                    activeNodeId={activeNodeId}
                    onActiveNodeChange={select}
                    palette={PALETTE}
                    reducedMotion={reduced}
                    onUnavailable={() => setSceneFailed(true)}
                  />
                </Suspense>
              ) : (
                <ArchitectureDiagram graph={graph} activeNodeId={activeNodeId} onSelect={select} />
              )}
            </div>
            <div className="mono-label mt-3 flex flex-wrap items-center gap-x-6 gap-y-2 text-stage-soft">
              <span>{!wide ? 'Request paths' : use3D ? 'Interactive 3D view' : 'Static diagram'}</span>
              <span className="flex items-center gap-2">
                <span aria-hidden="true" className="inline-block h-px w-6 bg-stage-soft" />
                Primary path
              </span>
              {hasFallback && (
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className="inline-block w-6 border-t border-dashed border-[#ff8a5c]"
                  />
                  Fallback path
                </span>
              )}
            </div>
          </div>

          <div className="lg:col-span-5">
            <p className="text-lg leading-relaxed text-stage-ink">{graph.summary}</p>

            <h3 className="mono-label mt-10 text-stage-soft">Components</h3>
            <ul className="mt-3 divide-y divide-stage-rule border-y border-stage-rule">
              {graph.nodes.map((n) => (
                <li key={n.id}>
                  <button
                    type="button"
                    aria-pressed={n.id === activeNodeId}
                    onClick={() => select(n.id === activeNodeId ? null : n.id)}
                    className={`flex w-full items-baseline justify-between gap-4 py-3 text-left transition-colors ${
                      n.id === activeNodeId ? 'text-stage-accent' : 'hover:text-stage-accent'
                    }`}
                  >
                    <span className="font-medium">{n.label}</span>
                    <span className="mono-label shrink-0 text-stage-soft">{KIND_LABEL[n.kind]}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div aria-live="polite" className="mt-6 min-h-[8.5rem] border border-stage-rule p-5">
              {activeNode ? (
                <>
                  <p className="mono-label text-stage-accent">{KIND_LABEL[activeNode.kind]}</p>
                  <p className="mt-1 font-display text-3xl">{activeNode.label}</p>
                  <p className="mt-3 text-stage-ink/90">{activeNode.detail}</p>
                  {(receives.length > 0 || sends.length > 0) && (
                    <p className="mono-label mt-4 text-stage-soft">
                      {receives.length > 0 && <>From {receives.join(', ')}</>}
                      {receives.length > 0 && sends.length > 0 && ' · '}
                      {sends.length > 0 && <>To {sends.join(', ')}</>}
                    </p>
                  )}
                </>
              ) : (
                <p className="text-stage-soft">
                  Select a component to read how it works and what it connects to.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
