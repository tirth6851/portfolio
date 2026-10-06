# Reference "feel" notes (2026-10-06)

Method: each page was loaded in a real Chrome (headless, hardware GL), recorded while scrolling with the mouse wheel, hovering links, and sweeping the pointer, then turned into frame sheets with ffmpeg. Motion data (fonts, colors, transitions, GSAP/ScrollTrigger, canvases, libraries) was read from the live pages. View-only; nothing was copied, bought, or logged into. Raw captures live in the session scratch folder, not the repo.

## What was measured

| Site | Stack seen | Feel |
|---|---|---|
| gsap.com | GSAP 3.15 + ScrollTrigger + ScrollSmoother; 178 tweens, 12 ScrollTriggers (1 scrub, 1 pin of 3000px); easings `0.645,0.045,0.355,1` and `0.86,0,0.07,1` | Kinetic type: letters scramble then settle; copy highlights word by word on scroll; pinned sections; sticker-like labels |
| revelatio.studio (GSAP showcase) | GSAP + ScrollTrigger + Lenis + Webflow, 2 canvases | Dark; scramble-text preloader; dithered WebGL image that expands to full-bleed on scroll; dark-to-light inversion |
| huyml.co (GSAP showcase) | Framer Motion + Rive, 2 canvases; ease `0.22,1,0.36,1` | Character-animated preloader pushes the title in; tilted 3D stack of project cards; oversized numerals |
| illoca.unseen.co (GSAP showcase) | Lenis, 1 canvas; ease `0.4,0,0.2,1` | Warm paper tone, logo-build preloader, hero image scales from a small frame to full width |
| tasteskill.dev | CSS only; ease `0.22,1,0.36,1`, 0.5s | Restrained dark editorial, long calm reveals |
| threeui.com demos | three.js; sublevel.studio is a full lit 3D room (about 10 s load, red mono "LOADING" text, glass pill nav); Structure Flow is a particle dome | Heavy custom 3D assets; not reproducible without authored models |
| 21st.dev | not reachable as a motion reference (app shell; free component previews only, prompts are paid) | skipped |
| this portfolio (beta) | Motion only, no smooth scroll; one 0.15s transition | Clean but flat: almost no micro-interaction, no intro, no scroll choreography |

## Patterns that repeat

- A short, deliberate intro (scramble text, logo build, character) before the hero.
- Smooth scroll (Lenis) on 2 of 3 portfolio references; scroll-driven reveals rather than plain fades.
- A media element that grows from a small frame to full-bleed as you scroll.
- Out-expo easing family (`0.16-0.22, 1, 0.3-0.36, 1`) at 0.5-0.8s; short hovers around 0.3s.
- Texture (grain, dither, particles) so flat color fields feel tactile.

## Limits

- No video model was used to "watch" the recordings; judgments come from frame sheets plus measured data. A free Gemini key would let a model analyze the video directly.
- `claude-real-video` 0.10.7 (MIT, audited, installed in an isolated scratch venv, memory DB disabled) was run on four recordings for scene-change frames with timestamps. It selects better frames than a fixed rate and flags action bursts versus still periods. Recordings include page load plus a 3.5 s settle wait, so its intro timings are rough (about 2 s tolerance); the intros on these sites run roughly 3-8 s including load.
- "Let Me Watch / Video Analyzer" (MCP Market) was not installed: publisher and cost are unverified.
- Ditto's hosted API accepted the key but its queue never processed jobs (all stayed "queued"), so it was not used.
- Frame rate of the references was not measured.
