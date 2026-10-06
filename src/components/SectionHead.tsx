interface Props {
  index: string
  kicker: string
  title: string
  className?: string
}

export function SectionHead({ index, kicker, title, className = '' }: Props) {
  return (
    <header className={className}>
      <p className="mono-label text-ink-soft">
        {index} — {kicker}
      </p>
      <h2 className="mt-4 font-display text-5xl leading-[1.02] tracking-tight md:text-6xl">{title}</h2>
    </header>
  )
}
