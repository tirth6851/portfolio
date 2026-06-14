import { skillCategories } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { RevealGroup, Reveal } from '@/components/Reveal'

export function Skills() {
  return (
    <section id="skills" className="bg-bg-secondary/65 py-20">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle>Technical Skills</SectionTitle>

        <RevealGroup className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {skillCategories.map((category) => (
            <Reveal key={category.title} variant="up" asItem>
              <div className="h-full rounded-xl border border-accent-primary/40 bg-bg-card/50 p-6">
                <h3 className="mb-4 text-xl font-semibold text-accent-gold">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-accent-secondary/20 bg-bg-card px-4 py-2 text-sm text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-secondary hover:bg-accent-primary hover:shadow-[0_4px_12px_rgba(25,135,84,0.3)]"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
