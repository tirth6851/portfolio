import { motion, useReducedMotion } from 'motion/react'

export interface HeadlineWord {
  text: string
  accent?: boolean
}

/** Masked word-by-word rise. Renders the same words as plain text under reduced motion. */
export function KineticHeadline({ words, className }: { words: HeadlineWord[]; className?: string }) {
  const reduceMotion = useReducedMotion()

  return (
    <h1 className={className}>
      {words.map((w, i) => {
        const inner = w.accent ? <em className="text-accent">{w.text}</em> : w.text
        return (
          <span key={`${w.text}-${i}`}>
            {reduceMotion ? (
              inner
            ) : (
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span
                  className="inline-block"
                  initial={{ y: '115%' }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.85, delay: 0.1 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                >
                  {inner}
                </motion.span>
              </span>
            )}
            {i < words.length - 1 ? ' ' : null}
          </span>
        )
      })}
    </h1>
  )
}
