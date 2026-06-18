# Portfolio Update Guide — Tirth Patel
> Generated 2026-06-17 from verified GitHub repo scans. All facts sourced from actual code — no invented metrics.

---

## CONTACT & LINKS

- **Name:** Tirth Patel
- **Email:** tirth2093@gmail.com
- **Phone:** 440-881-6330
- **LinkedIn:** https://linkedin.com/in/tirthm2093
- **GitHub:** https://github.com/tirth6851
- **Portfolio (current):** https://portfolio-green-delta-11.vercel.app/

---

## ABOUT / BIO

CS student at Cleveland State University (GPA: 3.52 / 4.00, Dean's List) with a Minor in Mathematics, seeking software engineering internships and co-ops starting Fall 2026.

I build full-stack and backend applications using Python, Java, TypeScript, and SQL. My work spans deployed web platforms, REST APIs with automated test suites, data pipelines, and interactive frontend applications — built with Flask, Spring Boot, Next.js, Supabase, and PostgreSQL.

Outside of projects, I serve as a STEM Peer Teacher at CSU (competitively selected to support ~30 students per session in Precalculus I) and as Secretary of the CSU Billiards Club.

I'm looking for backend, full-stack, or general software engineering internship and co-op roles starting Fall 2026.

---

## EDUCATION

**Cleveland State University** | Cleveland, OH
Bachelor of Science in Computer Science | Minor in Mathematics
GPA: 3.52 / 4.00 | Dean's List
January 2025 – May 2028 (Expected)

---

## EXPERIENCE

### STEM Peer Teacher
**Cleveland State University** | Cleveland, OH | August 2025 – Present
- Selected through competitive hiring to provide instructional support for MTH 167: Precalculus I, serving approximately 30 students per session
- Diagnosed comprehension gaps across student cohorts and adapted practice activities based on participation patterns to improve concept retention
- Maintained weekly session documentation covering learning objectives, topic coverage, and student response trends aligned with faculty exam preparation goals
- Translated abstract pre-calculus concepts — algebra, trigonometry, and functions — into structured problem-solving frameworks for students from varied learning backgrounds

### Operations Assistant
**CENTERS Recreation Center** | Cleveland, OH | January 2026 – Present
- Supported 100+ members per shift by maintaining facility operations, enforcing safety protocols, and responding to incidents including injury response and missing person procedures
- Delivered customer service across reception and member inquiry functions, maintaining positive experience under high-traffic conditions
- Coordinated with operations supervisors to support daily administrative tasks and contribute to facility operational efficiency

---

## PROJECTS

> ⚠️ IMPORTANT CORRECTIONS — previous portfolio descriptions were inaccurate. Use ONLY the verified descriptions below.

---

### 1. WatchNextAI
**Stack:** Python · Flask · Supabase · PostgreSQL · Vercel · Groq (llama-3.3-70b-versatile)
**Live:** https://watchnextai-orpin.vercel.app/
**GitHub:** https://github.com/tirth6851/watchnextai

**Verified facts (from actual code):**
- 37 REST endpoints spanning movies, TV shows, and anime
- Integrates TMDB API (movies + TV) and Jikan v4 / MyAnimeList API (anime)
- Groq LLM (llama-3.3-70b-versatile) powers an AI chat feature
- Frontend: vanilla HTML/CSS/JavaScript with Jinja2 templating (NOT React/Next.js)
- Deployed on Vercel as a serverless Python app
- Supabase Auth: Google OAuth, email/password, OTP, and MFA/TOTP
- Content-based recommendation engine with weighted scoring:
  - 40% frequency score (how many seed titles surfaced the candidate)
  - 25% average rating weight (normalized 0–1)
  - 25% genre overlap with user preferences
  - 10% TMDB quality score (vote_average × vote_count factor)
- Two concurrent ThreadPoolExecutor pools (max 4 workers each) for parallel TMDB API calls
- Global search: ThreadPoolExecutor(max_workers=3) fans out to TMDB movies, TMDB TV, and Jikan simultaneously
- Supabase PostgreSQL schema: 3 tables (watchlist, watched, watching), 3 composite unique indexes, 10 RLS policies
- Rate limiting via flask-limiter: 20–300 req/hr depending on endpoint sensitivity
- Security: RFC4122 UUID validation, 512 KB request body limit, profanity filter, security headers
- 7 smoke tests in tests/test_app_smoke.py

**Short description for portfolio card:**
Full-stack media discovery platform with 37 REST endpoints across movies, TV, and anime (TMDB + Jikan v4), a weighted recommendation engine using concurrent ThreadPoolExecutor pools, Groq LLM AI chat, 10 Supabase RLS policies, and Supabase Auth with OAuth/OTP/MFA.

**Bullet points (resume-style):**
- Built a full-stack media discovery platform with 37 REST endpoints integrating TMDB and Jikan v4 (MyAnimeList) APIs for movies, TV, and anime; deployed on Vercel with Supabase Auth supporting OAuth, OTP, and MFA/TOTP
- Engineered a content-based recommendation engine with two concurrent ThreadPoolExecutor pools (max 4 workers each) to parallelize TMDB calls; scored candidates via weighted formula: 40% frequency, 25% rating, 25% genre overlap, 10% quality
- Designed a Supabase PostgreSQL schema with 3 tables, 3 composite unique indexes, and 10 Row-Level Security policies; rate-limited all endpoints via flask-limiter (20–300 req/hr by route sensitivity)

---

### 2. Java JWT Authentication Service
**Stack:** Java 17 · Spring Boot 3.2.5 · Spring Security · JJWT 0.12.5 · JUnit 5 · Mockito · H2
**GitHub:** https://github.com/tirth6851/auth-service-java

**Verified facts (from pom.xml and source files):**
- Spring Boot 3.2.5, Java 17
- JWT library: JJWT (io.jsonwebtoken) 0.12.5
- Algorithm: HS256 (HMAC-SHA256) via Keys.hmacShaKeyFor
- Token claims: subject = userId, custom "email" claim; expiry: 1 hour (configurable via JWT_SECRET env var)
- BCryptPasswordEncoder (default strength, 10 rounds)
- H2 in-memory database (NOT production PostgreSQL)
- 2 endpoints: POST /auth/signup, POST /auth/login
- Custom OncePerRequestFilter for Bearer-token validation
- Spring Security: stateless session policy, CSRF disabled
- User enumeration resistance: uniform 401 for both wrong password AND unknown email
- Email normalized to lowercase before storage
- Startup guard: throws IllegalStateException if JWT secret is null, blank, or shorter than 32 chars

**17 automated tests breakdown (verified):**
- JwtUtilTest.java: 8 unit tests (token generation, claims extraction, expiry, startup validation)
- AuthServiceTest.java: 5 unit tests with Mockito (signup success/duplicate, login success/wrong-password/unknown-email)
- AuthControllerIntegrationTest.java: 4 MockMvc integration tests (HTTP contract + Spring Security filter chain)
- Total: 17 tests across 3 files

**Short description for portfolio card:**
Stateless JWT REST API (Spring Boot 3.2.5 / Java 17) with BCrypt hashing, HS256 token issuance (JJWT 0.12.5), a custom Spring Security filter, and 17 automated tests spanning unit (Mockito), JWT utility, and MockMvc integration layers.

**Bullet points (resume-style):**
- Built a stateless JWT REST API with BCrypt hashing, HS256 token issuance, and a custom Spring Security OncePerRequestFilter; enforced user-enumeration resistance via uniform 401 for both wrong-password and unknown-email scenarios
- Wrote 17 automated tests across 3 files: 5 Mockito unit tests (service logic), 8 JwtUtil unit tests (claims, expiry, startup secret validation), and 4 MockMvc integration tests (HTTP contract + Spring Security filter chain)

---

### 3. ComplexityLab
**Stack:** Next.js 16 · TypeScript 6 · React 19 · Supabase · Clerk · Groq · Vitest · Tailwind CSS
**Live:** https://complexity-lab-eight.vercel.app/
**GitHub:** https://github.com/tirth6851/ComplexityLab

**⚠️ CRITICAL CORRECTION — This is NOT a data structure visualizer.**
The app is a **Big-O code complexity analyzer**. There are no animated data structure visualizers. There is no LangChain, no FAISS, no RAG — the "AI" is a Groq LLM call with a deterministic fallback.

**Verified facts (from package.json and source files):**
- Next.js 16.2.7, React 19.2.7, TypeScript 6.0.3
- Clerk v7 for auth (Google OAuth only — no passwords)
- Supabase v2 for PostgreSQL database
- Groq SDK: model llama-3.3-70b-versatile, temperature 0, structured JSON output, 20s timeout
- No LangChain, no FAISS, no RAG, no vector database
- 7 programming languages supported: TypeScript, JavaScript, Python, Java, Go, Rust, C++
- 7 Big-O complexity classes: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ)
- 18 built-in code sample templates across the 7 languages
- Dual-engine pipeline:
  1. Groq LLM (primary): temperature 0, structured JSON (time, space, verdict, notes, confidence)
  2. Deterministic heuristic engine (fallback): detects loop nesting, recursion branching, memoization, halving patterns
- 3 Supabase tables: profiles, analyses (with JSONB result column), saved_snippets
- RLS enabled on all tables (deny-by-default)
- 14 app routes (6 public, 8 protected behind Clerk middleware)
- 30 test files using Vitest + Testing Library (jsdom)
- Monaco Editor (@monaco-editor/react) for code input
- No Framer Motion, no animation libraries — CSS/Tailwind only

**Short description for portfolio card:**
Full-stack Big-O code complexity analyzer for 7 languages (TypeScript, JavaScript, Python, Java, Go, Rust, C++) with a dual-engine pipeline: Groq LLM with automatic fallback to a deterministic heuristic engine. Clerk auth, Supabase PostgreSQL persistence, 18 code templates, and a 30-test suite.

**Bullet points (resume-style):**
- Built a full-stack Big-O code complexity analyzer for 7 languages (TypeScript, JavaScript, Python, Java, Go, Rust, C++) classifying 7 complexity classes (O(1) through O(2ⁿ)) with 18 built-in code templates and per-user history via Supabase PostgreSQL
- Implemented a dual-engine analysis pipeline: Groq LLM (temperature 0, structured JSON output) with automatic fallback to a deterministic heuristic engine detecting loop nesting, recursion branching, and memoization; backed by 30-test suite (Vitest + Testing Library)

---

### 4. SponsorScout AI
**Stack:** Next.js 14 · TypeScript · React 18 · Supabase · Groq · Framer Motion · Tailwind CSS
**Live:** https://sponsorscout-ai.vercel.app/
**GitHub:** https://github.com/tirth6851/sponsorscout-ai

**⚠️ CRITICAL CORRECTION — There is NO Java or Spring Boot in this project.**
The entire app is full-stack Next.js 14. The "backend" is Next.js API routes, not a separate Java service.

**Verified facts (from package.json and source files):**
- Next.js 14.2.5, React 18.3.1, TypeScript (strict mode)
- Framer Motion 12.38.0 for animations
- Supabase v2 for auth + PostgreSQL
- Groq SDK v1.2.0: model llama-3.3-70b-versatile (used for career strategy, NOT for job ranking)
- No tests (no testing framework in package.json)

**8-factor, 100-point scoring algorithm (scoreOpportunity in lib/matching.ts):**
| Factor | Max Points |
|---|---|
| Authorization compatibility (visa/OPT/CPT) | 30 pts |
| Skills overlap (% of required skills matched) | 22 pts |
| Sponsorship history (H1B track record) | 18 pts |
| Location / remote match | 10 pts |
| Industry alignment | 8 pts |
| Engineering discipline match | 7 pts |
| Role family preference (intern/co-op/full-time) | 5 pts |
| Experience level match | +5 pts bonus |

- Fit tiers: Realistic (≥75), Stretch (50–74), Low-Fit (<50)
- Returns: score, fit tier, up to 4 match reasons, up to 3 warning flags, recommended action string

**3 job API integrations (lib/jobs/ingest API route):**
- Adzuna API (engineering internships/entry-level)
- SerpApi / Google Jobs (broader coverage)
- USAJobs (US government / federal research lab positions)

**Sponsorship signal detection (lib/jobs/sponsorship-signals.ts):**
- 17 risky phrases (e.g. "no sponsorship", "us citizen only", "security clearance required")
- 16 positive phrases (e.g. "visa sponsorship available", "accepts opt")
- Returns: "Risky", "Better", or "Unclear"

**7 Supabase tables with RLS:**
profiles, student_profiles, opportunities, saved_opportunities, strategy_outputs, action_items, job_ingestion_runs / raw_jobs / normalized_jobs

**Short description for portfolio card:**
Visa-aware job-matching platform (Next.js 14, TypeScript, React 18, Supabase) with an 8-factor, 100-point scoring algorithm (authorization compatibility 30 pts, skills overlap 22 pts, sponsorship history 18 pts), multi-source ingestion from Adzuna, SerpApi, and USAJobs, sponsorship signal detection across 33 phrases, and Groq LLM for AI career strategy.

**Bullet points (resume-style):**
- Built a visa-aware job-matching platform with an 8-factor, 100-point scoring algorithm (authorization compatibility 30 pts, skills overlap 22 pts, sponsorship history 18 pts) classifying roles into Realistic/Stretch/Low-Fit tiers across 8 engineering disciplines
- Engineered a multi-source ingestion pipeline aggregating Adzuna, SerpApi (Google Jobs), and USAJobs APIs; normalized and deduplicated listings before persisting to Supabase PostgreSQL with RLS across 7 relational tables

---

## SKILLS (organized by category)

**Languages:** Python · Java · JavaScript · TypeScript · SQL

**Frameworks & Libraries:** Flask · Spring Boot · Next.js · Tailwind CSS · Framer Motion · React

**Databases & Cloud:** PostgreSQL · Supabase · Vercel

**Testing:** JUnit 5 · Mockito · Vitest · Testing Library

**Developer Tools:** Git · Groq API · Clerk · TMDB API · Jikan API

**Core CS Concepts:** Data Structures & Algorithms · OOP · REST API Design · JWT Authentication · Row-Level Security · Concurrency (ThreadPoolExecutor)

---

## ACTIVITIES / LEADERSHIP

**Secretary — CSU Billiards Club**
Cleveland State University

---

## PORTFOLIO SITE TODOS

The following things should be updated on the live portfolio at https://portfolio-green-delta-11.vercel.app/:

### High Priority
1. **Fix ComplexityLab description** — Remove all references to "data structure visualizers", "LangChain", "FAISS", "RAG-powered AI tutor". Replace with: Big-O code complexity analyzer supporting 7 languages with a dual Groq LLM + deterministic heuristic engine.
2. **Fix SponsorScout AI description** — Remove all references to "Java" or "Spring Boot" backend. It is full-stack Next.js 14.
3. **Add Groq AI chat to WatchNextAI description** — Also add "Jikan v4 / MyAnimeList" to the API integrations listed.
4. **Update JWT auth service description** — Clarify test breakdown: 8 unit (JWT) + 5 unit (service/Mockito) + 4 integration (MockMvc) = 17 total.

### Content to Add
5. **Operations Assistant role** — CENTERS Recreation Center, January 2026 – Present (currently probably missing or not updated)
6. **About section** — Update to reflect current bio (see bio section above)
7. **Skills section** — Add: Vitest, Testing Library, Framer Motion, Groq API, Jikan API, TMDB API

### Stack Labels to Fix Per Project
- WatchNextAI: Python, Flask, Supabase, PostgreSQL, Vercel, Groq (add Groq; remove React if listed)
- Java JWT Auth: Java 17, Spring Boot 3.2, JJWT 0.12.5, JUnit 5, Mockito (add JJWT version)
- ComplexityLab: Next.js 16, TypeScript 6, React 19, Supabase, Clerk, Groq (remove LangChain, FAISS)
- SponsorScout AI: Next.js 14, TypeScript, React 18, Supabase, Groq, Framer Motion (remove Java, Spring Boot)
