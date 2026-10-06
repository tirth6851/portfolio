import { profile } from '@/data/content'
import { Reveal } from '@/components/Reveal'

const base = import.meta.env.BASE_URL

export function Contact() {
  return (
    <section id="contact" className="border-t border-ink py-24 md:py-32">
      <div className="wrap">
        <Reveal>
          <p className="mono-label text-ink-soft">06 — Contact</p>
          <h2 className="mt-4 font-display text-[clamp(3rem,9vw,8rem)] leading-[0.95] tracking-tight">
            Let's build something <em className="text-accent">useful</em>.
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-12 inline-block break-all font-display text-3xl underline decoration-ink/30 decoration-1 underline-offset-8 transition-colors hover:text-accent hover:decoration-accent md:text-5xl"
          >
            {profile.email}
          </a>
          <ul className="mono-label mt-10 flex flex-wrap gap-x-8 gap-y-3">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent">
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent">
                LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`${base}${profile.resume}`} className="underline decoration-ink/30 underline-offset-8 hover:decoration-accent">
                Resume (PDF)
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
