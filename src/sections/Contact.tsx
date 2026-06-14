import { profile } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { RevealGroup, Reveal } from '@/components/Reveal'
import { RainingLetters } from '@/components/RainingLetters'

const items = [
  { label: 'Location', value: profile.location, href: undefined },
  { label: 'Email', value: profile.email, href: `mailto:${profile.email}` },
  { label: 'LinkedIn', value: profile.linkedinLabel, href: profile.linkedin },
  { label: 'GitHub', value: profile.githubLabel, href: profile.github },
]

export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden bg-bg-primary/65 py-20">
      <RainingLetters />
      <div className="relative z-10 mx-auto max-w-3xl px-6 text-center md:px-8">
        <SectionTitle>Get in Touch</SectionTitle>
        <p className="mb-8 text-lg text-text-secondary">
          Seeking Software Engineering / Developer Internship or Co-op — Fall 2026
        </p>

        <RevealGroup className="grid gap-5 text-left sm:grid-cols-2">
          {items.map((item) => (
            <Reveal key={item.label} variant="right" asItem>
              <div className="rounded-xl border-l-4 border-accent-primary bg-bg-card p-6 transition-all duration-300 hover:translate-x-1.5 hover:shadow-[0_4px_20px_rgba(25,135,84,0.2)]">
                <strong className="mb-1 block text-accent-gold">{item.label}</strong>
                {item.href ? (
                  <a
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel="noreferrer"
                    className="text-accent-secondary transition-colors hover:text-accent-gold hover:underline"
                  >
                    {item.value}
                  </a>
                ) : (
                  <p className="text-text-secondary">{item.value}</p>
                )}
              </div>
            </Reveal>
          ))}
        </RevealGroup>
      </div>
    </section>
  )
}
