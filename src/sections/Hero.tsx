import { motion, useReducedMotion } from 'motion/react'
import { profile, heroStrings, badges } from '@/data/content'
import { MatrixText } from '@/components/MatrixText'
import { LiquidButton } from '@/components/LiquidButton'

const base = import.meta.env.BASE_URL

export function Hero() {
  const reduceMotion = useReducedMotion()
  const fade = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 30 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const },
        }

  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-bg-primary/65 px-4 pt-20"
    >
      <div className="mx-auto max-w-3xl px-4 text-center [text-shadow:0_2px_10px_rgba(0,0,0,0.5)]">
        <motion.img
          src={`${base}${profile.photo}`}
          alt="Portrait of Tirth Patel"
          {...fade(0)}
          className="mx-auto mb-6 h-44 w-44 rounded-full border-4 border-accent-primary object-cover shadow-[0_8px_32px_rgba(0,0,0,0.25)] md:h-48 md:w-48"
        />

        <MatrixText
          phrases={heroStrings.titlePhrases}
          as="h1"
          className="mb-4 block min-h-[7rem] text-4xl font-bold text-text-primary md:min-h-[4.5rem] md:text-5xl"
        />

        <MatrixText
          phrases={heroStrings.descPhrases}
          as="p"
          className="mx-auto mb-6 block max-w-2xl text-base text-text-muted md:text-lg"
        />

        {/* Credibility badges */}
        <motion.ul
          {...fade(0.25)}
          className="mb-8 flex flex-wrap justify-center gap-3"
        >
          {badges.map((badge) => (
            <li
              key={badge}
              className="flex items-center gap-2 rounded-full border border-accent-primary/70 bg-bg-card/60 px-4 py-1.5 text-sm text-text-secondary backdrop-blur"
            >
              <span className="h-2 w-2 rounded-full bg-accent-secondary" aria-hidden="true" />
              {badge}
            </li>
          ))}
        </motion.ul>

        <motion.div {...fade(0.4)} className="flex flex-wrap justify-center gap-5">
          <LiquidButton href={`${base}${profile.resume}`} download>
            View Resume
          </LiquidButton>
          <LiquidButton href={profile.github} target="_blank" rel="noreferrer">
            GitHub
          </LiquidButton>
          <LiquidButton href={profile.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </LiquidButton>
        </motion.div>
      </div>
    </section>
  )
}
