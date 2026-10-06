# Tirth Patel — Portfolio

Personal portfolio for Tirth Patel, a Computer Science student at Cleveland State University seeking a Summer 2027 software engineering internship or co-op. A dark, glowing single-page site built around an interactive 3D scene that draws each featured project's real system architecture.

**Live:** https://portfolio-green-delta-11.vercel.app/

## Tech stack

- **React 19** + **TypeScript** (strict)
- **Vite** (build tooling / dev server)
- **Tailwind CSS v4** (`@tailwindcss/vite`, design tokens via `@theme` in `src/index.css`)
- **Motion** (`motion/react`) for reveals, tilt, count-up, and scroll progress
- **three.js** for the architecture scene (bloom, particles, perspective camera), lazy-loaded into its own chunk

## Highlights

- **Projects stage:** a full-viewport 3D scene holds all featured systems side by side. Drag or swipe to slide between projects; neighbors peek in. Tap a component and the page zooms into it, then a full-screen explainer opens (a neural-network diagram for LLM nodes, table cards for databases, route and rate-limit bars for APIs, and so on).
- **Honest visuals:** every real number in an explainer cites its source in `docs/`; concept illustrations (the neural net, classifier values, growth curves) are labeled "illustrative".
- **Data-flow trace:** a button animates data through each system's primary path, step by step (dashed fallback paths run only on failure).
- **Quality tiers:** bloom and particles on capable GPUs, an automatic step-down if frames run slow, and a lighter tier on touch devices.
- **Works without WebGL:** falls back to a swipeable glowing SVG diagram (or a readable request-path list on phones) if WebGL is unavailable, the context is lost, or the scene fails to download. Add `?webgl=0` to the URL to force it.
- **Cursor glow:** a soft glow follows the mouse on desktop (off for touch and reduced motion).
- **Accessibility:** the DOM is the source of truth (tabs and a component list drive the canvas), a real modal dialog with focus trap, Esc and browser-Back to close, a page-wide pause-animation control, `prefers-reduced-motion` support, skip link, and AA text contrast.

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
docs/            verified evidence behind every project claim, plus design research
src/
  data/          content.ts (copy, stats), architectures.ts (scene graphs), explainers.ts (drill-down facts + sources)
  scene/         three.js constellation (lazy-loaded): types.ts contract, runtime, world, camera, effects, quality
  sections/      Hero, ProjectStage, AlsoBuilt, About, Experience, Stack, Contact, Footer
  components/    SiteHeader, ExplainerModal, FallbackCarousel, ArchitectureDiagram, explainers/ (visuals), ...
  hooks/         useScrollSpy, useMediaQuery
```

## Updating content

Edit `src/data/content.ts` for text and stats, `src/data/architectures.ts` for scene graphs, and `src/data/explainers.ts` for the drill-down facts (each carries its source). Keep every number in line with `docs/project-evidence.md` and `docs/new-repos-evidence.md`, and re-run the repos' counts before changing one.
