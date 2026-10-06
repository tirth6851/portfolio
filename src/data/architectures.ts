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
    id: 'complexitylab',
    project: 'ComplexityLab',
    summary: 'An LLM answers first; a deterministic engine takes over when it cannot.',
    nodes: [
      { id: 'editor', label: 'Monaco editor', kind: 'client', detail: 'Code input for 7 languages with 35 built-in templates (5 per language).', position: [-4.6, 0.8, 0] },
      { id: 'clerk', label: 'Clerk', kind: 'security', detail: 'Google OAuth only; middleware protects the signed-in routes.', position: [-2.6, 2.0, -1] },
      { id: 'route', label: 'POST /api/analyze', kind: 'api', detail: 'Checks auth, validates input, applies a per-user rate limit, then calls the analysis provider.', position: [-2.2, -0.6, 0.2] },
      { id: 'groq', label: 'Groq LLM', kind: 'external', detail: 'Temperature 0 with structured JSON output.', position: [0.2, 1.5, 0.6] },
      { id: 'heuristic', label: 'Heuristic engine', kind: 'service', detail: 'Deterministic fallback on a missing key, bad JSON, or error: loop nesting, recursion branching, memoization.', position: [0.2, -1.7, 0] },
      { id: 'classes', label: 'Complexity class', kind: 'service', detail: 'Classifies into 8 classes, from O(1) through O(n!).', position: [2.5, 0, 0] },
      { id: 'db', label: 'Supabase', kind: 'store', detail: 'PostgreSQL with RLS enabled on 9 tables; JSONB analysis results and saved snippets.', position: [4.6, -1.0, -0.4] },
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
    id: 'ai-guardrail',
    project: 'AI Guardrail',
    summary: 'Input is normalized and screened in layers before the model runs, then its output is checked and redacted.',
    nodes: [
      { id: 'client', label: 'CLI / API client', kind: 'client', detail: 'Two entry points: a CLI (with a no-model mode and a chat REPL) and a FastAPI service.', position: [-4.7, 0.2, 0] },
      { id: 'auth', label: 'API gate', kind: 'security', detail: 'X-API-Key tenant auth, prompt size limit, repeat-offender escalation, and per-tenant rate limiting (401, 403, 413, 429).', position: [-3.0, -1.4, 0.2] },
      { id: 'session', label: 'Session lock', kind: 'security', detail: 'Chat path: per-turn and cross-turn manipulation checks over the last 6 turns; the session locks after 3 flagged turns.', position: [-3.2, 1.9, -0.8] },
      { id: 'normalize', label: 'Normalizer', kind: 'service', detail: 'Unicode folding, leetspeak, zero-width stripping, and base64 or hex decoding produce text variants to screen.', position: [-1.3, 0.3, 0.2] },
      { id: 'filters', label: 'Filters', kind: 'security', detail: 'Banned-word filter, intent-gated weapons backstop, and injection heuristics; an unsafe hit short-circuits the pipeline.', position: [0.4, -1.2, 0.2] },
      { id: 'classifier', label: 'Input classifier', kind: 'service', detail: 'TF-IDF and logistic regression; flags unsafe at a 0.30 threshold.', position: [1.7, 0.9, 0.2] },
      { id: 'model', label: 'Groq LLM', kind: 'external', detail: 'llama-3.3-70b-versatile. A model failure returns an explicit error decision; the error text is never used as an answer.', position: [3.2, -0.6, -0.4] },
      { id: 'output', label: 'Output check', kind: 'service', detail: 'Output classifier (unsafe at 0.50), then PII redaction for email, SSN, credit card, phone, and IP address.', position: [4.6, 1.2, 0] },
    ],
    edges: [
      { from: 'client', to: 'auth' },
      { from: 'client', to: 'session', label: 'chat' },
      { from: 'auth', to: 'normalize' },
      { from: 'session', to: 'normalize' },
      { from: 'normalize', to: 'filters' },
      { from: 'filters', to: 'classifier' },
      { from: 'classifier', to: 'model' },
      { from: 'model', to: 'output' },
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
      { id: 'controller', label: 'AuthController', kind: 'api', detail: 'Five endpoints: signup, login, refresh, logout, and me.', position: [0, 0.7, 0] },
      { id: 'service', label: 'AuthService', kind: 'service', detail: 'BCrypt hashing; unknown email and wrong password return the same 401.', position: [2.0, -0.8, 0.6] },
      { id: 'jwt', label: 'JwtUtil', kind: 'security', detail: 'HS256 access tokens via JJWT 0.12.5 with a one-hour TTL; startup guard rejects secrets under 32 characters.', position: [3.7, 1.3, -0.6] },
      { id: 'refresh', label: 'Refresh tokens', kind: 'service', detail: 'Seven-day rotating refresh tokens with reuse detection and optimistic locking.', position: [3.7, -1.8, -0.6] },
      { id: 'db', label: 'PostgreSQL / H2', kind: 'store', detail: 'PostgreSQL with Flyway migrations in production; H2 in development.', position: [4.4, -0.2, 0.2] },
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
    id: 'blackbox-council',
    project: 'Blackbox Council',
    summary: 'A council of model passes proposes; deterministic policy rules decide; a human approves the exact action.',
    nodes: [
      { id: 'web', label: 'Next.js UI', kind: 'client', detail: 'Task form and report view. A same-origin proxy attaches the operator credential only after a signed session cookie and origin check.', position: [-4.6, 0.5, 0] },
      { id: 'api', label: 'FastAPI', kind: 'api', detail: 'Evaluation routes: create, report, approve, execute, and rollback, plus health. Approve, execute, and rollback require an operator credential.', position: [-2.4, -0.6, 0.2] },
      { id: 'council', label: 'Council', kind: 'service', detail: 'Four passes (planner, red team, privacy, arbiter) plus five controlled prompt-perturbation tests.', position: [-0.2, 0.9, 0.4] },
      { id: 'provider', label: 'Model provider', kind: 'external', detail: 'Budgeted client with per-run and daily call caps, retries, and typed failures. Mock mode uses a scripted provider; the live Nebius path is implemented but unverified.', position: [-0.4, -1.9, -0.6] },
      { id: 'policy', label: 'Policy engine', kind: 'security', detail: 'Pure deterministic rules for shell payloads, file deletion, scope, secrets, network, authorization, legal holds, and untrusted text. Model output never sets the outcome.', position: [2.3, -0.4, 0.2] },
      { id: 'gate', label: 'Human approval', kind: 'security', detail: 'Approval is bound to a hash of the exact action, followed by a simulated archive execution and rollback.', position: [4.5, 0.9, 0] },
      { id: 'db', label: 'SQLite', kind: 'store', detail: 'Run history stored through SQLAlchemy.', position: [4.5, -1.6, -0.4] },
    ],
    edges: [
      { from: 'web', to: 'api' },
      { from: 'api', to: 'council', label: 'evaluate' },
      { from: 'council', to: 'provider', label: 'prompts' },
      { from: 'council', to: 'policy', label: 'candidates' },
      { from: 'policy', to: 'gate', label: 'decision' },
      { from: 'gate', to: 'db', label: 'record' },
    ],
  },
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
      { id: 'db', label: 'Supabase PostgreSQL', kind: 'store', detail: 'Schema file defines 3 tables, 3 composite unique indexes, and 10 RLS policies; watched history seeds recommendations.', position: [4.3, -1.2, -0.4] },
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
]
