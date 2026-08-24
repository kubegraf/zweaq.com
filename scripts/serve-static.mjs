/**
 * Serves the static export at the same path GitHub Pages will.
 *
 * The export is built with basePath `/zweaq.com`, so every asset URL is
 * absolute under that prefix. Serving `out/` at the root would 404 all of them
 * and — worse — quietly return index.html for missing CSS in SPA mode, which
 * looks like "the styles broke" rather than "the mount point is wrong".
 *
 * Usage: node scripts/serve-static.mjs [port]
 */
import { createServer } from 'node:http';
import { createReadStream, statSync, existsSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';

const PORT = Number(process.argv[2] ?? 4321);
const ROOT = new URL('../out/', import.meta.url).pathname;
const BASE = process.env.STATIC_BASE_PATH ?? '/zweaq.com';

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};

function resolve(urlPath) {
  if (!urlPath.startsWith(BASE)) return null;
  let rel = urlPath.slice(BASE.length) || '/';
  rel = decodeURIComponent(rel.split('?')[0]);

  // Reject traversal before it ever touches the filesystem.
  const safe = normalize(rel).replace(/^(\.\.[/\\])+/, '');
  let file = join(ROOT, safe);
  if (!file.startsWith(ROOT)) return null;

  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file) && existsSync(`${file}.html`)) file = `${file}.html`;
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

const server = createServer((req, res) => {
  const url = req.url ?? '/';

  if (url === '/' || url === BASE) {
    res.writeHead(302, { Location: `${BASE}/` });
    res.end();
    return;
  }

  const file = resolve(url);
  if (!file) {
    const notFound = join(ROOT, '404.html');
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    if (existsSync(notFound)) createReadStream(notFound).pipe(res);
    else res.end('Not found');
    return;
  }

  res.writeHead(200, {
    'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream',
    'Cache-Control': 'no-store',
  });
  createReadStream(file).pipe(res);
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Static export on http://127.0.0.1:${PORT}${BASE}/`);
});
