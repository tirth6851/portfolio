---
name: portfolio-workflow
description: Explore → spec → code workflow for the portfolio repo, with named-file commits and self-verification. Use before any portfolio change.
---

1. **Explore:** read the affected files, `git status`, and `docs/project-evidence.md`. State what exists.
2. **Spec:** write the plan (files, owner, acceptance check) before editing. For architecture/design decisions call `/advisor` with evidence.
3. **Code:** make a scoped change. Run `npm run build` and `npm run lint`; inspect the rendered page in Playwright for UI work.
4. **Commit:** `scripts/commit-task.sh "<type>: <msg>" <named files>`. Never stage broad paths.
5. **Verify:** re-check against the spec; report what was and was not tested.
