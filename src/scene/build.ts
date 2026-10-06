import {
  BufferGeometry, Color, Group, Line, LineBasicMaterial, LineDashedMaterial,
  LineSegments, Mesh, MeshBasicMaterial, MeshLambertMaterial, QuadraticBezierCurve3, Vector3,
} from 'three'
import type { ArchGraph } from '@/data/architectures'
import type { ScenePalette } from './ArchitectureScene'
import type { GeometryLibrary } from './geometry'
import { createLabel } from './labels'

export function buildGraph(graph: ArchGraph, library: GeometryLibrary, palette: ScenePalette, dpr: number) {
  const root = new Group()
  const disposables: { dispose: () => void }[] = []
  try {
    const nodes = graph.nodes.map((node, index) => {
      const anchor = new Group()
      const base = new Vector3(...node.position)
      anchor.position.copy(base)
      const fill = new MeshLambertMaterial({ color: palette.muted, flatShading: true, transparent: true })
      const stroke = new LineBasicMaterial({ color: palette.ink, transparent: true })
      disposables.push(fill, stroke)
      const body = new Mesh(library.bodies[node.kind], fill)
      body.rotation.set(0.08, 0.18, 0)
      body.userData.nodeId = node.id
      body.add(new LineSegments(library.outlines.get(node.kind), stroke))
      const label = createLabel(node.label, palette.ink, dpr)
      disposables.push(label)
      anchor.add(body, label.sprite)
      root.add(anchor)
      return { id: node.id, anchor, base, body, fill, stroke, label, phase: index * 1.37, dim: 1 }
    })
    const byId = new Map(nodes.map(node => [node.id, node]))
    const primaryPacket = new MeshBasicMaterial({ color: palette.packet, transparent: true, depthWrite: false })
    const fallbackPacket = new MeshBasicMaterial({ color: palette.fallback, transparent: true, depthWrite: false })
    disposables.push(primaryPacket, fallbackPacket)
    const edges = graph.edges.flatMap((edge, index) => {
      const from = byId.get(edge.from)
      const to = byId.get(edge.to)
      if (!from || !to) return []
      const direction = to.base.clone().sub(from.base).normalize()
      const start = from.base.clone().addScaledVector(direction, 0.45)
      const end = to.base.clone().addScaledVector(direction, -0.45)
      const middle = start.clone().lerp(end, 0.5)
      middle.z += edge.fallback ? -0.48 : 0.32
      middle.y += (index % 2 === 0 ? 1 : -1) * 0.16
      const curve = new QuadraticBezierCurve3(start, middle, end)
      const geometry = new BufferGeometry().setFromPoints(curve.getPoints(40))
      const material = edge.fallback
        ? new LineDashedMaterial({ color: palette.fallback, dashSize: 0.1, gapSize: 0.09, transparent: true, depthWrite: false })
        : new LineBasicMaterial({ color: palette.muted, transparent: true, depthWrite: false })
      disposables.push(geometry, material)
      const line = new Line(geometry, material)
      line.computeLineDistances()
      const packet = new Mesh(library.packet, edge.fallback ? fallbackPacket : primaryPacket)
      root.add(line, packet)
      return [{ edge, curve, material, packet, phase: (index * 0.237) % 1, dim: 1 }]
    })
    let opacity = 1
    return {
      root, nodes,
      get opacity() { return opacity },
      style(nextPalette: ScenePalette, active: string | null, hover: string | null) {
        const hasActive = active !== null && byId.has(active)
        for (const node of nodes) {
          const selected = node.id === active
          const hovered = node.id === hover
          node.dim = hasActive && !selected ? (hovered ? 0.65 : 0.3) : 1
          node.fill.color.copy(new Color(nextPalette.background).lerp(new Color(selected ? nextPalette.accent : nextPalette.ink), selected ? 0.8 : 0.3))
          node.stroke.color.set(selected ? nextPalette.accent : hovered ? nextPalette.ink : nextPalette.muted)
          node.label.setColor(selected ? nextPalette.accent : nextPalette.ink)
        }
        for (const item of edges) {
          item.dim = hasActive && item.edge.from !== active && item.edge.to !== active ? 0.24 : 1
          item.material.color.set(item.edge.fallback ? nextPalette.fallback : nextPalette.muted)
        }
        primaryPacket.color.set(nextPalette.packet)
        fallbackPacket.color.set(nextPalette.fallback)
      },
      frame(time: number, amount: number, moving: boolean) {
        opacity = amount
        root.scale.setScalar(0.92 + amount * 0.08)
        for (const node of nodes) {
          node.anchor.position.y = node.base.y + (moving ? Math.sin(time * 0.75 + node.phase) * 0.06 : 0)
          node.body.rotation.y = 0.18 + (moving ? Math.sin(time * 0.5 + node.phase) * 0.5 : 0)
          node.fill.opacity = amount * node.dim
          node.stroke.opacity = amount * node.dim
          node.label.material.opacity = amount * node.dim
        }
        primaryPacket.opacity = amount * 0.95
        fallbackPacket.opacity = amount * 0.42
        for (const item of edges) {
          item.material.opacity = amount * item.dim * (item.edge.fallback ? 0.48 : 0.65)
          item.packet.visible = amount > 0.01 && item.dim > 0.5
          item.curve.getPointAt((item.phase + (moving ? time * (item.edge.fallback ? 0.065 : 0.17) : 0)) % 1, item.packet.position)
        }
      },
      dispose() {
        root.removeFromParent()
        disposables.forEach(resource => resource.dispose())
        root.clear()
      },
    }
  } catch (error) {
    disposables.forEach(resource => resource.dispose())
    root.clear()
    throw error
  }
}

export type GraphVisual = ReturnType<typeof buildGraph>
