import { describe, it, expect } from 'vitest';
import { organizationSchema, productSchema, faqSchema, breadcrumbSchema } from '@/lib/schema';
import { siteConfig } from '@/content/site';
import { faq } from '@/content/faq';

describe('structured data', () => {
  it('describes the organisation without inventing profiles', () => {
    const schema = organizationSchema();
    expect(schema['@type']).toBe('Organization');
    expect(schema.url).toBe(siteConfig.url);
    // No social accounts are configured, so sameAs must be absent entirely.
    expect('sameAs' in schema).toBe(false);
  });

  /*
   * The important one. Emitting an `offers` block would tell search engines the
   * product can be bought at a price, which is false: preorders are not open and
   * the price is a target band.
   */
  it('publishes no offer for a product that cannot be bought', () => {
    const schema = productSchema();
    expect('offers' in schema).toBe(false);
    expect(JSON.stringify(schema)).not.toContain('InStock');
    expect(JSON.stringify(schema)).not.toContain('PreOrder');
  });

  it('carries the target qualifier into structured data', () => {
    const properties = productSchema().additionalProperty;
    for (const property of properties) {
      expect(property.value).toMatch(/^Target: /);
    }
    expect(properties.some((p) => p.value === 'Target: 32 GB')).toBe(true);
  });

  it('keeps every asset URL under the deployment base path', () => {
    const urls = [
      organizationSchema().logo,
      productSchema().image,
      ...breadcrumbSchema([{ name: 'Home', path: '/' }]).itemListElement.map((i) => i.item),
    ];
    for (const url of urls) {
      expect(url.startsWith(siteConfig.url), `${url} escaped the base path`).toBe(true);
    }
  });

  it('mirrors every published FAQ answer', () => {
    const schema = faqSchema();
    expect(schema.mainEntity).toHaveLength(faq.length);
    expect(schema.mainEntity[0]?.acceptedAnswer.text).toBe(faq[0]?.answer);
  });
});
