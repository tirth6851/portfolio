import { useRef } from 'react'
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react'
import { projects } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { ProjectCard } from '@/components/ProjectCard'
import { RevealGroup } from '@/components/Reveal'

export function Projects() {
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'center center'],
  })
  // Tilt the whole grid flat as it enters (softened from the legacy 20deg).
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1])

  return (
    <section id="projects" className="bg-bg-primary/65 py-20">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle>Featured Projects</SectionTitle>
        <div ref={ref} style={{ perspective: 1200 }}>
          <motion.div style={reduceMotion ? undefined : { rotateX, scale }}>
            <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.title} project={project} />
              ))}
            </RevealGroup>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
