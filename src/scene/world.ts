import {
  AdditiveBlending, AmbientLight, BufferAttribute, BufferGeometry, Color, DirectionalLight,
  DynamicDrawUsage, FogExp2, Group, LineBasicMaterial, LineSegments, Mesh, MeshStandardMaterial,
  Points, PointsMaterial, QuadraticBezierCurve3, Scene, Sprite, SpriteMaterial, Vector3,
} from 'three'
import type { PerspectiveCamera } from 'three'
import { Line2 } from 'three/addons/lines/Line2.js'
import { LineGeometry } from 'three/addons/lines/LineGeometry.js'
import { LineMaterial } from 'three/addons/lines/LineMaterial.js'
import type { ArchGraph, NodeKind } from '@/data/architectures'
import type { ScenePalette, ZoomTarget } from './types'
import { createGeometryLibrary } from './geometry'
import { createLabel } from './labels'
import { createGlowTexture, createParticles } from './effects'
import { GRAPH_SPACING } from './camera'

export interface NodeHit { graphIndex: number; nodeId: string }
export interface TraceState { graphIndex: number; edgeIndex: number; progress: number }

function kindColor(kind: NodeKind, palette: ScenePalette) {
  const colors: Record<NodeKind, Color> = {
    client: new Color(palette.glow).lerp(new Color(palette.ink), 0.3),
    api: new Color(palette.accent),
    service: new Color(palette.glow),
    worker: new Color(palette.packet),
    store: new Color(palette.accent).lerp(new Color(palette.glow), 0.45),
    external: new Color(palette.glow).lerp(new Color(palette.ink), 0.3),
    security: new Color(palette.fallback).lerp(new Color(palette.accent), 0.25),
  }
  return colors[kind]
}

export function createWorld(graphs: ArchGraph[], palette: ScenePalette) {
  const scene = new Scene()
  const resources: { dispose(): void }[] = []
  const library = createGeometryLibrary()
  resources.push(library)
  function dispose() { resources.forEach(item => item.dispose()); scene.clear() }
  try {
    const glow = createGlowTexture()
    resources.push(glow)
    const particles = createParticles(palette, glow)
    resources.push(particles)
    const ambient = new AmbientLight(palette.glow, 1.4)
    const light = new DirectionalLight(palette.ink, 3)
    light.position.set(-4, 8, 12)
    scene.add(ambient, light, particles.points)
    const visuals = graphs.map((graph, graphIndex) => {
      const root = new Group()
      root.position.x = graphIndex * GRAPH_SPACING
      scene.add(root)
      const nodes = graph.nodes.map((data, index) => {
        const anchor = new Group()
        const base = new Vector3(data.position[0] * 1.3, data.position[1] * 1.35, data.position[2] * 1.5)
        anchor.position.copy(base)
        const color = kindColor(data.kind, palette)
        const fill = new MeshStandardMaterial({ color: new Color(palette.background).lerp(color, 0.3),
          emissive: color, emissiveIntensity: 1.1, roughness: 0.42, metalness: 0.35,
          flatShading: true, transparent: true })
        const stroke = new LineBasicMaterial({ color, transparent: true })
        const haloMaterial = new SpriteMaterial({ color, map: glow, blending: AdditiveBlending,
          depthWrite: false, transparent: true, opacity: 0.8 })
        resources.push(fill, stroke, haloMaterial)
        const halo = new Sprite(haloMaterial)
        halo.scale.setScalar(2.5)
        const body = new Mesh(library.bodies[data.kind], fill)
        body.scale.setScalar(1.3)
        body.rotation.set(0.16, 0.35, 0.08)
        body.userData.hit = { graphIndex, nodeId: data.id } satisfies NodeHit
        body.add(new LineSegments(library.outlines.get(data.kind), stroke))
        const label = createLabel(data.label, palette.ink, 2)
        resources.push(label)
        const labelScale = label.sprite.scale.clone()
        label.sprite.position.y -= 0.2
        anchor.add(halo, body, label.sprite)
        root.add(anchor)
        return { data, base, anchor, body, fill, stroke, label, labelScale, halo, haloMaterial,
          phase: index * 1.71, dim: 1, pulsing: false }
      })
      const byId = new Map(nodes.map(node => [node.data.id, node]))
      const edges = graph.edges.map((data, index) => {
        const from = byId.get(data.from)
        const to = byId.get(data.to)
        if (!from || !to) throw new Error(`Invalid graph edge in ${graph.id}`)
        const direction = to.base.clone().sub(from.base).normalize()
        const start = from.base.clone().addScaledVector(direction, 0.55)
        const end = to.base.clone().addScaledVector(direction, -0.55)
        const middle = start.clone().lerp(end, 0.5)
        middle.z += data.fallback ? -0.8 : 0.7
        middle.y += (index % 2 ? -1 : 1) * 0.28
        const curve = new QuadraticBezierCurve3(start, middle, end)
        const geometry = new LineGeometry()
        resources.push(geometry)
        geometry.setPositions(curve.getPoints(32).flatMap(point => point.toArray()))
        const material = new LineMaterial({ color: data.fallback ? palette.fallback : palette.glow,
          linewidth: data.fallback ? 1.5 : 1.8, transparent: true, depthWrite: false,
          dashed: !!data.fallback, dashSize: 0.14, gapSize: 0.12, opacity: 0.6 })
        resources.push(material)
        const line = new Line2(geometry, material)
        line.computeLineDistances()
        root.add(line)
        return { data, curve, material, phase: (index * 0.237) % 1, dim: 1,
          packetColor: new Color(data.fallback ? palette.fallback : palette.packet) }
      })
      return { root, nodes, byId, edges, graph }
    })
    // All packet heads and fading trail samples share a single draw call.
    const trailLength = 9
    const packetCount = visuals.reduce((sum, graph) => sum + graph.edges.length, 0) * trailLength
    const positions = new Float32Array(packetCount * 3)
    const colors = new Float32Array(packetCount * 3)
    const packetGeometry = new BufferGeometry()
    resources.push(packetGeometry)
    const positionAttribute = new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage)
    const colorAttribute = new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage)
    packetGeometry.setAttribute('position', positionAttribute)
    packetGeometry.setAttribute('color', colorAttribute)
    const packetMaterial = new PointsMaterial({ map: glow, size: 0.25, vertexColors: true,
      blending: AdditiveBlending, transparent: true, depthWrite: false, toneMapped: false })
    resources.push(packetMaterial)
    const packets = new Points(packetGeometry, packetMaterial)
    packets.frustumCulled = false
    scene.add(packets)
    const sample = new Vector3()
    const worldPosition = new Vector3()
    let trace: TraceState | null = null
    let low = false

    function setPalette(next: ScenePalette) {
      scene.background = new Color(next.background)
      scene.fog = new FogExp2(next.background, 0.014)
      ambient.color.set(next.glow)
      light.color.set(next.ink)
      particles.palette(next)
      for (const graph of visuals) {
        for (const node of graph.nodes) {
          const color = kindColor(node.data.kind, next)
          node.fill.color.set(next.background).lerp(color, 0.3)
          node.fill.emissive.copy(color)
          node.stroke.color.copy(color).multiplyScalar(1.6)
          node.haloMaterial.color.copy(color)
          node.label.setColor(next.ink)
        }
        for (const edge of graph.edges) {
          edge.material.color.set(edge.data.fallback ? next.fallback : next.glow)
          edge.packetColor.set(edge.data.fallback ? next.fallback : next.packet)
        }
      }
    }
    setPalette(palette)
    return {
      scene,
      pickables: visuals.flatMap(graph => graph.nodes.map(node => node.body)),
      palette: setPalette,
      nodePosition(target: ZoomTarget) {
        const graph = visuals.find(item => item.graph.id === target.graphId)
        const node = graph?.byId.get(target.nodeId)
        return graph && node ? node.base.clone().add(graph.root.position) : null
      },
      resize(width: number, height: number) {
        visuals.forEach(graph => graph.edges.forEach(edge => edge.material.resolution.set(width, height)))
      },
      quality(isLow: boolean, halos: boolean) {
        low = isLow
        particles.quality(isLow)
        visuals.forEach(graph => graph.nodes.forEach(node => { node.halo.visible = halos }))
      },
      style(index: number, highlight: string | null, hover: NodeHit | null, zoom: ZoomTarget | null, nextTrace: TraceState | null) {
        trace = nextTrace
        visuals.forEach((graph, graphIndex) => {
          const active = hover?.graphIndex === graphIndex ? hover.nodeId : graphIndex === index ? highlight : null
          const traced = trace?.graphIndex === graphIndex ? graph.edges[trace.edgeIndex] : null
          const base = graphIndex === index ? 1 : 0.35
          for (const node of graph.nodes) {
            const selected = node.data.id === active
            const endpoint = traced && (traced.data.from === node.data.id || traced.data.to === node.data.id)
            const zoomed = zoom?.graphId === graph.graph.id && zoom.nodeId === node.data.id
            node.pulsing = !!zoomed
            node.dim = zoom ? zoomed ? 1.5 : 0.15 : base * (selected || endpoint ? 1.5 : active || traced ? 0.22 : 1)
            node.fill.opacity = Math.min(1, node.dim)
            node.fill.emissiveIntensity = node.dim * 1.2 * (node.data.kind === 'client' ? 0.45 : 1)
            node.stroke.opacity = Math.min(1, node.dim)
            node.label.material.opacity = Math.min(1, node.dim)
            node.haloMaterial.opacity = node.dim * 0.8
          }
          graph.edges.forEach(edge => {
            const connected = active && (edge.data.from === active || edge.data.to === active)
            edge.dim = zoom ? 0.15 : base * (edge === traced || connected ? 1.8 : active || traced ? 0.15 : 1)
            edge.material.opacity = Math.min(1, edge.dim * (edge.data.fallback ? 0.4 : 0.65))
            edge.material.linewidth = edge === traced || connected ? 3 : 1.8
          })
        })
      },
      frame(time: number, moving: boolean, camera: PerspectiveCamera, height: number, zoomed: boolean) {
        particles.frame(moving ? time : 0, camera.position.x, zoomed)
        let cursor = 0
        for (let g = 0; g < visuals.length; g++) {
          const graph = visuals[g]
          // Cull whole distant constellations while keeping the adjacent graphs built and ready.
          graph.root.visible = Math.abs(graph.root.position.x - camera.position.x) < 37
          if (!graph.root.visible) {
            // Keep the shared trail buffer cursor aligned without animating anything off-screen.
            cursor += graph.edges.length * trailLength
            continue
          }
          for (const node of graph.nodes) {
            node.anchor.position.y = node.base.y + (moving ? Math.sin(time * 0.8 + node.phase) * 0.09 : 0)
            node.body.rotation.y = 0.35 + (moving ? Math.sin(time * 0.4 + node.phase) * 0.35 : 0)
            node.body.rotation.z = 0.08 + (moving ? Math.sin(time * 0.3 + node.phase) * 0.12 : 0)
            node.fill.emissiveIntensity = node.dim * (node.pulsing && moving ? 1.4 + Math.sin(time * 2.5) * 0.18 : 1.2) * (node.data.kind === 'client' ? 0.45 : 1)
            worldPosition.copy(node.anchor.position).add(graph.root.position)
            const distance = camera.position.distanceTo(worldPosition)
            // Label font is 28px on the texture; keep it at least 14 CSS pixels on screen.
            const unitsPerPixel = 2 * distance * Math.tan(camera.fov * Math.PI / 360) / Math.max(1, height)
            node.label.sprite.scale.copy(node.labelScale).multiplyScalar(Math.max(1, 14 * unitsPerPixel / (28 * 0.0098)))
          }
          for (let e = 0; e < graph.edges.length; e++) {
            const edge = graph.edges[e]
            const tracing = trace?.graphIndex === g && trace.edgeIndex === e
            const head = tracing ? trace!.progress : (edge.phase + (moving ? time * (edge.data.fallback ? 0.075 : 0.2) : 0)) % 1
            for (let tail = 0; tail < trailLength; tail++) {
              const t = head - tail * 0.012
              edge.curve.getPoint(Math.max(0, t), sample)
              positions[cursor * 3] = sample.x + graph.root.position.x
              positions[cursor * 3 + 1] = sample.y
              positions[cursor * 3 + 2] = sample.z
              const brightness = graph.root.visible && t >= 0 && (moving || tail === 0) && (!low || tail < 5)
                ? Math.pow(1 - tail / trailLength, 2) * edge.dim * (tracing ? 4 : edge.data.fallback ? 0.5 : 1.8) : 0
              colors[cursor * 3] = edge.packetColor.r * brightness
              colors[cursor * 3 + 1] = edge.packetColor.g * brightness
              colors[cursor * 3 + 2] = edge.packetColor.b * brightness
              cursor++
            }
          }
        }
        positionAttribute.needsUpdate = colorAttribute.needsUpdate = true
      },
      dispose,
    }
  } catch (error) { dispose(); throw error }
}

export type World = ReturnType<typeof createWorld>
