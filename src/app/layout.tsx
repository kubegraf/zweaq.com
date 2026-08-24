import type { Metadata, Viewport } from 'next';
import localFont from 'next/font/local';
import { Nav } from '@/components/layout/Nav';
import { Footer } from '@/components/layout/Footer';
import { BrandDefs } from '@/components/ui/Logo';
import { AnalyticsBoot } from '@/components/layout/AnalyticsBoot';
import { siteConfig } from '@/content/site';
import { organizationSchema } from '@/lib/schema';
import './globals.css';

/**
 * Fonts are self-hosted latin-subset variable builds (see public/fonts).
 * Nothing is fetched from a font CDN at build time or at runtime: the build has
 * no network dependency, the page makes no third-party request, and there is no
 * external origin to connect to before text can paint.
 */
const grotesk = localFont({
  src: '../../public/fonts/SpaceGrotesk-latin.woff2',
  weight: '300 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-grotesk',
  // Tuned so the fallback occupies almost exactly the same space — this is what
  // keeps CLS at zero across the font swap.
  fallback: ['ui-sans-serif', 'system-ui', 'sans-serif'],
  adjustFontFallback: false,
});

const mono = localFont({
  src: '../../public/fonts/JetBrainsMono-latin.woff2',
  weight: '400 700',
  style: 'normal',
  display: 'swap',
  variable: '--font-mono-face',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    'ZWEAQ',
    'ZWEAQ ONE',
    'wearable personal computer',
    'AI ring',
    'smart ring',
    'digital identity wearable',
    'encrypted wearable storage',
    'NFC ring',
  ],
  authors: [{ name: 'ZWEAQ' }],
  creator: 'ZWEAQ',
  publisher: 'ZWEAQ',
  alternates: { canonical: siteConfig.url },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large' },
  },
  openGraph: {
    type: 'website',
    siteName: siteConfig.name,
    title: `${siteConfig.name} ONE — ${siteConfig.tagline}`,
    description: siteConfig.description,
    url: siteConfig.url,
    locale: 'en_GB',
    images: [
      {
        url: siteConfig.absolute('/og.png'),
        width: 1200,
        height: 630,
        alt: 'ZWEAQ ONE — the personal computer you wear.',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteConfig.name} ONE — ${siteConfig.tagline}`,
    description: siteConfig.description,
    images: [siteConfig.absolute('/og.png')],
  },
  icons: {
    icon: [{ url: siteConfig.asset('/brand/favicon.svg'), type: 'image/svg+xml' }],
    apple: [{ url: siteConfig.asset('/brand/app-icon.svg') }],
  },
  category: 'technology',
};

export const viewport: Viewport = {
  themeColor: '#08090b',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1,
  // Never block zoom. Pinch-zoom is an accessibility requirement, not a
  // layout inconvenience.
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${grotesk.variable} ${mono.variable}`}>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="fixed left-4 top-4 z-[100] inline-flex h-11 -translate-y-24 items-center rounded-full bg-paper px-5 font-mono text-xs uppercase tracking-[0.14em] text-ink transition-transform duration-[var(--duration-fast)] focus:translate-y-0"
        >
          Skip to content
        </a>

        <BrandDefs />
        <AnalyticsBoot />
        <Nav />
        <main id="main" className="pt-[var(--nav-h)]">
          {children}
        </main>
        <Footer />

        <script
          type="application/ld+json"
          // Static, build-time constant. No user input reaches this string.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema()) }}
        />
      </body>
    </html>
  );
}
