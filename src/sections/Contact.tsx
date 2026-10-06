import { profile } from '@/data/content'
import { Reveal } from '@/components/Reveal'

const base = import.meta.env.BASE_URL
const pill =
  'mono-label rounded-full border border-line-strong px-6 py-3 text-ink transition hover:border-accent hover:text-accent hover:shadow-[0_0_28px_rgba(77,224,160,0.28)]'

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden border-t border-line py-28 md:py-40">
      <div className="aurora" aria-hidden="true" />
      <div className="grain absolute inset-0" aria-hidden="true" />
      <div className="wrap relative z-10">
        <Reveal>
          <p className="mono-label text-accent">05 — Contact</p>
          <h2 className="mt-4 text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[0.98] tracking-tight">
            Let's build something <span className="serif-italic gradient-text text-glow">useful.</span>
          </h2>
          <a
            href={`mailto:${profile.email}`}
            className="mt-12 inline-block break-all rounded-2xl border border-accent/50 bg-accent/10 px-6 py-4 text-xl font-medium text-ink shadow-[0_0_50px_rgba(77,224,160,0.25)] transition hover:-translate-y-1 hover:bg-accent/20 hover:shadow-[0_0_80px_rgba(77,224,160,0.45)] sm:text-3xl"
          >
            {profile.email}
          </a>
          <ul className="mt-10 flex flex-wrap gap-3">
            <li>
              <a href={profile.github} target="_blank" rel="noreferrer" className={pill}>
                GitHub ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={profile.linkedin} target="_blank" rel="noreferrer" className={pill}>
                LinkedIn ↗<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
            <li>
              <a href={`${base}${profile.resume}`} className={pill}>
                Resume (PDF)
              </a>
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
