import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { CtaBand } from '@/components/sections/CtaBand';
import { Section, Reveal } from '@/components/ui/Section';
import { architecture, powerBudget } from '@/content/technology';
import { siteConfig } from '@/content/site';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Technology',
  description:
    'ZWEAQ ONE architecture: hardware, firmware, security, storage, AI routing, connectivity and power — including the problems that are still open.',
  alternates: { canonical: siteConfig.absolute('/technology') },
};

export default function TechnologyPage() {
  return (
    <>
      <PageHeader
        eyebrow="Architecture"
        title="How it is built."
        lede={
          <>
            The honest version, including the parts that are unresolved. A product two
            years from validation that claims every decision is settled is not telling
            you the truth about hardware.
          </>
        }
      />

      {architecture.map((block, i) => (
        <Section
          key={block.id}
          id={block.id}
          index={String(i + 1).padStart(2, '0')}
          eyebrow={block.title}
          headline={block.summary}
        >
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.75fr)] lg:gap-14">
            <Reveal>
              <dl className="flex flex-col">
                {block.points.map((point) => (
                  <div
                    key={point.label}
                    className="grid gap-1.5 border-t border-[var(--line)] py-5 last:border-b sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
                  >
                    <dt className="label-z pt-1 text-ti-600">{point.label}</dt>
                    <dd className="text-sm leading-relaxed text-ti-300">{point.detail}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {block.open ? (
              <Reveal delay={90}>
                <div className="flex flex-col gap-3 rounded-lg border border-signal/25 bg-signal/[0.04] p-6">
                  <h3 className="label-z text-signal">Open problem</h3>
                  <p className="text-sm leading-relaxed text-ti-300">{block.open}</p>
                </div>
              </Reveal>
            ) : null}
          </div>
        </Section>
      ))}

      <Section
        id="power"
        index={String(architecture.length + 1).padStart(2, '0')}
        eyebrow="Power"
        headline="Battery life is a duty-cycle problem."
        lede="Nothing about a ring makes a battery bigger. Everything about the design is about being asleep more of the time."
      >
        <Reveal>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2 lg:grid-cols-4">
            {powerBudget.map((row) => (
              <li key={row.state} className="flex flex-col gap-2 bg-ink-raised p-6">
                <span className="text-paper">{row.state}</span>
                <span className="label-z text-ti-600">{row.share}</span>
                <span className="text-xs leading-relaxed text-ti-700">{row.note}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <CtaBand
        headline="Follow the engineering."
        copy="Development updates as the architecture firms up — including the decisions that change and the dates that move."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Technology', path: '/technology' },
            ]),
          ),
        }}
      />
    </>
  );
}
