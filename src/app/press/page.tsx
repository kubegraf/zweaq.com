import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section, Reveal } from '@/components/ui/Section';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Press',
  description: 'Brand assets, product renders and the facts we are willing to stand behind.',
  alternates: { canonical: siteConfig.absolute('/press') },
};

const ASSETS = [
  { name: 'Logo, reversed', file: '/brand/zweaq-logo-white.svg', note: 'For dark backgrounds' },
  { name: 'Logo, positive', file: '/brand/zweaq-logo-black.svg', note: 'For light backgrounds' },
  { name: 'Mark only', file: '/brand/zweaq-mark-white.svg', note: 'Below 96px lockup width' },
  { name: 'Ring, three-quarter', file: '/product/hero.webp', note: 'Concept render' },
  { name: 'Ring, front', file: '/product/front.webp', note: 'Concept render' },
  { name: 'Display detail', file: '/product/display.webp', note: 'Concept render' },
];

export default function PressPage() {
  return (
    <>
      <PageHeader
        eyebrow="Press"
        title="Assets and facts."
        lede={
          <>
            Everything below is downloadable and usable. Product imagery is concept
            rendering and we ask that it is captioned as such — it is not a photograph
            of manufactured hardware.
          </>
        }
      />

      <Section id="facts" index="01" eyebrow="Facts" headline="What is true today.">
        <Reveal>
          <dl className="mt-10 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2">
            {[
              ['Company', 'ZWEAQ'],
              ['Product', 'ZWEAQ ONE, a wearable personal computer'],
              ['Stage', 'Concept and engineering. No hardware has been built to specification.'],
              ['Target first shipments', '2028, as a plan rather than a commitment'],
              ['Indicative price', 'From £199, a target band and not a retail price'],
              ['Certifications held', 'None. There is no production hardware to certify.'],
            ].map(([label, value]) => (
              <div key={label} className="flex flex-col gap-2 bg-ink-raised p-6">
                <dt className="label-z text-ti-600">{label}</dt>
                <dd className="text-sm leading-relaxed text-ti-300">{value}</dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </Section>

      <Section id="assets" index="02" eyebrow="Assets" headline="Brand and product.">
        <Reveal>
          <ul className="mt-10 flex flex-col">
            {ASSETS.map((asset) => (
              <li
                key={asset.file}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 border-t border-[var(--line)] py-4 last:border-b"
              >
                <span className="text-paper">{asset.name}</span>
                <span className="text-sm text-ti-600">{asset.note}</span>
                <a
                  href={siteConfig.asset(asset.file)}
                  download
                  className="label-z inline-flex h-11 items-center rounded-full border border-[var(--line-strong)] px-4 text-ti-400 transition-colors hover:border-ti-500 hover:text-paper"
                >
                  Download
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section id="contact" index="03" eyebrow="Contact" headline="Talk to us.">
        <Reveal>
          <p className="mt-6 max-w-xl leading-relaxed text-ti-400">
            Press enquiries: <ObfuscatedEmail {...siteConfig.contact.press} />. We will
            answer questions about what is built and what is not, and we would rather
            correct a draft than a published article.
          </p>
        </Reveal>
      </Section>
    </>
  );
}
