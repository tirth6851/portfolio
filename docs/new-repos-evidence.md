# New repos evidence (read-only audit, 2026-10-06)

Method: shallow clones under .claude/jobs/252fa4ab/tmp/repos2/, source read, nothing executed, no dependencies installed. Test counts are declared `def test_*` counted by grep (tests were NOT run). Verdict key: CONFIRMED / CORRECTED / UNVERIFIABLE. No hard-coded secrets found in any repo (regex scan for key-shaped literals).

## Summary

| Repo | Verdict | Status | Commits | First / last commit |
|---|---|---|---|---|
| blackbox-council | strong | finished mock MVP; live-model path unverified | 8 | 2026-09-13 / 2026-09-14 |
| AI_Guardrail | strong | finished, documented, tested | 39 | 2026-06-28 / 2026-07-17 |
| markitdown-web | moderate | small finished wrapper, live | 19 | 2026-06-18 / 2026-08-11 |
| ai-browser-extension | skip (moderate at best as a prototype) | early prototype | 5 | 2026-03-23 / 2026-03-25 |
| numpy-image-studio | skip | coursework exercise | 5 | 2026-07-19 / 2026-07-25 |

---

## 1. blackbox-council

**What it is:** A pre-action policy gate for AI agents. A FastAPI backend runs a four-pass "council" (planner, red-team, privacy, arbiter) plus five prompt-perturbation tests, and deterministic policy rules decide the enforced outcome (block / approval required / etc.). A Next.js UI shows the report and drives approve, execute (simulated archive), and rollback. Finished in mock mode; the live Nemotron/Nebius path is implemented but, per its own README, never successfully run. 119 tracked files, ~3,480 lines in app/services+council+providers+counterfactuals+main, 8 commits over 2 days (2026-09-13 to 2026-09-14). Built for a hackathon; README says AI-assisted development.

**Stack (manifests):** Python 3.11 in CI; fastapi 0.141.1, pydantic 2.13.5, SQLAlchemy 2.0.52, uvicorn 0.52.4, openai 3.13.0 (client for Nebius), pytest 9.1.1 (apps/api/requirements.txt). Frontend Next.js App Router + TypeScript + Tailwind, Node 20 in CI, Playwright e2e (apps/web/package.json; versions not extracted, read it before quoting one). SQLite storage.

| Claim | Verdict | Evidence |
|---|---|---|
| "62 tests" (README) | CORRECTED: 74 declared backend test functions + 6 Playwright e2e tests | grep `def test_` in apps/api/tests: council 9, counterfactuals 13, decision_service_smoke 4, evaluations_api 11, health 1, live_failure_states 5, operator_credential 5, policy_engine 4, provider_validation 10, run_repository 2, schemas 6, state_machine 4 = 74; no parametrize. e2e: flow.spec.ts 3 + operator-auth.spec.ts 3. README number is stale; pass count unverified (not run). Frameworks: pytest, Playwright. |
| 6 evaluation API routes | CONFIRMED | apps/api/app/api/evaluations.py: POST "" (create), GET /{run_id}, GET /{run_id}/report, POST /{run_id}/approvals, POST /{run_id}/execute, POST /{run_id}/rollback; plus GET /health in app/main.py = 7 backend routes. Next.js adds 3 operator routes (login/logout/status) and one catch-all proxy route. |
| "Exactly four evaluation passes" | CONFIRMED | council/orchestrator.py records stages planner, red_team, privacy, arbiter (plus created, evaluating, decision_ready, counterfactuals). |
| "Five controlled prompt variations" | CONFIRMED | counterfactuals/variants.py VARIANTS = reword, remove_constraint, add_constraint, injection, replace_verb. Only reword + injection feed the stability score (STABILITY_VARIANT_IDS). |
| Deterministic policies override the model | CONFIRMED | services/policy_engine.py (pure, no network/db/model) + services/decision_service.py classify_candidate/select_final_decision; model output never sets the outcome. |
| Number of policy rules | CORRECTED: 12 distinct rule IDs appear in app code | grep of quoted IDs under apps/api/app: APPROVAL-001, AUTH-001, CMD-001, FILE-001, HOLD-001, NET-001, RET-001, SAFE-001, SAFE-002, SCOPE-001, SECRET-001, TRUST-001. TRUST-001 is info-only. README never states a count; say "12 rule IDs" only after re-verifying each is a live check. |
| Retention policy parameters | CONFIRMED | app/policies/retention-v1.json: inactive_days_min 180, modified_days_min 30, recovery_days_min 30, max_files 10, legal hold excluded, dry run + backup manifest + approval required. |
| Live model call works | UNVERIFIABLE (README itself says unverified) | README + docs/MODEL_INTEGRATION.md state the live Nemotron-via-Nebius call has not run successfully. Do NOT claim live Nemotron results. |
| Deployed | CORRECTED: not deployed | README: "not yet deployed from this repo". No homepage field. No Dockerfile/vercel.json found. |
| CI | CONFIRMED | .github/workflows/ci.yml: backend pytest (py3.11), frontend typecheck+lint+build (node 20), e2e Playwright in mock mode. Whether CI is green was not checked. |
| Operator auth on approve/execute/rollback | CONFIRMED (code present) | require_operator_credential dependency on those three routes; Next proxy attaches the secret server-side only after signed HttpOnly session cookie + same-origin check; tests/test_operator_credential.py. |

**Architecture path (real code):**
1. Browser: apps/web (Next.js page.tsx, task-form.tsx) -> same-origin proxy apps/web/src/app/api/v1/evaluations/[[...path]]/route.ts (attaches operator credential only for protected calls after session-cookie + same-origin check; login via api/operator/login/route.ts).
2. FastAPI apps/api/app/main.py -> router app/api/evaluations.py `POST /api/v1/evaluations`.
3. Branch on `mode`:
   - mock: fixture_loader.load_fixture (fixtures/retention-v1.json + policies/retention-v1.json; FixtureError -> 500) -> services/decision_service.run_mock_evaluation using the scripted mock provider (UnsupportedMockTaskError -> 422) -> run_repository.create_run (SQLite via SQLAlchemy).
   - live: check_operator_credential -> live_mode_configured? else 503 `live_mode_unconfigured` -> concurrency cap (409 `live_run_busy`) -> placeholder run -> LiveRunWorker.enqueue (202; client polls GET /{run_id}) -> council/orchestrator.run_council_evaluation: planner -> deterministic policy checks (decision_ready) -> red_team -> privacy -> counterfactuals (5 variants, counterfactuals/runner.py + scoring.py) -> arbiter. Provider chain: providers/budget.BudgetedProvider (per-run + daily call caps) wrapping providers/nebius.NebiusProvider (retry/backoff, sanitized errors); failures become typed failed states (CouncilRunFailed / ModelOutputError).
4. Policy gate: services/policy_engine.evaluate_candidate (CMD-001 shell payload, FILE-001 deletion blocked, SCOPE-001, SECRET-001, NET-001, AUTH-001, HOLD-001, etc.) + evaluate_context (TRUST-001 untrusted-repo-text injection flag) -> decision_service.classify_candidate -> outcome in {blocked, clarification_required, safeguard_required, approval_required, safe} -> select_final_decision (priority approval_required > safeguard_required > safe > clarification_required; blocked never selected) -> action_hash from dry-run + backup manifests (services/hashing.py, manifests.py).
5. Human gate: POST approvals (approval_service.submit_approval, bound to action_hash) -> POST execute (services/executor.execute_action; simulated archive only) -> POST rollback.
6. Report: GET /{run_id} or /report (JSON download).

**Safe-to-publish facts:**
- Four-pass council (planner, red-team, privacy, arbiter) + five controlled perturbation tests; deterministic policy engine overrides model output.
- Direct deletion is blocked by policy (FILE-001); the safe path is a bounded archive simulation needing human approval, a dry-run manifest, a backup manifest, and a 30-day recovery window, with approval bound to a hash of the exact action.
- Untrusted repository text is treated as data; an embedded "SYSTEM OVERRIDE" injection in the demo repo is flagged (TRUST-001) and cannot change the outcome.
- 74 backend tests (pytest) + 6 Playwright e2e tests declared; CI workflow with 3 jobs (backend, frontend, e2e).
- Operator-credential protection on approve/execute/rollback via a server-side proxy with signed HttpOnly session.
- Say "mock-mode demo; live model integration implemented but unverified". Never say it was run against Nemotron. Never say deployed. Do not say "62 tests".

**Verdict: strong.** Real architecture with a clear safety thesis, tests, CI and honest status; caveats are the 2-day hackathon timeline and the unverified live path.

---

## 2. AI_Guardrail

**What it is:** A layered prompt/response safety pipeline in Python (normalization, word-list + weapons backstop, injection heuristics, TF-IDF+LogReg classifier, Groq model call, output classifier, PII redaction) exposed through a CLI and a FastAPI shell with API-key tenants, rate limiting, offender escalation and multi-turn session hardening. Finished and extensively documented (HANDOFF.md, CLAUDE.md). 52 tracked files, ~1,416 lines in api/cli/guardrail core, 39 commits 2026-06-28 to 2026-07-17. Contains committed model artifacts (guardrail/models/*.joblib).

**Stack:** requirements.txt uses minimum versions only (no exact pins): groq>=1.5.0, scikit-learn>=1.9.0, pandas>=2.2.3, joblib>=1.5.3, fastapi>=0.115.12, uvicorn>=0.34.2, pytest>=8.3.5, httpx>=0.28.1, python-dotenv>=1.1.0. A curated requirements-lock.txt exists (self-described as hand-curated). LLM: llama-3.3-70b-versatile on Groq (guardrail/model.py MODEL_NAME). Python version not pinned in repo.

| Claim | Verdict | Evidence |
|---|---|---|
| API has `POST /check` and `GET /health` | CORRECTED: 4 routes | api.py: GET /health, POST /check, POST /chat/session, POST /chat/message. README only lists two; the chat endpoints exist and are tested. |
| Tests | CORRECTED / partial | Declared `def test_` = 63 (abuse 6, api 14, gate 5, manipulation 6, pipe_bomb_backstop 3, pipeline 14, policy 7, session 8); test_gate.py has 2 parametrize uses so collected count is higher. HANDOFF.md says "expect 71 passed" (UNVERIFIABLE, not run). Framework: pytest. README test list omits test_session, test_manipulation, test_pipe_bomb_backstop. |
| Pipeline stages (README diagram) | CORRECTED: README diagram is incomplete | Code also has guardrail/manipulation.py and guardrail/session.py (chat path: per-turn + cross-turn manipulation regexes, SESSION_LOCK_THRESHOLD=3 flagged turns, history of 6 turns, 3600 s TTL). |
| Classifier thresholds 0.30 input / 0.50 output, fail-closed | CONFIRMED | guardrail/judge.py INPUT_UNSAFE_THRESHOLD=0.30, OUTPUT_UNSAFE_THRESHOLD=0.50; except branches present for model load/classify errors (fail-closed per comments; exact return values not individually traced). |
| Metrics macro-F1 0.974, severe recall 1.000, benign FP 0.048 (README) | UNVERIFIABLE and INCONSISTENT | HANDOFF.md says `eval/run.py` should give macro-F1 1.000, FP 0.000. The guardrail/__init__.py docstring cites 0.921 / 0.143 for an older TF-IDF baseline. Three different sets of numbers. Not run. The eval corpus is only 38 hand-built cases (counted 38 lines across eval/corpus/*.jsonl, matches README), so any F1 is on a tiny author-written set. Do not publish F1 numbers. |
| Trained on wildguardmix | CONFIRMED in code comments, data not in repo | train_classifier.py header cites wildguardmix parquet; dataset is gitignored (gated). Not reproducible from the repo. |
| Banned-word / backstop lists | CONFIRMED | banned.txt 270 non-empty lines; harmful_terms.txt 59 non-empty lines (grep -c .; may include comment lines). |
| PII redaction | CONFIRMED | guardrail/pii.py patterns: EMAIL, SSN, CREDIT_CARD, PHONE, IP (5). |
| Injection heuristics | CONFIRMED | guardrail/injection.py labeled regex list (ignore-previous, disregard-prior, DAN persona, jailbreak mode, developer mode, pretend-no-restrictions, system-prompt exfiltration, act-as-unrestricted; about 9 patterns). |
| CI / Docker / deploy | CORRECTED: none | No .github/workflows, Dockerfile or deploy config. No live URL. |
| Abuse controls | CONFIRMED, with limits | guardrail/abuse.py in-memory sliding-window rate limiter + offender tracker per tenant; README admits single-process only. HTTP codes 401 / 403 / 429 / 413 confirmed in api.py (MAX_PROMPT_BYTES 8192 per README, constant not individually traced). |
| Unresolved issue | FLAG | HANDOFF.md: an original "pipe bomb passes SAFE" report is "still unexplained, not disproven" (a later backstop layer was added). Do not claim robust weapons coverage. |

**Architecture path (real code):**
- Entry A: cli.py (full pipeline, `--no-model`, `--chat` REPL). Entry B: api.py FastAPI: `require_tenant` (X-API-Key -> guardrail/policy.get_tenant; 401) -> prompt size check 413 -> offender_tracker.is_escalated 403 -> rate_limiter.allow 429 -> `screen_input` (no_model) or `process_prompt`. `/chat/message` instead calls guardrail/session.process_turn (session-lock check, manipulation checks per turn and across last 6 turns, then the same core pipeline, lock after 3 flagged turns). Every request logged via guardrail/store.log_interaction (analytics.db, prompt hashed with salt); UNSAFE results feed offender_tracker.record_unsafe. Only generic public_message + answer leave over HTTP.
- Core `screen_input` (guardrail/__init__.py): normalize.expansions (unicode fold, leetspeak, zero-width strip, base64/hex decode into variants) -> for each variant: filter.local_filter (banned.txt) then backstop.backstop_check (harmful_terms.txt + instructional intent), UNSAFE short-circuits -> injection.injection_check -> judge.judge_input (TF-IDF+LR, 0.30) -> SAFE/UNSAFE.
- `process_prompt`: screen_input (UNSAFE returns) -> model.call_model (Groq) -> failure branch returns decision ERROR (error text never used as an answer) -> judge.judge_output (0.50; UNSAFE returns) -> pii.redact -> Result.
- Not in live path: DistilBERT classifier (ml_input_classifier.py), evaluated and rejected per docstring.

**Safe-to-publish facts:**
- Layered pipeline: normalization/decoding, banned-word filter, intent-gated weapons backstop, injection heuristics, TF-IDF+LogReg input classifier (threshold 0.30), Groq llama-3.3-70b-versatile call, output classifier (0.50), PII redaction (5 pattern types).
- 4 API routes, API-key tenant auth, per-tenant rate limit, repeat-offender escalation, multi-turn session lockout after 3 flagged turns; no scores leaked over HTTP.
- At least 63 declared pytest tests (author notes say 71, unverified) including a regression gate with protected anchor cases; 38-case offline eval corpus.
- Evaluated and rejected a DistilBERT alternative because it regressed a protected case (documented engineering judgment).
- Honest limits: in-memory abuse state, single process, tiny eval set, no CI. Do not publish an F1 figure.

**Verdict: strong.** Substantial, well-tested, security-minded pipeline with unusually honest documentation; weaknesses are the tiny self-authored eval and no CI/deploy.

---

## 3. markitdown-web

**What it is:** A small Flask app wrapping Microsoft's MarkItDown library, with a single-page Tailwind frontend (index.html, 591 lines) to convert uploaded files or pasted text/HTML to Markdown; deployed on Vercel. app.py is 123 lines. 18 tracked files, 19 commits 2026-06-18 to 2026-08-11. A thin wrapper: conversion is Microsoft's library; the only original backend logic is the image-to-metadata function (Pillow + 9 EXIF tags).

**Stack:** Python 3.12 (.python-version), Flask (unpinned), flask-cors (unpinned), markitdown[pdf,docx,pptx,xlsx,xls]==0.1.6, Pillow (unpinned). Vercel `@vercel/python` + `@vercel/static` (vercel.json).

| Claim | Verdict | Evidence |
|---|---|---|
| Live at https://markitdown-web-rho.vercel.app | CONFIRMED | `curl` HTTP status 200 (2026-10-06). Also the repo homepage field. Conversion endpoints not exercised. |
| 2 API endpoints | CONFIRMED | app.py: POST /api/convert (multipart `file`), POST /api/convert-text (JSON `content`), plus GET / serving index.html = 3 routes. |
| Supported formats PDF/docx/xlsx/pptx/images/HTML/CSV/JSON/text | CORRECTED for images | Images are NOT converted by MarkItDown: app.py `_image_to_markdown` returns only a table of format, dimensions, color mode and up to 9 EXIF fields (IMAGE_EXTS has 10 extensions); no OCR/caption. Other formats rely on markitdown 0.1.6; not exercised. |
| 50 MB upload limit | CONFIRMED (config) | app.py MAX_CONTENT_LENGTH = 50 MB. Vercel serverless body limits are lower, so large uploads may fail in production (UNVERIFIABLE). |
| Tests / CI | CORRECTED: none | No test suite or CI; only test-files/ samples (csv, docx, html, json, pdf, pptx, xlsx) and generate_test_files.py. |
| Error handling | CONFIRMED | 400 on missing file/content, 500 on exception with str(e) returned (leaks exception text), temp file deleted in finally. No file-type allowlist, no auth, CORS open to all (CORS(app)). |

**Architecture path:** Browser index.html (drag/drop, paste, Ctrl+Enter) -> fetch POST /api/convert or /api/convert-text -> Vercel route `/api/(.*)` -> app.py Flask -> temp file written -> branch: extension in IMAGE_EXTS ? `_image_to_markdown` (Pillow metadata) : `MarkItDown().convert(path)` -> JSON `{markdown}` or `{error}` -> temp file removed -> result card with Copy / Save .md in the UI.

**Safe-to-publish facts:**
- Live on Vercel (HTTP 200 at audit time); Flask backend + MarkItDown 0.1.6 + vanilla HTML/Tailwind frontend.
- 2 conversion endpoints (file upload and pasted text/HTML), 50 MB limit configured in Flask.
- Seven sample files for manual testing. Image handling returns metadata/EXIF only.
- Do not claim tests, CI, OCR, or that you wrote the conversion engine.

**Verdict: moderate.** Live and tidy but a thin wrapper around a Microsoft library; fine as a deployed small tool, not as a depth piece.

---

## 4. ai-browser-extension

**What it is:** A Chrome Manifest V3 extension (v0.2.0) that watches AI chat pages (claude.ai, chatgpt.com, Gemini) for `[ACTION: platform.method({json})]` tags in assistant replies, shows a confirm toast, then runs the action on supabase.com or vercel.com using the user's logged-in session. Prototype: 13 files, ~800 lines JS, 5 commits over 3 days (2026-03-23 to 2026-03-25), no tests, no CI, not on the Web Store.

**Stack:** Plain JS, manifest_version 3, permissions tabs/activeTab/scripting/storage, host permissions for the 3 chat sites (4 hostnames) + supabase.com + vercel.com. No package manifest, no dependencies.

| Claim | Verdict | Evidence |
|---|---|---|
| Supported actions | CONFIRMED: 7 | supabase.js: createTable, getApiKeys, createProject; vercel.js: getDeploymentLogs, setEnvVar, listDeployments, getLatestDeploymentStatus. |
| Supports Claude, ChatGPT, Gemini | CONFIRMED (code present) | chat-watcher.js PLATFORM_CONFIG selectors for 4 hostnames. Selectors are DOM scraping and may be stale; UNVERIFIABLE that it works today. |
| User confirmation before executing | CONFIRMED | service-worker.js stores pendingActions; executes only on EXECUTE_ACTION from the toast. |
| API-key settings | CORRECTED: stored but unused | popup.js saves Anthropic/OpenAI/Google keys to chrome.storage.local; grep finds no code that uses them. |
| Works end to end | UNVERIFIABLE | No tests. Auth approach is fragile: the Supabase script reads the session token out of page localStorage; the Vercel script reads `token` from localStorage/cookies. Whether those exist there today is unverified (httpOnly cookies cannot be read). |
| Security | FLAG | AI-chat output can trigger privileged actions (create tables, fetch service-role keys, set env vars) via extracted session tokens; the only guard is a toast confirmation. Pending actions live in service-worker memory (lost when the MV3 worker suspends). Not something to showcase as a safe design. |

**Architecture path:** AI chat tab -> content/chat-watcher.js (MutationObserver, ACTION_REGEX, JSON.parse payload; parse failure -> console warn and skip; honors `extensionEnabled` in chrome.storage) -> chrome.runtime message ACTION_DETECTED -> background/service-worker.js (pendingActions map, logAction) -> SHOW_TOAST to chat tab -> user clicks Execute -> EXECUTE_ACTION -> service worker finds or opens the platform tab (supabase.com/dashboard or vercel.com/dashboard; unknown platform -> error toast), `chrome.scripting.executeScript` injects content/platform-scripts/{supabase,vercel}.js -> EXECUTE_PLATFORM_ACTION -> platform script calls api.supabase.com / api.vercel.com with the extracted token -> PLATFORM_RESULT -> service worker -> ACTION_RESULT toast in the chat tab; history persisted to chrome.storage (shown in popup).

**Safe-to-publish facts:**
- Manifest V3 extension, ~800 lines of JS, 7 actions across Supabase and Vercel, confirm-before-run toast, built for three chat UIs.
- Describe as an early prototype (v0.2.0). Do not claim it is tested, published, or secure.

**Verdict: skip** (moderate at best as a prototype line item). Early, untested, and its core mechanism (scraping session tokens) is a security liability a reviewer would question.

---

## 5. numpy-image-studio

**What it is:** A learning exercise: a CLI photo filter tool where all pixel math is NumPy-only (13 filters in filters.py, 231 lines; main.py 108 lines; utils.py 149 lines). PLAN.MD describes it as a "first real NumPy project" with an unchecked skills checklist. 24 files (3 sample images, a smoke-test notebook, docs/CODEBASE_EXPLAINED.md), 5 commits 2026-07-19 to 2026-07-25.

**Stack:** numpy>=1.26, matplotlib>=3.8, pillow>=12.3.0 (requirements.txt). No tests (only smokeTest.ipynb), no CI, no deploy, no URL.

| Claim | Verdict | Evidence |
|---|---|---|
| "Pure NumPy" filters | CONFIRMED | filters.py uses np only (vectorized box blur via shifted sums, 3x3 convolutions for sharpen/emboss/edge); Pillow/Matplotlib only in utils.py I/O. |
| Filter count | CONFIRMED: 13 public functions | to_grayscale, adjust_brightness, adjust_contrast, invert, flip_horizontal, flip_vertical, rotate_90, crop, add_noise, blur, sharpen, emboss, edge_detect. CLI subcommand names not individually enumerated. |
| Tests | CORRECTED: none | No test files; a notebook smoke test only. |

**Architecture path:** `python main.py <input> <filter> -o <out>` -> argparse (main.py build_parser/build_kwargs) -> utils.load_image + validate_image -> filters.<fn> (returns new array; float math then clip to uint8) -> utils.save_image.

**Safe-to-publish facts:** 13 NumPy-only image filters via a CLI. Mention only as a fundamentals exercise, if at all.

**Verdict: skip.** Tutorial-grade coursework with no tests or deploy; adds nothing beyond the stronger repos.

---

## Recommendation and red flags

Best three to add: (1) blackbox-council, (2) AI_Guardrail, (3) markitdown-web (only because it is live; otherwise omit).

Red flags to avoid claiming:
- blackbox-council: live Nemotron run (never verified), deployment, and "62 tests" (actual 74 declared).
- AI_Guardrail: any F1/recall/FP number (README, HANDOFF and docstring disagree); "only 2 endpoints" (actually 4); robust weapons coverage (open unexplained bypass report); CI (none).
- markitdown-web: image OCR/conversion (metadata only), tests, "built a converter" (wraps MarkItDown).
- ai-browser-extension: token-scraping design and unused API-key fields.
