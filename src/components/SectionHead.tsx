interface Props {
  index: string
  kicker: string
  title: string
  /** Rendered after the title in serif italic with the gradient. */
  accent?: string
  className?: string
}

export function SectionHead({ index, kicker, title, accent, className = '' }: Props) {
  return (
    <header className={className}>
      <p className="mono-label text-accent">
        {index} — {kicker}
      </p>
      <h2 className="mt-3 text-4xl font-bold leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
        {title}
        {accent && (
          <>
            {' '}
            <span className="serif-italic gradient-text text-glow">{accent}</span>
          </>
        )}
      </h2>
    </header>
  )
}
