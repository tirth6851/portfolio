---
name: webgl-quality-review
description: Review the portfolio's WebGL/3D scene for loading, fallback, motion, and interaction quality. Use after any change under src/scene or any canvas/shader code.
---

Check each item with evidence (build output, Playwright screenshots, console), not assumption:
1. **Loading:** three.js only in a lazy chunk (compare `vite build` output); first paint does not wait on the scene.
2. **Fallback:** `?webgl=0`, no WebGL context, and context-loss all show a readable DOM/SVG equivalent. Page content is fully readable without WebGL.
3. **Motion:** `prefers-reduced-motion` gives a static frame; loop pauses offscreen and on `visibilitychange`; DPR capped (≤2).
4. **Lifecycle:** React StrictMode double-mount leaves one canvas; unmount disposes renderer, geometries, materials, listeners, rAF.
5. **Interaction:** every canvas interaction has a keyboard-reachable DOM control; focus visible; touch works; no scroll-trap.
6. **Performance/console:** no console errors or shader warnings; mobile uses a simpler path.
