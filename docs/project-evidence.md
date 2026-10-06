# Project evidence (fact-check of portfolio claims)

Method: shallow clone of each repo's default branch HEAD (checked 2026-10-06) plus `curl` on live URLs. Counts are static (grep/regex on source); no repo code was installed or executed. Portfolio text read from `src/data/content.ts` and `needUpdate.md`.

IMPORTANT: ComplexityLab and auth-service-java have grown a lot since the portfolio numbers were written (auth-service-java HEAD is a single squashed commit dated 2026-07-25). Many "wrong" numbers below are stale rather than invented.

---

## 1. WatchNextAI (https://github.com/tirth6851/watchnextai)

| Claim | Verdict | Evidence |
|---|---|---|
| 37 REST endpoints | CORRECTED: 38 `@app.route` decorators = 37 distinct URL rules, but only 27 are `/api/*` JSON routes (plus `/health`), and 10 are HTML page routes | `backend/app.py`: 38 decorators; `/api/comments` appears twice (GET, POST); 10 page routes (`/`, `/browse`, `/movie/<id>`, `/tv/<id>`, `/anime/<id>`, `/person/<id>`, `/profile`, `/onboarding`, `/terms`, `/privacy`); 27 `/api/*` decorators (26 distinct paths); `/health` + `/api/health` stacked on one function |
| 2 ThreadPoolExecutor pools, max_workers=4 each | CONFIRMED (but sequential, not concurrent with each other) | `backend/recommender.py` L119 (genre prefetch) and L139 (per-seed recs fetch), both `max_workers=4`; second starts after first finishes |
| max_workers=3 search fan-out | CONFIRMED | `backend/app.py` L615, `/api/search` runs TMDB movie, TMDB tv, Jikan anime in parallel |
| Weights 40/25/25/10 | CONFIRMED | `recommender.py` L180: `freq*0.40 + avg_weight*0.25 + genre*0.25 + quality*0.10` (25% is the rating weight, 25% genre overlap) |
| Schema: 3 tables | CONFIRMED for `supabase/schema.sql` (watchlist, watched, watching). Caveat: code also reads/writes a `comments` table (`app.py` L914, L959) that is not in schema.sql | `supabase/schema.sql` L10, L22, L35 |
| 3 composite unique indexes | CONFIRMED | `schema.sql` L19, L32, L47, each on (user_id, media_id, media_type) |
| 10 RLS policies | CONFIRMED | `schema.sql` L54-65: watchlist 3 + watched 3 + watching 4 = 10 |
| flask-limiter 20-300/hr | CORRECTED: limits range from 5 per 15 min up to 300 per hour | `app.py`: default 300/hr; `/api/chat` 20/hr; `/api/recommendations` 60/hr; `/api/autocomplete` 60/min; `/api/search` 30/min; welcome-email + checkin-email 5 per 15 min; comments POST 10 per 15 min. Not every endpoint is explicitly limited, the rest use the 300/hr default |
| 7 smoke tests | CONFIRMED | `tests/test_app_smoke.py`: 7 `def test_` in `AppSmokeTests` |
| Groq llama-3.3-70b-versatile | CONFIRMED | `app.py` L282, `/api/chat`, temperature 0.7, max_tokens 500 |
| Jikan v4 + TMDB | CONFIRMED | `app.py` L113 `JIKAN_BASE_URL=https://api.jikan.moe/v4`; L45 TMDB v3 base URL |
| Supabase Auth Google OAuth, OTP, MFA/TOTP | CONFIRMED | `static/js/auth.js`: `signInWithOAuth` L72, `verifyOtp` L98, `mfa.enroll/challenge/verify` L106-118 (client-side) |
| Vercel deployment | CONFIRMED | `vercel.json` (@vercel/python, all routes to `api/index.py`); live URL returns HTTP 200 |

Other observation: a Supabase anon key and project URL are hardcoded as defaults in `app.py` L46-51 (anon keys are public by design, but worth moving to env).

### Architecture path (WatchNextAI)
1. Browser: Jinja templates in `templates/*.html` + `static/js/{script,home,auth,auth-modal}.js`.
2. Auth and watchlist: browser talks directly to Supabase (`static/js/auth.js`: Auth with Google OAuth/OTP/MFA; tables watchlist/watched/watching protected by RLS).
3. Vercel: `vercel.json` routes every path to `api/index.py` (@vercel/python), which imports the Flask `app` from `backend/app.py`.
4. Flask middleware: `MAX_CONTENT_LENGTH` 512 KB; flask-limiter (in-memory, default 300/hr); `before_request` `guard_tmdb_key` (503 if no key); `after_request` security headers.
5. Routes in `backend/app.py`: page routes render templates; `/api/*` proxy to external APIs with `requests` (10 s timeout).
6. External: TMDB v3 (movies/TV/search/credits/providers/reviews) and Jikan v4 (anime); Groq (`/api/chat`, llama-3.3-70b-versatile); Supabase REST (`/api/comments`, and `recommender.py` reads the `watched` table).
7. Search fan-out (`/api/search`): ThreadPoolExecutor(3) running TMDB movie, TMDB tv, Jikan anime; Jikan failure returns `[]` (soft fail).
8. Recommendations (`/api/recommendations`, `backend/recommender.py`): if `user_id`, `recommend_for_user` fetches the last 50 `watched` rows from Supabase, up to 8 seeds, Pool A (4 workers) fetches genres of top-5 rated seeds, Pool B (4 workers) fetches TMDB `/recommendations` + `/similar` per seed, then weighted score 0.40/0.25/0.25/0.10 and top 24. Fallback: no history -> `recommend_content_based` (TMDB recs + similar, deduped, sorted by quality). Anonymous with `media_id` goes straight to content-based.

---

## 2. auth-service-java (https://github.com/tirth6851/auth-service-java)

| Claim | Verdict | Evidence |
|---|---|---|
| Spring Boot 3.2.5 | CONFIRMED | `pom.xml` parent `spring-boot-starter-parent` 3.2.5 |
| Java 17 | CONFIRMED | `pom.xml` `<java.version>17` |
| JJWT 0.12.5 | CONFIRMED | `pom.xml` jjwt-api/impl/jackson 0.12.5 |
| HS256 | CONFIRMED | `security/JwtUtil.java` `Keys.hmacShaKeyFor` (32+ byte key gives HS256); `OpenApiConfig` and `AuthResponse` doc say HS256 |
| BCrypt | CONFIRMED | `config/SecurityConfig.java` `new BCryptPasswordEncoder()` |
| Startup guard, secret < 32 chars | CONFIRMED (also rejects missing secret and the default placeholder) | `JwtUtil.java` L28-39 |
| Uniform 401 for wrong password / unknown email | CONFIRMED | `service/AuthService.java` login: both paths throw `ResponseStatusException(401, "Invalid credentials")`. Not verified: timing equalization (unknown email skips the BCrypt check) |
| JwtUtil 8 tests | CONFIRMED | `JwtUtilTest.java`: 8 `@Test` |
| AuthService 5 tests (Mockito) | CONFIRMED | `AuthServiceTest.java`: 5 `@Test` |
| 4 MockMvc integration tests | CORRECTED: 40 | `AuthControllerIntegrationTest.java`: 40 `@Test` |
| 17 tests total across 3 files | CORRECTED: 75 `@Test` across 8 files | AuthControllerIntegrationTest 40, JwtUtilTest 8, RefreshTokenServiceTest 8, JwtAuthenticationFilterTest 7, AuthServiceTest 5, PostgresFlywayIntegrationTest 3 (Testcontainers, needs Docker), GlobalExceptionHandlerTest 2, RefreshTokenOptimisticLockTest 2. No `@Disabled`, no parameterized tests |
| 2 endpoints (signup, login) | CORRECTED: 5 endpoints | `AuthController.java` `/auth`: POST signup, POST login, POST refresh, POST logout, GET me. Also actuator `/actuator/health` |
| No live demo | CONFIRMED | No deployment URL in repo content checked; `render.yaml` and `Dockerfile` exist, so a Render deploy is configured but no URL is published (UNVERIFIABLE whether it is running) |

Extra features not in portfolio: rotating refresh tokens with reuse detection (`RefreshTokenService`, `RefreshTokenReuseHandler`, optimistic locking), Bucket4j per-IP rate limiting (`RateLimitInterceptor`, `WebConfig`), Flyway migrations V1-V3 (Postgres prod) with H2 in dev, a Next.js `web/` front end (login/signup/account/sessions pages, `web/app/api/auth/*`), GitHub Actions CI (`mvn -B verify`), 7 ADRs.

### Architecture path (auth-service-java)
1. Client: curl/Swagger, or `web/` Next.js app (`web/app/api/auth/{login,signup,logout}/route.ts` -> `web/lib/auth-api.ts`, `web/proxy.ts`, session cookie in `web/lib/session.ts`).
2. Spring Security filter chain (`config/SecurityConfig.java`): `/auth/signup|login|refresh|logout` and health permitted; everything else (`/auth/me`) requires auth.
3. Rate limiting: `config/WebConfig.java` registers per-endpoint `RateLimitInterceptor` (Bucket4j, keyed by `remoteAddr`); over-limit -> `RateLimitExceededException` -> `exception/GlobalExceptionHandler`.
4. `security/JwtAuthenticationFilter` (OncePerRequestFilter, before `UsernamePasswordAuthenticationFilter`): reads `Authorization: Bearer`, `JwtUtil.parseToken`, sets `AuthenticatedUser` principal; invalid token -> continues unauthenticated -> `Http401UnauthorizedEntryPoint` returns 401.
5. `controller/AuthController` (thin, DTOs in `dto/`) -> `service/AuthService` (signup/login/refresh/logout/me) -> `security/JwtUtil` (HS256 access token, 1 h TTL) + `service/RefreshTokenService` (7-day rotating refresh, reuse handling).
6. Persistence: `repository/UserRepository`, `RefreshTokenRepository` (Spring Data JPA) -> H2 in dev (ddl-auto), PostgreSQL + Flyway `db/migration/V1..V3` in prod.
7. Passwords hashed with `BCryptPasswordEncoder`; login failure (unknown email or bad password) both return identical 401 "Invalid credentials".

---

## 3. ComplexityLab (https://github.com/tirth6851/ComplexityLab)

App lives in `frontend/`; Supabase migrations in `supabase/migrations/`.

| Claim | Verdict | Evidence |
|---|---|---|
| Next.js 16 / React 19 / TS 6 | CONFIRMED | `frontend/package.json`: next ^16.2.7, react ^19.2.7, typescript ^6.0.3, vitest ^3.2.6, @clerk/nextjs ^7.5.2 |
| "30 test suite" | CORRECTED: 59 test files, ~578 `it()` declarations (237 unit, 107 integration, 234 component) | `frontend/tests/{unit,integration,components}/*.test.ts(x)`: 22 + 9 + 28 = 59 files (plus `setup.ts`, stubs). 578 counted by regex for `it(`/`it.each(`/`test(` at line start. 3 `it.each` blocks (11, 11 and 4 params) expand to ~23 more runtime cases, so the runtime total is about 600. Exact runtime count UNVERIFIABLE without running vitest. "30" matches neither files nor cases at HEAD |
| 7 languages | CONFIRMED | `lib/analysis/languages.ts`: typescript, javascript, python, java, go, rust, cpp |
| 7 complexity classes | CORRECTED: 8 | `types/index.ts` `Complexity` union: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ), O(n!); same 8 in `lib/complexity.ts` and the Groq prompt (`lib/ai/providers/groq.ts` L41) |
| 18 built-in templates | CORRECTED: 35 | `lib/analysis/samples.ts`: 5 templates for each of the 7 languages |
| 3 Supabase tables with RLS | CORRECTED: 9 tables, all with RLS enabled | migrations: `profiles`, `analyses`, `saved_snippets` (init); `user_progress`, `xp_events` (progress); `code_executions`; `chat_conversations`, `chat_messages`, `ai_usage`. Every table has `enable row level security`; the init migration's policies are commented out, so RLS is deny-by-default with access via the service-role server client (`lib/db/admin.ts`). Only 3 tables existed in the first migration |
| 14 app routes (6 public / 8 protected) | CORRECTED: 33 pages + 3 API routes | `frontend/app`: 33 `page.tsx` (17 behind auth, 16 public) and 3 `route.ts` (`/api/analyze`, `/api/chat`, `/api/execute`). Protected prefixes in `proxy.ts`: dashboard, analyzer, analyses, snippets, playground, progress, settings, chat, learning |
| Clerk Google OAuth only | CONFIRMED | `app/sign-in/page.tsx` and `sign-up/page.tsx` render only `GoogleAuthButton`; `proxy.ts` uses `clerkMiddleware` |
| Groq temperature 0 + deterministic heuristic fallback | CONFIRMED for analysis | `lib/ai/groq-client.ts` L60 default `temperature = 0` (analysis path); `lib/ai/providers/groq.ts` `fallback()` to `lib/analysis/engine.ts` on missing key, bad JSON or error. Note: chat uses temperature 0.7 (`groq-chat.ts`) |
| No LangChain/FAISS | CONFIRMED (and a small home-grown RAG exists) | no langchain/faiss in `package.json`; `lib/ai/rag/retriever.ts` is a tag/keyword scorer over `knowledge-base.ts` |
| Live demo | CONFIRMED | HTTP 200 |

Features added since portfolio text: AI chat tutor with RAG, code execution playground via Judge0 (`lib/execute/judge0.ts`), XP/progress/achievements, learning tracks, snippets, rate limiting, GitHub Actions CI (typecheck, lint, build, test).

### Architecture path (ComplexityLab)
1. Browser: Next.js 16 App Router pages (`app/(app)/analyzer`, `components/analyzer/*`, Monaco editor).
2. Clerk auth + route protection: `frontend/proxy.ts` (`clerkMiddleware`, `PROTECTED_ROUTES`), Google OAuth.
3. `POST /api/analyze` (`app/api/analyze/route.ts`): auth check, input validation, per-user `lib/rate-limit.ts`, then `getAnalysisProvider()` (`lib/ai/index.ts`, env-selected strategy).
4. Provider `lib/ai/providers/groq.ts` -> Groq (`lib/ai/groq-client.ts`, temperature 0, structured JSON). On missing key / malformed JSON / error -> `fallback()` -> `lib/analysis/engine.ts` (deterministic heuristic: loop nesting, recursion, memoization; `lib/analysis/growth.ts`) with a note that the heuristic result was used.
5. Persistence via Server Actions (`app/(app)/analyzer/actions.ts`, `analyses/actions.ts`, `snippets/actions.ts`) -> `lib/db/*` -> `lib/supabase/server.ts` / `lib/db/admin.ts` (service role) -> Supabase Postgres (RLS on 9 tables); XP awards via `lib/progress/award.ts`.
6. Chat: `POST /api/chat` -> `lib/ai/chat.ts` + `lib/ai/rag/retriever.ts` (keyword retrieval over `knowledge-base.ts`) -> Groq chat provider (streaming, temperature 0.7) -> `lib/db/chat.ts`.
7. Execute: `POST /api/execute` -> `lib/execute/judge0.ts` (poll, normalize) -> Judge0 -> `lib/db/executions.ts`.
8. Vercel deploy; CI `.github/workflows/ci.yml`.

---

## 4. sponsorscout-ai (https://github.com/tirth6851/sponsorscout-ai)

| Claim | Verdict | Evidence |
|---|---|---|
| 8-factor, 100-point scoring in `lib/matching.ts` | CONFIRMED with caveat | 8 factors in `scoreOpportunity`. Max raw points 30+18+22+10+8+7+5+5 = 105, clamped with `Math.min(100, ...)` at the end; so "100-point" is a capped score, and negative penalties (-40) exist |
| Point weights 30/22/18/10/8/7/5/+5 | CONFIRMED | header comment of `lib/matching.ts` and code: authorization 30 (18 or 10 base + 12 sponsorship bonus), skills 22, sponsorship history 18, location 10, industry 8, discipline 7, role family 5, experience +5 (partial +2) |
| Tiers >=75 Realistic, 50-74 Stretch | CONFIRMED | `matching.ts`: `>=75` Realistic, `>=50` Stretch, else Low-Fit |
| 3 job sources (Adzuna, SerpApi, USAJobs) | CONFIRMED | `lib/jobs/sources/{adzuna,serpapi,usajobs}.ts`; `app/api/jobs/ingest/route.ts` (queried sequentially, each skipped if its key is missing) |
| 17 risky + 16 positive = 33 phrases | CORRECTED: 16 risky + 15 positive = 31 | `lib/jobs/sponsorship-signals.ts` `RISKY_PHRASES` 16, `BETTER_PHRASES` 15 (counted by regex). Separate hardcoded checks in `detectCPT/OPTCompatibility` are not part of these lists |
| 7 relational tables | CORRECTED: 10 tables, all with RLS enabled | `001_initial_schema.sql`: profiles, student_profiles, opportunities, saved_opportunities, strategy_outputs, action_items; `003_job_ingestion.sql`: job_sources, raw_jobs, normalized_jobs, job_ingestion_runs. `002` is seed data. 15 policies in 001 + 4 in 003 |
| No tests | CONFIRMED | no test files, no test script or test framework in `package.json` |
| Groq for career strategy only | CONFIRMED | only `app/api/strategy/route.ts` imports `lib/groq.ts`; model `llama-3.3-70b-versatile` (env-overridable), temperature 0.4; deterministic fallback if Groq unset or fails |
| No Java | CONFIRMED (stack) | only occurrence is "java" as a skill keyword in `lib/jobs/normalize.ts` L65 |
| Live demo | CONFIRMED | HTTP 200 |

Other observations: repo also contains `.github/workflows/deploy.yml` (GitHub Pages static deploy) alongside the Vercel app; Next 14.2.5 / React 18.3.1 (portfolio does not claim versions); demo mode with mock data when Supabase is not configured.

### Architecture path (sponsorscout-ai)
1. Browser: Next.js 14 App Router pages (`app/page.tsx` landing, `app/dashboard`, `app/profile`, `app/strategy`, `app/(auth)/login|signup`).
2. `middleware.ts`: Supabase SSR session check; protects `/dashboard`, `/strategy`, `/profile`; no-op in demo mode (Supabase unconfigured).
3. Ingestion: `POST /api/jobs/ingest` (optional `X-Ingest-Secret`, requires signed-in user) -> sequential fetch from `lib/jobs/sources/adzuna.ts`, `serpapi.ts`, `usajobs.ts` -> `lib/jobs/dedupe.ts` -> `lib/jobs/normalize.ts` (role family, discipline, skills/tools, `detectSponsorshipSignal` from `lib/jobs/sponsorship-signals.ts`, CPT/OPT signals) -> Supabase `raw_jobs` + `normalized_jobs` upserts, `job_ingestion_runs` log.
4. Matching: `GET /api/opportunities` reads `student_profiles` + `normalized_jobs` (fallback to seeded `opportunities`; mock data in demo mode) -> `lib/matching.ts` `scoreOpportunity` -> score, tier, reasons, warnings -> sorted JSON -> `components/dashboard/*`.
5. Profile: `app/api/profile/route.ts` <-> `student_profiles`.
6. Strategy: `app/api/strategy/route.ts` scores opportunities, then Groq (`lib/groq.ts`, llama-3.3-70b-versatile, temp 0.4); on failure or missing key falls back to deterministic `lib/strategy.ts`; output stored in `strategy_outputs`.
7. Vercel deploy; Supabase Auth callback at `app/api/auth/callback/route.ts`.

---

## 5. Live demos (curl HTTP status, 2026-10-06)

| URL | Status |
|---|---|
| https://watchnextai-orpin.vercel.app | 200 (live) |
| https://complexity-lab-eight.vercel.app | 200 (live) |
| https://sponsorscout-ai.vercel.app | 200 (live) |
| auth-service-java | no demo URL; not checked |

Only the HTTP status was checked, not page content.

## 6. Portfolio headline stats

- "4 Projects Shipped": 4 public repos exist. 3 have live deployments returning 200; the Java service is code-only (Docker/Render config present but no public URL). Supportable wording: "4 projects, 3 live in production".
- "47 Automated Tests": the portfolio's 47 appears to be 17 (Java) + 30 (ComplexityLab) and omits WatchNextAI's 7. Supportable real test-case counts at repo HEAD (static counts of declared test cases, not files):
  - WatchNextAI 7
  - auth-service-java 75 (3 of them need Docker/Testcontainers)
  - ComplexityLab 578 (about 600 after `it.each` expansion; running vitest would confirm)
  - SponsorScout 0
  - Sum: 660 declared (about 680 with expansion). Conservative claim: "650+ automated tests". Note the repo state may include tests added after the portfolio snapshot; if you prefer the original figure, it should be recomputed as 7 + 17 + 30 = 54, but the 17 and 30 are no longer accurate descriptions of the repos.

---

## 7. Recommended corrections to portfolio text

WatchNextAI
- "37 REST endpoints" -> "27 JSON API endpoints plus 10 server-rendered pages (37 URL routes)" or just "27 REST endpoints" (safest).
- "flask-limiter 20-300 req/hr by route" -> "per-route rate limits from 5 per 15 min to 300 per hour".
- "two concurrent ThreadPoolExecutor pools" -> "two ThreadPoolExecutor stages (4 workers each) plus a 3-way parallel search fan-out" (the two pools run one after the other; the "concurrent" wording in needUpdate.md is loose).
- "3 tables" is true for `schema.sql`; the app also uses a `comments` table not in that file. Either add it to the schema file or say "3 tables in the schema file".
- Everything else (weights, 10 RLS policies, 3 unique indexes, 7 smoke tests, Groq model, Jikan v4 + TMDB, Vercel) verified.

auth-service-java
- "17 automated tests across 3 files" -> "75 automated tests across 8 files (JUnit 5, Mockito, MockMvc, Testcontainers)". Specific numbers 8 JwtUtil and 5 AuthService remain true; MockMvc integration is now 40, not 4.
- "2 endpoints" -> "5 endpoints (signup, login, refresh, logout, me)"; mention rotating refresh tokens with reuse detection, Bucket4j rate limiting, Flyway/PostgreSQL.
- Stack versions, HS256, BCrypt, uniform 401, 32-char guard all confirmed.

ComplexityLab
- "30-test suite" -> "59 test files, 570+ test cases (Vitest + Testing Library)".
- "7 complexity classes" -> "8" (adds O(n³) and O(n!)).
- "18 built-in templates" -> "35 (5 per language)".
- "3 tables" -> "9 tables, all with RLS enabled".
- "14 app routes" -> "33 pages and 3 API routes".
- Optionally add: AI chat tutor with keyword RAG, Judge0 code playground, XP/achievements.
- Next 16 / React 19 / TS 6, Clerk Google-only, temperature 0 + heuristic fallback, no LangChain/FAISS confirmed.

SponsorScout AI
- "100-point scoring" is accurate only as a clamped score (raw max is 105).
- "33 phrases" -> "31 phrases (16 risky, 15 positive)".
- "7 relational tables" -> "10 tables".
- Tiers, weights, 3 sources, Groq-for-strategy-only, no tests, no Java confirmed.

Headline stats
- "47 Automated Tests" -> "650+ automated tests" (7 + 75 + 578 = 660 declared) or drop the aggregate and cite per-project counts.
- "4 Projects Shipped" -> keep, optionally qualify as "3 live in production".
