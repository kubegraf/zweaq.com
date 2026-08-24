import { siteConfig } from '@/content/site';
import { productConfig } from '@/content/product';
import { faq } from '@/content/faq';

/**
 * Structured data.
 *
 * Every claim here mirrors what the page actually says. In particular the
 * Product schema deliberately does NOT emit an `offers` block: there is no
 * price, no availability and no way to buy, and publishing an offer for a
 * product that cannot be bought is exactly the kind of dishonesty this site
 * is built to avoid. `PreOrder`/`InStock` go in when commerce is switched on.
 */

/**
 * Absolute URL for a public asset. Not `new URL(path, siteConfig.url)` — this
 * deployment lives under a path prefix, and resolving an absolute path against
 * it would silently drop that prefix.
 */
const abs = (path: string) => siteConfig.absolute(path);

export function organizationSchema() {
  const sameAs = Object.values(siteConfig.links).filter(
    (value): value is string => typeof value === 'string' && value.length > 0,
  );

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: abs('/brand/zweaq-logo-white.svg'),
    description: siteConfig.description,
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

export function productSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productConfig.name,
    category: productConfig.category,
    description: siteConfig.description,
    brand: { '@type': 'Brand', name: siteConfig.name },
    image: abs('/og.png'),
    releaseDate: '2028',
    additionalProperty: Object.entries(productConfig.specs).map(([key, claim]) => ({
      '@type': 'PropertyValue',
      name: key,
      // The claim prefix travels with the value into structured data too.
      value: claim.level === 'production' ? claim.value : `Target: ${claim.value}`,
    })),
  };
}

export function faqSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };
}

export function breadcrumbSchema(trail: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
