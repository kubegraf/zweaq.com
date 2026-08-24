'use client';

import { Section, Reveal } from '@/components/ui/Section';
import { FlowNode, FlowArrow } from '@/components/ui/Panel';
import { Spec } from '@/components/ui/Spec';
import { productConfig } from '@/content/product';

/**
 * ZWEAQ Vault.
 *
 * The capacity bar is proportional to the real allocation figures, and the
 * figures are labelled as an intended split of target capacity — not measured
 * usage of hardware that exists.
 */

const CONTENTS = [
  { label: 'Documents', share: 30 },
  { label: 'Photos', share: 22 },
  { label: 'Notes', share: 12 },
  { label: 'AI memory', share: 14 },
  { label: 'Credentials', share: 6 },
  { label: 'Offline data', share: 16 },
];

export function VaultSection() {
  return (
    <Section
      id="vault"
      index="05"
      eyebrow="Storage"
      headline="Your personal vault."
      lede="Storage that stays with you — encrypted on the ring, with the keys in hardware you are wearing."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <div className="flex flex-col gap-7">
            <dl>
              <Spec label="Vault capacity" claim={productConfig.specs.storage} />
            </dl>

            {/* Proportional, and labelled as an intended split rather than
                measured usage — there is no hardware to measure. */}
            <div className="flex flex-col gap-3">
              <div
                className="flex h-2.5 w-full overflow-hidden rounded-full bg-ink-panel"
                role="img"
                aria-label={`Intended allocation of vault capacity: ${CONTENTS.map((c) => `${c.label} ${c.share}%`).join(', ')}`}
              >
                {CONTENTS.map((item, i) => (
                  <span
                    key={item.label}
                    style={{
                      width: `${item.share}%`,
                      // Stepped titanium, so segments read apart without
                      // needing six different hues.
                      backgroundColor: `color-mix(in oklab, var(--color-ti-300) ${88 - i * 12}%, transparent)`,
                    }}
                  />
                ))}
              </div>

              <ul className="grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                {CONTENTS.map((item) => (
                  <li key={item.label} className="flex items-baseline justify-between gap-2">
                    <span className="text-sm text-ti-400">{item.label}</span>
                    <span className="font-mono text-xs text-ti-700">{item.share}%</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-ti-700">
                Illustrative allocation of target capacity, not measured usage.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-6 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-7">
            <p className="label-z text-ti-600">How a file gets there</p>

            <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
              <FlowNode label="Laptop" caption="Source" className="flex-1" />
              <FlowArrow />
              <FlowNode label="Encrypt" caption="Before transfer" className="flex-1" />
              <FlowArrow />
              <FlowNode label="Vault" caption="On the ring" emphasis className="flex-1" />
            </div>

            <p className="text-sm leading-relaxed text-ti-500">
              Files are encrypted before they are written, with keys generated in and
              held by the secure element. The architecture is designed around
              hardware-backed security.
            </p>
            <p className="text-sm leading-relaxed text-ti-700">
              We hold no third-party security certification, so we describe the design
              rather than claiming an audit we have not had. Nothing is unhackable.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
