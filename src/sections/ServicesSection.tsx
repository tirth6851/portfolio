import { FadeIn } from '@/components/FadeIn';

const services = [
  {
    num: '01',
    name: 'Full Stack Development',
    desc: 'End-to-end web applications built with Python/Flask, Next.js, and React — from REST API design to polished, responsive frontends deployed on Vercel.',
  },
  {
    num: '02',
    name: 'Backend Engineering',
    desc: 'Scalable server-side systems using Java Spring Boot and Python, with stateless JWT auth, rate limiting, and production-grade security patterns.',
  },
  {
    num: '03',
    name: 'AI Integration',
    desc: 'LLM-powered features using Groq (llama-3.3-70b) — recommendation engines, AI chat, automated analysis pipelines, and structured JSON inference.',
  },
  {
    num: '04',
    name: 'Database Design',
    desc: 'PostgreSQL schema design with Supabase, row-level security policies, composite indexes, and multi-table relational models built for scale.',
  },
  {
    num: '05',
    name: 'API Development',
    desc: 'Clean, documented REST APIs with multi-source data ingestion, OAuth & OTP auth flows, and thorough automated test coverage (JUnit 5, pytest, Vitest).',
  },
];

export function ServicesSection() {
  return (
    <section
      id="skills"
      className="rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32"
      style={{ backgroundColor: '#FFFFFF' }}
    >
      <h2
        className="font-black uppercase text-center text-[#0C0C0C] mb-16 sm:mb-20 md:mb-28"
        style={{ fontSize: 'clamp(3rem, 12vw, 160px)' }}
      >
        Skills
      </h2>

      <div className="max-w-5xl mx-auto">
        {services.map((service, i) => (
          <FadeIn key={service.num} delay={i * 0.1}>
            <div
              className="flex items-start gap-6 md:gap-10 py-8 sm:py-10 md:py-12"
              style={{
                borderTop: '1px solid rgba(12, 12, 12, 0.15)',
                borderBottom: i === services.length - 1 ? '1px solid rgba(12, 12, 12, 0.15)' : 'none',
              }}
            >
              <span
                className="font-black text-[#0C0C0C] leading-none flex-shrink-0"
                style={{ fontSize: 'clamp(3rem, 10vw, 140px)' }}
              >
                {service.num}
              </span>
              <div className="flex flex-col justify-center pt-2">
                <h3
                  className="font-medium uppercase text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(1rem, 2.2vw, 2.1rem)' }}
                >
                  {service.name}
                </h3>
                <p
                  className="font-light leading-relaxed max-w-2xl text-[#0C0C0C]"
                  style={{ fontSize: 'clamp(0.85rem, 1.6vw, 1.25rem)', opacity: 0.6, marginTop: '0.5rem' }}
                >
                  {service.desc}
                </p>
              </div>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
