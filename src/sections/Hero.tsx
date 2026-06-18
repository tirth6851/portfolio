import { motion, useReducedMotion } from 'motion/react'
import { profile } from '@/data/content'
import { MatrixText } from '@/components/MatrixText'

const rolePhrases = [
  'Backend & AI Developer',
  'CS @ Cleveland State',
  'Fall 2026 SWE Intern',
  'Backend & AI Developer',
]

const fade = (delay: number, reduceMotion: boolean | null) =>
  reduceMotion
    ? {}
    : {
        initial: { opacity: 0, y: 28 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.75, delay, ease: [0.16, 1, 0.3, 1] as const },
      }

export function Hero() {
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 pt-20"
    >
      {/* Radial ambient glow behind the hero content */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{
          width: 700,
          height: 700,
          background:
            'radial-gradient(circle, rgba(0,230,118,0.10) 0%, rgba(0,230,118,0.03) 45%, transparent 70%)',
        }}
      />

      <div className="relative mx-auto max-w-3xl px-4 text-center">
        {/* Availability badge */}
        <motion.div
          {...fade(0, reduceMotion)}
          className="mb-8 inline-flex items-center gap-2.5 rounded-full border border-accent-secondary/20 bg-accent-secondary/5 px-4 py-1.5 text-sm font-medium text-accent-secondary"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-secondary opacity-70" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent-secondary" />
          </span>
          Available for Fall 2026 Internships
        </motion.div>

        {/* Name — static, with gradient on last name */}
        <motion.h1
          {...fade(0.1, reduceMotion)}
          className="mb-4 text-5xl font-bold leading-tight tracking-tight md:text-7xl"
        >
          <span className="text-text-primary">Tirth </span>
          <span className="gradient-name">Patel</span>
        </motion.h1>

        {/* Role — MatrixText cycling */}
        <motion.div {...fade(0.2, reduceMotion)} className="mb-4 min-h-[1.75rem]">
          <MatrixText
            phrases={rolePhrases}
            as="p"
            className="text-lg font-medium text-accent-secondary md:text-xl"
          />
        </motion.div>

        {/* Tagline */}
        <motion.p
          {...fade(0.3, reduceMotion)}
          className="mx-auto mb-10 max-w-xl text-base leading-7 text-text-muted"
        >
          Building Python & Java backends, recommendation systems, and clean software from
          Cleveland, Ohio.
        </motion.p>

        {/* CTAs */}
        <motion.div
          {...fade(0.4, reduceMotion)}
          className="flex flex-wrap items-center justify-center gap-4"
        >
          <a
            href="#projects"
            className="rounded-lg bg-accent-secondary px-6 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-[#00cc6a] hover:shadow-[0_0_24px_rgba(0,230,118,0.35)]"
          >
            View My Work
          </a>
          <a
            href="#contact"
            className="rounded-lg border border-accent-secondary/25 px-6 py-2.5 text-sm font-medium text-text-primary transition hover:border-accent-secondary/50 hover:bg-accent-secondary/5"
          >
            Get in Touch
          </a>
        </motion.div>

        {/* Social links */}
        <motion.div
          {...fade(0.5, reduceMotion)}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <a
            href={profile.github}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-muted transition-colors hover:text-accent-secondary"
          >
            GitHub
          </a>
          <span className="h-px w-4 bg-text-muted/40" />
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noreferrer"
            className="text-sm text-text-muted transition-colors hover:text-accent-secondary"
          >
            LinkedIn
          </a>
          <span className="h-px w-4 bg-text-muted/40" />
          <a
            href={`mailto:${profile.email}`}
            className="text-sm text-text-muted transition-colors hover:text-accent-secondary"
          >
            Email
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <a
        href="#about"
        aria-label="Scroll to About"
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 text-text-muted/50 transition-colors hover:text-accent-secondary"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M10 4v12M4 10l6 6 6-6" />
        </svg>
      </a>
    </section>
  )
}
