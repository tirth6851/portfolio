import { useRef } from 'react'
import { motion, useReducedMotion, useScroll } from 'motion/react'
import { experiences } from '@/data/content'
import { SectionHead } from '@/components/SectionHead'
import { Reveal } from '@/components/Reveal'

export function Experience() {
  const ref = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] })

  return (
    <section id="experience" className="relative overflow-hidden border-t border-line py-24 md:py-32">
      <div className="wrap relative z-10">
        <SectionHead index="03" kicker="Experience" title="Where I've" accent="worked." className="mb-14" />

        <div ref={ref} className="relative pl-8 md:pl-12">
          <span aria-hidden="true" className="absolute bottom-0 left-[7px] top-0 w-px bg-line md:left-[11px]" />
          <motion.span
            aria-hidden="true"
            className="absolute bottom-0 left-[6px] top-0 w-[3px] origin-top rounded-full bg-gradient-to-b from-accent via-glow to-violet shadow-[0_0_18px_rgba(77,224,160,0.8)] md:left-[10px]"
            style={{ scaleY: reduce ? 1 : scrollYProgress }}
          />
          <div className="space-y-8">
            {experiences.map((exp) => (
              <Reveal key={exp.role}>
                <article className="glass glow-border relative p-6 md:p-8">
                  <span aria-hidden="true" className="absolute -left-[2.35rem] top-8 h-3.5 w-3.5 rounded-full border-2 border-accent bg-bg shadow-[0_0_16px_rgba(77,224,160,0.9)] md:-left-[3.2rem]" />
                  <p className="mono-label text-accent">{exp.date}</p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight md:text-3xl">{exp.role}</h3>
                  <p className="mono-label mt-2 text-ink-soft">{exp.company}</p>
                  <ul className="mt-5 list-disc space-y-3 pl-5 leading-relaxed text-ink-soft marker:text-accent/70">
                    {exp.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
