import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'motion/react'
import { useMediaQuery } from '@/hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], [role="tab"], input, textarea, select, summary'

/** Soft glow that trails the cursor. Mouse/trackpad only; off for touch and reduced motion. */
export function CursorGlow() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)')
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')
  const x = useMotionValue(-200)
  const y = useMotionValue(-200)
  const sx = useSpring(x, { stiffness: 520, damping: 42, mass: 0.35 })
  const sy = useSpring(y, { stiffness: 520, damping: 42, mass: 0.35 })
  const grow = useMotionValue(1)
  const scale = useSpring(grow, { stiffness: 260, damping: 22 })
  const alpha = useMotionValue(0)

  useEffect(() => {
    if (!fine || reduced) return
    const move = (e: PointerEvent) => {
      x.set(e.clientX)
      y.set(e.clientY)
      alpha.set(1)
      grow.set((e.target as Element | null)?.closest?.(INTERACTIVE) ? 1.9 : 1)
    }
    const hide = () => alpha.set(0)
    window.addEventListener('pointermove', move, { passive: true })
    document.documentElement.addEventListener('pointerleave', hide)
    return () => {
      window.removeEventListener('pointermove', move)
      document.documentElement.removeEventListener('pointerleave', hide)
    }
  }, [fine, reduced, x, y, alpha, grow])

  if (!fine || reduced) return null

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[100] h-14 w-14 rounded-full"
      style={{
        x: sx,
        y: sy,
        scale,
        opacity: alpha,
        marginLeft: -28,
        marginTop: -28,
        background:
          'radial-gradient(circle, rgba(77,224,160,0.55) 0%, rgba(77,224,160,0.28) 22%, rgba(110,168,255,0.14) 48%, rgba(110,168,255,0) 70%)',
      }}
    />
  )
}
