/**
 * Generates /public/product concept renders and the Open Graph image.
 *
 * Run: npm run gen:renders
 *
 * These are CONCEPT renders of hardware that has not been built. They are not
 * photographs, and nothing in this repository presents them as photographs.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { ringSvg, VIEWS } from './ring-svg.mjs';
import { markBody } from './brand-geometry.mjs';

const PRODUCT = new URL('../public/product/', import.meta.url);
const PUBLIC = new URL('../public/', import.meta.url);
mkdirSync(PRODUCT, { recursive: true });

const SIZES = {
  hero: [1600, 1280],
  front: [1200, 960],
  side: [1200, 960],
  top: [1200, 960],
  display: [1200, 960],
  detail: [1200, 960],
};

for (const view of Object.keys(VIEWS)) {
  const [w, h] = SIZES[view];
  const svg = ringSvg(view, { width: w, height: h });
  const out = new URL(`${view}.webp`, PRODUCT);
  await sharp(Buffer.from(svg))
    .webp({ quality: 88, effort: 6 })
    .toFile(out.pathname);
  console.log(`  ✓ public/product/${view}.webp  ${w}×${h}`);
}

/*
 * Open Graph image.
 *
 * PNG, not SVG: several major consumers — including Slack and a number of
 * messaging clients — do not render SVG Open Graph images at all, and show a
 * blank card instead. 1200×630 is the size everything agrees on.
 */
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <rect width="1200" height="630" fill="#08090b"/>
  <g opacity=".92">
    <image href="data:image/svg+xml;base64,${Buffer.from(ringSvg('hero', { width: 800, height: 640 })).toString('base64')}"
           x="600" y="15" width="750" height="600"/>
  </g>
  <g transform="translate(80 96) scale(1.05)" fill="#f4f5f7">${markBody('og', '#f4f5f7')}</g>
  <text x="80" y="290" fill="#f4f5f7" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="500" letter-spacing="-3">The personal</text>
  <text x="80" y="372" fill="#f4f5f7" font-family="Helvetica, Arial, sans-serif" font-size="76" font-weight="500" letter-spacing="-3">computer you wear.</text>
  <text x="80" y="440" fill="#a2abb8" font-family="Helvetica, Arial, sans-serif" font-size="27">AI. Identity. Storage. Information. On your finger.</text>
  <rect x="80" y="492" width="242" height="38" rx="19" fill="none" stroke="#3a4048"/>
  <text x="100" y="517" fill="#7c8593" font-family="monospace" font-size="16" letter-spacing="2.4">CONCEPT RENDER</text>
  <text x="1120" y="566" fill="#565e6b" font-family="monospace" font-size="18" letter-spacing="4" text-anchor="end">ZWEAQ ONE</text>
</svg>`;

await sharp(Buffer.from(ogSvg)).png({ compressionLevel: 9 }).toFile(new URL('og.png', PUBLIC).pathname);
console.log('  ✓ public/og.png  1200×630');
