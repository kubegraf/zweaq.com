'use client';

import { Section, Reveal } from '@/components/ui/Section';
import { ClaimBadge } from '@/components/ui/ClaimBadge';
import { faq, faqGroups } from '@/content/faq';
import { track } from '@/lib/analytics';

/**
 * FAQ.
 *
 * Native <details>/<summary>, which means it is keyboard operable, announced
 * correctly, and — the part that matters — every answer is present in the HTML
 * and findable with the browser's own find-in-page. A div-based accordion gets
 * none of that for free and usually gets none of it at all.
 */
export function FaqSection() {
  return (
    <Section
      id="faq"
      index="22"
      eyebrow="Questions"
      headline="Straight answers."
      lede="Including the ones where the answer is “no” or “not yet”."
    >
      <div className="mt-12 flex flex-col gap-12">
        {faqGroups.map((group) => {
          const items = faq.filter((item) => item.group === group.id);
          if (items.length === 0) return null;

          return (
            <div key={group.id} className="grid gap-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:gap-10">
              <h3 className="label-z pt-1 text-ti-600">{group.label}</h3>

              <ul className="flex flex-col">
                {items.map((item, i) => (
                  <li key={item.id}>
                    <Reveal delay={i * 40}>
                      <details
                        className="group border-t border-[var(--line)] last:border-b"
                        onToggle={(event) => {
                          if (event.currentTarget.open) {
                            track({ name: 'faq_open', id: item.id });
                          }
                        }}
                      >
                        <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-5 text-paper marker:content-none [&::-webkit-details-marker]:hidden">
                          <span className="text-base sm:text-lg">{item.question}</span>
                          <span
                            aria-hidden="true"
                            className="mt-1 shrink-0 text-ti-600 transition-transform duration-[var(--duration-fast)] group-open:rotate-45"
                          >
                            <svg viewBox="0 0 16 16" className="h-4 w-4">
                              <path
                                d="M8 2v12M2 8h12"
                                stroke="currentColor"
                                strokeWidth="1.4"
                                strokeLinecap="round"
                              />
                            </svg>
                          </span>
                        </summary>
                        <div className="flex flex-col gap-4 pb-6 pr-6">
                          <p className="max-w-2xl leading-relaxed text-ti-400">{item.answer}</p>
                          <ClaimBadge level={item.level} className="self-start" />
                        </div>
                      </details>
                    </Reveal>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
