import { useEffect, useId, useRef, type KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import { motion } from 'motion/react'
import type { ArchGraph, NodeKind } from '@/data/architectures'
import { explainers, ILLUSTRATIVE, type ExplainerSpec } from '@/data/explainers'
import { ExplainerVisual } from '@/components/explainers/ExplainerVisual'

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
  graph: ArchGraph
  nodeId: string
  onClose: () => void
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'

export function ExplainerModal({ graph, nodeId, onClose }: Props) {
  const node = graph.nodes.find((n) => n.id === nodeId)
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null
    const root = document.getElementById('root')
    root?.setAttribute('inert', '')
    const prevOverflow = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    closeRef.current?.focus()
    return () => {
      root?.removeAttribute('inert')
      document.documentElement.style.overflow = prevOverflow
      if (opener && document.contains(opener)) opener.focus({ preventScroll: true })
    }
  }, [])

  if (!node) return null

  const nameOf = (id: string) => graph.nodes.find((n) => n.id === id)?.label ?? id
  const from = graph.edges.filter((e) => e.to === node.id).map((e) => nameOf(e.from))
  const to = graph.edges.filter((e) => e.from === node.id).map((e) => nameOf(e.to))
  const spec: ExplainerSpec = explainers[`${graph.id}:${node.id}`] ?? { kind: 'generic', facts: [], sources: [] }
  const illustrative = ILLUSTRATIVE[spec.kind]

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') {
      e.stopPropagation()
      onClose()
      return
    }
    if (e.key !== 'Tab') return
    const items = [...(panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? [])]
    if (items.length === 0) return
    const first = items[0]
    const last = items[items.length - 1]
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault()
      last.focus()
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  return createPortal(
    <motion.div
      className="fixed inset-0 z-[70] grid place-items-center p-3 sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45 }}
      onKeyDown={onKeyDown}
    >
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,7,10,0.55),rgba(5,7,10,0.92))] backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <motion.div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="glass glow-border relative max-h-[94svh] w-full max-w-6xl overflow-y-auto bg-bg/70 p-5 shadow-[0_0_120px_rgba(77,224,160,0.18)] sm:p-8"
        initial={{ opacity: 0, scale: 0.9, filter: 'blur(14px)' }}
        animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
        exit={{ opacity: 0, scale: 0.96, filter: 'blur(8px)' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="mono-label text-accent">
              {KIND_LABEL[node.kind]} <span className="text-ink-soft">· {graph.project}</span>
            </p>
            <h2 id={titleId} className="mt-2 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              <span className="gradient-text">{node.label}</span>
            </h2>
          </div>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mono-label shrink-0 rounded-full border border-line-strong px-4 py-2 text-ink transition-colors hover:border-accent hover:text-accent"
          >
            Close <span className="text-ink-soft">Esc</span>
          </button>
        </div>

        <p className="mt-4 max-w-3xl text-lg text-ink-soft">{node.detail}</p>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="relative min-h-[300px] overflow-hidden rounded-2xl border border-line bg-black/30 p-4 sm:p-6">
              <div className="aurora" aria-hidden="true" />
              <div className="relative z-10 h-full">
                <ExplainerVisual spec={spec} label={node.label} from={from} to={to} />
              </div>
            </div>
            {illustrative && <p className="mono-label mt-3 text-[0.66rem] leading-relaxed text-amber">{illustrative}</p>}
          </div>

          <div className="space-y-5">
            {spec.facts.length > 0 && (
              <div>
                <h3 className="mono-label text-ink-soft">Verified from the source</h3>
                <dl className="mt-3 divide-y divide-line border-y border-line">
                  {spec.facts.map((f) => (
                    <div key={f.label} className="grid gap-1 py-2.5 sm:grid-cols-[8.5rem_1fr] sm:gap-4">
                      <dt className="mono-label pt-0.5 text-[0.66rem] text-accent">{f.label}</dt>
                      <dd className="text-sm text-ink">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {spec.caveat && (
              <p className="rounded-lg border border-amber/40 bg-amber/10 p-3 text-sm text-amber">
                <span className="mono-label mr-2">Note</span>
                {spec.caveat}
              </p>
            )}
            <div>
              <h3 className="mono-label text-ink-soft">Connects</h3>
              <p className="mt-2 text-sm text-ink">
                <span className="text-ink-soft">Receives from </span>
                {from.length ? from.join(', ') : 'nothing (entry point)'}
              </p>
              <p className="mt-1 text-sm text-ink">
                <span className="text-ink-soft">Sends to </span>
                {to.length ? to.join(', ') : 'nothing (end of the path)'}
              </p>
            </div>
            {spec.sources.length > 0 && (
              <p className="mono-label text-[0.6rem] leading-relaxed text-ink-soft">Sources: {spec.sources.join('; ')}</p>
            )}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
