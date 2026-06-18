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
    /* Dim output — green tint, low intensity so section text stays readable */
    gl_FragColor = vec4(color[0] * 0.04, color[1] * 0.38, color[2] * 0.08, 1.0);
  }
`

const vertexShader = `void main() { gl_Position = vec4(position, 1.0); }`

/**
 * Full-screen animated WebGL background.
 * Animation loop guard: onVisibility only restarts when truly stopped to prevent
 * double-loop stall caused by calling animate() while rAF is already queued.
 * Context-lost/restored handlers keep it alive across bfcache restores.
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
      return
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
    scene.add(new THREE.Mesh(geometry, material))

    const resize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight)
      uniforms.resolution.value.set(renderer.domElement.width, renderer.domElement.height)
    }

    let rafId = 0
    let running = false

    const animate = () => {
      uniforms.time.value += 0.02
      renderer.render(scene, camera)
      if (running) rafId = requestAnimationFrame(animate)
    }

    const start = () => {
      if (running || reduceMotion) return
      running = true
      rafId = requestAnimationFrame(animate)
    }

    const stop = () => {
      running = false
      cancelAnimationFrame(rafId)
    }

    const onVisibility = () => {
      if (document.hidden) stop()
      else start()
    }

    // WebGL context can be lost on bfcache restore or GPU reset
    const onContextLost = (e: Event) => {
      e.preventDefault()
      stop()
    }
    const onContextRestored = () => start()

    window.addEventListener('resize', resize)
    document.addEventListener('visibilitychange', onVisibility)
    canvas.addEventListener('webglcontextlost', onContextLost)
    canvas.addEventListener('webglcontextrestored', onContextRestored)

    resize()

    if (reduceMotion) {
      renderer.render(scene, camera)
    } else {
      start()
    }

    return () => {
      stop()
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisibility)
      canvas.removeEventListener('webglcontextlost', onContextLost)
      canvas.removeEventListener('webglcontextrestored', onContextRestored)
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
