/** True when a WebGL context can be created. `?webgl=0` forces the fallback path (for testing). */
export function detectWebGL(): boolean {
  if (typeof window === 'undefined') return false
  if (new URLSearchParams(window.location.search).get('webgl') === '0') return false
  try {
    const canvas = document.createElement('canvas')
    const gl = (canvas.getContext('webgl2') ?? canvas.getContext('webgl')) as WebGLRenderingContext | null
    if (!gl) return false
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return true
  } catch {
    return false
  }
}
