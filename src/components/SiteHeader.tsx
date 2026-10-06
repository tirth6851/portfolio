import { useState } from 'react'
import { navItems } from '@/data/content'
import { useScrollSpy } from '@/hooks/useScrollSpy'

const ids = ['top', ...navItems.map((n) => n.id)]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const active = useScrollSpy(ids)

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-rule bg-paper/90 backdrop-blur">
      <div className="wrap flex h-14 items-center justify-between">
        <a href="#top" className="font-display text-2xl leading-none tracking-tight">
          Tirth Patel
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-7">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={active === item.id ? 'true' : undefined}
                  className={`mono-label transition-colors hover:text-accent ${
                    active === item.id ? 'text-accent' : 'text-ink-soft'
                  }`}
                >
                  <span className="mr-1.5 opacity-50">{String(i + 1).padStart(2, '0')}</span>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <button
          type="button"
          className="mono-label -mr-2 px-2 py-2 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav id="mobile-nav" aria-label="Primary" className="border-t border-rule bg-paper md:hidden">
          <ul className="wrap py-3">
            {navItems.map((item, i) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  onClick={() => setOpen(false)}
                  className="mono-label flex items-baseline gap-3 border-b border-rule py-3 text-ink last:border-b-0"
                >
                  <span className="opacity-50">{String(i + 1).padStart(2, '0')}</span>
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
