# Tirth Patel — Portfolio

Personal portfolio for Tirth Patel, a Computer Science student at Cleveland State University seeking a Summer 2027 software engineering internship or co-op. An editorial single-page site with one interactive 3D scene that draws each featured project's real system architecture.

**Live:** https://portfolio-green-delta-11.vercel.app/

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite** (build tooling / dev server)
- **Tailwind CSS v4** (`@tailwindcss/vite`, design tokens via `@theme` in `src/index.css`)
- **Motion** (`motion/react`) for reveals, tilt, count-up, and scroll progress
- **three.js** for the architecture scene, lazy-loaded into its own chunk

## Highlights

- **Systems stage:** an interactive 3D scene per featured project (nodes are the real components, packets flow along the real request paths, dashed lines are real fallbacks). The DOM tabs and component list drive all state; the canvas only reflects it.
- **Works without WebGL:** falls back to an SVG diagram, or a readable request-path list on phones, if WebGL is unavailable, the context is lost, or the scene chunk fails to download. Add `?webgl=0` to the URL to force the fallback.
- **Accessibility:** keyboard-operable tabs and component list, a pause-animation control, `prefers-reduced-motion` support (static scene frame, no reveals), skip link, and AA text contrast.
- **Evidence-backed copy:** project numbers are counted from the source repositories (see `docs/`).

## Getting started

```bash
npm install
npm run dev      # dev server (http://localhost:5173)
npm run build    # type-check + production build -> dist/
npm run preview  # preview the production build
npm run lint     # ESLint
```

## Project structure

```
public/          static assets (resume, portrait, favicon, og-image, robots.txt)
docs/            verified evidence behind every project claim
src/
  data/          content.ts (copy, stats) and architectures.ts (3D scene graphs)
  scene/         three.js scene (lazy-loaded): runtime, geometry, labels, graph builder
  sections/      Hero, Systems, Work, About, Experience, Stack, Contact, Footer
  components/    SiteHeader, ArchitectureDiagram, SceneBoundary, Reveal, TiltCard, CountUp, ...
  hooks/         useScrollSpy, useMediaQuery
```

## Updating content

Edit `src/data/content.ts` for text and stats, and `src/data/architectures.ts` for scene graphs. Keep every number in line with `docs/project-evidence.md` and `docs/new-repos-evidence.md`, and re-run the repos' counts before changing one.
