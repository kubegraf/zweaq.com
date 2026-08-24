import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';

/**
 * Three ordinary moments, shown as the interaction actually shrinks.
 *
 * Each row is: what you say or do, what a phone makes of it, and what the ring
 * makes of it. The phone column is not mocked — for two of these three, the
 * phone is genuinely the better tool the moment you want detail.
 */

const MOMENTS = [
  {
    trigger: '“What’s my next meeting?”',
    phone: 'Unlock, find the calendar, read the entry, lock again.',
    display: '10:30 TECHSTART',
    caption: 'Time and title. If you need the agenda, that is what the phone is for.',
  },
  {
    trigger: '“Save this.”',
    phone: 'Share sheet, pick a destination, confirm, dismiss.',
    display: '✓ SAVED',
    caption: 'Written to the vault on the ring. One haptic pulse to confirm.',
    verify: true,
  },
  {
    trigger: 'A laptop asks who you are.',
    phone: 'Find the phone, open the authenticator, type six digits.',
    display: 'VERIFY',
    caption: 'Tap the ring. The confirmation is physical, and it is on your hand.',
  },
];

export function PhoneDisappears() {
  return (
    <Section
      id="phone"
      index="03"
      eyebrow="The argument"
      headline="For the moments that don’t need a screen."
      lede="Most of what a phone does in a day is not reading — it is confirming, checking, and acknowledging. Those are the interactions ZWEAQ is designed to take."
    >
      <ol className="mt-12 flex flex-col">
        {MOMENTS.map((moment, i) => (
          <Reveal key={moment.trigger} delay={i * 80}>
            <li className="grid gap-5 border-t border-[var(--line)] py-8 last:border-b sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] sm:items-center sm:gap-8">
              <div className="flex flex-col gap-2">
                <span className="label-z text-ti-700">{String(i + 1).padStart(2, '0')}</span>
                <p className="text-lg text-paper sm:text-xl">{moment.trigger}</p>
              </div>

              <p className="text-sm leading-relaxed text-ti-600">
                <span className="label-z mr-2 text-ti-800">Phone</span>
                {moment.phone}
              </p>

              <div className="flex flex-col items-start gap-2 sm:items-end">
                <DisplayChip size="lg" tone={moment.verify ? 'verify' : 'default'}>
                  {moment.display}
                </DisplayChip>
                <p className="max-w-[19rem] text-xs leading-relaxed text-ti-600 sm:text-right">
                  {moment.caption}
                </p>
              </div>
            </li>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
