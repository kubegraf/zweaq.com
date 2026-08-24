/**
 * Site-wide configuration. Anything that is a fact about the company, the
 * deployment, or an external destination lives here — never inline in a
 * component.
 */

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

export const siteConfig = {
  name: 'ZWEAQ',
  product: 'ZWEAQ ONE',
  tagline: 'The personal computer you wear.',
  promise: ['Your data.', 'Your identity.', 'Your AI.', 'On your finger.'],
  alternateLine: 'See less. Do more.',
  description:
    'ZWEAQ ONE is a wearable personal computer. AI interaction, encrypted personal storage, digital identity, NFC and a micro-display — on your finger.',

  /** Canonical origin. Override per-environment via NEXT_PUBLIC_SITE_URL. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kubegraf.github.io/zweaq.com',
  basePath,

  /** Prefix a public asset path with the deployment base path. */
  asset: (path: string) => `${basePath}${path}`,

  /**
   * Fully-qualified URL for a public asset.
   *
   * Metadata cannot use `asset()`: Open Graph and Twitter consumers fetch these
   * from another origin, so they must be absolute. And they cannot be resolved
   * against `metadataBase` either — this deployment lives under a path prefix,
   * and `new URL('/og.png', 'https://host/zweaq.com')` resolves to the host
   * root, silently dropping the prefix.
   */
  absolute: (path: string) =>
    `${(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://kubegraf.github.io/zweaq.com').replace(/\/$/, '')}${path}`,

  /**
   * Outbound links. A key set to null renders nothing at all — the footer and
   * nav skip missing destinations rather than emitting dead `#` links.
   */
  links: {
    x: null as string | null,
    linkedin: null as string | null,
    youtube: null as string | null,
    github: null as string | null,
  },

  /** Contact routes. Rendered obfuscated; never emitted as a plain mailto in HTML. */
  contact: {
    general: { user: 'hello', domain: 'zweaq.com' },
    press: { user: 'press', domain: 'zweaq.com' },
    security: { user: 'security', domain: 'zweaq.com' },
    developers: { user: 'developers', domain: 'zweaq.com' },
  },

  /**
   * Commerce is architecturally present but switched off. Nothing in the UI
   * takes payment details while this is false. See docs/WEBSITE_ARCHITECTURE.md.
   */
  commerce: {
    preordersEnabled: false,
    checkoutProvider: null as string | null,
    currency: 'GBP',
  },
} as const;

export type SiteConfig = typeof siteConfig;
