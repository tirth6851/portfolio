import { PerspectiveCamera, Vector3 } from 'three'

export const GRAPH_SPACING = 20

/** Analytic critically damped spring; stable even when a frame is delayed. */
export function spring(value: number, velocity: number, target: number, dt: number) {
  const omega = 8
  const offset = value - target
  const impulse = velocity + omega * offset
  const decay = Math.exp(-omega * dt)
  return [(offset + impulse * dt) * decay + target, (velocity - omega * impulse * dt) * decay]
}

export function createCameraRig(index: number) {
  const camera = new PerspectiveCamera(40, 1, 0.1, 180)
  const look = new Vector3(index * GRAPH_SPACING, 0, 0)
  const startEye = new Vector3()
  const startLook = new Vector3()
  const endEye = new Vector3()
  const endLook = new Vector3()
  let x = look.x
  let velocity = 0
  let targetX = x
  let distance = 24
  let zoom: Vector3 | null = null
  let transition = 1
  let startFov = 40

  function destinations() {
    endLook.copy(zoom ?? new Vector3(x, 0, 0))
    endEye.copy(endLook).add(new Vector3(zoom ? 0.25 : 0.7, zoom ? 0.3 : 2.1, zoom ? 4 : distance))
  }
  function begin() {
    startEye.copy(camera.position)
    startLook.copy(look)
    startFov = camera.fov
    transition = 0
  }
  function frame(dt: number, reduced: boolean) {
    if (reduced) { x = targetX; velocity = 0 }
    else [x, velocity] = spring(x, velocity, targetX, dt)
    destinations()
    transition = reduced ? 1 : Math.min(1, transition + dt / 0.9)
    const blend = transition * transition * (3 - 2 * transition)
    if (transition < 1) {
      camera.position.lerpVectors(startEye, endEye, blend)
      look.lerpVectors(startLook, endLook, blend)
      camera.fov = startFov + ((zoom ? 34 : 40) - startFov) * blend
    } else {
      camera.position.copy(endEye)
      look.copy(endLook)
      camera.fov = zoom ? 34 : 40
    }
    camera.lookAt(look)
    camera.updateProjectionMatrix()
    camera.updateMatrixWorld()
  }
  frame(0, true)
  return {
    camera,
    get x() { return x },
    get span() { return 2 * distance * Math.tan(20 * Math.PI / 180) * camera.aspect },
    slide(index: number) { targetX = index * GRAPH_SPACING },
    drag(position: number) { x = position; targetX = position; velocity = 0; transition = 1 },
    zoom(node: Vector3 | null) { zoom = node?.clone() ?? null; begin() },
    resize(width: number, height: number) {
      camera.aspect = width / height
      // Leave room for the page's info card: wide screens shift the scene right, narrow ones shift it up.
      if (width >= 1024) camera.setViewOffset(width, height, -Math.min(230, width * 0.16), -24, width, height)
      else camera.setViewOffset(width, height, 0, Math.min(70, height * 0.08), width, height)
      // Wide screens reveal the inner tips of adjacent constellations.
      const halfWidth = camera.aspect >= 1.3 ? 12.6 : camera.aspect >= 0.8 ? 9.2 : 10.8
      distance = Math.max(5.3, halfWidth / camera.aspect) / Math.tan(20 * Math.PI / 180)
      camera.updateProjectionMatrix()
    },
    frame,
  }
}
