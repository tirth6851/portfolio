# Tirth Patel — Portfolio

Personal portfolio for Tirth Patel, a Computer Science student at Cleveland State University seeking a Fall 2026 Software Engineering internship. Built as a single-page React app with scroll-driven animations, an animated WebGL background, and a neon-green dark theme.

**Live:** https://portfolio-green-delta-11.vercel.app/

## Tech stack

- **React 19** + **TypeScript**
- **Vite** (build tooling / dev server)
- **Tailwind CSS v4** (`@tailwindcss/vite`, tokens via `@theme`)
- **Motion** (Framer Motion — `motion/react`) for scroll animations
- **three.js** for the WebGL shader background
- **react-icons** for skill category icons

## Features

- Scroll progress bar, active-section nav highlighting (scrollspy), and staggered scroll-reveal animations (`whileInView`).
- Animated stat counters, a 3D "container-scroll" tilt on the projects grid, and a back-to-top button.
- Run-once "matrix" text scramble on the hero role subtitle.
- WebGL shader background (code-split, DPR-capped, paused on hidden tab).
- Full reduced-motion support (`useReducedMotion`) plus a CSS fallback.
- SEO/shareability: meta description, Open Graph + Twitter cards, favicon, `robots.txt`.

## Getting started

```bash
npm install
npm run dev      # start the dev server (http://localhost:5173)
npm run build    # type-check + production build → dist/
npm run preview  # preview the production build
npm run lint     # run ESLint
```

## Project structure

```
public/        static assets (resume, profile photo, favicon, og-image, robots.txt)
src/
  data/        content.ts — all portfolio content (single source of truth)
  hooks/       useScrollSpy, useCountUp
  components/  Navbar, ShaderBackground, MatrixText, Reveal, ScrollProgressBar, …
  sections/    Hero, About, Highlights, Projects, Experience, Skills, Contact, Footer
  App.tsx      composes the page
```

Edit `src/data/content.ts` to update projects, experience, skills, and contact info.

## Deployment

Deploys as a static SPA via **Vercel** (zero-config for Vite; build `npm run build`, output `dist/`). For a **GitHub Pages** project site, set `base: '/portfolio/'` in `vite.config.ts`.
