import { cn } from '@/lib/utils'
import { Reveal } from './Reveal'

interface SectionTitleProps {
  label: string
  children: string
  center?: boolean
}

/** Section heading with monospace "// label" prefix above the h2. */
export function SectionTitle({ label, children, center }: SectionTitleProps) {
  return (
    <Reveal variant="up">
      <div className={cn('mb-12', center && 'text-center')}>
        <p className="mb-2 font-mono text-sm tracking-wide text-accent-secondary">
          {'// '}
          {label}
        </p>
        <h2 className="text-3xl font-bold text-text-primary md:text-4xl">{children}</h2>
      </div>
    </Reveal>
  )
}
