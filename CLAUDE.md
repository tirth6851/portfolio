# Portfolio — Project Rules

Vite + React 19 + TypeScript + Tailwind v4 + Motion + three.js. Single source of truth for content: `src/data/content.ts`. Verified repo evidence: `docs/project-evidence.md` and `docs/new-repos-evidence.md`.

## Workflow
1. Explore, then spec, then code. Plan before implementing; call `/advisor` for consequential decisions.
2. Commit after each verified task, naming files explicitly: `scripts/commit-task.sh "<type>: <msg>" <files...>`. Never `git add -A`/`.`; never stage `.claude/`, `.agents/`, `ditto.site/`, `.playwright-mcp/`, screenshots, or other agents' files.
3. Verify own work (build, lint, type-check, browser screenshots) before calling a task done. No automatic pushes or deploys.
4. Keep context lean: delegate noisy research/review to subagents; summarize between phases.

## Cost rule
Use free resources by default. Anything paid or of unknown price (Higgsfield generation, API credits, paid assets/fallbacks): ask first. Codex runs on the user's ChatGPT plan via `codex exec` (verified working); the Codex MCP tools are not loaded in-session.

## Content rules
- Never invent employment, metrics, skills, GPA (3.52 per needUpdate.md/content.ts), or availability.
- Decided by the owner (2026-10-06): target term is Summer 2027; published email is `t.patel76@vikes.csohio.edu`; canonical deploy target is Vercel (`https://portfolio-green-delta-11.vercel.app/`, vite `base: '/'`). Don't change these without asking.
- Do not adopt "AI/ML Engineer" titling; evidence supports backend / full-stack.

## Design direction (v2)
Dark, glowing, animated. The centerpiece is the full-viewport projects stage: one WebGL constellation, horizontal slide, tap a component to zoom into an evidence-backed explainer. DOM is the source of truth; canvas mirrors it. Must work without WebGL, with reduced motion, on mobile (touch swipe), and by keyboard. Explainer facts live in `src/data/explainers.ts` with a source per fact; only evidence docs may be cited; illustrative visuals must say so. Top five projects, in order: ComplexityLab, AI Guardrail, Java Auth (in progress), Blackbox Council (in progress), WatchNextAI.

## Multi-agent ownership
Lead integrates. Codex owns `src/scene/**` only. Verifier agent owns `docs/project-evidence.md` only. Use a separate git worktree for parallel implementation; review the real diff before merging.
