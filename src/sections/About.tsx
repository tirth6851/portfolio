import { profile } from '@/data/content'
import { SectionTitle } from '@/components/SectionTitle'
import { Reveal } from '@/components/Reveal'

const base = import.meta.env.BASE_URL

function TerminalWidget() {
  return (
    <div className="terminal">
      <div className="terminal-header">
        <span className="terminal-dot" style={{ background: '#ff5f57' }} />
        <span className="terminal-dot" style={{ background: '#febc2e' }} />
        <span className="terminal-dot" style={{ background: '#28c840' }} />
        <span className="ml-3 text-xs text-text-muted/50">~/tirth</span>
      </div>
      <div className="terminal-body">
        <div>
          <span className="terminal-prompt">$ </span>
          <span className="terminal-output">whoami</span>
        </div>
        <div className="terminal-output">&gt; tirth_patel</div>
        <div className="mt-2">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-output">cat stack.txt</span>
        </div>
        <div className="terminal-output">&gt; python, java, flask, postgresql</div>
        <div className="mt-2">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-output">cat role.txt</span>
        </div>
        <div className="terminal-output">&gt; cs_student, stem_teacher, builder</div>
        <div className="mt-2">
          <span className="terminal-prompt">$ </span>
          <span className="terminal-output">echo $STATUS</span>
        </div>
        <div className="terminal-output">
          &gt; open_to_fall_2026_internship
          <span className="terminal-cursor" />
        </div>
      </div>
    </div>
  )
}

export function About() {
  return (
    <section id="about" className="bg-bg-secondary/93 py-32">
      <div className="mx-auto max-w-[1200px] px-6 md:px-8">
        <SectionTitle label="about">Who I Am</SectionTitle>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          {/* Left — photo + terminal */}
          <Reveal variant="up" className="lg:col-span-2">
            <div className="space-y-5">
              <div className="relative">
                <img
                  src={`${base}${profile.photo}`}
                  alt="Portrait of Tirth Patel"
                  className="mx-auto h-44 w-44 rounded-2xl object-cover ring-2 ring-accent-secondary/20 shadow-[0_8px_32px_rgba(0,230,118,0.1)] lg:mx-0"
                />
                {/* Small available pulse overlay */}
                <span className="absolute -bottom-1.5 -right-1.5 lg:bottom-1 lg:right-auto lg:-left-1 flex h-4 w-4 items-center justify-center rounded-full bg-bg-secondary ring-2 ring-bg-secondary hidden lg:flex">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                </span>
              </div>
              <TerminalWidget />
            </div>
          </Reveal>

          {/* Right — bio */}
          <Reveal variant="up" delay={0.1} className="lg:col-span-3">
            <div className="space-y-6">
              <div className="space-y-4 text-text-secondary leading-8">
                <p>
                  I'm a Computer Science student at Cleveland State University (GPA 3.54) focused on
                  building real software — not just coursework. My work spans Python backends, Java
                  applications, and recommendation systems using NLP.
                </p>
                <p>
                  As a STEM Peer Teacher I explain hard problems simply every day, which shapes how I
                  write code: clear structure, good naming, no unnecessary complexity. I'm looking for a
                  Fall 2026 internship where I can ship real things from day one.
                </p>
              </div>

              {/* Stats row */}
              <div className="grid grid-cols-2 gap-4 pt-2 sm:grid-cols-4">
                {[
                  { value: '3.54', label: 'Cumulative GPA' },
                  { value: '10+', label: 'Java Projects' },
                  { value: '10', label: 'CS50P Problems' },
                  { value: 'F\'26', label: 'Available' },
                ].map(({ value, label }) => (
                  <div
                    key={label}
                    className="rounded-xl border border-accent-secondary/10 bg-bg-card/50 p-4 text-center backdrop-blur-sm"
                  >
                    <p className="text-2xl font-bold text-accent-secondary">{value}</p>
                    <p className="mt-1 text-xs text-text-muted">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
