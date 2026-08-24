import type { MetadataRoute } from 'next';
import { siteConfig } from '@/content/site';

/**
 * Sitemap.
 *
 * `priority` is deliberately omitted: Google has stated for years that it
 * ignores it, and populating it is cargo cult rather than SEO.
 */
export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const routes: { path: string; changeFrequency: 'weekly' | 'monthly' | 'yearly' }[] = [
    { path: '/', changeFrequency: 'weekly' },
    { path: '/product', changeFrequency: 'weekly' },
    { path: '/technology', changeFrequency: 'monthly' },
    { path: '/security', changeFrequency: 'monthly' },
    { path: '/developers', changeFrequency: 'monthly' },
    { path: '/press', changeFrequency: 'monthly' },
    { path: '/privacy', changeFrequency: 'yearly' },
    { path: '/terms', changeFrequency: 'yearly' },
    { path: '/cookies', changeFrequency: 'yearly' },
  ];

  return routes.map((route) => ({
    url: siteConfig.absolute(route.path === '/' ? '' : route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
  }));
}
