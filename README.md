# zweaq.com

The ZWEAQ product website — **ZWEAQ ONE**, a wearable personal computer.

**Live:** https://kubegraf.github.io/zweaq.com

---

## About this site

ZWEAQ ONE is a product in development. No hardware has been built to
specification, and this site is written so it cannot pretend otherwise: every
capability figure passes through a claim-level system that prefixes anything
unvalidated with `Target:`, and three separate test layers fail the build if
that stops being true.

See [`docs/PRODUCT_CLAIMS.md`](docs/PRODUCT_CLAIMS.md).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Framer Motion ·
Vitest · Playwright · GitHub Pages.

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

## Scripts

| Command | Does |
|---|---|
| `npm run dev` | Development server |
| `npm run build` | Production build, Node target (API routes live) |
| `npm run build:static` | Static export for GitHub Pages |
| `npm run serve:static` | Serve `out/` at the same base path Pages uses |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |
| `npm test` | Unit and component tests |
| `npm run test:e2e` | Playwright, against the built export |
| `npm run qa:visual` | Responsive audit, 7 viewports × 9 pages |
| `npm run gen:brand` | Regenerate brand assets from geometry |
| `npm run gen:renders` | Regenerate product renders and the OG image |
| `npm run verify` | Typecheck, lint, test, build |

## Configuration

All optional. With none set, the site builds and runs with no backend.

| Variable | Effect |
|---|---|
| `NEXT_PUBLIC_BASE_PATH` | Deployment path prefix. Defaults to `/zweaq.com` on static builds; set empty for an apex domain. |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin used for metadata and structured data. |
| `NEXT_PUBLIC_WAITLIST_ENDPOINT` | Absolute URL to POST signups to. Without it, signups stay in the browser. |
| `NEXT_PUBLIC_HAS_API` | `1` when deployed to a Node host, to use the built-in route handler. |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | Enables the analytics abstraction. Unset means no provider, no requests. |

No API key is ever read in the browser.

## Documentation

| Document | Covers |
|---|---|
| [Master plan](docs/ZWEAQ_WEBSITE_MASTER_PLAN.md) | Repository audit, architecture decisions, phases |
| [Website architecture](docs/WEBSITE_ARCHITECTURE.md) | Structure, build targets, waitlist, a11y, testing |
| [Brand guidelines](docs/BRAND_GUIDELINES.md) | Mark construction, clear space, misuse, engraving |
| [Product claims](docs/PRODUCT_CLAIMS.md) | The honesty policy and how it is enforced |
| [Content guide](docs/CONTENT_GUIDE.md) | Where copy lives, voice, how to write more |
| [SEO](docs/SEO.md) | Metadata, structured data, the base-path trap |
| [Animation guide](docs/ANIMATION_GUIDE.md) | Motion primitives, what animates and what does not |

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which gates on typecheck
and tests, builds the static export, and publishes to GitHub Pages.

The repository's **Settings → Pages → Source** must be set to **GitHub Actions**.

## Licence

Apache 2.0 — see [LICENSE](LICENSE). Vendored typefaces are licensed separately
under the SIL Open Font License; see [`public/fonts/LICENSE.md`](public/fonts/LICENSE.md).
