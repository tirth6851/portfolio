import type { IconType } from 'react-icons'
import {
  SiPython, SiJavascript, SiFlask, SiPostgresql,
  SiGit, SiGithub, SiLinux, SiHtml5, SiCss,
  SiSupabase,
} from 'react-icons/si'
import { VscVscode } from 'react-icons/vsc'
import { FaJava } from 'react-icons/fa'
import { skillCategories } from '@/data/content'
import type { Skill } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { RevealGroup, Reveal } from '@/components/Reveal'

const categoryIcons: Record<string, string> = {
  Languages: '</>',
  'Web & Backend': '⚡',
  Concepts: '◈',
  Tools: '⚙',
}

const skillIcons: Record<string, IconType> = {
  Python: SiPython,
  Java: FaJava,
  JavaScript: SiJavascript,
  Flask: SiFlask,
  PostgreSQL: SiPostgresql,
  Git: SiGit,
  GitHub: SiGithub,
  Linux: SiLinux,
  HTML: SiHtml5,
  CSS: SiCss,
  'VS Code': VscVscode,
  Supabase: SiSupabase,
}

const tierPill: Record<Skill['tier'], string> = {
  Primary:
    'border-accent-secondary/25 bg-accent-secondary/10 text-text-primary hover:border-accent-secondary/40 hover:bg-accent-secondary/15',
  Familiar:
    'border-accent-secondary/15 bg-bg-card text-text-secondary hover:border-accent-secondary/30 hover:bg-accent-secondary/5',
  Learning:
    'border-text-muted/15 bg-transparent text-text-muted/80 hover:border-text-muted/25 hover:text-text-muted',
}

const tierDot: Record<Skill['tier'], string> = {
  Primary: 'bg-accent-secondary',
  Familiar: 'bg-text-muted/50',
  Learning: 'bg-text-muted/25',
}

export function Skills() {
  return (
    <section id="skills" className="bg-bg-primary/88 py-32 backdrop-blur-sm">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle label="skills">Tech Stack</SectionTitle>

        {/* Proficiency legend */}
        <div className="mb-8 flex flex-wrap items-center gap-5 font-mono text-xs text-text-muted">
          {(['Primary', 'Familiar', 'Learning'] as Skill['tier'][]).map((tier) => (
            <span key={tier} className="flex items-center gap-1.5">
              <span className={`inline-block h-1.5 w-1.5 rounded-full ${tierDot[tier]}`} />
              {tier}
            </span>
          ))}
        </div>

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
                  {category.skills.map((skill) => {
                    const Icon = skillIcons[skill.name]
                    return (
                      <span
                        key={skill.name}
                        className={`flex cursor-default items-center gap-1.5 rounded-full border px-3.5 py-1.5 font-mono text-xs transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_0_10px_rgba(0,230,118,0.12)] ${tierPill[skill.tier]}`}
                      >
                        {Icon && <Icon className="shrink-0 opacity-70" />}
                        {skill.name}
                        <span
                          className={`ml-0.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full ${tierDot[skill.tier]}`}
                        />
                      </span>
                    )
                  })}
                </div>
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
