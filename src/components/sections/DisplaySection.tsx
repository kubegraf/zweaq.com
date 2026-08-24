import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { Spec } from '@/components/ui/Spec';
import { productConfig } from '@/content/product';

const STATES = [
  { text: '12:30', label: 'Time' },
  { text: 'B42', label: 'Gate' },
  { text: '£18.40', label: 'Amount' },
  { text: 'OTP 583921', label: 'Passcode' },
  { text: 'BATTERY 64%', label: 'Power' },
  { text: '✓', label: 'Done', verify: true },
];

export function DisplaySection() {
  return (
    <Section
      id="display"
      index="09"
      eyebrow="Display"
      headline="A screen that knows when to stay quiet."
      lede="Off almost all of the time. It shows the one thing that matters, then goes dark again."
    >
      <div className="mt-12 flex flex-col gap-10">
        <Reveal>
          <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-3">
            {STATES.map((state) => (
              <li
                key={state.text}
                className="flex flex-col items-center gap-3 bg-ink-raised px-4 py-8"
              >
                <DisplayChip size="lg" tone={state.verify ? 'verify' : 'default'}>
                  {state.text}
                </DisplayChip>
                <span className="label-z text-ti-700">{state.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14">
          <Reveal delay={80}>
            <p className="text-base leading-relaxed text-ti-400 sm:text-lg">
              The ring does not need to show everything. Six characters and a symbol
              cover most of what a glance is actually for — and a display that stays
              dark is a display that does not cost you a day of battery.
            </p>
          </Reveal>
          <Reveal delay={140}>
            <dl className="grid gap-6 sm:grid-cols-2">
              <Spec label="Display" claim={productConfig.specs.display} size="sm" />
              <Spec label="Battery" claim={productConfig.specs.battery} size="sm" />
            </dl>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
