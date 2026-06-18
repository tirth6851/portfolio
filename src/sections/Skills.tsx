import { skillCategories } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { RevealGroup, Reveal } from '@/components/Reveal'

const categoryIcons: Record<string, string> = {
  Languages: '</>',
  'Web & Backend': '⚡',
  Concepts: '◈',
  Tools: '⚙',
}

export function Skills() {
  return (
    <section id="skills" className="bg-bg-primary/88 py-32 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle label="skills">Tech Stack</SectionTitle>

        <RevealGroup className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {skillCategories.map((category) => (
            <Reveal key={category.title} variant="up" asItem>
              <div className="h-full rounded-xl bg-bg-card/40 p-6 ring-1 ring-accent-secondary/10 backdrop-blur-sm transition hover:ring-accent-secondary/20">
                {/* Category header */}
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-secondary/10 font-mono text-sm text-accent-secondary">
                    {categoryIcons[category.title] ?? '</>'}
                  </span>
                  <h3 className="font-semibold text-text-primary">{category.title}</h3>
                </div>

                {/* Skill pills */}
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <span
                      key={skill}
                      className="cursor-default rounded-full border border-accent-secondary/15 bg-bg-card px-3.5 py-1.5 font-mono text-xs text-text-secondary transition-all duration-200 hover:-translate-y-0.5 hover:border-accent-secondary/35 hover:bg-accent-secondary/5 hover:text-text-primary hover:shadow-[0_0_10px_rgba(0,230,118,0.12)]"
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
