import { motion, useScroll, useSpring } from 'motion/react'

/** Thin gradient bar at the top of the viewport that fills as the page scrolls. */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  })

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[1100] h-[2px] origin-left bg-gradient-to-r from-accent-secondary/40 via-accent-secondary to-accent-secondary"
      aria-hidden="true"
    />
  )
}
