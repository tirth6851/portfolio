/* ============================================================
   Explainer content for the "tap a component" drill-down.
   Every fact must come from docs/project-evidence.md or
   docs/new-repos-evidence.md (cited in `sources`). Visuals that
   only illustrate a concept are labeled as illustrative in the UI.
   Keys are `${graphId}:${nodeId}`.
   ============================================================ */

export interface Fact {
  label: string
  value: string
}

interface Base {
  /** Where the facts come from (shown to the reader). */
  sources: string[]
  /** Verified facts shown beside the visual. */
  facts: Fact[]
  /** One honest caveat, if any. */
  caveat?: string
}

export type ExplainerSpec = Base &
  (
    | { kind: 'generic' }
    | { kind: 'neural'; model: string }
    | { kind: 'classifier'; threshold: number }
    | { kind: 'tables'; tables: { name: string; note?: string }[]; policy?: string }
    | { kind: 'routes'; routes: { method?: string; path: string; note?: string; limit?: string; guarded?: boolean }[] }
    | { kind: 'pipeline'; steps: { label: string; note?: string }[] }
    | { kind: 'weights'; items: { label: string; value: number }[] }
    | { kind: 'pool'; lanes: { label: string; workers: number; note?: string }[] }
    | { kind: 'token'; claims: { key: string; value: string }[]; secretNote: string }
    | { kind: 'curves'; classes: string[] }
  )

const E1 = 'project-evidence §1 (WatchNextAI)'
const E2 = 'project-evidence §2 (auth-service-java)'
const E3 = 'project-evidence §3 (ComplexityLab)'
const E8 = 'project-evidence §8 (re-verified in source)'
const N1 = 'new-repos-evidence §1 (blackbox-council)'
const N2 = 'new-repos-evidence §2 (AI_Guardrail)'

export const explainers: Record<string, ExplainerSpec> = {
  /* ---------------- ComplexityLab ---------------- */
  'complexitylab:editor': {
    kind: 'pipeline',
    steps: [
      { label: 'Pick a language', note: 'TypeScript, JavaScript, Python, Java, Go, Rust, C++' },
      { label: 'Start from a template', note: '5 built-in templates per language' },
      { label: 'Edit in the Monaco editor' },
      { label: 'Submit to POST /api/analyze' },
    ],
    facts: [
      { label: 'Languages', value: '7' },
      { label: 'Built-in templates', value: '35 (5 per language)' },
    ],
    sources: [E3],
  },
  'complexitylab:clerk': {
    kind: 'routes',
    routes: [
      { path: '/dashboard', guarded: true },
      { path: '/analyzer', guarded: true },
      { path: '/analyses', guarded: true },
      { path: '/snippets', guarded: true },
      { path: '/playground', guarded: true },
      { path: '/progress', guarded: true },
      { path: '/settings', guarded: true },
      { path: '/chat', guarded: true },
      { path: '/learning', guarded: true },
    ],
    facts: [
      { label: 'Sign-in', value: 'Google OAuth only' },
      { label: 'Guard', value: 'clerkMiddleware in proxy.ts' },
      { label: 'App size', value: '33 pages, 3 API routes' },
    ],
    sources: [E3],
  },
  'complexitylab:route': {
    kind: 'pipeline',
    steps: [
      { label: 'Check the signed-in user' },
      { label: 'Validate the input' },
      { label: 'Apply the per-user rate limit' },
      { label: 'Pick the analysis provider' },
      { label: 'Ask Groq; fall back to the heuristic engine on failure' },
      { label: 'Save the result with a Server Action' },
    ],
    facts: [{ label: 'Endpoint', value: 'POST /api/analyze' }],
    sources: [E3],
  },
  'complexitylab:groq': {
    kind: 'neural',
    model: 'llama-3.3-70b-versatile',
    facts: [
      { label: 'Model', value: 'llama-3.3-70b-versatile (Groq)' },
      { label: 'Temperature', value: '0 for analysis' },
      { label: 'Timeout', value: '20 seconds' },
      { label: 'Output', value: 'Structured JSON' },
      { label: 'On failure', value: 'Missing key, bad JSON, or error falls back to the heuristic engine' },
    ],
    sources: [E3, E8],
  },
  'complexitylab:heuristic': {
    kind: 'pipeline',
    steps: [
      { label: 'Detect loop nesting' },
      { label: 'Detect recursion branching' },
      { label: 'Detect memoization' },
      { label: 'Estimate growth', note: 'lib/analysis/growth.ts' },
      { label: 'Report with a note that the heuristic result was used' },
    ],
    facts: [
      { label: 'Nature', value: 'Deterministic: same code, same answer' },
      { label: 'Runs when', value: 'The Groq analysis is unavailable' },
    ],
    sources: [E3],
  },
  'complexitylab:classes': {
    kind: 'curves',
    classes: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)', 'O(n²)', 'O(n³)', 'O(2ⁿ)', 'O(n!)'],
    facts: [{ label: 'Classes', value: '8, from O(1) through O(n!)' }],
    sources: [E3],
  },
  'complexitylab:db': {
    kind: 'tables',
    tables: [
      { name: 'profiles' },
      { name: 'analyses', note: 'result stored as jsonb' },
      { name: 'saved_snippets' },
      { name: 'user_progress' },
      { name: 'xp_events' },
      { name: 'code_executions' },
      { name: 'chat_conversations' },
      { name: 'chat_messages' },
      { name: 'ai_usage' },
    ],
    policy: 'Row-level security is enabled on every table',
    facts: [
      { label: 'Tables', value: '9' },
      { label: 'Access', value: 'The server reads and writes through a service-role client' },
    ],
    sources: [E3, E8],
  },

  /* ---------------- AI Guardrail ---------------- */
  'ai-guardrail:client': {
    kind: 'generic',
    facts: [
      { label: 'CLI', value: 'Full pipeline, a no-model mode, and a chat REPL' },
      { label: 'API', value: 'A FastAPI service with 4 routes' },
    ],
    sources: [N2],
  },
  'ai-guardrail:auth': {
    kind: 'routes',
    routes: [
      { method: 'GET', path: '/health' },
      { method: 'POST', path: '/check', guarded: true },
      { method: 'POST', path: '/chat/session', guarded: true },
      { method: 'POST', path: '/chat/message', guarded: true },
    ],
    facts: [
      { label: '401', value: 'Missing or unknown API key' },
      { label: '403', value: 'Repeat offender escalated' },
      { label: '413', value: 'Prompt too large' },
      { label: '429', value: 'Rate limit hit' },
    ],
    caveat: 'Abuse state is in memory, so it works for a single process only.',
    sources: [N2],
  },
  'ai-guardrail:session': {
    kind: 'pipeline',
    steps: [
      { label: 'Is the session already locked?' },
      { label: 'Per-turn manipulation checks' },
      { label: 'Cross-turn checks over the last 6 turns' },
      { label: 'Run the core screening pipeline' },
      { label: 'Lock the session after 3 flagged turns' },
    ],
    facts: [
      { label: 'Lock threshold', value: '3 flagged turns' },
      { label: 'History kept', value: '6 turns, 3600 s TTL' },
    ],
    sources: [N2],
  },
  'ai-guardrail:normalize': {
    kind: 'pipeline',
    steps: [
      { label: 'Fold unicode lookalikes' },
      { label: 'Undo leetspeak' },
      { label: 'Strip zero-width characters' },
      { label: 'Decode base64 and hex into extra variants' },
      { label: 'Screen every variant' },
    ],
    facts: [{ label: 'Why', value: 'Disguised text is screened in its plain form too' }],
    sources: [N2],
  },
  'ai-guardrail:filters': {
    kind: 'pipeline',
    steps: [
      { label: 'Banned-word filter' },
      { label: 'Weapons backstop, gated on instructional intent' },
      { label: 'Injection heuristics' },
    ],
    facts: [{ label: 'Behavior', value: 'An unsafe hit stops the pipeline immediately' }],
    sources: [N2],
  },
  'ai-guardrail:classifier': {
    kind: 'classifier',
    threshold: 0.3,
    facts: [
      { label: 'Model', value: 'TF-IDF features with logistic regression' },
      { label: 'Input threshold', value: 'Unsafe at 0.30' },
    ],
    caveat: 'Trained on a gated dataset that is not in the repo; the offline eval set has 38 hand-built cases.',
    sources: [N2],
  },
  'ai-guardrail:model': {
    kind: 'neural',
    model: 'llama-3.3-70b-versatile',
    facts: [
      { label: 'Model', value: 'llama-3.3-70b-versatile (Groq)' },
      { label: 'On failure', value: 'Returns an explicit ERROR decision; the error text is never used as an answer' },
    ],
    sources: [N2],
  },
  'ai-guardrail:output': {
    kind: 'pipeline',
    steps: [
      { label: 'Output classifier', note: 'Unsafe at 0.50' },
      { label: 'Redact PII', note: 'Email, SSN, credit card, phone, IP address' },
      { label: 'Return the result' },
    ],
    facts: [{ label: 'Output threshold', value: '0.50' }],
    sources: [N2],
  },

  /* ---------------- Java JWT auth service ---------------- */
  'jwt-auth:client': {
    kind: 'generic',
    facts: [{ label: 'Clients', value: 'Curl, Swagger, or the bundled Next.js front end' }],
    sources: [E2],
  },
  'jwt-auth:filter': {
    kind: 'pipeline',
    steps: [
      { label: 'Read the Authorization: Bearer header' },
      { label: 'Parse and verify the token' },
      { label: 'Set the authenticated principal' },
      { label: 'Invalid token: continue unauthenticated, then 401' },
    ],
    facts: [
      { label: 'Type', value: 'OncePerRequestFilter' },
      { label: 'Sessions', value: 'Stateless; CSRF disabled' },
    ],
    sources: [E2, 'project-evidence §8 (re-verified in source)'],
  },
  'jwt-auth:limiter': {
    kind: 'pipeline',
    steps: [
      { label: 'Find the Bucket4j bucket for the endpoint and client address' },
      { label: 'Over the limit: raise RateLimitExceededException' },
      { label: 'GlobalExceptionHandler builds the response' },
    ],
    facts: [{ label: 'Keyed by', value: 'Client remote address' }],
    sources: [E2],
  },
  'jwt-auth:controller': {
    kind: 'routes',
    routes: [
      { method: 'POST', path: '/auth/signup' },
      { method: 'POST', path: '/auth/login' },
      { method: 'POST', path: '/auth/refresh' },
      { method: 'POST', path: '/auth/logout' },
      { method: 'GET', path: '/auth/me', guarded: true },
    ],
    facts: [
      { label: 'Endpoints', value: '5' },
      { label: 'Open', value: 'signup, login, refresh, logout, health' },
      { label: 'Needs a token', value: '/auth/me' },
    ],
    sources: [E2],
  },
  'jwt-auth:service': {
    kind: 'pipeline',
    steps: [
      { label: 'Signup: hash the password with BCrypt, store the user' },
      { label: 'Login: look up the user and check the password' },
      { label: 'Unknown email or wrong password: the same 401 "Invalid credentials"' },
      { label: 'Success: issue an access token and a refresh token' },
    ],
    facts: [{ label: 'Why one error', value: 'The response text does not reveal whether an email is registered' }],
    caveat: 'Response timing for unknown emails was not verified, so this does not prove the service is free of enumeration leaks.',
    sources: [E2],
  },
  'jwt-auth:jwt': {
    kind: 'token',
    claims: [
      { key: 'alg', value: 'HS256' },
      { key: 'sub', value: 'the user id' },
      { key: 'email', value: 'the user email' },
      { key: 'exp', value: 'issued time + 1 hour' },
    ],
    secretNote: 'The signing secret must be at least 32 characters, or the app refuses to start.',
    facts: [
      { label: 'Library', value: 'JJWT 0.12.5' },
      { label: 'Access token', value: '1 hour' },
    ],
    sources: [E2, E8],
  },
  'jwt-auth:refresh': {
    kind: 'pipeline',
    steps: [
      { label: 'Client presents a refresh token' },
      { label: 'Rotate: issue a new token and retire the old one' },
      { label: 'A retired token used again triggers reuse handling' },
    ],
    facts: [
      { label: 'Lifetime', value: '7 days' },
      { label: 'Protection', value: 'Rotation, reuse detection, optimistic locking' },
    ],
    sources: [E2, E8],
  },
  'jwt-auth:db': {
    kind: 'tables',
    tables: [
      { name: 'User records', note: 'Spring Data JPA repository' },
      { name: 'Refresh tokens', note: 'Spring Data JPA repository' },
    ],
    policy: 'Flyway migrations V1 to V3 on PostgreSQL in production; H2 in development',
    facts: [{ label: 'Production', value: 'PostgreSQL with Flyway' }],
    sources: [E2],
  },

  /* ---------------- Blackbox Council ---------------- */
  'blackbox-council:web': {
    kind: 'pipeline',
    steps: [
      { label: 'Browser form (Next.js)' },
      { label: 'Same-origin proxy route' },
      { label: 'Check the signed session cookie and the origin' },
      { label: 'Attach the operator credential for protected calls only' },
    ],
    facts: [{ label: 'Cookie', value: 'Signed and HttpOnly' }],
    sources: [N1],
  },
  'blackbox-council:api': {
    kind: 'routes',
    routes: [
      { method: 'POST', path: '/api/v1/evaluations', note: 'create a run' },
      { method: 'GET', path: '/api/v1/evaluations/{run_id}', note: 'fetch / poll a run' },
      { method: 'GET', path: '/api/v1/evaluations/{run_id}/report' },
      { method: 'POST', path: '/api/v1/evaluations/{run_id}/approvals', guarded: true },
      { method: 'POST', path: '/api/v1/evaluations/{run_id}/execute', guarded: true },
      { method: 'POST', path: '/api/v1/evaluations/{run_id}/rollback', guarded: true },
      { method: 'GET', path: '/health' },
    ],
    facts: [{ label: 'Guarded', value: 'Approve, execute, and rollback need an operator credential' }],
    sources: [N1],
  },
  'blackbox-council:council': {
    kind: 'pipeline',
    steps: [
      { label: 'Planner' },
      { label: 'Red team' },
      { label: 'Privacy' },
      { label: 'Five controlled perturbations', note: 'reword, remove constraint, add constraint, injection, replace verb' },
      { label: 'Arbiter' },
    ],
    facts: [{ label: 'Stability score', value: 'Uses only the reword and injection variants' }],
    sources: [N1],
  },
  'blackbox-council:provider': {
    kind: 'pipeline',
    steps: [
      { label: 'Mock mode: a scripted provider (what the demo runs)' },
      { label: 'Live mode: budgeted provider with per-run and daily call caps' },
      { label: 'Live mode: Nebius provider with retry and backoff' },
    ],
    facts: [{ label: 'Status', value: 'Mock mode demo' }],
    caveat: 'The live model path is implemented but has not been run successfully.',
    sources: [N1],
  },
  'blackbox-council:policy': {
    kind: 'pipeline',
    steps: [
      { label: 'CMD-001', note: 'shell payloads' },
      { label: 'FILE-001', note: 'direct deletion is blocked' },
      { label: 'SCOPE-001, SECRET-001, NET-001, AUTH-001, HOLD-001' },
      { label: 'TRUST-001', note: 'flags untrusted repository text (informational)' },
      { label: 'Outcome', note: 'blocked, clarification, safeguard, approval required, or safe' },
    ],
    facts: [
      { label: 'Priority', value: 'approval required, then safeguard, then safe, then clarification' },
      { label: 'Blocked', value: 'A blocked option is never selected' },
    ],
    caveat: 'Pure code: no network, database, or model call decides the outcome.',
    sources: [N1],
  },
  'blackbox-council:gate': {
    kind: 'pipeline',
    steps: [
      { label: 'Build a dry-run manifest and a backup manifest' },
      { label: 'Hash the exact action' },
      { label: 'A human approves that hash' },
      { label: 'Execute (a simulated archive)' },
      { label: 'Roll back if needed' },
    ],
    facts: [
      { label: 'Inactive for', value: 'at least 180 days' },
      { label: 'Recovery window', value: 'at least 30 days' },
      { label: 'Max files', value: '10 per action' },
    ],
    sources: [N1],
  },
  'blackbox-council:db': {
    kind: 'generic',
    facts: [{ label: 'Store', value: 'SQLite through SQLAlchemy (run history)' }],
    sources: [N1],
  },

  /* ---------------- WatchNextAI ---------------- */
  'watchnextai:client': {
    kind: 'generic',
    facts: [{ label: 'Front end', value: 'Jinja2 templates with vanilla JavaScript' }],
    sources: [E1],
  },
  'watchnextai:auth': {
    kind: 'pipeline',
    steps: [
      { label: 'Google OAuth' },
      { label: 'Email and password' },
      { label: 'One-time passcode (OTP)' },
      { label: 'MFA: enroll, challenge, verify (TOTP)' },
    ],
    facts: [{ label: 'Where', value: 'The browser talks to Supabase Auth directly' }],
    sources: [E1, 'project-evidence §8 (re-verified in source)'],
  },
  'watchnextai:api': {
    kind: 'routes',
    routes: [
      { path: '/api/chat', limit: '20 per hour' },
      { path: '/api/recommendations', limit: '60 per hour' },
      { path: '/api/autocomplete', limit: '60 per minute' },
      { path: '/api/search', limit: '30 per minute' },
      { path: 'comments (POST)', limit: '10 per 15 minutes' },
      { path: 'welcome and check-in email', limit: '5 per 15 minutes' },
      { path: 'everything else', limit: '300 per hour (default)' },
    ],
    facts: [
      { label: 'JSON routes', value: '27' },
      { label: 'Server-rendered pages', value: '10' },
      { label: 'Body limit', value: '512 KB' },
    ],
    sources: [E1],
  },
  'watchnextai:pools': {
    kind: 'pool',
    lanes: [
      { label: 'Stage A: genres of the top-rated seeds', workers: 4 },
      { label: 'Stage B: TMDB recommendations and similar titles per seed', workers: 4, note: 'starts after A finishes' },
      { label: 'Search: TMDB movies, TMDB TV, Jikan anime', workers: 3, note: 'in parallel' },
    ],
    facts: [{ label: 'Executor', value: 'ThreadPoolExecutor' }],
    caveat: 'Stages A and B run one after the other, not at the same time.',
    sources: [E1],
  },
  'watchnextai:sources': {
    kind: 'generic',
    facts: [
      { label: 'TMDB', value: 'v3 API for movies and TV' },
      { label: 'Jikan', value: 'v4 API for anime (MyAnimeList)' },
      { label: 'Timeout', value: '10 seconds per request' },
      { label: 'If Jikan fails', value: 'Search returns an empty anime list' },
    ],
    sources: [E1],
  },
  'watchnextai:recommender': {
    kind: 'weights',
    items: [
      { label: 'Frequency', value: 40 },
      { label: 'Rating', value: 25 },
      { label: 'Genre overlap', value: 25 },
      { label: 'Quality', value: 10 },
    ],
    facts: [
      { label: 'Seeds', value: 'Up to 8 from the last 50 watched titles' },
      { label: 'Result', value: 'Top 24' },
      { label: 'No history', value: 'Falls back to content-based recommendations' },
    ],
    sources: [E1],
  },
  'watchnextai:db': {
    kind: 'tables',
    tables: [{ name: 'watchlist' }, { name: 'watched' }, { name: 'watching' }],
    policy: '10 row-level security policies (3 + 3 + 4)',
    facts: [
      { label: 'Unique indexes', value: '3 composite, on (user_id, media_id, media_type)' },
      { label: 'Role', value: 'Watched history seeds the recommender' },
    ],
    sources: [E1],
  },
  'watchnextai:llm': {
    kind: 'neural',
    model: 'llama-3.3-70b-versatile',
    facts: [
      { label: 'Model', value: 'llama-3.3-70b-versatile (Groq)' },
      { label: 'Endpoint', value: '/api/chat, limited to 20 per hour' },
      { label: 'Temperature', value: '0.7' },
      { label: 'Max tokens', value: '500' },
    ],
    sources: [E1],
  },
}

/** Which kinds of visual are conceptual illustrations rather than this system's real data. */
export const ILLUSTRATIVE: Partial<Record<ExplainerSpec['kind'], string>> = {
  neural: 'Illustrative diagram of how a language model processes tokens. It is not this model’s actual architecture; the real settings are listed beside it.',
  classifier: 'Illustrative values. The real classifier is TF-IDF with logistic regression and the threshold shown is real.',
  curves: 'Illustrative curves of how each complexity class grows.',
}

/** Quick facts shown as chips on each project slide. */
export const projectChips: Record<string, { label: string; value: string }[]> = {
  complexitylab: [
    { label: 'languages', value: '7' },
    { label: 'complexity classes', value: '8' },
    { label: 'templates', value: '35' },
    { label: 'test files', value: '59' },
    { label: 'tables with RLS', value: '9' },
  ],
  'ai-guardrail': [
    { label: 'API routes', value: '4' },
    { label: 'declared tests', value: '63' },
    { label: 'PII types redacted', value: '5' },
    { label: 'flagged turns lock a session', value: '3' },
  ],
  'jwt-auth': [
    { label: 'endpoints', value: '5' },
    { label: 'tests', value: '75' },
    { label: 'access token', value: '1 h' },
    { label: 'refresh token', value: '7 days' },
  ],
  'blackbox-council': [
    { label: 'council passes', value: '4' },
    { label: 'perturbation tests', value: '5' },
    { label: 'pytest tests', value: '74' },
    { label: 'e2e tests', value: '6' },
  ],
  watchnextai: [
    { label: 'JSON routes', value: '27' },
    { label: 'RLS policies', value: '10' },
    { label: 'smoke tests', value: '7' },
    { label: 'live', value: 'Vercel' },
  ],
}
