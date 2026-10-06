import { useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react'
import { navItems } from '@/data/content'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const ids = ['top', ...navItems.map((n) => n.id)]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(ids)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 140, damping: 24 })

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-bg/70 backdrop-blur-xl">
      <div className="wrap flex h-14 items-center justify-between">
        <a href="#top" className="flex items-center gap-2 text-lg font-bold tracking-tight">
          <span aria-hidden="true" className="h-2.5 w-2.5 rounded-full bg-accent shadow-[0_0_14px_rgba(77,224,160,0.9)]" />
          Tirth Patel
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`mono-label transition-colors hover:text-accent ${active === item.id ? 'text-accent [text-shadow:0_0_14px_rgba(77,224,160,0.7)]' : 'text-ink-soft'}`}
                >
                  <span className="mr-1.5">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="mono-label -mr-2 px-2 py-2 text-ink md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {!reduceMotion && (
        <motion.div
          aria-hidden="true"
          style={{ scaleX: progress }}
          className="absolute inset-x-0 bottom-[-1px] h-px origin-left bg-gradient-to-r from-accent via-glow to-violet shadow-[0_0_12px_rgba(77,224,160,0.8)]"
        />
      )}

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-line bg-bg/95 md:hidden">
          <ul className="wrap py-3">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="mono-label flex items-baseline gap-3 border-b border-line py-3 text-ink last:border-b-0"
                >
                  <span className="text-accent">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
