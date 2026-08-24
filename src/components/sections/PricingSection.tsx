'use client';

import { useEffect, useRef } from 'react';
import { Section, Reveal } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { pricing } from '@/content/pricing';
import { siteConfig } from '@/content/site';
import { track } from '@/lib/analytics';

export function PricingSection() {
  const ref = useRef<HTMLDivElement>(null);
  const fired = useRef(false);

  // One pricing_view event per page load, on the section actually being seen.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting || fired.current) continue;
          fired.current = true;
          track({ name: 'pricing_view' });
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Section
      id="pricing"
      index="18"
      eyebrow="Pricing"
      headline="The ring works without a subscription."
      lede="Everything the hardware does on its own is a hardware function, and stays one."
    >
      <div ref={ref} className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <div className="flex flex-col gap-7 rounded-lg border border-[var(--line-strong)] bg-ink-raised p-6 sm:p-8">
            <div className="flex flex-col gap-2">
              <span className="label-z text-ti-600">Hardware</span>
              <h3 className="text-[length:var(--text-heading)] text-paper">ZWEAQ ONE</h3>
              <p className="font-mono text-3xl text-paper">
                from £199
                <span className="ml-2 align-middle text-sm text-ti-600">target</span>
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <span className="label-z text-ti-700">Always included, no account needed</span>
              <ul className="flex flex-col gap-2">
                {pricing.hardwareAlwaysIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-ti-300">
                    <span aria-hidden="true" className="mt-0.5 text-verify">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <ButtonLink href="/#waitlist" size="lg" className="self-start">
              Join early access
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-4">
            {pricing.services.map((tier) => (
              <div
                key={tier.id}
                className="flex flex-col gap-4 rounded-lg border border-[var(--line)] p-6"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-paper">{tier.name}</h3>
                  <span className="font-mono text-sm text-ti-400">{tier.price}</span>
                </div>
                <p className="text-sm leading-relaxed text-ti-500">{tier.summary}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1.5">
                  {tier.includes.map((item) => (
                    <li key={item} className="text-xs text-ti-600">
                      {item}
                    </li>
                  ))}
                </ul>
                {tier.note ? (
                  <p className="text-xs leading-relaxed text-ti-700">{tier.note}</p>
                ) : null}
              </div>
            ))}

            {!siteConfig.commerce.preordersEnabled && (
              <p className="text-sm leading-relaxed text-ti-600">
                Preorders are not open and this site cannot take payment. When commerce
                is enabled, it will be a checkout — not a form that quietly stores a
                card number.
              </p>
            )}
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
