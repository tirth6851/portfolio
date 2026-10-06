/* ============================================================
   Single source of truth for all portfolio content.
   ============================================================ */

export const profile = {
  name: 'Tirth Patel',
  email: 't.patel76@vikes.csohio.edu',
  github: 'https://github.com/tirth6851',
  githubLabel: 'github.com/tirth6851',
  linkedin: 'https://www.linkedin.com/in/tirthm2093',
  linkedinLabel: 'linkedin.com/in/tirthm2093',
  location: 'Cleveland, Ohio, United States',
  resume: 'resume.pdf',
  photo: 'me-pic.jpeg',
}

export interface Stat {
  /** Numeric target the counter animates toward. */
  value: number
  /** Decimal places to render (for GPA). */
  decimals?: number
  suffix?: string
  prefix?: string
  label: string
}

export const stats: Stat[] = [
  { value: 3.52, decimals: 2, label: 'Cumulative GPA' },
  { value: 7, label: 'Projects Built' },
  { value: 4, label: 'Live Deployments' },
  { value: 800, suffix: '+', label: 'Automated Tests' },
]

export interface Project {
  title: string
  /** Top projects get a full case study and a scene in the Systems stage. */
  featured: boolean
  status?: 'In progress'
  tags: string[]
  details: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    title: 'ComplexityLab',
    featured: true,
    tags: ['Next.js', 'TypeScript', 'React', 'Supabase', 'Clerk', 'Groq', 'Vitest'],
    details: [
      'Full-stack Big-O code complexity analyzer for 7 languages (TypeScript, JavaScript, Python, Java, Go, Rust, C++) classifying 8 complexity classes (O(1) through O(n!)) with 35 built-in code templates and per-user history.',
      'Dual-engine analysis pipeline: Groq LLM (temperature 0, structured JSON) with automatic fallback to a deterministic heuristic engine detecting loop nesting, recursion branching, and memoization.',
      '59 Vitest test files with 570+ test cases (Testing Library); Clerk v7 auth (Google OAuth only), Supabase PostgreSQL with RLS enabled on 9 tables, 33 pages and 3 API routes; also an AI chat tutor with keyword retrieval and a Judge0 code playground.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://complexity-lab-eight.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/ComplexityLab' },
    ],
  },
  {
    title: 'AI Guardrail',
    featured: true,
    tags: ['Python', 'FastAPI', 'scikit-learn', 'Groq', 'pytest'],
    details: [
      'Layered prompt-safety pipeline: input normalization and decoding (unicode folding, leetspeak, zero-width stripping, base64 and hex), a banned-word filter, an intent-gated weapons backstop, injection heuristics, and a TF-IDF plus logistic regression input classifier.',
      'Groq llama-3.3-70b-versatile call checked by an output classifier and PII redaction (email, SSN, credit card, phone, IP address); a model failure returns an explicit error decision instead of an answer.',
      'FastAPI service with 4 routes, API-key tenants, per-tenant rate limiting, repeat-offender escalation, and multi-turn session lockout after 3 flagged turns; 63 declared pytest tests and a regression gate with protected anchor cases. Evaluated and rejected a DistilBERT classifier because it regressed a protected case.',
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tirth6851/AI_Guardrail' }],
  },
  {
    title: 'Java JWT Authentication Service',
    featured: true,
    status: 'In progress',
    tags: ['Java 17', 'Spring Boot', 'Spring Security', 'JJWT', 'JUnit 5', 'Mockito', 'Testcontainers', 'Flyway'],
    details: [
      'Stateless JWT REST API with five endpoints (signup, login, refresh, logout, me): BCrypt hashing, HS256 access tokens (JJWT 0.12.5), rotating refresh tokens with reuse detection, Bucket4j rate limiting, and a custom OncePerRequestFilter; uniform 401 for wrong-password and unknown-email.',
      '75 automated tests across 8 files (JUnit 5, Mockito, MockMvc, Testcontainers): 40 MockMvc integration tests over the HTTP contract, plus unit tests for JWT handling, the auth filter, refresh tokens, and the service layer. PostgreSQL with Flyway migrations in production, H2 in development, GitHub Actions CI.',
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/auth-service-java' },
    ],
  },
  {
    title: 'Blackbox Council',
    featured: true,
    status: 'In progress',
    tags: ['Python', 'FastAPI', 'Pydantic', 'SQLAlchemy', 'Next.js', 'TypeScript', 'Playwright', 'pytest'],
    details: [
      'Pre-action policy gate for AI agents: a FastAPI backend runs a four-pass council (planner, red team, privacy, arbiter) plus five controlled prompt-perturbation tests, while a deterministic policy engine, not the model, decides the enforced outcome.',
      'Direct deletion is blocked by policy; the safe path is a bounded archive simulation that needs human approval bound to a hash of the exact action, a dry-run manifest, a backup manifest, and a 30-day recovery window. Untrusted repository text is treated as data, so an embedded override instruction is flagged and cannot change the outcome.',
      '74 backend pytest tests and 6 Playwright end-to-end tests with a three-job GitHub Actions CI. Built in two days for a hackathon; runs in mock mode, and the live model integration is implemented but not yet verified.',
    ],
    links: [{ label: 'View on GitHub', href: 'https://github.com/tirth6851/blackbox-council' }],
  },
  {
    title: 'WatchNextAI',
    featured: true,
    tags: ['Python', 'Flask', 'Supabase', 'PostgreSQL', 'Vercel', 'Groq', 'TMDB API', 'Jikan API'],
    details: [
      'Full-stack media discovery platform: 27 JSON API routes plus 10 server-rendered pages over movies, TV, and anime (TMDB + Jikan v4); deployed on Vercel with Supabase Auth supporting Google OAuth, OTP, and MFA/TOTP.',
      'Content-based recommendation engine: two ThreadPoolExecutor stages (4 workers each) feed a weighted score of 40% frequency, 25% rating, 25% genre overlap, and 10% quality; search fans out across TMDB movies, TMDB TV, and Jikan in parallel.',
      'Groq LLM (llama-3.3-70b-versatile) AI chat; Supabase schema with 3 tables, 3 composite unique indexes, and 10 RLS policies; per-route flask-limiter limits from 5 per 15 minutes to 300 per hour; 7 smoke tests.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://watchnextai-orpin.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/watchnextai' },
    ],
  },
  {
    title: 'SponsorScout AI',
    featured: false,
    tags: ['Next.js', 'TypeScript', 'React', 'Supabase', 'Groq', 'Framer Motion'],
    details: [
      'Visa-aware job-matching platform with an 8-factor scoring algorithm capped at 100 (authorization compatibility 30 pts, skills overlap 22 pts, sponsorship history 18 pts) classifying roles into Realistic/Stretch/Low-Fit tiers.',
      'Multi-source ingestion pipeline from Adzuna, SerpApi (Google Jobs), and USAJobs; sponsorship signal detection across 31 phrases (16 risky, 15 positive); listings deduplicated and normalized into Supabase PostgreSQL with RLS across 10 tables.',
      'Groq LLM (llama-3.3-70b-versatile) for AI career strategy generation with a deterministic fallback; Supabase Auth for user profiles and saved opportunities.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://sponsorscout-ai.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/sponsorscout-ai' },
    ],
  },
  {
    title: 'MarkItDown Web',
    featured: false,
    tags: ['Python', 'Flask', 'MarkItDown', 'Pillow', 'Tailwind CSS', 'Vercel'],
    details: [
      'Document-to-Markdown web tool: a Flask backend wraps the Microsoft MarkItDown library to convert uploaded PDF, Word, PowerPoint, and Excel files, or pasted text and HTML, into Markdown.',
      'Two conversion endpoints (file upload and pasted content) with a 50 MB upload limit set in the Flask config and a Pillow-based image handler that returns format, dimensions, and EXIF metadata; single-page drag-and-drop interface with copy and save-as-.md, deployed on Vercel.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://markitdown-web-rho.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/markitdown-web' },
    ],
  },
]

export interface Experience {
  role: string
  company: string
  date: string
  bullets: string[]
}

export const experiences: Experience[] = [
  {
    role: 'STEM Peer Teacher — Precalculus I (MTH 167)',
    company: 'Cleveland State University',
    date: 'August 2025 – Present',
    bullets: [
      'Competitively selected to provide instructional support for Precalculus I, serving approximately 30 students per session.',
      'Diagnosed comprehension gaps across student cohorts and adapted practice activities based on participation patterns to improve concept retention.',
      'Translated abstract concepts — algebra, trigonometry, functions — into structured problem-solving frameworks for students from varied learning backgrounds.',
      'Maintained weekly session documentation covering learning objectives, topic coverage, and student response trends.',
    ],
  },
  {
    role: 'Operations Assistant',
    company: 'CENTERS Recreation Center, Cleveland State University',
    date: 'January 2026 – Present',
    bullets: [
      'Supported 100+ members per shift by maintaining facility operations, enforcing safety protocols, and responding to incidents including injury response procedures.',
      'Delivered customer service across reception and member inquiry functions, maintaining positive experience under high-traffic conditions.',
      'Coordinated with operations supervisors on daily administrative tasks and facility operational efficiency.',
    ],
  },
]

export interface Skill {
  name: string
  /** Primary = use in every project · Familiar = know and have used · Learning = currently building */
  tier: 'Primary' | 'Familiar' | 'Learning'
}

export interface SkillCategory {
  title: string
  skills: Skill[]
}

export const skillCategories: SkillCategory[] = [
  {
    title: 'Languages',
    skills: [
      { name: 'Python', tier: 'Primary' },
      { name: 'Java', tier: 'Primary' },
      { name: 'TypeScript', tier: 'Primary' },
      { name: 'JavaScript', tier: 'Familiar' },
      { name: 'SQL', tier: 'Familiar' },
    ],
  },
  {
    title: 'Frameworks & Libraries',
    skills: [
      { name: 'Flask', tier: 'Primary' },
      { name: 'Spring Boot', tier: 'Familiar' },
      { name: 'Next.js', tier: 'Familiar' },
      { name: 'React', tier: 'Familiar' },
      { name: 'Tailwind CSS', tier: 'Familiar' },
      { name: 'Framer Motion', tier: 'Familiar' },
    ],
  },
  {
    title: 'Databases & Cloud',
    skills: [
      { name: 'PostgreSQL', tier: 'Primary' },
      { name: 'Supabase', tier: 'Familiar' },
      { name: 'Vercel', tier: 'Familiar' },
    ],
  },
  {
    title: 'Testing & Tools',
    skills: [
      { name: 'Git', tier: 'Primary' },
      { name: 'GitHub', tier: 'Primary' },
      { name: 'JUnit 5', tier: 'Familiar' },
      { name: 'Mockito', tier: 'Familiar' },
      { name: 'Vitest', tier: 'Familiar' },
      { name: 'Testing Library', tier: 'Familiar' },
      { name: 'pytest', tier: 'Familiar' },
    ],
  },
  {
    title: 'APIs & Services',
    skills: [
      { name: 'Groq API', tier: 'Familiar' },
      { name: 'Clerk', tier: 'Familiar' },
      { name: 'TMDB API', tier: 'Familiar' },
      { name: 'Jikan API', tier: 'Familiar' },
    ],
  },
]

export const navItems = [
  { id: 'projects', label: 'Projects' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'stack', label: 'Stack' },
  { id: 'contact', label: 'Contact' },
]
