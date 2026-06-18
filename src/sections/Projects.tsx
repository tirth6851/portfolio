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
  const rotateX = useTransform(scrollYProgress, [0, 1], [10, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [0.97, 1])

  return (
    <section id="projects" className="bg-transparent py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle label="projects">What I've Built</SectionTitle>
        <div ref={ref} style={{ perspective: 1200 }}>
          <motion.div style={reduceMotion ? undefined : { rotateX, scale }}>
            <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
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
