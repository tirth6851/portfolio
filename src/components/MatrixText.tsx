import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { cn } from '@/lib/utils'

/** Frame-based text scramble (adapted from the reference TextScramble). */
class TextScramble {
  el: HTMLElement
  chars = '!<>-_\\/[]{}—=+*^?#'
  queue: { from: string; to: string; start: number; end: number; char?: string }[] = []
  frame = 0
  frameRequest = 0
  resolve: () => void = () => {}

  constructor(el: HTMLElement) {
    this.el = el
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => (this.resolve = resolve))
    this.queue = []
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const item = this.queue[i]
      let { char } = item
      if (this.frame >= item.end) {
        complete++
        output += item.to
      } else if (this.frame >= item.start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          item.char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += item.from
      }
    }
    this.el.innerHTML = output
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }

  stop() {
    cancelAnimationFrame(this.frameRequest)
  }
}

interface MatrixTextProps {
  phrases: string[]
  /** ms to hold each phrase before scrambling to the next. */
  hold?: number
  /** Delay before the sequence begins. */
  startDelay?: number
  className?: string
  as?: 'h1' | 'p' | 'span'
}

/**
 * Scrambles once through `phrases`, then settles on phrases[0] (the canonical
 * label). Does NOT loop forever. Reduced-motion renders phrases[0] directly.
 */
export function MatrixText({
  phrases,
  hold = 1800,
  startDelay = 300,
  className,
  as: Tag = 'span',
}: MatrixTextProps) {
  const ref = useRef<HTMLHeadingElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (reduceMotion) return
    const el = ref.current
    if (!el) return

    const scrambler = new TextScramble(el)
    // Cycle through the alternate phrases once, ending back on the canonical first.
    const sequence = [...phrases.slice(1), phrases[0]]
    let cancelled = false
    const timers: ReturnType<typeof setTimeout>[] = []

    const run = async () => {
      await new Promise((r) => timers.push(setTimeout(r, startDelay)))
      for (const phrase of sequence) {
        if (cancelled) return
        await scrambler.setText(phrase)
        if (cancelled) return
        await new Promise((r) => timers.push(setTimeout(r, hold)))
      }
    }
    run()

    return () => {
      cancelled = true
      scrambler.stop()
      timers.forEach(clearTimeout)
    }
  }, [phrases, hold, startDelay, reduceMotion])

  return (
    <Tag ref={ref} className={cn('font-mono', className)}>
      {phrases[0]}
    </Tag>
  )
}
