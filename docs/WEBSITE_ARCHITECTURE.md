# Website Architecture

## 1. Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15, App Router |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` |
| Styling | Tailwind CSS v4, CSS-first `@theme` tokens |
| Motion | CSS transitions + IntersectionObserver; Framer Motion where interruptible state matters |
| Type | Self-hosted variable WOFF2 (Space Grotesk, JetBrains Mono) |
| Tests | Vitest + Testing Library (unit/component), Playwright (E2E + visual QA) |
| Hosting | GitHub Pages, static export under `basePath: /zweaq.com` |

### Deliberate omissions

- **No 3D runtime.** A ring is a torus. A procedural torus inside a 600 KB WebGL
  runtime looks worse than well-drawn vector art and spends the entire
  performance budget. `ProductViewer` takes a `model` prop so a real GLB drops
  in later behind the same interface.
- **No component library.** The visual language is bespoke and a generic one
  would fight it.
- **No animation library for scroll reveals.** A 40-line IntersectionObserver
  hook costs nothing and cannot jank.
- **No cookie banner.** There are no cookies.

---

## 2. Two build targets, one codebase

| Command | Target | `POST /api/waitlist` |
|---|---|---|
| `npm run build` | Node server | Live route handler |
| `npm run build:static` | Static export → GitHub Pages | Excluded at build time |

The handler lives at `src/app/api/waitlist/route.node.ts`. `next.config.mjs`
lists `node.ts` as a page extension **only** on the Node target, so the static
export never sees the file — rather than the build failing on a route handler it
cannot export.

The waitlist UI is identical on both because it talks to a provider abstraction,
not a URL.

---

## 3. Directory map

```
src/
├── app/                      routes, metadata, sitemap, robots
│   └── api/waitlist/route.node.ts    Node-only HTTP adapter
├── components/
│   ├── layout/               Nav, Footer, PageHeader, LegalPage, AnalyticsBoot
│   ├── product/              ProductViewer, ring geometry, interaction hook
│   ├── sections/             one file per homepage section
│   └── ui/                   Button, Section, Spec, ClaimBadge, DisplayChip, …
├── content/                  ALL copy and configuration
├── hooks/                    useReveal, usePrefersReducedMotion
├── lib/                      analytics, schema, waitlist, cn
└── styles/tokens.css         the design system, single source of truth
```

**No marketing copy lives in a component.** Everything a marketer would want to
change is in `src/content/`, so copy edits never require touching layout.

---

## 4. The claim system

The most important architectural decision on this site. Specification values are
`Claim` objects, not strings, and render through `<Spec>`. There is no code path
that prints an unqualified number for unvalidated hardware. See
[PRODUCT_CLAIMS.md](./PRODUCT_CLAIMS.md).

---

## 5. Waitlist

```
WaitlistSection ──▶ lib/waitlist/client.ts ──┬─▶ NEXT_PUBLIC_WAITLIST_ENDPOINT
                                             ├─▶ /api/waitlist  (Node target)
                                             └─▶ local provider (fallback)
                                                     │
                            route.node.ts ──▶ lib/waitlist/handler.ts
                                                     │
                                             WaitlistStore (port)
```

- `validate.ts` — pure, shared by client and server. The server never trusts the
  client's validation; it re-runs it.
- `handler.ts` — framework-agnostic. No Next.js import, so it is testable
  without a server and portable off Next entirely.
- `store.ts` — a port. `MemoryWaitlistStore` is for tests and local development
  and is documented as unsuitable for production.
- **Spam handling** — honeypot plus a submission-timing floor. Automated
  submissions receive the same success response a person receives and are
  silently dropped, so a bot learns nothing about which check caught it.
- **Rate limiting** — fixed window, keyed on a hash of the caller IP. The IP is
  never stored.
- **No secrets in the client.** The endpoint provider expects a URL that holds
  its own credentials.

### Going live

1. Implement `WaitlistStore` against your database.
2. Pass it to `handleWaitlist` in `route.node.ts`.
3. Deploy to a Node host, or point `NEXT_PUBLIC_WAITLIST_ENDPOINT` at a
   standalone function.

Nothing in the UI changes.

---

## 6. Commerce (not enabled)

`siteConfig.commerce` gates preorders, checkout provider and currency.
`preordersEnabled` is `false`, and **nothing in the UI collects payment details
while it is false**. The Product schema deliberately publishes no `offers`
block, because publishing an offer for something that cannot be bought is
exactly the dishonesty this site is built to avoid.

The extension points for preorder, checkout, shipping, sizing, tax and orders
are the same shape as the waitlist: a content config, a pure validator, a
framework-agnostic handler, and a storage port.

---

## 7. Analytics

`lib/analytics.ts` is a no-op unless a provider is installed at runtime.

- Event payloads are a **closed union** — there is no `track(name, anything)`
  escape hatch, so PII cannot be added at a call site.
- No cookies, no localStorage, no identifier, no cross-page correlation.
- A throwing provider is swallowed. Analytics never breaks the page.
- On the public deployment no provider is configured and no request is made.

---

## 8. Performance

- First Load JS ≈ 103 KB shared, ≈ 166 KB on the heaviest route.
- Zero image bytes for the product: it is vector, generated at render time.
- Fonts self-hosted, latin subset, variable — 54 KB total, no third-party
  connection, no build-time network dependency.
- Reveal animation is CSS; the observer unobserves on first reveal.
- Pointer input is rAF-latched and never sets state directly.

---

## 9. Accessibility

Targeting WCAG 2.2 AA.

- One `h1` per page; heading levels never skip (asserted in E2E).
- Skip link, focus-visible ring on everything, no `outline: none` anywhere.
- The mobile menu is inside the `Primary` navigation landmark — not beside it.
- The demo is a real tablist: roving tabindex, arrow/Home/End keys.
- The FAQ uses native `<details>`, so answers are in the DOM and findable by
  browser find-in-page even while collapsed.
- Colour never carries meaning alone — every state has an icon or a text label.
- Reduced motion is handled in CSS, in JS state, and in scheduling.
- Zoom is not blocked (`maximumScale: 5`).

---

## 10. Testing

| Layer | Location | Covers |
|---|---|---|
| Unit | `tests/unit` | Claims, validation, handler, ring geometry, schema, analytics |
| Component | `tests/component` | Spec, nav, waitlist, demo, FAQ, hero |
| E2E | `tests/e2e` | Navigation, waitlist flows, honesty assertions, reduced motion |
| Visual QA | `scripts/visual-qa.mjs` | 7 viewports × 9 pages: overflow, touch targets, tiny text |

E2E and visual QA run against the **built static export**, served under the same
base path GitHub Pages uses.

---

## 11. Deployment

`.github/workflows/deploy.yml` builds the static export, gates it on typecheck
and tests, writes `.nojekyll` (without which Pages strips `_next/`), and
publishes via `actions/deploy-pages`.

`.github/workflows/ci.yml` additionally runs lint, E2E, responsive QA, and
verifies that committed generated assets match their generators.

To move to an apex domain, set `NEXT_PUBLIC_BASE_PATH=` and
`NEXT_PUBLIC_SITE_URL=https://zweaq.com`. No code changes.
