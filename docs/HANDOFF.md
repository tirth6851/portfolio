# Handoff (2026-10-06)

## Branch state
- `main` + tag `beta`: the beige editorial site, live on Vercel. Rollback point. Untouched.
- `v2`: the dark, glowing site with the 3D project stage. **Not pushed, not merged.**
  Preview: `git push -u origin v2`. Ship: `git checkout main && git merge --ff-only v2 && git push`.

## Done on v2 (all committed)
Slidable 3D stage, tap-to-zoom explainers (neural net, tables, routes, pipelines, weights, pool, JWT, curves), data-flow trace, cursor glow, page-wide pause, glow restyle of every section, independent review fixes (14), perf fix (scene is frozen while an explainer is open).

## Fixed and verified: explainer "keeps resizing / glitching" (user report)
- Cause (reproduced with real scrollbars; headless Playwright hides them by default): the modal panel overflowed by 1px, a vertical scrollbar appeared (15px), text re-wrapped, the scrollbar vanished, repeat every frame; the neural-net canvas was reset each flip.
- Fix (committed): `ExplainerModal.tsx` panel has `overflow-x-hidden` + `scrollbar-gutter: stable` + thin scrollbar; `index.css` html has `scrollbar-gutter: stable`; `NeuralNet.tsx` no longer resets the canvas unless its pixel size changed.
- Verified: `scripts/qa/resizetest.mjs` reports 0 problems across 8 viewport sizes x 5 components at DPR 1, and 0 at DPR 1.25 and 1.5 (Groq node).

## Not started: better component icons (user request)
The 3D nodes use generic shapes; the user wants recognisable icons (Clerk, Supabase, Flask, ...). 21st.dev content is paid/prompt-gated, so it was NOT used. Plan:
1. Free icon sets: Simple Icons (CC0, brand logos: Clerk, Supabase, PostgreSQL, Flask, Next.js, FastAPI, SQLite, Spring, JWT, Jinja, TMDB, ...) and Lucide (ISC, generic: brain-circuit for LLM, shield, filter, gauge, users, ...). Groq has no Simple Icons logo: use the generic LLM icon rather than a fake logo.
2. Add an optional `icon` id per node (map by `graphId:nodeId`), render it to a canvas texture, and replace the per-kind low-poly bodies in `src/scene/world.ts` with a glowing rounded tile (`RoundedBoxGeometry`) carrying the icon on its front face (white/ink glyph, `toneMapped: false` so bloom lights it). Show the same icon beside the title in `ExplainerModal.tsx` and in the SVG fallback (`ArchitectureDiagram.tsx`).
3. Keep icons in the lazy scene chunk where possible; re-run `node scripts/qa/webgl-test.mjs` (fps must stay ~60) and `node scripts/qa/fixes.mjs`.

## Facts and rules to keep
- Every number lives in `docs/project-evidence.md` / `docs/new-repos-evidence.md`; explainer facts in `src/data/explainers.ts` with a source each. Concept visuals say "illustrative".
- Decided by the owner: Summer 2027; email t.patel76@vikes.csohio.edu; Vercel deploy. Top projects in order: ComplexityLab, AI Guardrail, Java Auth (in progress), Blackbox Council (in progress), WatchNextAI.
- Free resources only; ask before paying; never push for the owner; commit named files only (`scripts/commit-task.sh`).
- Please rotate the Ditto API key that was pasted in chat.

## Not tested
A real phone, Safari, Firefox, other GPUs. All testing was headless Chrome on Windows (Intel UHD).
