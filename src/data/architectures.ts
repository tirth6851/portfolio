/* ============================================================
   System graphs for the signature 3D scene and its DOM fallback.
   Facts here must stay in sync with docs/project-evidence.md.
   Layout units are abstract: x = request flow (left→right),
   y = vertical offset, z = depth layer.
   ============================================================ */

export type NodeKind = 'client' | 'api' | 'service' | 'worker' | 'store' | 'external' | 'security'

export interface ArchNode {
  id: string
  label: string
  kind: NodeKind
  detail: string
  position: [number, number, number]
}

export interface ArchEdge {
  from: string
  to: string
  label?: string
  /** Path taken only when the primary path fails. */
  fallback?: boolean
}

export interface ArchGraph {
  id: string
  project: string
  summary: string
  nodes: ArchNode[]
  edges: ArchEdge[]
}

export const architectures: ArchGraph[] = [
  {
    id: 'watchnextai',
    project: 'WatchNextAI',
    summary: 'A request fans out across concurrent worker pools before scoring and persistence.',
    nodes: [
      { id: 'client', label: 'Browser', kind: 'client', detail: 'Jinja2 templates with vanilla JavaScript.', position: [-4.2, 0, 0] },
      { id: 'api', label: 'Flask API', kind: 'api', detail: '37 REST endpoints; flask-limiter throttles routes from 20 to 300 requests per hour.', position: [-2.1, 0, 0] },
      { id: 'auth', label: 'Supabase Auth', kind: 'security', detail: 'Google OAuth, email/password, OTP, and MFA/TOTP.', position: [-2.1, 1.7, -1.2] },
      { id: 'pools', label: 'ThreadPool ×2', kind: 'worker', detail: 'Two concurrent pools (max 4 workers each) parallelize TMDB calls; global search fans out over 3 workers.', position: [0, 0.2, 0.8] },
      { id: 'sources', label: 'TMDB + Jikan v4', kind: 'external', detail: 'Movies and TV from TMDB; anime from Jikan v4 (MyAnimeList).', position: [2.2, 1.4, 1.2] },
      { id: 'recommender', label: 'Recommender', kind: 'service', detail: 'Weighted scoring: 40% frequency, 25% rating, 25% genre overlap, 10% quality.', position: [2.2, -0.2, 0] },
      { id: 'db', label: 'PostgreSQL', kind: 'store', detail: 'Supabase schema with 3 tables, 3 composite unique indexes, and 10 RLS policies.', position: [4.2, -1.3, -0.6] },
      { id: 'llm', label: 'Groq LLM', kind: 'external', detail: 'llama-3.3-70b-versatile powers the AI chat feature.', position: [0, -1.9, -1.2] },
    ],
    edges: [
      { from: 'client', to: 'api' },
      { from: 'api', to: 'auth', label: 'verify session' },
      { from: 'api', to: 'pools', label: 'fan out' },
      { from: 'pools', to: 'sources' },
      { from: 'pools', to: 'recommender', label: 'candidates' },
      { from: 'recommender', to: 'db' },
      { from: 'api', to: 'llm', label: 'chat' },
    ],
  },
  {
    id: 'jwt-auth',
    project: 'Java JWT Authentication Service',
    summary: 'A stateless filter chain validates bearer tokens before any controller runs.',
    nodes: [
      { id: 'client', label: 'Client', kind: 'client', detail: 'Calls POST /auth/signup, POST /auth/login, then sends Bearer tokens.', position: [-4, 0, 0] },
      { id: 'filter', label: 'JWT Filter', kind: 'security', detail: 'Custom OncePerRequestFilter validates Bearer tokens; stateless sessions, CSRF disabled.', position: [-2, 0, 0] },
      { id: 'controller', label: 'AuthController', kind: 'api', detail: 'Two endpoints: signup and login.', position: [0, 0, 0] },
      { id: 'service', label: 'AuthService', kind: 'service', detail: 'BCrypt hashing; returns an identical 401 for wrong password and unknown email.', position: [2, 0.4, 0.6] },
      { id: 'jwt', label: 'JwtUtil', kind: 'security', detail: 'HS256 via JJWT 0.12.5; one-hour expiry; startup guard rejects secrets under 32 characters.', position: [2, 1.8, -0.8] },
      { id: 'db', label: 'H2 (in-memory)', kind: 'store', detail: 'In-memory database; emails are lowercased before storage.', position: [4, -0.4, 0] },
    ],
    edges: [
      { from: 'client', to: 'filter' },
      { from: 'filter', to: 'controller' },
      { from: 'controller', to: 'service' },
      { from: 'service', to: 'jwt', label: 'issue token' },
      { from: 'service', to: 'db' },
    ],
  },
  {
    id: 'complexitylab',
    project: 'ComplexityLab',
    summary: 'An LLM answers first; a deterministic engine takes over when it cannot.',
    nodes: [
      { id: 'editor', label: 'Monaco editor', kind: 'client', detail: 'Code input for 7 languages with 18 built-in templates.', position: [-4.2, 0, 0] },
      { id: 'clerk', label: 'Clerk', kind: 'security', detail: 'Google OAuth only; middleware guards the protected routes.', position: [-2.1, 1.6, -1] },
      { id: 'route', label: 'Next.js route', kind: 'api', detail: 'Analysis endpoint orchestrating the dual-engine pipeline.', position: [-2.1, 0, 0] },
      { id: 'groq', label: 'Groq LLM', kind: 'external', detail: 'Temperature 0, structured JSON output, 20-second timeout.', position: [0.4, 1.2, 0.6] },
      { id: 'heuristic', label: 'Heuristic engine', kind: 'service', detail: 'Deterministic fallback detecting loop nesting, recursion branching, memoization, and halving patterns.', position: [0.4, -1.3, 0] },
      { id: 'classes', label: 'Complexity class', kind: 'service', detail: 'Classifies into 7 Big-O classes, O(1) through O(2ⁿ).', position: [2.6, 0, 0] },
      { id: 'db', label: 'Supabase', kind: 'store', detail: 'PostgreSQL with RLS; JSONB analysis results and saved snippets.', position: [4.4, -0.4, -0.4] },
    ],
    edges: [
      { from: 'editor', to: 'route' },
      { from: 'route', to: 'clerk', label: 'auth' },
      { from: 'route', to: 'groq', label: 'primary' },
      { from: 'route', to: 'heuristic', label: 'on failure', fallback: true },
      { from: 'groq', to: 'classes' },
      { from: 'heuristic', to: 'classes', fallback: true },
      { from: 'classes', to: 'db' },
    ],
  },
  {
    id: 'sponsorscout',
    project: 'SponsorScout AI',
    summary: 'Three job sources are normalized, scored on eight factors, and tiered by fit.',
    nodes: [
      { id: 'sources', label: 'Adzuna · SerpApi · USAJobs', kind: 'external', detail: 'Three job APIs feed one ingestion route.', position: [-4.4, 0.4, 0] },
      { id: 'ingest', label: 'Ingest route', kind: 'api', detail: 'Next.js API route that fetches, normalizes, and deduplicates listings.', position: [-2.2, 0.4, 0] },
      { id: 'signals', label: 'Sponsorship signals', kind: 'service', detail: 'Phrase detection across 33 signals (17 risky, 16 positive) returning Risky, Better, or Unclear.', position: [-0.2, 1.7, -0.8] },
      { id: 'db', label: 'Supabase', kind: 'store', detail: 'PostgreSQL with RLS holding profiles, opportunities, and ingestion runs.', position: [-0.2, -0.9, 0.6] },
      { id: 'scorer', label: 'Scoring engine', kind: 'service', detail: '8-factor, 100-point algorithm: authorization 30, skills 22, sponsorship history 18, plus five more factors.', position: [2.2, 0.4, 0] },
      { id: 'tiers', label: 'Fit tiers', kind: 'service', detail: 'Realistic (75+), Stretch (50–74), Low-Fit (under 50) with match reasons and warnings.', position: [4.2, 0.4, 0] },
      { id: 'llm', label: 'Groq LLM', kind: 'external', detail: 'Generates career strategy text; it does not rank jobs.', position: [2.2, -1.8, -1] },
    ],
    edges: [
      { from: 'sources', to: 'ingest' },
      { from: 'ingest', to: 'signals' },
      { from: 'ingest', to: 'db', label: 'persist' },
      { from: 'signals', to: 'scorer' },
      { from: 'db', to: 'scorer' },
      { from: 'scorer', to: 'tiers' },
      { from: 'scorer', to: 'llm', label: 'strategy' },
    ],
  },
]
