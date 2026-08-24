/**
 * ZWEAQ website — Next.js configuration.
 *
 * Two build targets share one codebase:
 *
 *  - `next build`                 → Node target. Route handlers (POST /api/waitlist) are live.
 *  - `STATIC_EXPORT=1 next build` → Static export for GitHub Pages. No server, so the
 *                                   route handler is excluded via `pageExtensions` (the
 *                                   handler file is named `route.node.ts`, which only
 *                                   resolves as a route when `node.ts` is a page extension).
 *
 * The waitlist UI never depends on which target is in use — see src/lib/waitlist/client.ts.
 */
const isStaticExport = process.env.STATIC_EXPORT === '1';

// GitHub Pages project sites are served from /<repo>. Configurable so a future
// move to zweaq.com (apex domain, basePath '') needs no code change.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? (isStaticExport ? '/zweaq.com' : '');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  ...(isStaticExport
    ? { output: 'export', images: { unoptimized: true }, trailingSlash: true }
    : {}),

  basePath,
  assetPrefix: basePath || undefined,

  // `node.ts` is only a routable extension on the Node target.
  pageExtensions: isStaticExport ? ['tsx', 'ts'] : ['node.ts', 'tsx', 'ts'],

  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },

  eslint: { dirs: ['src', 'scripts'] },
};

export default nextConfig;
