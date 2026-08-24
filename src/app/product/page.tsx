import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { CtaBand } from '@/components/sections/CtaBand';
import { Section, Reveal } from '@/components/ui/Section';
import { Spec } from '@/components/ui/Spec';
import { ClaimBadge } from '@/components/ui/ClaimBadge';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { ProductViewer } from '@/components/product/ProductViewer';
import { productConfig } from '@/content/product';
import { pricing } from '@/content/pricing';
import { faq } from '@/content/faq';
import { siteConfig } from '@/content/site';
import { productSchema, breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'ZWEAQ ONE',
  description:
    'ZWEAQ ONE hardware: micro-display, encrypted vault, hardware-backed identity, NFC, sensors and battery. Every figure labelled with how much is actually known about it.',
  alternates: { canonical: siteConfig.absolute('/product') },
};

const SPEC_GROUPS = [
  {
    title: 'Hardware',
    specs: [
      ['Materials', productConfig.specs.materials],
      ['Weight', productConfig.specs.weight],
      ['Sizes', productConfig.specs.sizes],
      ['Water resistance', productConfig.specs.waterResistance],
    ] as const,
  },
  {
    title: 'Compute and storage',
    specs: [
      ['Vault capacity', productConfig.specs.storage],
      ['Secure element', productConfig.specs.secureElement],
      ['Display', productConfig.specs.display],
      ['Battery', productConfig.specs.battery],
    ] as const,
  },
  {
    title: 'Connectivity',
    specs: [
      ['Wireless', productConfig.specs.connectivity],
      ['NFC', productConfig.specs.nfc],
    ] as const,
  },
];

const COMPATIBILITY = [
  { platform: 'iOS', status: 'In scope', note: 'Over Bluetooth LE. Minimum version published at beta.' },
  { platform: 'Android', status: 'In scope', note: 'Over Bluetooth LE. Minimum version published at beta.' },
  { platform: 'macOS', status: 'In scope', note: 'Identity and vault access from a paired machine.' },
  { platform: 'Windows', status: 'In scope', note: 'Identity and vault access from a paired machine.' },
  { platform: 'Linux', status: 'Exploring', note: 'Depends on the developer platform landing first.' },
];

export default function ProductPage() {
  return (
    <>
      <PageHeader
        eyebrow="ZWEAQ ONE"
        title="The hardware."
        lede={
          <>
            A wearable personal computer: AI interaction, an encrypted vault, a
            hardware-backed identity, NFC, a micro-display and context sensors — in a
            band you already know how to wear.
          </>
        }
        aside={
          <div className="flex flex-col items-center gap-3">
            <ProductViewer
              title="ZWEAQ ONE concept render, three-quarter view, display reading 12:30."
              displayText="12:30"
              className="w-full max-w-[24rem]"
            />
            <span className="label-z rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
              Concept render
            </span>
          </div>
        }
      />

      <Section
        id="specifications"
        index="01"
        eyebrow="Specifications"
        headline="Every number, with its provenance."
        lede="Nothing below is a measurement. ZWEAQ ONE has not been built, so these are design targets and they are labelled as design targets."
      >
        <div className="mt-12 flex flex-col gap-10">
          {SPEC_GROUPS.map((group, gi) => (
            <Reveal key={group.title} delay={gi * 70}>
              <div className="grid gap-6 border-t border-[var(--line)] pt-8 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
                <h3 className="label-z text-ti-600">{group.title}</h3>
                <dl className="grid gap-8 sm:grid-cols-2">
                  {group.specs.map(([label, claim]) => (
                    <Spec key={label} label={label} claim={claim} />
                  ))}
                </dl>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section
        id="capabilities"
        index="02"
        eyebrow="Capabilities"
        headline="What it is designed to do."
      >
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {productConfig.modes.map((mode, i) => (
            <li key={mode.id} className="flex flex-col gap-4 bg-ink-raised p-6">
              <Reveal delay={i * 50}>
                <div className="flex items-center justify-between gap-3">
                  <DisplayChip>{mode.display}</DisplayChip>
                  <ClaimBadge level="concept" />
                </div>
                <h3 className="mt-4 text-paper">{mode.headline}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ti-600">{mode.blurb}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="compatibility"
        index="03"
        eyebrow="Compatibility"
        headline="What it is designed to work with."
        lede="“In scope” means it is part of the platform plan. It does not mean it works today — nothing does yet."
      >
        <Reveal>
          <ul className="mt-12 flex flex-col">
            {COMPATIBILITY.map((row) => (
              <li
                key={row.platform}
                className="grid gap-2 border-t border-[var(--line)] py-5 last:border-b sm:grid-cols-[10rem_8rem_minmax(0,1fr)] sm:items-baseline sm:gap-6"
              >
                <span className="text-paper">{row.platform}</span>
                <span className="label-z text-ti-500">{row.status}</span>
                <span className="text-sm leading-relaxed text-ti-600">{row.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section
        id="price"
        index="04"
        eyebrow="Pricing"
        headline="From £199, as a target."
        lede={pricing.disclaimer}
      >
        <Reveal>
          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {productConfig.variants.map((variant) => (
              <li
                key={variant.id}
                className="flex flex-col gap-2 rounded-lg border border-[var(--line)] p-6"
              >
                <span className="text-paper">{variant.name}</span>
                <span className="font-mono text-xl text-ti-300">
                  £{variant.priceFrom}–£{variant.priceTo}
                </span>
                <span className="label-z mt-2 text-ti-700">Indicative target</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section
        id="product-faq"
        index="05"
        eyebrow="Questions"
        headline="About the hardware."
      >
        <ul className="mt-12 flex flex-col">
          {faq
            .filter((item) => item.group === 'capability')
            .slice(0, 6)
            .map((item, i) => (
              <li key={item.id}>
                <Reveal delay={i * 40}>
                  <details className="group border-t border-[var(--line)] last:border-b">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-paper marker:content-none [&::-webkit-details-marker]:hidden">
                      <span>{item.question}</span>
                      <span aria-hidden="true" className="mt-1 shrink-0 text-ti-600 transition-transform group-open:rotate-45">
                        <svg viewBox="0 0 16 16" className="h-4 w-4">
                          <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                        </svg>
                      </span>
                    </summary>
                    <p className="max-w-2xl pb-6 leading-relaxed text-ti-400">{item.answer}</p>
                  </details>
                </Reveal>
              </li>
            ))}
        </ul>
      </Section>

      <CtaBand />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema()) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'ZWEAQ ONE', path: '/product' },
            ]),
          ),
        }}
      />
    </>
  );
}
