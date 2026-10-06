import {
  AdditiveBlending, BufferAttribute, BufferGeometry, DataTexture, Points, PointsMaterial,
  RGBAFormat, LinearFilter, Vector2,
} from 'three'
import type { PerspectiveCamera, Scene, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import type { ScenePalette } from './types'

/** Neutral alpha mask: all visible hue comes from palette-tinted materials. */
export function createGlowTexture() {
  const size = 64
  const data = new Uint8Array(size * size * 4)
  for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
    const radius = Math.hypot((x + 0.5) / size * 2 - 1, (y + 0.5) / size * 2 - 1)
    const offset = (y * size + x) * 4
    data[offset] = data[offset + 1] = data[offset + 2] = 255
    data[offset + 3] = Math.round(Math.pow(Math.max(0, 1 - radius), 2.4) * 255)
  }
  const texture = new DataTexture(data, size, size, RGBAFormat)
  texture.magFilter = texture.minFilter = LinearFilter
  texture.needsUpdate = true
  return texture
}

export function createParticles(palette: ScenePalette, texture: DataTexture) {
  const positions = new Float32Array(800 * 3)
  // Repeatable field, local to the camera: distant layers move at different apparent speeds.
  let seed = 12345
  const random = () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647 }
  for (let i = 0; i < 800; i++) {
    positions[i * 3] = (random() - 0.5) * 100
    positions[i * 3 + 1] = (random() - 0.5) * 44
    positions[i * 3 + 2] = -random() * 42 + 5
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  const material = new PointsMaterial({ color: palette.glow, map: texture, size: 0.12,
    opacity: 0.55, transparent: true, blending: AdditiveBlending, depthWrite: false })
  const points = new Points(geometry, material)
  return {
    points,
    quality(low: boolean) { geometry.setDrawRange(0, low ? 250 : 800) },
    frame(time: number, cameraX: number, dim: boolean) {
      points.position.set(cameraX * 0.72, Math.sin(time * 0.045) * 0.8, 0)
      points.rotation.z = Math.sin(time * 0.025) * 0.025
      material.opacity = dim ? 0.08 : 0.55
    },
    palette(next: ScenePalette) { material.color.set(next.glow) },
    dispose() { geometry.dispose(); material.dispose() },
  }
}

export function createBloom(renderer: WebGLRenderer, scene: Scene, camera: PerspectiveCamera) {
  const composer = new EffectComposer(renderer)
  const passes: { dispose(): void }[] = []
  function dispose() { passes.forEach(pass => pass.dispose()); composer.dispose() }
  try {
    const render = new RenderPass(scene, camera)
    passes.push(render)
    const bloom = new UnrealBloomPass(new Vector2(1, 1), 0.95, 0.75, 0.78)
    // r184's dispose omits the luminance filter material.
    passes.push(bloom, bloom.materialHighPassFilter)
    const output = new OutputPass()
    passes.push(output)
    composer.addPass(render)
    composer.addPass(bloom)
    composer.addPass(output)
    return {
      render() { composer.render() },
      resize(width: number, height: number, dpr: number) {
        composer.setPixelRatio(dpr)
        composer.setSize(width, height)
        // UnrealBloomPass internally halves this size for its largest buffer.
        // The scene and output remain full-resolution for crisp sprite text.
        bloom.setSize(Math.max(1, width * dpr), Math.max(1, height * dpr))
      },
      dispose,
    }
  } catch (error) { dispose(); throw error }
}
