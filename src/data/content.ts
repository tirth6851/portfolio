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
  { value: 4, label: 'Projects Shipped' },
  { value: 47, label: 'Automated Tests' },
  { value: 2026, label: 'Available — Fall' },
]

export interface Project {
  title: string
  tags: string[]
  details: string[]
  links: { label: string; href: string }[]
}

export const projects: Project[] = [
  {
    title: 'WatchNextAI',
    tags: ['Python', 'Flask', 'Supabase', 'PostgreSQL', 'Vercel', 'Groq', 'TMDB API', 'Jikan API'],
    details: [
      'Full-stack media discovery platform with 37 REST endpoints across movies, TV, and anime (TMDB + Jikan v4); deployed on Vercel with Supabase Auth supporting Google OAuth, OTP, and MFA/TOTP.',
      'Content-based recommendation engine using two concurrent ThreadPoolExecutor pools (max 4 workers each); weighted scoring: 40% frequency, 25% rating, 25% genre overlap, 10% quality.',
      'Groq LLM (llama-3.3-70b-versatile) AI chat; Supabase schema with 3 tables, 3 composite unique indexes, 10 RLS policies; flask-limiter rate limits (20–300 req/hr by route sensitivity).',
    ],
    links: [
      { label: 'Live Demo', href: 'https://watchnextai-orpin.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/watchnextai' },
    ],
  },
  {
    title: 'Java JWT Authentication Service',
    tags: ['Java 17', 'Spring Boot', 'Spring Security', 'JJWT', 'JUnit 5', 'Mockito'],
    details: [
      'Stateless JWT REST API with BCrypt hashing, HS256 token issuance (JJWT 0.12.5), and a custom Spring Security OncePerRequestFilter; enforced user-enumeration resistance via uniform 401 for wrong-password and unknown-email.',
      '17 automated tests across 3 files: 8 JwtUtil unit tests (token generation, claims, expiry, startup secret validation), 5 Mockito service tests, and 4 MockMvc integration tests covering the full HTTP contract.',
    ],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/auth-service-java' },
    ],
  },
  {
    title: 'ComplexityLab',
    tags: ['Next.js', 'TypeScript', 'React', 'Supabase', 'Clerk', 'Groq', 'Vitest'],
    details: [
      'Full-stack Big-O code complexity analyzer for 7 languages (TypeScript, JavaScript, Python, Java, Go, Rust, C++) classifying 7 complexity classes (O(1) through O(2ⁿ)) with 18 built-in code templates and per-user history.',
      'Dual-engine analysis pipeline: Groq LLM (temperature 0, structured JSON) with automatic fallback to a deterministic heuristic engine detecting loop nesting, recursion branching, and memoization.',
      '30-test suite (Vitest + Testing Library); Clerk v7 auth (Google OAuth only), Supabase PostgreSQL with RLS across 3 tables, 14 app routes.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://complexity-lab-eight.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/ComplexityLab' },
    ],
  },
  {
    title: 'SponsorScout AI',
    tags: ['Next.js', 'TypeScript', 'React', 'Supabase', 'Groq', 'Framer Motion'],
    details: [
      'Visa-aware job-matching platform with an 8-factor, 100-point scoring algorithm (authorization compatibility 30 pts, skills overlap 22 pts, sponsorship history 18 pts) classifying roles into Realistic/Stretch/Low-Fit tiers.',
      'Multi-source ingestion pipeline from Adzuna, SerpApi (Google Jobs), and USAJobs; sponsorship signal detection across 33 phrases; listings normalized into Supabase PostgreSQL with RLS across 7 relational tables.',
      'Groq LLM (llama-3.3-70b-versatile) for AI career strategy generation; Supabase Auth for user profiles and saved opportunities.',
    ],
    links: [
      { label: 'Live Demo', href: 'https://sponsorscout-ai.vercel.app/' },
      { label: 'View on GitHub', href: 'https://github.com/tirth6851/sponsorscout-ai' },
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
  {
    role: 'OpSTEM Representative & Billiards Club Secretary',
    company: 'Cleveland State University',
    date: '2024 – Present',
    bullets: [
      'Promote STEM engagement and support events for underrepresented students in technology.',
      'Coordinate Billiards Club communication, meeting logistics, and event planning as Club Secretary.',
      'Build leadership, organization, and teamwork skills through campus involvement.',
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
      { name: 'pytest', tier: 'Familiar' },
    ],
  },
]

export const navItems = [
  { id: 'about', label: 'About' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'contact', label: 'Contact' },
]
