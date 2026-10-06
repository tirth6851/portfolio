---
name: agent-handoff
description: Rules for delegating and receiving work between the lead and Codex/subagents on the portfolio. Use when briefing an agent or integrating its output.
---

**Briefing (lead → agent):** exact owned paths; prop/type contract; constraints (no new deps, free resources only); acceptance command (`npm run build`); what NOT to touch (everything else, incl. other agents' files).

**Return (agent → lead):** list of files changed; command output proving build/lint/tests ran; known gaps. A summary is not evidence.

**Integration (lead):** read the actual diff (`git diff <base>..<branch> --stat` then the files); confirm no edits outside owned paths; run build/lint/browser check on the merged result; commit only task-owned files by name. Use a separate worktree for parallel work; one owner per file.
