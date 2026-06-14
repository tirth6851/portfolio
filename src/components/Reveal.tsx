import type { ReactNode } from 'react'
import { motion, useReducedMotion, type Variants } from 'motion/react'

export type RevealVariant = 'up' | 'flip' | 'left' | 'right' | 'scale'

/** Hidden → visible variants, softened from the legacy CSS for a balanced tone. */
const variantMap: Record<RevealVariant, Variants> = {
  up: {
    hidden: { opacity: 0, y: 50, rotateX: 8 },
    visible: { opacity: 1, y: 0, rotateX: 0 },
  },
  flip: {
    hidden: { opacity: 0, y: 60, rotateX: 12, rotateY: 6 },
    visible: { opacity: 1, y: 0, rotateX: 0, rotateY: 0 },
  },
  left: {
    hidden: { opacity: 0, x: -55, rotateY: -10 },
    visible: { opacity: 1, x: 0, rotateY: 0 },
  },
  right: {
    hidden: { opacity: 0, x: 55, rotateY: 10 },
    visible: { opacity: 1, x: 0, rotateY: 0 },
  },
  scale: {
    hidden: { opacity: 0, scale: 0.9, y: 20, rotateX: 6 },
    visible: { opacity: 1, scale: 1, y: 0, rotateX: 0 },
  },
}

interface RevealProps {
  children: ReactNode
  variant?: RevealVariant
  delay?: number
  className?: string
  /** Render inside a stagger parent (skips its own initial/whileInView). */
  asItem?: boolean
  as?: 'div' | 'li' | 'section' | 'span'
}

export function Reveal({
  children,
  variant = 'up',
  delay = 0,
  className,
  asItem = false,
  as = 'div',
}: RevealProps) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const transition = { duration: 0.8, ease: [0.16, 1, 0.3, 1] as const, delay }

  if (asItem) {
    return (
      <MotionTag variants={variantMap[variant]} transition={transition} className={className}>
        {children}
      </MotionTag>
    )
  }

  return (
    <MotionTag
      variants={variantMap[variant]}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      transition={transition}
      className={className}
      style={{ transformPerspective: 800 }}
    >
      {children}
    </MotionTag>
  )
}

/** Parent that staggers Reveal children with asItem. */
export function RevealGroup({
  children,
  className,
  stagger = 0.1,
  as = 'div',
}: {
  children: ReactNode
  className?: string
  stagger?: number
  as?: 'div' | 'ul' | 'section'
}) {
  const reduceMotion = useReducedMotion()
  const MotionTag = motion[as]

  if (reduceMotion) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.12 }}
      variants={{ visible: { transition: { staggerChildren: stagger } } }}
      className={className}
    >
      {children}
    </MotionTag>
  )
}
