import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { ClaimBadge } from '@/components/ui/ClaimBadge';

/**
 * The AI section.
 *
 * The honest version: the ring is the input and the acknowledgement, and the
 * computation happens elsewhere. Saying so plainly is more credible than
 * implying a language model fits in a 5-gram object, and it is the claim we
 * can actually stand behind.
 */

const CHAIN = [
  { step: 'Touch', detail: 'Hold the ring. Capacitive touch wakes the request.' },
  { step: 'Capture', detail: 'The ring captures the request and hands it off.' },
  { step: 'Compute', detail: 'Your phone or a connected device does the work.' },
  { step: 'Haptic', detail: 'One pulse when the answer is back.' },
  { step: 'Display', detail: 'The part that fits on a finger, and nothing more.' },
];

export function AiSection() {
  return (
    <Section
      id="ai"
      index="04"
      eyebrow="Intelligence"
      headline="AI, one tap away."
      lede="Hold the ring, make the request, get the confirmation. The interaction is on your hand; the computation is not."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
        <Reveal>
          <ol className="flex flex-col">
            {CHAIN.map((link, i) => (
              <li
                key={link.step}
                className="flex gap-5 border-t border-[var(--line)] py-5 last:border-b"
              >
                <span className="label-z w-6 shrink-0 pt-1 text-ti-800">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex flex-col gap-1">
                  <span className="text-lg text-paper">{link.step}</span>
                  <span className="text-sm leading-relaxed text-ti-600">{link.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex h-full flex-col gap-6 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-7">
            <p className="label-z text-ti-600">Example</p>

            <blockquote className="text-lg leading-snug text-paper">
              “Remind me to call the bank tomorrow.”
            </blockquote>

            <div className="flex items-center gap-3">
              <DisplayChip size="lg" tone="verify">
                REMINDER SET ✓
              </DisplayChip>
            </div>

            <hr className="rule-z border-0" />

            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-paper">
                  The ring does not run a large model
                </h3>
                <ClaimBadge level="concept" />
              </div>
              <p className="text-sm leading-relaxed text-ti-600">
                There is no power or thermal budget for one in an object this size, and
                we are not going to pretend otherwise. Small on-device models handle
                wake and gesture detection. Anything larger runs on your phone or a
                connected device.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
