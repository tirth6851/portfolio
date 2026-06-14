import { Reveal } from './Reveal'

/** Gold centered section heading with the gradient underline. */
export function SectionTitle({ children }: { children: string }) {
  return (
    <Reveal variant="scale">
      <h2 className="relative mb-12 text-center text-3xl font-bold text-accent-gold md:text-4xl">
        {children}
        <span className="mx-auto mt-4 block h-1 w-20 rounded bg-gradient-to-r from-accent-primary to-accent-secondary" />
      </h2>
    </Reveal>
  )
}
