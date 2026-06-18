# Portfolio Redesign Brief — Tirth Patel

> **Build plan based on aaabadcode.com audit vs. current portfolio state.**
> Use this file directly — headings map to implementation tasks, bullets are spec.

---

## 1. Reference Portfolio Audit — aaabadcode.com

### What it is
Single-page developer portfolio for an AI engineer. React/Next.js, Tailwind, Geist font system.

### Design tokens extracted

| Token | Value |
|---|---|
| Background | `#010102` (near-pure black) |
| Foreground | `#eee` |
| Card bg | `#040609` at 50% opacity |
| Primary accent | `#00c8c8` (cyan) |
| Secondary bg | `#0f1216` |
| Border | `rgba(255,255,255,0.08)` (ring, not solid border) |
| Card radius | `14px` |
| Section padding | `128px 24px` (py-32) |
| h1 size | `72px`, weight 700, line-height 1 |
| h2 size | `36px`, weight 700 |
| Body font | Geist (sans) |
| Mono font | Geist Mono |
| Badge radius | `26px` (fully pill-shaped) |

### What makes it feel polished (key principles)

1. **Single accent color discipline.** Only `#00c8c8` is the accent. No gold, no secondary accent fighting for attention. Every interactive element, every glow, every gradient uses it.
2. **Opacity-based cards.** Cards are `bg-card/50 backdrop-blur-sm` with a `ring-1 ring-white/10` instead of a solid visible border. Creates depth without heaviness.
3. **Generous vertical spacing.** `128px` top/bottom per section. The blank space is doing as much work as the content.
4. **The `// sectionname` prefix pattern.** Tiny monospace label above every h2 in the accent color. Signals developer personality without effort.
5. **Gradient text on the name span.** `linear-gradient(135deg, cyan → purple/blue → cyan)` on `background-clip: text`. Single-word visual anchor on h1.
6. **"Available" badge with `animate-ping`.** Green dot pulsing next to availability status makes the hero feel alive without a background animation.
7. **Geist + Geist Mono.** Specifically designed for developer UIs. Every heading feels intentional.
8. **Font size confidence.** 72px h1 takes up space unapologetically. Smaller portfolios timidly use 48px.
9. **Pill tags everywhere.** `rounded-full` for all tech tags — consistent, reads as "labels" not "chips".
10. **Progress bars in Skills.** Shows skill depth at a glance vs. a flat tag grid.
11. **Terminal widget in About.** `$ whoami` → name. `$ cat skills.txt` → tech stack. `$ echo $STATUS` → "building the future." Developer-flavored biography.
12. **Fixed header at 80% opacity.** Frosted glass nav that scrolls with you without being opaque.
13. **Scroll indicator** in hero — small animated down-arrow at bottom of viewport.
14. **Left-aligned hero layout** — not centered. More editorial, less resume-template.

### Things NOT to copy from aaabadcode.com

- **Cyan as accent.** Tirth's green identity is distinctive. Keep green but modernize it.
- **The terminal widget content.** It fits an AI/ML engineer's brand. Tirth's story is different (CS student, teacher, recommendation systems).
- **Progress bars with fake percentages.** Showing "95% PyTorch" looks great for a senior engineer. For a student, precise percentages seem contrived. Use a different skill display.
- **The blog section.** Only add if you have real posts. An empty section hurts more than no section.
- **The company logos** in experience. Not the same context.
- **AI/ML branding.** The whole site is tuned for that persona. Tirth is CS + Python + Java + backend.

---

## 2. Current Portfolio Honest Critique

### What's already good
- Framer Motion throughout — Reveal, RevealGroup, flip effects all work well
- ShaderBackground (Three.js) gives a unique depth effect
- MatrixText scramble on hero title is memorable
- LiquidButton glassmorphism is original
- ScrollProgressBar + BackToTop are polished touches
- Scroll spy in navbar is correct
- Fixed navbar with mobile hamburger is implemented
- Content structure (Hero → About → Highlights → Projects → Experience → Skills → Contact) is logical
- `py-20` spacing is reasonable

### What's hurting it

#### Color system
- **Forest green (`#0f5132`) + gold (`#c9a96b`) combo reads as "GitHub dark mode" or "sports team branding."** It doesn't say "modern tech" — it says "corporate template."
- Gold is used for section titles and card headings. This creates hierarchy confusion between accent (green) and emphasis (gold). One accent, one purpose.
- Card border is `border-accent-primary` (forest green) — very visible, turns every card into a box. Cards should feel like surfaces, not containers.

#### Typography
- **Segoe UI** is the Windows system UI font. It has no personality and renders differently on every OS. It's the default you use when you don't pick one.
- Section titles at `text-3xl` (30px) — understated. The reference uses 36px.
- The underline bar on SectionTitle looks like a Bootstrap "divider."

#### Hero
- **Circular portrait photo** centered above the title — reads as a LinkedIn headshot, not a developer hero. If you keep the photo it needs more intentional placement.
- Three LiquidButtons in a row (Resume, GitHub, LinkedIn) — important signal (your CTAs) buried in the same visual weight as each other. Primary action should dominate.
- Badges cycling `"Open to Fall 2026 SWE Internships"` etc. are good information but look like pill-badge salad.
- No availability indicator (the "Available for new projects" ping dot is an insight worth adapting).

#### About
- **One paragraph.** That's it. No stats, no personality, no visual interest. This section currently does very little.
- No stats (GPA, projects built, courses completed, etc.) displayed visually.

#### Projects
- Cards work but no project thumbnails / preview images — looks like a list.
- `border-accent-primary` solid border is too heavy.
- The `✓` list bullets feel dated.

#### Skills
- Flat tag cloud in a box — functional but the lowest visual-interest skills section possible.
- No differentiation between "comfortable" and "learning" skills.

#### Experience
- Alternating left/right Reveal directions on a centered max-w-3xl container is invisible on desktop (cards don't offset left/right, just fly in from different sides). This is animation for no visual reason.
- Good content, just needs vertical timeline treatment.

#### Contact
- `border-l-4 border-accent-primary` cards = visually dated left-border card pattern.
- RainingLetters background effect — fun, but it conflicts with the ShaderBackground already running globally. Double background effects compete.

#### Section headers (SectionTitle)
- `text-accent-gold` centered title + gradient underline = very 2020 portfolio.
- Replace with the `// prefix` + left-aligned h2 pattern.

---

## 3. Redesign Direction

### Core principle
**Keep Tirth's green identity. Evolve it from "forest/GitHub green" to "neon/tech green."**
Drop gold entirely. Replace with near-white as the emphasis color. One neon, one dark, one white — that's the full palette.

### New color system

```css
@theme {
  /* Backgrounds */
  --color-bg-primary:    #030c06;   /* near-black, slight green tint — intentional */
  --color-bg-secondary:  #091409;   /* slightly lighter */
  --color-bg-card:       #0d1a10;   /* card surface */

  /* Accent — neon tech green replaces forest green + gold */
  --color-accent:        #00e676;   /* primary neon green */
  --color-accent-dim:    #00b85a;   /* hover / interactive states */
  --color-accent-glow:   rgba(0, 230, 118, 0.15); /* for box-shadows and glows */

  /* Text */
  --color-text-primary:  #f0faf2;   /* near-white with green undertone */
  --color-text-secondary:#9dbfa5;   /* cool gray-green */
  --color-text-muted:    #4d7558;   /* darker muted */

  /* Borders — never solid, always opacity */
  --color-border:        rgba(0, 230, 118, 0.10);
  --color-border-hover:  rgba(0, 230, 118, 0.25);
}
```

**Why this works:**
- `#00e676` is Tailwind's `green-400` equivalent — reads as neon/tech, not plant/nature
- Removing gold removes the competing second accent
- `bg-primary: #030c06` vs `#050809` — the slight green tint makes the near-black feel designed, not default
- `rgba` borders scale up on hover without changing from one color to another

### Font system upgrade

Replace `Segoe UI` with **Inter** (or Geist if you want to mirror the reference):

```css
/* Option A — Inter (safe, readable, universally loved) */
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
--font-sans: 'Inter', ui-sans-serif, system-ui, sans-serif;

/* Option B — Geist (closer to reference, more developer-native) */
/* via npm: @fontsource-variable/geist */
--font-sans: 'Geist Variable', ui-sans-serif, system-ui, sans-serif;
--font-mono: 'Geist Mono Variable', ui-monospace, monospace;
```

Use the mono variant for badges, terminal blocks, `// section` labels, and code-like UI elements.

### Spacing scale upgrade

| Context | Current | New |
|---|---|---|
| Section py | `py-20` (80px) | `py-28` or `py-32` (112–128px) |
| Card padding | `p-8` (32px) | `p-6` (24px) inner, let ring provide visual edge |
| Gap between cards | `gap-8` (32px) | keep |
| Max-width container | `max-w-[1200px]` | keep |

---

## 4. Section-by-Section Recommendations

### Navbar

**Current issues:** Green bottom border, Segoe UI, MatrixText cycling in logo is confusing.

**Fix:**
- Remove `border-b border-accent-primary`. Use only the `bg/75 backdrop-blur` + a very subtle `ring-b ring-white/5` (or no border at all, just the blur).
- Replace MatrixText logo cycling with a stable text: `tirth.dev` or just `Tirth Patel` — one identity, not three.
- Make active link underline use `#00e676` instead of green.
- Nav link color: `text-text-secondary` → hover `text-text-primary` → active `text-accent` with `after:bg-accent` underline. Clean progression.
- Consider adding a GitHub icon link and Resume button in the nav right side.

```
Logo: "Tirth Patel"  |  About · Projects · Experience · Skills · Contact  |  [Resume ↗]
```

### Hero

**Current issues:** Centered photo + centered text = LinkedIn profile page vibes.

**Option A (safe refresh):** Keep centered, replace photo treatment
- Remove the circular avatar from the hero entirely — move to About section
- Add "Available for Fall 2026 Internship" availability badge with green animate-ping dot
- Upgrade h1 to `text-6xl md:text-7xl` (60-72px), bold
- Apply gradient to last name: `bg-gradient-to-r from-accent to-accent-dim bg-clip-text text-transparent`
- Replace three equal LiquidButtons with: one primary CTA (solid neon green, dark text) + one ghost CTA (transparent, neon border)
- Add scroll-down indicator at bottom of hero viewport

**Option B (layout evolution):** Left-aligned hero
- Left column: availability badge → name → tagline → CTAs → social links
- Right column: could be a decorative code block, terminal mockup, or stylized avatar
- Better for scanability on desktop

**Availability badge to add:**
```tsx
<div className="flex items-center gap-2 rounded-full border border-accent/20 bg-accent/5 px-4 py-1.5 text-sm text-accent">
  <span className="relative flex h-2 w-2">
    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-75" />
    <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
  </span>
  Available for Fall 2026 Internships
</div>
```

**CTA button pair:**
```tsx
/* Primary */
<a className="rounded-lg bg-accent px-6 py-2.5 text-sm font-semibold text-bg-primary transition hover:bg-accent-dim">
  View My Work
</a>
/* Ghost */
<a className="rounded-lg border border-accent/25 px-6 py-2.5 text-sm font-medium text-text-primary transition hover:border-accent/50 hover:bg-accent/5">
  Get in Touch
</a>
```

### About Section

**Current state:** One paragraph. Almost no visual impact.

**Minimum upgrade (medium effort):**
```
// about
"Who I Am"

[2-column layout]
Left (40%):
  - Photo of Tirth (more casual/natural than LinkedIn headshot)
  - Terminal-style widget showing:
      $ whoami
      > tirth_patel
      $ cat current.txt
      > cs_student, stem_teacher, builder
      $ echo $STATUS
      > seeking fall 2026 internship
      
Right (60%):
  - 2-3 sentence bio (rewrite the current one — it's too resume-formal)
  - 4 stat counters in a 2×2 grid:
      - 3.54 GPA
      - 10+ Java Projects
      - 10 CS50P Problem Sets
      - 2 Internship Apps Submitted (or "1 Course Completed")

```

**Stat cards:**
```tsx
<div className="rounded-lg border border-border bg-bg-card/50 p-4 text-center">
  <p className="text-3xl font-bold text-accent">3.54</p>
  <p className="text-sm text-text-muted">Cumulative GPA</p>
</div>
```

**Bio rewrite direction:**
Current: formal, passive, resume-speak.
New: first-person, active, curious.
> "I'm a CS student at Cleveland State building real things with Python and Java. I teach precalculus to my peers, which means I know how to explain hard problems simply — a skill that transfers directly to code reviews and documentation. Right now I'm building recommendation systems and looking for a Fall 2026 internship where I can contribute from day one."

### Projects Section

**Current issues:** No thumbnails, heavy green borders, `✓` bullets feel dated.

**Card redesign:**
- Switch from `border border-accent-primary` to `ring-1 ring-accent/10` — cards feel like surfaces not containers
- Add a subtle top gradient strip per card: `h-0.5 w-full rounded-t-xl bg-gradient-to-r from-accent/50 to-transparent`
- Remove `✓` bullets — use `→` or plain `li` with a small colored dot
- Tech tags: change from `rounded-md` to `rounded-full` (pill shape), reduce to `px-2 py-0.5 text-xs`
- Add `"Live Demo"` and `"GitHub"` links as icon+text at card bottom, not just arrow text
- Hover state: `hover:ring-accent/30 hover:shadow-[0_8px_32px_rgba(0,230,118,0.1)]`

**Optional — project card header image:**
For WatchNextAI, generate or screenshot a preview. Even a simple colored gradient header band with the project name on it is better than no image.

```tsx
/* Card accent top strip */
<div className="h-0.5 rounded-t-xl bg-gradient-to-r from-accent/60 via-accent/20 to-transparent" />
```

### Skills / Tech Stack Section

**Current state:** Flat tag cloud in 2-column grid. Looks like an afterthought.

**Upgrade option A — icon pills with hover glow:**
Keep the tag approach but add SVG devicons / simple icons per skill and enhance hover:
```tsx
<span className="group flex items-center gap-2 rounded-full border border-accent/15 bg-bg-card px-4 py-2 text-sm transition hover:border-accent/40 hover:bg-accent/5 hover:shadow-[0_0_12px_rgba(0,230,118,0.15)]">
  <img src={iconUrl} className="h-4 w-4" />
  {skill}
</span>
```

**Upgrade option B — category cards with proficiency rings:**
Instead of progress bars (looks contrived for a student), show proficiency as a simple label:
- `Primary` — skills you use in every project
- `Familiar` — skills you know and have used
- `Learning` — currently building

**Category card structure:**
```
Languages         [icon]
──────────────
Python  [Primary]
Java    [Primary]  
JavaScript [Familiar]
SQL     [Familiar]

Web & Backend
──────────────
Flask   [Primary]
...
```

### Experience Section

**Current issues:** Alternating reveal directions look fine on mobile but add no visual value on desktop. Missing timeline connector.

**Upgrade — vertical timeline:**
```
    │
    ●── [STEM Peer Teacher]
    │   Cleveland State University · July 2025–Present
    │   [tag] [tag]
    │   • bullet
    │
    ●── [Operations Assistant]
    │   ...
```

Implementation:
```tsx
<div className="relative ml-4 border-l border-accent/20 pl-8">
  <div className="absolute -left-[5px] top-6 h-3 w-3 rounded-full bg-accent ring-4 ring-bg-primary" />
  {/* card content */}
</div>
```

- Keep card style consistent with projects: `ring-1 ring-accent/10 bg-bg-card/50`
- Company name in `text-accent` instead of gold
- Date as small badge: `text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full`
- Tech/role tags as pill badges at bottom

### Contact Section

**Current issues:** Border-left cards are dated. RainingLetters + ShaderBackground double effect.

**Upgrade — minimal, direct:**
- Remove RainingLetters (ShaderBackground already gives ambient motion)
- Replace 4-item card grid with a large centered email link + social row:

```
// contact
"Let's Work Together"

Seeking Fall 2026 Software Engineering internship.
Open to remote, hybrid, or Cleveland area.

[large email link with arrow]
t.patel76@vikes.csohio.edu  ↗

[GitHub] · [LinkedIn]
```

**Email link interaction:**
```tsx
<a href="mailto:..." className="group flex items-center gap-3 text-2xl font-semibold text-text-primary transition hover:text-accent">
  {email}
  <span className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
</a>
```

### Footer

**Current state:** Minimal, works.

**Small refinements:**
- Add a "Back to top ↑" link on the right side (alongside GitHub/LinkedIn)
- Change `border-t border-accent-primary` to `border-t border-white/5` — subtle
- Add a one-line tagline: `"Built with React + Vite + Tailwind"` or just your name + year

### SectionTitle Component

**Replace entirely.** Current: centered gold text + underline bar.

**New pattern:**
```tsx
export function SectionTitle({ label, children }: { label: string; children: string }) {
  return (
    <Reveal variant="up">
      <div className="mb-12">
        <p className="mb-2 font-mono text-sm text-accent">// {label}</p>
        <h2 className="text-3xl font-bold text-text-primary md:text-4xl">{children}</h2>
      </div>
    </Reveal>
  )
}
```

Usage: `<SectionTitle label="about">Who I Am</SectionTitle>`

**Left-aligned by default.** Center only on Contact section.

---

## 5. Visual Language System

### Typography

| Element | Size | Weight | Color | Font |
|---|---|---|---|---|
| h1 (hero) | `clamp(48px, 6vw, 72px)` | 700 | `text-primary` with gradient span | sans |
| h2 (section) | `36px` | 700 | `text-primary` | sans |
| h3 (card title) | `20px` | 600 | `text-accent` | sans |
| Section label | `14px` | 400 | `text-accent` | mono |
| Body | `16px` | 400 | `text-secondary` | sans |
| Muted / meta | `14px` | 400 | `text-muted` | sans |
| Code/tags | `13px` | 400 | varies | mono |

### Spacing scale

- `py-32` (128px) for all major sections (min)
- `py-20` (80px) acceptable on smaller sections (contact, footer)
- `gap-6` between cards in a grid
- `mb-12` after SectionTitle
- `mb-4` between card elements
- `px-6 md:px-8` for container inner padding
- Max container: `max-w-6xl` (1152px) — slightly wider than current 1200px is fine

### Border radius

| Element | Radius |
|---|---|
| Cards | `rounded-xl` (12px) |
| Buttons (primary) | `rounded-lg` (8–10px) |
| Buttons (ghost) | `rounded-lg` |
| Tags/badges | `rounded-full` (pill) |
| Images | `rounded-xl` or `rounded-full` |
| Timeline dot | `rounded-full` |
| Stat counters | `rounded-lg` |

### Shadows

Replace any colored shadow with this system:

```css
/* Subtle card lift */
hover:shadow-[0_8px_32px_rgba(0,230,118,0.08)]

/* Medium glow */
hover:shadow-[0_12px_40px_rgba(0,230,118,0.12)]

/* Strong glow — for primary CTA hover */
hover:shadow-[0_0_20px_rgba(0,230,118,0.25)]

/* Ambient ambient card shadow (always-on) */
shadow-[0_2px_8px_rgba(0,0,0,0.4)]
```

Never use `rgba(25, 135, 84, 0.2)` (the old forest green shadow) — replace all instances with `rgba(0, 230, 118, x)`.

### Card design

All cards should follow this template:
```
ring-1 ring-accent/10          ← default state
bg-bg-card/50                  ← surface
backdrop-blur-sm               ← depth
rounded-xl                     ← shape
transition hover:ring-accent/25 hover:shadow-[0_8px_32px_rgba(0,230,118,0.1)]
```

No more `border border-accent-primary`. Cards should be surfaces, not boxes.

### Button styling

**Primary (CTA):**
```tsx
bg-accent text-bg-primary font-semibold rounded-lg px-6 py-2.5 text-sm
transition hover:bg-accent-dim hover:shadow-[0_0_20px_rgba(0,230,118,0.3)]
```

**Ghost:**
```tsx
border border-accent/25 text-text-primary rounded-lg px-6 py-2.5 text-sm font-medium
transition hover:border-accent/50 hover:bg-accent/5
```

**Icon link (footer, contact):**
```tsx
text-text-muted hover:text-accent transition-colors
```

### Hover states

| Element | Hover |
|---|---|
| Nav links | `text-primary` + underline extends |
| Cards | lift `-translate-y-1` + ring brightens + glow shadow |
| Primary button | `bg-accent-dim` + glow |
| Ghost button | border brightens |
| Skill tags | `bg-accent/5` + border brightens |
| Contact email | `text-accent` + arrow translates |
| Project links | `text-accent` (currently gold → change to accent) |

### Reveal animations / motion

**Keep existing Reveal system — it's good.** Just audit the variants per section:

| Section | Variant recommendation |
|---|---|
| Hero elements | staggered fade-in-up (keep current) |
| About | `"up"` for both columns |
| Project cards | `"up"` staggered — remove `"flip"` (too dramatic for 3-column grid) |
| Skill tags | `"up"` group reveal |
| Experience items | `"up"` only — remove alternating left/right |
| Contact | `"up"` |
| Footer | no animation |
| SectionTitle | `"scale"` is fine, but try `"up"` instead |

**Add one new animation:** Terminal cursor blink in the About terminal widget.
```css
@keyframes blink { 0%, 100% { opacity: 1 } 50% { opacity: 0 } }
.cursor { animation: blink 1s step-end infinite; }
```

**Keep ShaderBackground** — it's a differentiator. Just ensure it doesn't fight with section backgrounds. Sections that need to feel distinct from the hero should use `bg-bg-secondary/80 backdrop-blur-sm` not just transparency.

### Section dividers / backgrounds

Current: alternating `bg-bg-primary/65` and `bg-bg-secondary/65`.

**Problem:** The 65% opacity lets the shader bleed through unevenly. Some sections should feel more contained.

**Fix:**
- Hero: keep transparent (shader is the background)
- About: `bg-bg-secondary/80` — slightly more opaque
- Projects: `bg-transparent` — let shader show, use card surfaces for containment
- Experience: `bg-bg-secondary/80`
- Skills: `bg-transparent`
- Contact: `bg-bg-secondary/90` — most opaque, helps it feel like a "landing zone"

**Section separators:** Instead of hard color changes, use a 1px gradient line:
```tsx
<div className="h-px w-full bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
```

---

## 6. What NOT to Copy From Reference

- `#00c8c8` cyan — you have green, keep it
- Terminal widget text ($ whoami etc.) — fine to adapt the format but use your own content
- Skill progress bars with specific % numbers — contrived for a student
- Company logos in timeline — you don't have the same kind of corporate experience
- The blog section — only add when you have real posts
- His "30+ projects shipped / 5+ years experience" stats — don't fake scale
- Left-aligned hero exactly — the centered version with the ShaderBackground works for your identity; a clean refresh of the centered version is fine

---

## 7. Direct Changes to Make Now (Checklist)

### Global / tokens
- [ ] Replace `Segoe UI` with `Inter` or `Geist` via Google Fonts or fontsource
- [ ] Replace `#0f5132` (forest green) with `#00e676` (neon green) as `--color-accent`
- [ ] Replace `#198754` with `#00b85a` as `--color-accent-dim`
- [ ] Remove `--color-accent-gold: #c9a96b` entirely — find every usage and replace with `text-accent` or `text-text-primary`
- [ ] Change `--color-bg-primary` from `#050809` to `#030c06`
- [ ] Update all `rgba(25, 135, 84, x)` box-shadow values to `rgba(0, 230, 118, x)`

### Navbar
- [ ] Remove `border-b border-accent-primary`; add subtle `shadow-[0_1px_0_0_rgba(255,255,255,0.05)]` when scrolled
- [ ] Change logo from MatrixText cycling to stable `"Tirth Patel"`
- [ ] Add a `<a href="resume.pdf">Resume ↗</a>` link on the right of desktop nav

### Hero
- [ ] Add availability badge with animate-ping green dot above h1
- [ ] Make h1 larger: `text-5xl md:text-7xl` 
- [ ] Apply gradient to last name span: `bg-gradient-to-r from-accent to-green-300 bg-clip-text text-transparent`
- [ ] Replace three equal LiquidButtons with primary + ghost button pair
- [ ] Add scroll-down indicator at bottom

### SectionTitle
- [ ] Rewrite component: remove gold, add `// label` in mono, left-align

### About
- [ ] Add stat counters (GPA, projects, courses)
- [ ] Add terminal-style code block widget
- [ ] Rewrite bio paragraph — make it first-person and human

### ProjectCard
- [ ] Replace `border border-accent-primary` with `ring-1 ring-accent/10`
- [ ] Replace `text-accent-secondary` (green) with `text-accent` (new neon green)
- [ ] Replace `text-accent-gold` links with `text-accent`
- [ ] Change tag shape from `rounded-md` to `rounded-full`
- [ ] Replace `✓` bullets with plain dots or `▸`
- [ ] Update hover shadow to `rgba(0, 230, 118, 0.12)`

### Skills
- [ ] Add skill icons (Simple Icons or Devicons)
- [ ] Change tag hover to include glow: `hover:shadow-[0_0_12px_rgba(0,230,118,0.15)]`
- [ ] Change from `rounded-lg` to `rounded-full` for tags

### Experience
- [ ] Add vertical timeline connector `border-l border-accent/20`
- [ ] Add timeline dot per entry `absolute -left-[5px] h-3 w-3 rounded-full bg-accent`
- [ ] Change all Reveal variants to `"up"` (remove alternating left/right)
- [ ] Company name: `text-accent` instead of gold
- [ ] Date: small pill badge

### Contact
- [ ] Remove RainingLetters component
- [ ] Replace 4-card grid with large email link + socials row
- [ ] Add hover arrow translation to email link

### Footer
- [ ] Change `border-accent-primary` to `border-white/5`
- [ ] Add "Back to top ↑" link

---

## 8. Prioritized Implementation Roadmap

### Quick wins (< 1 hour each — do these first)

1. **Color token swap** — `index.css` changes: forest green → neon green, remove gold. Every section updates automatically. (~15 min)
2. **Font upgrade** — add Inter/Geist import, update `--font-sans`. (~10 min)
3. **SectionTitle rewrite** — new `// label` + left-aligned h2 pattern. (~20 min)
4. **Navbar** — remove green border, stable logo, add Resume link. (~20 min)
5. **Update all box-shadows** — grep `rgba(25, 135, 84` and replace throughout. (~15 min)
6. **ProjectCard border** — swap `border border-accent-primary` → `ring-1 ring-accent/10`. (~10 min)
7. **Tag shapes** — `rounded-md` → `rounded-full` across ProjectCard and Skills. (~10 min)

### Medium effort upgrades (1–3 hours each)

8. **Hero refresh** — availability badge, larger h1, gradient name span, primary+ghost CTA pair, scroll indicator. (~90 min)
9. **About section rebuild** — 2-col layout, terminal widget, stat counters, bio rewrite. (~2–3 hours)
10. **Contact rebuild** — remove RainingLetters, large email link, socials row. (~45 min)
11. **Experience timeline** — add `border-l`, timeline dots, pill dates. (~60 min)
12. **Section opacity fixes** — set correct bg opacity per section to fix shader interaction. (~20 min)
13. **Skills icon upgrade** — add devicon SVGs or Simple Icons per skill. (~90 min — mostly sourcing icons)

### Advanced polish (3+ hours — do after medium is stable)

14. **Hero left-align evolution** — restructure to 2-column hero layout. Only if you want a structural change.
15. **Project card preview images** — create or screenshot thumbnails for each project. (~2 hours)
16. **About terminal widget with blink cursor** — animated terminal with typed output. (~2 hours)
17. **Framer Motion review pass** — audit every Reveal variant across all sections, tune spring configs. (~2 hours)
18. **Section gradient dividers** — add `via-accent/20` gradient lines between sections. (~45 min)
19. **Scroll progress bar color** — update from current accent to new neon green. (~5 min, but easy to miss)
20. **BackToTop button** — restyle to match new accent. (~15 min)

---

*Last updated: June 2026. Based on live audit of aaabadcode.com and full source review of current portfolio.*
