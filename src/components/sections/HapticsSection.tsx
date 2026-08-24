import { Section, Reveal } from '@/components/ui/Section';
import { cn } from '@/lib/cn';

/**
 * Haptics.
 *
 * Each pattern is drawn as its actual pulse train, so the difference between
 * "one pulse" and "two pulses" is visible rather than described. The pattern is
 * also written out in text — the shapes are not the only way to read this.
 */

const PATTERNS = [
  { event: 'Notification', pattern: [1], described: 'One pulse' },
  { event: 'Authentication', pattern: [1, 1], described: 'Two pulses' },
  { event: 'Transfer complete', pattern: [0.5, 0.5, 1.6], described: 'Two short, one long' },
  { event: 'AI action taken', pattern: [0.6], described: 'One soft pulse' },
];

export function HapticsSection() {
  return (
    <Section
      id="haptics"
      index="11"
      eyebrow="Feedback"
      headline="Feel the answer."
      lede="Silent confirmation, so the ring can tell you something in a meeting without telling the room."
    >
      <Reveal>
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2">
          {PATTERNS.map((item) => (
            <li key={item.event} className="flex flex-col gap-5 bg-ink-raised p-6 sm:p-7">
              <div className="flex items-baseline justify-between gap-4">
                <h3 className="text-paper">{item.event}</h3>
                <span className="label-z text-ti-600">{item.described}</span>
              </div>

              {/* The pulse train, drawn to scale. Width is duration. */}
              <div className="flex h-10 items-center gap-2" aria-hidden="true">
                {item.pattern.map((width, i) => (
                  <span
                    key={i}
                    className={cn(
                      'h-full rounded-[2px]',
                      width >= 1.5 ? 'bg-signal/80' : 'bg-signal/55',
                    )}
                    style={{ width: `${width * 1.4}rem` }}
                  />
                ))}
                <span className="ml-1 h-px flex-1 bg-[var(--line)]" />
              </div>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal delay={120}>
        <p className="mt-8 max-w-2xl text-sm leading-relaxed text-ti-600">
          Pulse patterns are part of the interaction design and are not final. What
          matters is the principle: distinct events feel distinct, and you learn them
          without looking.
        </p>
      </Reveal>
    </Section>
  );
}
