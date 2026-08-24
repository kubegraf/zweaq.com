import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site';

/**
 * Web app manifest.
 *
 * Icons are PNG rather than the SVG mark: several Android launchers still
 * ignore SVG icons and substitute a screenshot of the page, which reads as a
 * bug rather than as a brand. The maskable variant carries the extra padding
 * launchers crop into.
 */
export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${siteConfig.name} — ${siteConfig.tagline}`,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: siteConfig.asset('/'),
    scope: siteConfig.asset('/'),
    display: 'standalone',
    background_color: '#08090b',
    theme_color: '#08090b',
    icons: [
      { src: siteConfig.asset('/icons/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { src: siteConfig.asset('/icons/icon-512.png'), sizes: '512x512', type: 'image/png' },
      {
        src: siteConfig.asset('/icons/icon-maskable-512.png'),
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}
