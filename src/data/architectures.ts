/* ============================================================
   System graphs for the signature 3D scene and its DOM fallback.
   Every fact here is backed by docs/project-evidence.md
   (verified against repo HEADs on 2026-10-06).
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
    summary: 'Auth talks to Supabase directly; the Flask API fans requests out to TMDB, Jikan, and Groq.',
    nodes: [
      { id: 'client', label: 'Browser', kind: 'client', detail: 'Jinja2 templates with vanilla JavaScript.', position: [-4.4, 0, 0] },
      { id: 'auth', label: 'Supabase Auth', kind: 'security', detail: 'The browser signs in directly: Google OAuth, email/password, OTP, and MFA/TOTP.', position: [-3, 1.8, -1.2] },
      { id: 'api', label: 'Flask API', kind: 'api', detail: '27 JSON API routes and 10 server-rendered pages on Vercel. flask-limiter sets per-route limits from 5 per 15 minutes to 300 per hour.', position: [-2, -0.2, 0.2] },
      { id: 'pools', label: 'ThreadPool stages', kind: 'worker', detail: 'Two ThreadPoolExecutor stages (4 workers each) fetch genres, then recommendations; search fans out over 3 workers.', position: [0.4, 0.6, 0.8] },
      { id: 'sources', label: 'TMDB + Jikan v4', kind: 'external', detail: 'Movies and TV from TMDB; anime from Jikan v4 (MyAnimeList).', position: [2.6, 1.7, 0.2] },
      { id: 'recommender', label: 'Recommender', kind: 'service', detail: 'Weighted score: 40% frequency, 25% rating, 25% genre overlap, 10% quality; returns the top 24.', position: [2.6, -0.3, 0.6] },
      { id: 'db', label: 'Supabase PostgreSQL', kind: 'store', detail: 'Schema file defines 3 tables, 3 composite unique indexes, and 10 RLS policies; watched history seeds recommendations.', position: [4.5, -1.2, -0.4] },
      { id: 'llm', label: 'Groq LLM', kind: 'external', detail: 'llama-3.3-70b-versatile powers the AI chat endpoint.', position: [0.2, -1.9, -0.9] },
    ],
    edges: [
      { from: 'client', to: 'auth', label: 'sign in' },
      { from: 'client', to: 'api' },
      { from: 'api', to: 'pools', label: 'fan out' },
      { from: 'api', to: 'db', label: 'watched history' },
      { from: 'pools', to: 'sources' },
      { from: 'pools', to: 'recommender', label: 'candidates' },
      { from: 'api', to: 'llm', label: 'chat' },
    ],
  },
  {
    id: 'jwt-auth',
    project: 'Java JWT Authentication Service',
    summary: 'A stateless filter chain validates bearer tokens before any controller runs.',
    nodes: [
      { id: 'client', label: 'Client', kind: 'client', detail: 'Curl, Swagger, or the bundled Next.js front end.', position: [-4.6, 0, 0] },
      { id: 'filter', label: 'JWT Filter', kind: 'security', detail: 'Custom OncePerRequestFilter reads the Bearer token and sets the principal; stateless sessions, CSRF disabled.', position: [-3.1, 0.9, 0.4] },
      { id: 'limiter', label: 'Rate limiter', kind: 'security', detail: 'Bucket4j interceptors throttle each auth endpoint per client address.', position: [-1.6, -0.9, 0.4] },
      { id: 'controller', label: 'AuthController', kind: 'api', detail: 'Five endpoints: signup, login, refresh, logout, and me.', position: [0, 0.6, 0] },
      { id: 'service', label: 'AuthService', kind: 'service', detail: 'BCrypt hashing; unknown email and wrong password return the same 401.', position: [1.6, -0.5, 0.6] },
      { id: 'jwt', label: 'JwtUtil', kind: 'security', detail: 'HS256 access tokens via JJWT 0.12.5 with a one-hour TTL; startup guard rejects secrets under 32 characters.', position: [3.2, 1.4, -0.6] },
      { id: 'refresh', label: 'Refresh tokens', kind: 'service', detail: 'Seven-day rotating refresh tokens with reuse detection and optimistic locking.', position: [3.2, -1.5, -0.6] },
      { id: 'db', label: 'PostgreSQL / H2', kind: 'store', detail: 'PostgreSQL with Flyway migrations in production; H2 in development.', position: [4.7, 0, 0.2] },
    ],
    edges: [
      { from: 'client', to: 'filter' },
      { from: 'filter', to: 'limiter' },
      { from: 'limiter', to: 'controller' },
      { from: 'controller', to: 'service' },
      { from: 'service', to: 'jwt', label: 'access token' },
      { from: 'service', to: 'refresh', label: 'rotate' },
      { from: 'service', to: 'db' },
      { from: 'refresh', to: 'db' },
    ],
  },
  {
    id: 'complexitylab',
    project: 'ComplexityLab',
    summary: 'An LLM answers first; a deterministic engine takes over when it cannot.',
    nodes: [
      { id: 'editor', label: 'Monaco editor', kind: 'client', detail: 'Code input for 7 languages with 35 built-in templates (5 per language).', position: [-4.4, 0, 0] },
      { id: 'clerk', label: 'Clerk', kind: 'security', detail: 'Google OAuth only; middleware protects the signed-in routes.', position: [-2.4, 1.7, -1] },
      { id: 'route', label: 'POST /api/analyze', kind: 'api', detail: 'Checks auth, validates input, applies a per-user rate limit, then calls the analysis provider.', position: [-2.2, -0.1, 0.2] },
      { id: 'groq', label: 'Groq LLM', kind: 'external', detail: 'Temperature 0 with structured JSON output.', position: [0.4, 1.3, 0.6] },
      { id: 'heuristic', label: 'Heuristic engine', kind: 'service', detail: 'Deterministic fallback on a missing key, bad JSON, or error: loop nesting, recursion branching, memoization.', position: [0.4, -1.4, 0] },
      { id: 'classes', label: 'Complexity class', kind: 'service', detail: 'Classifies into 8 classes, from O(1) through O(n!).', position: [2.7, 0, 0] },
      { id: 'db', label: 'Supabase', kind: 'store', detail: 'PostgreSQL with RLS enabled on 9 tables; JSONB analysis results and saved snippets.', position: [4.5, -0.4, -0.4] },
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
    summary: 'Three job sources are normalized and stored, then scored on eight factors and tiered by fit.',
    nodes: [
      { id: 'sources', label: 'Adzuna · SerpApi · USAJobs', kind: 'external', detail: 'Three job APIs, fetched in sequence; a source is skipped when its API key is missing.', position: [-4.5, 0.4, 0] },
      { id: 'ingest', label: 'Ingest route', kind: 'api', detail: 'POST /api/jobs/ingest fetches, deduplicates, and normalizes listings.', position: [-2.5, 0.4, 0] },
      { id: 'signals', label: 'Sponsorship signals', kind: 'service', detail: 'Phrase detection across 31 signals (16 risky, 15 positive) returning Risky, Better, or Unclear.', position: [-0.6, 1.7, -0.8] },
      { id: 'db', label: 'Supabase', kind: 'store', detail: 'PostgreSQL with RLS on 10 tables, including raw and normalized jobs and ingestion runs.', position: [-0.4, -0.9, 0.6] },
      { id: 'scorer', label: 'Scoring engine', kind: 'service', detail: '8 factors, score clamped to 100: authorization 30, skills 22, sponsorship history 18, location 10, industry 8, discipline 7, role family 5, experience +5.', position: [2, 0.4, 0] },
      { id: 'tiers', label: 'Fit tiers', kind: 'service', detail: 'Realistic (75+), Stretch (50–74), Low-Fit (under 50) with match reasons and warning flags.', position: [4.3, 0.4, 0] },
      { id: 'llm', label: 'Groq LLM', kind: 'external', detail: 'Writes career strategy (temperature 0.4) with a deterministic fallback; it does not rank jobs.', position: [2.2, -1.8, -1] },
    ],
    edges: [
      { from: 'sources', to: 'ingest' },
      { from: 'ingest', to: 'signals', label: 'detect' },
      { from: 'signals', to: 'db', label: 'persist' },
      { from: 'db', to: 'scorer' },
      { from: 'scorer', to: 'tiers' },
      { from: 'scorer', to: 'llm', label: 'strategy' },
    ],
  },
]
