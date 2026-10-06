import {
  BoxGeometry, BufferGeometry, CylinderGeometry, EdgesGeometry,
  IcosahedronGeometry, OctahedronGeometry,
} from 'three'
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'
import type { NodeKind } from '@/data/architectures'

function combine(parts: BufferGeometry[]): BufferGeometry {
  try {
    const result = mergeGeometries(parts)
    if (!result) throw new Error('Unable to build node geometry')
    return result
  } finally {
    parts.forEach(part => part.dispose())
  }
}

/** One body mesh per node, including the compound worker and store shapes. */
export function createGeometryLibrary() {
  const bodies: Record<NodeKind, BufferGeometry> = {
    client: new BoxGeometry(0.85, 0.57, 0.1),
    api: new BoxGeometry(0.65, 0.62, 0.55),
    service: new OctahedronGeometry(0.48),
    worker: combine([
      new BoxGeometry(0.3, 0.3, 0.3).translate(-0.32, -0.1, 0),
      new BoxGeometry(0.3, 0.3, 0.3).translate(0, 0.16, -0.08),
      new BoxGeometry(0.3, 0.3, 0.3).translate(0.32, -0.1, 0.08),
    ]),
    store: combine([-0.25, 0, 0.25].map(y =>
      new CylinderGeometry(0.36, 0.36, 0.19, 12).translate(0, y, 0))),
    external: new IcosahedronGeometry(0.43, 0),
    security: new CylinderGeometry(0.42, 0.42, 0.42, 6),
  }
  const outlines = new Map<NodeKind, EdgesGeometry>()
  for (const kind of Object.keys(bodies) as NodeKind[]) {
    outlines.set(kind, new EdgesGeometry(bodies[kind], 24))
  }
  const packet = new OctahedronGeometry(0.055)
  return {
    bodies, outlines, packet,
    dispose() {
      Object.values(bodies).forEach(geometry => geometry.dispose())
      outlines.forEach(geometry => geometry.dispose())
      packet.dispose()
    },
  }
}

export type GeometryLibrary = ReturnType<typeof createGeometryLibrary>
