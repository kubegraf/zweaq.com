/**
 * Ring SVG builder for static asset generation.
 *
 * Mirrors the design language of src/components/product/ProductViewer.tsx, but
 * stands alone: this runs in Node to emit files, and the component runs in the
 * browser to be interactive. The live site renders the component — these files
 * exist so /public/product has real assets, and so the swap path in
 * src/content/media.ts is demonstrably real rather than theoretical.
 *
 * Everything it emits is a CONCEPT render. No hardware has been built.
 */

const CX = 400;
const R = 250;

/** View definitions. `k` is cos(camera angle from the ring axis). */
export const VIEWS = {
  hero: { k: 0.5, band: 0.48, wall: 0.15, phi: 0, label: '12:30' },
  front: { k: 0.42, band: 0.52, wall: 0.15, phi: 0, label: 'AI READY' },
  side: { k: 0.16, band: 0.62, wall: 0.15, phi: 0, label: 'B42' },
  top: { k: 0.9, band: 0.2, wall: 0.15, phi: 0, label: '' },
  display: { k: 0.38, band: 0.56, wall: 0.15, phi: 0, label: 'OTP 583921', zoom: 1.9 },
  detail: { k: 0.55, band: 0.5, wall: 0.15, phi: 42, label: '✓ SAVED', zoom: 1.35 },
};

export function ringSvg(view, { width = 1200, height = 960, bg = '#08090b' } = {}) {
  const v = VIEWS[view];
  if (!v) throw new Error(`unknown view: ${view}`);

  const K = v.k;
  const SIN = Math.sqrt(1 - K * K);
  const RY = R * K;
  const H = Math.round(v.band * R * SIN);
  const TOP = Math.round(322 - H / 2);
  const BOT = TOP + H;
  const WALL = Math.round(v.wall * R);
  const RI = R - WALL;
  const RIY = RI * K;

  const ribbon = (y1, y2, rx, ry, half) => {
    const s = half === 'top' ? 1 : 0;
    return `M${CX - rx},${y1} A${rx},${ry} 0 0 ${s} ${CX + rx},${y1} L${CX + rx},${y2} A${rx},${ry} 0 0 ${1 - s} ${CX - rx},${y2} Z`;
  };
  const ell = (cy, rx, ry) =>
    `M${CX - rx},${cy} A${rx},${ry} 0 1 0 ${CX + rx},${cy} A${rx},${ry} 0 1 0 ${CX - rx},${cy} Z`;
  const pt = (phi, t) => {
    const a = (phi * Math.PI) / 180;
    return [CX + R * Math.sin(a), TOP + RY * Math.cos(a) + t * H];
  };
  const patch = (p0, p1, t0, t1, n = 20) => {
    const a = [];
    const b = [];
    for (let i = 0; i <= n; i += 1) {
      const phi = p0 + ((p1 - p0) * i) / n;
      a.push(pt(phi, t0).map((x) => x.toFixed(1)).join(','));
      b.push(pt(phi, t1).map((x) => x.toFixed(1)).join(','));
    }
    return `M${a.join(' L')} L${b.reverse().join(' L')} Z`;
  };
  const seam = (p0, p1, t, n = 28) => {
    const a = [];
    for (let i = 0; i <= n; i += 1) {
      const phi = p0 + ((p1 - p0) * i) / n;
      a.push(pt(phi, t).map((x) => x.toFixed(1)).join(','));
    }
    return `M${a.join(' L')}`;
  };

  const facing = Math.cos((v.phi * Math.PI) / 180);
  const showDisplay = v.label && Math.abs(v.phi) < 72 && K < 0.8;
  const d0 = v.phi - 20;
  const d1 = v.phi + 20;
  const [tx, ty0] = pt(v.phi, 0.5);
  const zoom = v.zoom ?? 1;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 640" width="${width}" height="${height}">
<defs>
 <linearGradient id="ti" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#33373d"/><stop offset=".07" stop-color="#5e646d"/>
  <stop offset=".18" stop-color="#a7adb6"/><stop offset=".28" stop-color="#868d97"/>
  <stop offset=".42" stop-color="#6b7179"/><stop offset=".55" stop-color="#767d86"/>
  <stop offset=".68" stop-color="#9aa1aa"/><stop offset=".8" stop-color="#6e747c"/>
  <stop offset=".92" stop-color="#4a4f56"/><stop offset="1" stop-color="#2e3239"/></linearGradient>
 <linearGradient id="shade" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#fff" stop-opacity=".13"/>
  <stop offset=".38" stop-color="#fff" stop-opacity="0"/>
  <stop offset="1" stop-color="#000" stop-opacity=".42"/></linearGradient>
 <linearGradient id="rim" x1="0" y1="0" x2="1" y2="0">
  <stop offset="0" stop-color="#3f444b"/><stop offset=".17" stop-color="#b7bec7"/>
  <stop offset=".37" stop-color="#8d949d"/><stop offset=".55" stop-color="#b4bbc4"/>
  <stop offset=".76" stop-color="#787f88"/><stop offset="1" stop-color="#3c4047"/></linearGradient>
 <linearGradient id="iw" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#080a0d"/><stop offset=".52" stop-color="#1a1e24"/>
  <stop offset="1" stop-color="#333941"/></linearGradient>
 <radialGradient id="hole" cx=".5" cy=".62" r=".72">
  <stop offset="0" stop-color="${bg}"/><stop offset=".78" stop-color="${bg}"/>
  <stop offset="1" stop-color="#000" stop-opacity=".85"/></radialGradient>
 <radialGradient id="key" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#c4cbd4" stop-opacity=".15"/>
  <stop offset="1" stop-color="#c4cbd4" stop-opacity="0"/></radialGradient>
 <radialGradient id="glow" cx=".5" cy=".5" r=".5">
  <stop offset="0" stop-color="#dff3ff" stop-opacity=".5"/>
  <stop offset="1" stop-color="#dff3ff" stop-opacity="0"/></radialGradient>
 <linearGradient id="refl" x1="0" y1="0" x2="1" y2="1">
  <stop offset="0" stop-color="#dff3ff" stop-opacity=".14"/>
  <stop offset=".65" stop-color="#dff3ff" stop-opacity=".03"/>
  <stop offset="1" stop-color="#dff3ff" stop-opacity="0"/></linearGradient>
 <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1">
  <stop offset="0" stop-color="#0a0f16"/><stop offset=".5" stop-color="#070b10"/>
  <stop offset="1" stop-color="#111820"/></linearGradient>
 <clipPath id="dw"><path d="${patch(d0, d1, 0.28, 0.72)}"/></clipPath>
</defs>
<rect width="800" height="640" fill="${bg}"/>
<g transform="translate(400 320) scale(${zoom}) translate(-400 -320)">
<ellipse cx="400" cy="320" rx="340" ry="240" fill="url(#key)"/>
<ellipse cx="400" cy="${BOT + RY + 34}" rx="${(R * 0.8).toFixed(0)}" ry="17" fill="#000" opacity=".6"/>
<path d="${ell((TOP + BOT) / 2, RI, RIY)}" fill="url(#hole)"/>
<path d="${ribbon(TOP, BOT, RI, RIY, 'top')}" fill="url(#iw)"/>
<path d="${ribbon(TOP, BOT, R, RY, 'bottom')}" fill="url(#ti)"/>
<path d="${seam(-90, 90, 0.17)}" fill="none" stroke="#0b0d11" stroke-opacity=".3" stroke-width="1.1"/>
<path d="${seam(-90, 90, 0.83)}" fill="none" stroke="#0b0d11" stroke-opacity=".3" stroke-width="1.1"/>
${
  showDisplay
    ? `<g opacity="${Math.min(1, Math.max(0, facing * 1.4)).toFixed(2)}">
<path d="${patch(d0, d1, 0.28, 0.72)}" fill="url(#glass)"/>
<g clip-path="url(#dw)">
 <ellipse cx="${tx.toFixed(1)}" cy="${ty0.toFixed(1)}" rx="${(74 * Math.max(0.05, facing)).toFixed(1)}" ry="24" fill="url(#glow)"/>
 <text x="${tx.toFixed(1)}" y="${(ty0 + 9).toFixed(1)}" fill="#dff3ff" font-family="monospace" font-size="27"
   font-weight="500" letter-spacing="1.5" text-anchor="middle"
   transform="translate(${tx.toFixed(1)} ${ty0.toFixed(1)}) scale(${Math.max(0.05, facing).toFixed(3)} 1) translate(${(-tx).toFixed(1)} ${(-ty0).toFixed(1)})">${v.label}</text>
 <path d="${patch(d0, d0 + 12, 0.28, 0.72)}" fill="url(#refl)"/>
</g>
<path d="${patch(d0, d1, 0.28, 0.34)}" fill="#000" opacity=".34"/>
<path d="${seam(d0, d1, 0.28)}" fill="none" stroke="#c4cbd4" stroke-opacity=".2" stroke-width=".9"/>
</g>`
    : ''
}
<path d="${ribbon(TOP, BOT, R, RY, 'bottom')}" fill="url(#shade)"/>
<path d="${ell(TOP, R, RY)} ${ell(TOP, RI, RIY)}" fill="url(#rim)" fill-rule="evenodd"/>
<path d="${ell(TOP, RI, RIY)}" fill="none" stroke="#05070a" stroke-opacity=".7" stroke-width="1.6"/>
</g>
</svg>`;
}
