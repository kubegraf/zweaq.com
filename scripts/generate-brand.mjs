/** Emits every brand asset from scripts/brand-geometry.mjs. Run: npm run gen:brand */
import { writeFileSync, mkdirSync } from 'node:fs';
import { markBody, wordmarkBody, WORDMARK_W, SVG_NOTE } from './brand-geometry.mjs';

const OUT = new URL('../public/brand/', import.meta.url);
mkdirSync(OUT, { recursive: true });

const INK = '#0A0B0D';
const PAPER = '#F4F5F7';

/** Mark-only, 48×48. */
const mark = (id, fill) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="ZWEAQ">
  ${SVG_NOTE}
  ${markBody(id, fill)}
</svg>
`;

/**
 * Lockup: mark + wordmark. Clear space is 1× the ring wall (10 units at mark
 * scale) on every side; the gap between mark and word is 2× that.
 */
function lockup(id, color) {
  const S = 48; // mark box
  const gap = 20;
  const wmScale = 0.78; // stroke 7 × 0.78 ≈ 5.5 vs the mark's 10-unit wall at half scale
  const wmW = WORDMARK_W * wmScale;
  const wmH = 52 * wmScale;
  const pad = 10;
  const w = pad * 2 + S + gap + wmW;
  const h = pad * 2 + S;
  const wmY = pad + (S - wmH) / 2 - 4 * wmScale;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${round(w)} ${round(h)}" role="img" aria-label="ZWEAQ">
  ${SVG_NOTE}
  <g transform="translate(${pad} ${pad})">${markBody(id, color)}</g>
  <g transform="translate(${round(pad + S + gap)} ${round(wmY)}) scale(${wmScale})">
    ${wordmarkBody(color)}
  </g>
</svg>
`;
}

const round = (n) => Math.round(n * 100) / 100;

/** Favicon: filled tile so the mark holds its shape against any browser chrome. */
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" role="img" aria-label="ZWEAQ">
  ${SVG_NOTE}
  <rect width="48" height="48" rx="11" fill="${INK}"/>
  <g transform="translate(24 24) scale(0.76) translate(-24 -24)">
    ${markBody('fav', PAPER)}
  </g>
</svg>
`;

/** App / maskable icon: 180×180 with the safe area iOS and Android expect. */
const appIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180" role="img" aria-label="ZWEAQ">
  ${SVG_NOTE}
  <rect width="180" height="180" fill="${INK}"/>
  <g transform="translate(90 90) scale(2.3) translate(-24 -24)">
    ${markBody('app', PAPER)}
  </g>
</svg>
`;

const files = {
  'zweaq-mark.svg': mark('m', 'currentColor'),
  'zweaq-mark-white.svg': mark('mw', PAPER),
  'zweaq-mark-black.svg': mark('mb', INK),
  'zweaq-logo.svg': lockup('l', 'currentColor'),
  'zweaq-logo-white.svg': lockup('lw', PAPER),
  'zweaq-logo-black.svg': lockup('lb', INK),
  'favicon.svg': favicon,
  'app-icon.svg': appIcon,
};

for (const [name, body] of Object.entries(files)) {
  writeFileSync(new URL(name, OUT), body);
  console.log('  ✓ public/brand/' + name);
}
