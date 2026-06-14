import { about } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { Reveal } from '@/components/Reveal'

export function About() {
  return (
    <section id="about" className="bg-bg-secondary/65 py-20">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle>About Me</SectionTitle>
        <Reveal variant="up">
          <p className="mx-auto max-w-3xl text-lg leading-8 text-text-secondary">{about}</p>
        </Reveal>
      </div>
    </section>
  )
}
