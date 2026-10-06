---
name: portfolio-case-study
description: Write project case studies for the portfolio strictly from verified repository evidence. Use when writing or editing project descriptions, metrics, or architecture claims.
---

- Source of truth: `docs/project-evidence.md` (counts with file paths) and `src/data/content.ts`.
- Every number needs a CONFIRMED verdict in the evidence file. If CORRECTED, use the corrected value. If UNVERIFIABLE, omit it.
- Structure per project: problem → architecture (ordered real components) → one notable engineering decision → evidence (tests, schema, limits) → links. No marketing adjectives; no invented features, users, or traffic.
- Count tests as individual cases, not files. Say "live demo" only for URLs that returned HTTP 200.
- Flag unresolved facts instead of guessing.
