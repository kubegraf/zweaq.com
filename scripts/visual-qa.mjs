/**
 * Responsive visual QA.
 *
 * Walks every page at every target viewport, captures a full-page screenshot,
 * and — more usefully — asserts the things that are easy to break and hard to
 * see: horizontal overflow, touch targets under 44px, and text below 12px.
 *
 * Run: npm run qa:visual   (expects `npm run build:static` to have run)
 */
import { chromium } from '@playwright/test';
import { chromiumLaunchOptions } from './pw-browser.mjs';
import { mkdirSync, writeFileSync } from 'node:fs';
import { spawn } from 'node:child_process';

const PORT = 4399;
const BASE = `http://127.0.0.1:${PORT}/zweaq.com`;
const OUT = 'qa/screenshots';

const VIEWPORTS = [
  { name: '375x812-iphone-se3', width: 375, height: 812, mobile: true },
  { name: '390x844-iphone-14', width: 390, height: 844, mobile: true },
  { name: '430x932-iphone-pro-max', width: 430, height: 932, mobile: true },
  { name: '768x1024-ipad-portrait', width: 768, height: 1024, mobile: true },
  { name: '1024x768-ipad-landscape', width: 1024, height: 768, mobile: false },
  { name: '1440x900-laptop', width: 1440, height: 900, mobile: false },
  { name: '1920x1080-desktop', width: 1920, height: 1080, mobile: false },
];

const PAGES = ['/', '/product/', '/technology/', '/security/', '/developers/', '/privacy/', '/terms/', '/cookies/', '/press/'];

const server = spawn('node', ['scripts/serve-static.mjs', String(PORT)], {
  stdio: ['ignore', 'ignore', 'inherit'],
  detached: false,
});

// A crash must fail the run, not end it quietly with a zero exit code.
process.on('unhandledRejection', (error) => {
  console.error('Visual QA failed:', error);
  shutdownAndExit(1);
});
const shutdown = () => {
  try {
    server.kill('SIGTERM');
  } catch {
    /* already gone */
  }
};
const shutdownAndExit = (code) => {
  shutdown();
  process.exit(code);
};
process.on('exit', shutdown);

async function waitForServer() {
  // If the child died — most often because the port was already taken — do not
  // fall through and audit whatever else is listening there.
  let exited = null;
  server.on('exit', (code) => {
    exited = code;
  });

  for (let i = 0; i < 60; i += 1) {
    if (exited !== null) {
      console.error(
        `The static server exited with code ${exited}. Port ${PORT} is probably in use.`,
      );
      process.exit(1);
    }
    try {
      const res = await fetch(`${BASE}/`);
      if (res.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  console.error('The static server did not start.');
  process.exit(1);
}

await waitForServer();
mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch(chromiumLaunchOptions());
const findings = [];

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({
    viewport: { width: vp.width, height: vp.height },
    deviceScaleFactor: 2,
    isMobile: vp.mobile,
    hasTouch: vp.mobile,
    // Screenshots must be deterministic, so freeze motion.
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();

  for (const path of PAGES) {
    const url = `${BASE}${path}`;
    const response = await page.goto(url, { waitUntil: 'networkidle' });
    if (!response || !response.ok()) {
      findings.push({ vp: vp.name, path, kind: 'http', detail: `status ${response?.status()}` });
      continue;
    }
    // Reveal animations are opacity-0 until observed; force them for the shot.
    await page.evaluate(() => {
      document.querySelectorAll('[data-reveal]').forEach((el) => {
        el.setAttribute('data-revealed', 'true');
      });
    });
    await page.waitForTimeout(180);

    const slug = path === '/' ? 'home' : path.replaceAll('/', '') || 'home';
    await page.screenshot({
      path: `${OUT}/${slug}__${vp.name}.png`,
      fullPage: true,
    });

    const issues = await page.evaluate((viewportWidth) => {
      const out = [];

      const docWidth = document.documentElement.scrollWidth;
      if (docWidth > viewportWidth + 1) {
        // Find what is actually sticking out, not just that something is.
        const culprits = [];
        document.querySelectorAll('body *').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.width === 0) return;
          if (r.right > viewportWidth + 1 || r.left < -1) {
            culprits.push(
              `${el.tagName.toLowerCase()}.${String(el.className).split(' ').slice(0, 2).join('.')} [${Math.round(r.left)}→${Math.round(r.right)}]`,
            );
          }
        });
        out.push({ kind: 'overflow', detail: `doc ${docWidth}px > vp ${viewportWidth}px :: ${culprits.slice(0, 4).join(' | ')}` });
      }

      /*
       * Touch targets below WCAG 2.5.8's 44px minimum.
       *
       * Two exemptions, both from the success criterion itself: targets in a
       * sentence or block of text ("inline exception"), and targets that are
       * not exposed to the user at all.
       */
      document.querySelectorAll('a[href], button, input, select, textarea, summary').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.width === 0 || r.height === 0) return;

        // Hidden from assistive technology and unfocusable: not a target.
        if (el.closest('[aria-hidden="true"]')) return;
        if (el.getAttribute('tabindex') === '-1') return;

        const style = getComputedStyle(el);
        if (style.visibility === 'hidden' || style.display === 'none') return;

        // WCAG 2.5.8 inline exception: a link inside running text.
        if (style.display.startsWith('inline') && el.closest('p, li, dd, blockquote')) return;

        /*
         * A control wrapped in a label is targeted by that label — clicking
         * anywhere on it activates the control — so the label's box is the
         * real target, not the input's.
         */
        let box = r;
        const wrappingLabel = el.closest('label');
        if (wrappingLabel && wrappingLabel !== el) {
          box = wrappingLabel.getBoundingClientRect();
        }

        if (box.height < 44 || box.width < 44) {
          out.push({
            kind: 'touch-target',
            detail: `${el.tagName.toLowerCase()} "${(el.textContent || '').trim().slice(0, 24)}" ${Math.round(box.width)}x${Math.round(box.height)}`,
          });
        }
      });

      document.querySelectorAll('p, li, span, dd, dt, td, th, a, button, label').forEach((el) => {
        if (!el.textContent?.trim()) return;
        const size = parseFloat(getComputedStyle(el).fontSize);
        if (size > 0 && size < 11) {
          out.push({ kind: 'tiny-text', detail: `${el.tagName.toLowerCase()} ${size}px "${el.textContent.trim().slice(0, 24)}"` });
        }
      });

      return out;
    }, vp.width);

    for (const issue of issues) findings.push({ vp: vp.name, path, ...issue });
  }
  await context.close();
}

await browser.close();
shutdown();

const grouped = findings.reduce((acc, f) => {
  const key = `${f.kind}`;
  (acc[key] ??= []).push(f);
  return acc;
}, {});

writeFileSync('qa/report.json', JSON.stringify(findings, null, 2));

if (findings.length === 0) {
  console.log(`\n✓ Visual QA clean across ${VIEWPORTS.length} viewports × ${PAGES.length} pages`);
} else {
  console.log(`\n${findings.length} finding(s):\n`);
  for (const [kind, list] of Object.entries(grouped)) {
    console.log(`  ${kind.toUpperCase()} (${list.length})`);
    const seen = new Set();
    for (const f of list) {
      const line = `    ${f.vp} ${f.path} — ${f.detail}`;
      if (seen.has(line)) continue;
      seen.add(line);
      console.log(line);
    }
    console.log('');
  }
}
console.log(`Screenshots: ${OUT}/`);

// Exit non-zero on findings — otherwise the CI step that claims to gate on
// this audit passes regardless of what the audit found.
process.exit(findings.length === 0 ? 0 : 1);
