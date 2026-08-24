import type { ReactNode } from 'react';
import { Reveal, RevealRoot } from '@/components/ui/Section';

export interface LegalSection {
  heading: string;
  body: ReactNode;
}

/**
 * Shared shell for the legal pages.
 *
 * The placeholder notice is a component, not a copy-pasted paragraph, so it
 * cannot be removed from one page and left on another. These documents have not
 * been reviewed by a lawyer and the page says so at the top rather than in a
 * footnote.
 */
export function LegalPage({
  title,
  updated,
  intro,
  sections,
  needsCounsel = true,
}: {
  title: string;
  updated: string;
  intro: ReactNode;
  sections: LegalSection[];
  needsCounsel?: boolean;
}) {
  return (
    <RevealRoot className="py-section" labelledBy="legal-title">
      <div className="container-z">
        <div className="max-w-3xl">
          <Reveal>
            <p className="label-z text-ti-600">Legal</p>
            <h1
              id="legal-title"
              className="mt-5 text-[length:var(--text-display-3)] leading-[1.05] text-paper"
            >
              {title}
            </h1>
            <p className="mt-4 font-mono text-sm text-ti-700">Last updated {updated}</p>
          </Reveal>

          {needsCounsel && (
            <Reveal delay={60}>
              <div className="mt-8 rounded-lg border border-signal/30 bg-signal/[0.05] p-5">
                <p className="label-z text-signal">Placeholder — not legal advice</p>
                <p className="mt-3 text-sm leading-relaxed text-ti-300">
                  This document has not been reviewed by legal counsel and is published
                  as a good-faith description of intent. It must be reviewed and
                  replaced before ZWEAQ collects payment, ships hardware, or operates in
                  any regulated capacity. Where a real policy would cite a company
                  registration, a supervisory authority or a legal basis, this one does
                  not invent them.
                </p>
              </div>
            </Reveal>
          )}

          <Reveal delay={120}>
            <div className="mt-10 text-base leading-relaxed text-ti-300">{intro}</div>
          </Reveal>

          <div className="mt-12 flex flex-col">
            {sections.map((section, i) => (
              <Reveal key={section.heading} delay={Math.min(i * 40, 200)}>
                <section className="border-t border-[var(--line)] py-8">
                  <h2 className="text-[length:var(--text-heading)] text-paper">
                    {section.heading}
                  </h2>
                  <div className="mt-4 flex flex-col gap-4 leading-relaxed text-ti-400">
                    {section.body}
                  </div>
                </section>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </RevealRoot>
  );
}
