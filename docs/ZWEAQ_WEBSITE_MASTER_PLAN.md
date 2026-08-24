# ZWEAQ Website — Master Plan

Status: living document. Owner: web team.

---

## 1. Repository audit (Phase 1)

Audited at commit `076fdb1` ("Initial commit").

| Area | Finding |
|---|---|
| Stack | None. Repo contained `LICENSE` (Apache-2.0) and a one-line `README.md`. |
| Components | None |
| Pages | None |
| Assets | None |
| Branding | None — no mark, no palette, no type system |
| Backend | None |
| Deployment | None — no CI, no Pages configuration |

### Files reused
- `LICENSE` — kept as-is.

### Files replaced
- `README.md` — replaced with project documentation.

### Missing assets (all created in this project)
Brand marks, favicon/app icons, product concept renders, OG image.

### Missing infrastructure (all created in this project)
Build pipeline, type checking, linting, unit/component tests, E2E tests, responsive
visual QA harness, CI workflow, GitHub Pages deployment workflow.

---

## 2. Recommended architecture

**Stack:** Next.js 15 (App Router) · TypeScript (strict) · Tailwind CSS v4 · Framer Motion.

Chosen because the site is content-heavy and mostly static: the App Router gives us
per-route metadata, streaming, a real static export, and file-system routing, while
Tailwind v4's CSS-first tokens let the design system live in one `@theme` block that
both Tailwind utilities and hand-written CSS read from.

**Deliberately NOT used:**

- **Three.js / WebGL.** A ring is a torus. A procedurally generated torus in a 600 KB
  3D runtime looks worse than well-drawn vector art and costs the entire performance
  budget. `ProductViewer` is vector-based and takes a `model` prop, so a real GLB drops
  in later behind the same interface (see §5).
- **A component library.** The visual language is bespoke; a generic library would fight it.
- **An animation library for scroll reveals.** A 40-line IntersectionObserver hook driving
  CSS transitions costs nothing and cannot jank. Framer Motion is reserved for the places
  where interpolated, interruptible state actually matters (display transitions, tab morphs).

### Two build targets, one codebase

| Command | Target | `/api/waitlist` |
|---|---|---|
| `npm run build` | Node server | Live route handler |
| `npm run build:static` | Static export → GitHub Pages | Excluded at build time |

The route handler file is named `route.node.ts`. `next.config.mjs` only lists `node.ts`
as a page extension on the Node target, so the static export simply never sees it. The
waitlist *UI* is identical on both targets because it talks to a provider abstraction
(`src/lib/waitlist/client.ts`), not to a hard-coded URL.

---

## 3. Honest-claims policy

The single hardest constraint on this site: **ZWEAQ ONE does not exist as validated
hardware yet.** Every capability figure is rendered through a claim-level system
(`src/content/claims.ts`) with five levels — `concept`, `prototype`, `engineering`,
`production`, `available` — and specification numbers are rendered by a `<Spec>`
component that prefixes unvalidated values with "Target:".

There is no path in this codebase to print "32 GB" as a bare fact. See
`docs/PRODUCT_CLAIMS.md`.

---

## 4. Phase order

| Phase | Scope |
|---|---|
| 1 | Repository audit (this document) |
| 2 | Brand system + original logo |
| 3 | Design system + tokens |
| 4 | App shell, site config, content layer |
| 5 | Product visual system (`ProductViewer`) |
| 6 | Homepage — 24 sections |
| 7 | Product / Technology / Security / Developers + legal pages |
| 8 | Waitlist API + client abstraction |
| 9 | SEO, analytics, accessibility |
| 10 | Performance |
| 11 | Unit / component / E2E tests |
| 12 | Responsive visual QA |
| 13 | CI + GitHub Pages deployment |

---

## 5. Asset replacement path

Components never reference asset paths directly. `src/content/media.ts` maps every
visual slot to either a procedural source or a file. To swap in real photography or a
real 3D model, edit that one file — no component changes.

```
media.hero = { kind: 'procedural', view: 'hero' }   →   { kind: 'image', src: '/product/hero.webp' }
```
