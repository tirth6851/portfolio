import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'

/**
 * Subtle "matrix rain" canvas for the contact backdrop.
 * Disabled under reduced-motion and on small screens for performance.
 */
export function RainingLetters() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion || window.innerWidth < 768) return
    const canvas = canvasRef.current
    const section = canvas?.parentElement
    const ctx = canvas?.getContext('2d')
    if (!canvas || !section || !ctx) return

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789<>[]{}*^%'.split('')
    let width = 0
    let height = 0
    let drops: number[] = []

    const resize = () => {
      width = canvas.width = section.offsetWidth
      height = canvas.height = section.offsetHeight
      drops = new Array(Math.floor(width / 20)).fill(1)
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(5, 8, 9, 0.15)'
      ctx.fillRect(0, 0, width, height)
      ctx.fillStyle = '#198754'
      ctx.font = '15px monospace'
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * 20, drops[i] * 20)
        if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0
        drops[i]++
      }
    }

    resize()
    window.addEventListener('resize', resize)
    const interval = window.setInterval(draw, 40)

    return () => {
      window.removeEventListener('resize', resize)
      window.clearInterval(interval)
    }
  }, [reduceMotion])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-40"
    />
  )
}
