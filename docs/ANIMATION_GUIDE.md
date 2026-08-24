# Animation Guide

Every animation on this site has to justify its existence. The product argument
is restraint; a site that fidgets undercuts it.

---

## 1. The primitives

Three durations and two curves, defined in `src/styles/tokens.css`. Nothing uses
a value outside this set.

| Token | Value | For |
|---|---|---|
| `--duration-fast` | 160ms | Hover, focus, press — anything the user is holding |
| `--duration-medium` | 380ms | State changes the user caused |
| `--duration-slow` | 720ms | Scroll reveals |
| `--ease-out` | `cubic-bezier(0.22, 1, 0.36, 1)` | Things arriving |
| `--ease-precise` | `cubic-bezier(0.65, 0, 0.35, 1)` | Things the user is driving |

---

## 2. What actually animates

| Where | What | Why it earns its place |
|---|---|---|
| Scroll reveal | opacity + 14px rise | Paces a long page. Fires once, then unobserves. |
| Nav | background and blur on scroll | Tells you the page moved under a fixed bar. |
| Hero ring | rotation from scroll position | The object is three-dimensional; rotating proves it. |
| Hero ring | key light follows the pointer | Makes titanium read as metal rather than as grey. |
| Hero display | cycles through glanceable states | Shows what the product is *for* without copy. |
| Demo tabs | cross-fade between capabilities | Interruptible mid-flight — the one place Framer Motion is used. |
| Exploded view | layers separate on hover and focus | Reveals stack order, which is the point of the diagram. |
| Buttons | 1px press, accent underline on hover | Feedback, not decoration. |

Everything else is static, deliberately.

---

## 3. What does not animate

No parallax on text. No counting-up numbers. No typewriter effects. No pulsing
"radar" rings on the NFC diagram. No animated gradient meshes. No page
transitions. No scroll-hijacking. No infinite loops anywhere on the page.

Every one of these was considered and rejected: they draw attention to the site
instead of to the product.

---

## 4. Reduced motion

Handled at three levels, because CSS alone is not enough.

1. **CSS** — a global `@media (prefers-reduced-motion: reduce)` block collapses
   every duration to 0.01ms and forces `[data-reveal]` elements to full opacity.
   Content is never left invisible.
2. **JavaScript** — `usePrefersReducedMotion()` returns `true` during SSR and
   first paint, so anything gated on it *starts stopped*. Nothing flashes a
   frame of motion at someone who asked for none.
3. **Scheduling** — `useRingInteraction` does not merely stop painting; it never
   creates the interval, attaches the scroll listener, or queues the rAF.

E2E tests assert all three: content visible, `setInterval` never called, and —
the counterpart — that the cycle *does* run when motion is allowed, so a bug
cannot masquerade as a reduced-motion feature.

---

## 5. Performance rules

- **Only `opacity` and `transform`.** No animated `width`, `height`, `top`, or
  `box-shadow`.
- **No per-frame JavaScript for reveals.** IntersectionObserver flips a data
  attribute; CSS does the rest, and the element is unobserved immediately.
- **Pointer input never sets state directly.** It writes to a ref and a single
  rAF commits at most one update per frame.
- **`will-change` is temporary.** Set while an element is pending reveal,
  released to `auto` the moment it lands.
- **Scroll listeners are passive** and guarded by an rAF latch.

---

## 6. Adding an animation

Ask, in order:

1. What does this tell the user that the static version does not?
2. Does it use an existing duration and curve token?
3. Is it `opacity`/`transform` only?
4. Does it stop scheduling work under reduced motion?
5. Does it still make sense at 375px, and on a slow device?

If any answer is no, do not add it.
