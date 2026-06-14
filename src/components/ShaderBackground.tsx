import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import * as THREE from 'three'

const fragmentShader = `
  #define TWO_PI 6.2831853072
  #define PI 3.14159265359
  precision highp float;
  uniform vec2 resolution;
  uniform float time;

  void main(void) {
    vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy) / min(resolution.x, resolution.y);
    float t = time * 0.05;
    float lineWidth = 0.002;
    vec3 color = vec3(0.0);
    for (int j = 0; j < 3; j++) {
      for (int i = 0; i < 5; i++) {
        color[j] += lineWidth * float(i * i) / abs(fract(t - 0.01 * float(j) + float(i) * 0.01) * 5.0 - length(uv) + mod(uv.x + uv.y, 0.2));
      }
    }
    gl_FragColor = vec4(color[0], color[1], color[2], 1.0);
  }
`

const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`

/**
 * Full-screen animated WebGL background (line-glow shader from the legacy site).
 * Perf-guarded: capped DPR, no antialias on mobile, paused on hidden tab,
 * and rendered as a single static frame under reduced-motion.
 */
export function ShaderBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const isMobile = window.innerWidth < 768
    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({ canvas, antialias: !isMobile, alpha: true })
    } catch {
      return // WebGL unsupported — solid bg fallback remains
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5))

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const geometry = new THREE.PlaneGeometry(2, 2)
    const uniforms = {
      time: { value: 1.0 },
      resolution: { value: new THREE.Vector2() },
    }
    const material = new THREE.ShaderMaterial({ uniforms, vertexShader, fragmentShader })
    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height,
      )
    }

    let rafId = 0
    let running = true
    const animate = () => {
      // Calmer pace than the legacy 0.05 increment.
      uniforms.time.value += 0.02
      renderer.render(scene, camera)
      if (running) rafId = requestAnimationFrame(animate)
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(rafId)
      } else if (!reduceMotion) {
        running = true
        animate()
      }
    }

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    resize()

    if (reduceMotion) {
      // Render a single static frame, no loop.
      renderer.render(scene, camera)
    } else {
      animate()
    }

    return () => {
      running = false
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      geometry.dispose()
      material.dispose()
      renderer.dispose()
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10 block h-full w-full bg-black"
    />
  )
}
