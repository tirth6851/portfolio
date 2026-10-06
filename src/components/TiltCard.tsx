import type { PointerEvent, ReactNode } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'motion/react'

interface Props {
  children: ReactNode
  className?: string
  /** Maximum tilt in degrees. */
  max?: number
}

/** Pointer-reactive 3D tilt (mouse only). Plain wrapper under reduced motion. */
export function TiltCard({ children, className, max = 9 }: Props) {
  const reduceMotion = useReducedMotion()
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const rotateX = useSpring(rawX, { stiffness: 140, damping: 16 })
  const rotateY = useSpring(rawY, { stiffness: 140, damping: 16 })

  if (reduceMotion) return <div className={className}>{children}</div>

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    rawY.set(((e.clientX - r.left) / r.width - 0.5) * 2 * max)
    rawX.set(-((e.clientY - r.top) / r.height - 0.5) * 2 * max)
  }
  const reset = () => {
    rawX.set(0)
    rawY.set(0)
  }

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformPerspective: 900 }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {children}
    </motion.div>
  )
}
