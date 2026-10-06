import { useEffect, useRef } from 'react'
import { animate, motion, useInView, useMotionValue, useReducedMotion, useTransform } from 'motion/react'

interface Props {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}

/** Counts up once when scrolled into view; the final value is always available to screen readers. */
export function CountUp({ value, decimals = 0, prefix = '', suffix = '' }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true })
  const reduceMotion = useReducedMotion()
  const progress = useMotionValue(reduceMotion ? value : 0)
  const text = useTransform(progress, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`)
  const final = `${prefix}${value.toFixed(decimals)}${suffix}`

  useEffect(() => {
    if (!inView || reduceMotion) return
    const controls = animate(progress, value, { duration: 1.4, ease: [0.16, 1, 0.3, 1] })
    return () => controls.stop()
  }, [inView, reduceMotion, progress, value])

  return (
    <span ref={ref}>
      <span className="sr-only">{final}</span>
      <motion.span aria-hidden="true">{text}</motion.span>
    </span>
  )
}
