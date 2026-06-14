import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'
import { navItems } from '@/data/content'
import { useScrollSpy } from '@/hooks/useScrollSpy'
import { MatrixText } from './MatrixText'

const sectionIds = navItems.map((i) => i.id)
const logoPhrases = ['Tirth Patel', 'CS @ Cleveland State', 'Python & Java']

export function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef<HTMLElement>(null)
  const activeId = useScrollSpy(sectionIds)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu when clicking outside the nav.
  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  return (
    <nav
      ref={navRef}
      className={cn(
        'fixed inset-x-0 top-0 z-[1000] border-b border-accent-primary bg-bg-primary/75 py-4 backdrop-blur-md transition-shadow',
        scrolled && 'shadow-[0_4px_24px_rgba(0,0,0,0.6)]',
      )}
    >
      <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 md:px-8">
        <a href="#top" className="text-2xl font-bold tracking-wide text-accent-gold">
          <MatrixText phrases={logoPhrases} as="span" />
        </a>

        {/* Desktop links */}
        <ul className="hidden gap-8 md:flex">
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={activeId === item.id ? 'true' : undefined}
                className={cn(
                  'relative font-medium text-text-secondary transition-colors hover:text-accent-secondary',
                  "after:absolute after:-bottom-1.5 after:left-0 after:h-0.5 after:bg-accent-secondary after:transition-all after:content-['']",
                  activeId === item.id
                    ? 'text-accent-secondary after:w-full'
                    : 'after:w-0 hover:after:w-full',
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger */}
        <button
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col items-center justify-center gap-[5px] p-1.5 md:hidden"
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={cn(
                'block h-0.5 w-6 rounded-full bg-accent-gold transition-all duration-300',
                open && i === 0 && 'translate-y-[7px] rotate-45',
                open && i === 1 && 'scale-x-0 opacity-0',
                open && i === 2 && '-translate-y-[7px] -rotate-45',
              )}
            />
          ))}
        </button>
      </div>

      {/* Mobile panel */}
      <ul
        className={cn(
          'absolute inset-x-0 top-full flex flex-col items-center gap-6 border-b border-accent-primary bg-bg-primary/98 py-6 backdrop-blur-md transition-all duration-300 md:hidden',
          open
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-4 opacity-0',
        )}
      >
        {navItems.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={() => setOpen(false)}
              aria-current={activeId === item.id ? 'true' : undefined}
              className={cn(
                'text-lg font-medium transition-colors',
                activeId === item.id ? 'text-accent-secondary' : 'text-text-secondary',
              )}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
