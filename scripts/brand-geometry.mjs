/**
 * ZWEAQ brand geometry — the single source of truth for the mark and wordmark.
 *
 * THE MARK — "Aperture Z"
 * ----------------------
 * A rounded-square annulus (the aperture) severed by a 45° channel running
 * top-right to bottom-left. Two pieces remain:
 *
 *   upper piece = top bar + left stem
 *   lower piece = right stem + bottom bar
 *
 * Read together with the channel between them, they form a Z. Read as a
 * whole, the silhouette is an aperture — a ring seen on-axis, squared off so
 * it never reads as "just a circle".
 *
 * Everything is constructed on a 48×48 integer grid. The channel is the pair
 * of lines x+y=43 and x+y=53, symmetric about the centre diagonal x+y=48, so
 * both cut faces are exactly 45° and exactly parallel.
 *
 * Concepts considered and rejected (see docs/BRAND_GUIDELINES.md §1):
 *   A  bare geometric Z            — indistinguishable from a hundred Z marks
 *   B  continuous data loop        — reads as a refresh icon at small sizes
 *   C  two interlocking Z paths    — collapses to mud below 24px
 *   D  ring + chip glyph           — two ideas fighting; neither wins
 *   E  finger/ring/identity glyph  — illustrative, not a mark
 */

/** Rounded-square path on a centred box. */
function squircle(inset, r) {
  const a = inset;
  const b = 48 - inset;
  return [
    `M${a + r},${a}`,
    `H${b - r}`,
    `A${r},${r} 0 0 1 ${b},${a + r}`,
    `V${b - r}`,
    `A${r},${r} 0 0 1 ${b - r},${b}`,
    `H${a + r}`,
    `A${r},${r} 0 0 1 ${a},${b - r}`,
    `V${a + r}`,
    `A${r},${r} 0 0 1 ${a + r},${a}`,
    'Z',
  ].join(' ');
}

// Outer edge inset 4 (r=10), inner edge inset 14 (r=4) → 10-unit ring wall.
// Radii chosen by test render: rounder reads as a generic slashed circle,
// squarer reads aggressive. This is the point where the flat top and bottom
// bars are long enough for the Z to surface.
export const ANNULUS = `${squircle(4, 10)} ${squircle(14, 4)}`;

// Half-planes either side of the channel, oversized so they always clip clean.
export const CLIP_UPPER = '-20,-20 63,-20 -20,63'; // x + y < 43
export const CLIP_LOWER = '68,68 68,-15 -15,68'; //  x + y > 53

/** The mark, as inner SVG markup. `id` namespaces the clip paths. */
export function markBody(id, fill = 'currentColor') {
  return `<defs>
    <clipPath id="${id}-u"><polygon points="${CLIP_UPPER}"/></clipPath>
    <clipPath id="${id}-l"><polygon points="${CLIP_LOWER}"/></clipPath>
  </defs>
  <path d="${ANNULUS}" fill="${fill}" fill-rule="evenodd" clip-path="url(#${id}-u)"/>
  <path d="${ANNULUS}" fill="${fill}" fill-rule="evenodd" clip-path="url(#${id}-l)"/>`;
}

/**
 * THE WORDMARK — geometric monoline capitals, drawn not typeset.
 *
 * Cap height 32 (y 8→40), stroke 7, butt caps. A miter limit of 1.9 chamfers
 * every acute join, so the apex of the A and the vertices of the W come to a
 * flat cut instead of a spike — the same machined-edge language as the mark's
 * channel. Stroke-to-cap ratio is 0.22, matching the mark's wall-to-height
 * ratio of 0.25, so symbol and word carry the same optical weight.
 *
 * Sidebearings are optical, not metric: the A is tucked closer than a uniform
 * gap would put it, because its diagonals already open white space above.
 *
 * The Q's tail is a 45° stroke — the same angle as the mark's channel, which
 * is what ties symbol and word together.
 */
export const LETTERS = [
  { x: 0, w: 26, d: 'M0,8 H26 L0,40 H26' }, //                                Z
  { x: 37, w: 34, d: 'M0,8 L7,40 L17,17 L27,40 L34,8' }, //                    W
  { x: 82, w: 22, d: 'M22,8 H0 V40 H22 M0,24 H17' }, //                        E
  { x: 111, w: 26, d: 'M0,40 L13,8 L26,40 M4.9,28 H21.1' }, //                 A
  { x: 146, w: 34, d: 'M15,8 A15,16 0 1 0 15.01,8 Z M25,34 L34,43' }, //       Q
];

export const WORDMARK_W = 180;

export function wordmarkBody(stroke = 'currentColor') {
  const paths = LETTERS.map(
    (l) => `<path d="${l.d}" transform="translate(${l.x} 0)"/>`,
  ).join('\n    ');
  return `<g fill="none" stroke="${stroke}" stroke-width="7" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="1.9">
    ${paths}
  </g>`;
}

export const SVG_NOTE =
  '<!-- ZWEAQ original brand mark. Geometry: scripts/brand-geometry.mjs -->';
