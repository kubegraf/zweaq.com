import { Section, Reveal } from '@/components/ui/Section';

/**
 * Gestures.
 *
 * Every gesture here is one a capacitive ring can actually detect. There are no
 * mid-air "magic" gestures, because a ring has no way to see your hand and
 * pretending otherwise is how a product demo becomes a returns policy.
 */

const GESTURES = [
  { name: 'Tap', action: 'Wake the display, acknowledge, confirm', detects: 'Single contact on the touch band' },
  { name: 'Double tap', action: 'Next item, or a shortcut you assign', detects: 'Two contacts inside the debounce window' },
  { name: 'Hold', action: 'Start an AI request', detects: 'Sustained contact past the hold threshold' },
  { name: 'Swipe', action: 'Move between glanceable items', detects: 'Contact travelling across touch segments' },
  { name: 'Assignable', action: 'Whatever you map it to', detects: 'A combination of the above', custom: true },
];

export function GesturesSection() {
  return (
    <Section
      id="gestures"
      index="10"
      eyebrow="Input"
      headline="Control without reaching for your phone."
      lede="Four gestures, each detected by the capacitive band around the ring. Nothing here requires the ring to see your hand."
    >
      <Reveal>
        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[38rem] border-collapse text-left">
            <caption className="sr-only">
              ZWEAQ gestures, what each does, and how the ring detects it
            </caption>
            <thead>
              <tr className="border-b border-[var(--line-strong)]">
                <th scope="col" className="label-z py-3 pr-6 text-ti-600">Gesture</th>
                <th scope="col" className="label-z py-3 pr-6 text-ti-600">Does</th>
                <th scope="col" className="label-z py-3 text-ti-600">How it is detected</th>
              </tr>
            </thead>
            <tbody>
              {GESTURES.map((gesture) => (
                <tr key={gesture.name} className="border-b border-[var(--line)]">
                  <th scope="row" className="py-5 pr-6 align-top font-normal">
                    <span className="text-lg text-paper">{gesture.name}</span>
                    {gesture.custom ? (
                      <span className="label-z ml-2 rounded-full border border-ti-800 px-2 py-0.5 text-ti-600">
                        Custom
                      </span>
                    ) : null}
                  </th>
                  <td className="py-5 pr-6 align-top text-ti-400">{gesture.action}</td>
                  <td className="py-5 align-top text-sm text-ti-600">{gesture.detects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>
    </Section>
  );
}
