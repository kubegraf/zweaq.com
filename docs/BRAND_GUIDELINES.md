# ZWEAQ — Brand Guidelines

All marks in `/public/brand` are original geometry, constructed from the parametric
definitions in `scripts/brand-geometry.mjs`. Nothing is traced, licensed, or derived
from an existing brand. Regenerate with `npm run gen:brand`.

---

## 1. The mark — "Aperture Z"

A rounded-square annulus severed by a 45° channel running top-right to bottom-left.
Two pieces remain: a top bar with a left stem, and a right stem with a bottom bar.

Read as a whole it is an **aperture** — a ring seen on-axis, squared off so it never
reads as merely a circle. Read as figure-and-ground, the two bars and the channel
between them form a **Z**.

### Construction

Everything sits on a 48 × 48 integer grid.

| Element | Value |
|---|---|
| Outer edge | rounded square, inset 4, corner radius 10 |
| Inner edge | rounded square, inset 14, corner radius 4 |
| Wall thickness | 10 units (0.25 × mark height) |
| Channel | the band between lines `x + y = 43` and `x + y = 53` |
| Channel width | 10 units in sum-space ≈ 7.07 units perpendicular |

The channel is symmetric about the centre diagonal `x + y = 48`, so both cut faces are
exactly 45° and exactly parallel. This is the single most important detail in the mark:
if the faces drift out of parallel, it stops looking machined and starts looking drawn.

### Concepts considered and rejected

| | Concept | Why not |
|---|---|---|
| A | Bare geometric Z | Indistinguishable from a hundred existing Z marks |
| B | Continuous data loop | Reads as a refresh/sync icon below 32 px |
| C | Two interlocking Z paths | Counters collapse to mud below 24 px |
| D | Ring plus chip glyph | Two ideas competing; neither wins |
| E | Finger / ring / identity glyph | Illustrative, not a mark; unusable as a favicon |

---

## 2. The wordmark

Geometric monoline capitals, **drawn rather than typeset** — the wordmark is not
set in any typeface and does not depend on a font being available.

| Property | Value |
|---|---|
| Cap height | 32 units (y 8 → 40) |
| Stroke | 7 units — a stroke-to-cap ratio of 0.22 |
| Caps | butt |
| Joins | miter, **miter limit 1.9** |
| Q tail | 45°, matching the mark's channel angle |

The low miter limit is deliberate: every acute join chamfers to a flat cut, so the
apex of the **A** and the vertices of the **W** are machined edges rather than spikes.
This is the same edge language as the mark's channel faces, and it is what makes the
symbol and the word look like one system.

Sidebearings are **optical, not metric**. The **A** is tucked tighter than a uniform
gap would place it, because its diagonals already open white space above. Setting the
gaps to equal numeric values makes the word break into "ZWE AQ".

---

## 3. Clear space

Minimum clear space on all four sides is **one ring wall** — 10 units at mark scale,
or 25% of the mark's height.

```
┌─────────────────────────────┐
│        ← clear space         │
│   ┌───────┐                 │
│   │ MARK  │   ZWEAQ         │
│   └───────┘                 │
│                             │
└─────────────────────────────┘
```

In the lockup, the gap between mark and wordmark is **2 × clear space** (20 units).
Nothing — no rule, image edge, or other logo — may enter the clear-space box.

---

## 4. Minimum size

| Asset | Minimum | Notes |
|---|---|---|
| Mark, screen | 16 px | Verified: channel stays open at 16 px |
| Mark, print | 5 mm | |
| Full lockup, screen | 96 px wide | Below this, use the mark alone |
| Full lockup, print | 25 mm wide | |
| Ring engraving | 2.2 mm | See §8 |

Below the lockup minimum, **drop the wordmark, never shrink it**.

---

## 5. Backgrounds

| Background | Asset |
|---|---|
| Near-black / dark photography | `zweaq-logo-white.svg`, `zweaq-mark-white.svg` |
| White / light | `zweaq-logo-black.svg`, `zweaq-mark-black.svg` |
| Inherits from CSS `color` | `zweaq-logo.svg`, `zweaq-mark.svg` (`currentColor`) |

On photography, place the mark only over an area with a measured contrast ratio of at
least **4.5:1** against the mark colour. If no such area exists, use a solid plate —
do not add a drop shadow or an outline to force legibility.

---

## 6. Incorrect usage

Do not:

1. Rotate the mark. The 45° channel is absolute; rotating it destroys the Z reading.
2. Change the channel angle or width.
3. Alter the wall thickness, or apply a stroke to the mark.
4. Fill the mark with a gradient, image, or more than one colour.
5. Add a drop shadow, glow, bevel, or outline.
6. Re-space, re-weight, or re-set the wordmark in any typeface.
7. Stretch, condense, or skew any asset. Scale proportionally only.
8. Place the mark inside another shape (circle, badge, "app tile") other than the
   supplied `favicon.svg` and `app-icon.svg`.
9. Use the mark as a bullet, loading spinner, or repeating pattern tile.
10. Recolour to any value outside the brand palette.

---

## 7. Favicon and app icon

- **`favicon.svg`** — mark reversed out of an ink tile, corner radius 11/48. The tile is
  required: an unplated mark disappears against dark browser chrome. The mark is scaled
  to 76% inside the tile so the channel survives at 16 px.
- **`app-icon.svg`** — 180 × 180, full-bleed ink field, mark centred at 2.3×. The margin
  is sized for both the iOS corner mask and the Android maskable safe area (the mark
  stays inside the central 80% circle).

---

## 8. Product engraving

On the ring, the mark is engraved on the inner band, aligned so the channel runs
parallel to the finger axis when worn.

- Minimum engraved size: **2.2 mm**
- Minimum groove width: **0.15 mm** — at 2.2 mm the channel is 0.32 mm, which clears this
- Depth: 0.05–0.08 mm, single pass
- No wordmark on the ring. The mark alone.

**Before sending to a laser or CNC vendor, flatten the mark to outlines.** The supplied
SVGs use `clipPath`, which most CAM toolchains do not read. Boolean the two clipped
paths into two closed outlines in vector software and supply that file.

---

## 9. Packaging

- Mark only on the outer face, blind-embossed or foiled, minimum 12 mm.
- Full lockup on the base panel with the legal line.
- Never place the lockup and the mark on the same visible face.

---

## 10. Colour

The brand palette is defined once, as CSS custom properties, in `src/styles/tokens.css`.
That file is the source of truth — these values are a copy for print and vendor use.

| Token | Value | Use |
|---|---|---|
| Ink | `#08090B` | Primary background, engraving fill |
| Paper | `#F4F5F7` | Primary text, reversed marks |
| Titanium 300 | `#C4CBD4` | Hardware highlights |
| Titanium 600 | `#7C8593` | Secondary text |
| Titanium 800 | `#3A4048` | Hairlines, dividers |
| Signal | `#F2A75C` | The single accent. Interactive, focus, emphasis |
| Verify | `#6FD79A` | Success states only, never alone — always with a ✓ |
| Display | `#DFF3FF` | Ring micro-display glyphs |

**Signal is the only accent.** If a layout needs a second accent colour to work, the
layout is wrong. Colour never carries meaning on its own — every state that uses colour
also carries an icon or a text label.
