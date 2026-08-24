import { Section, Reveal } from '@/components/ui/Section';
import { Spec } from '@/components/ui/Spec';
import { productConfig } from '@/content/product';

export function SensorsSection() {
  return (
    <Section
      id="sensors"
      index="12"
      eyebrow="Sensing"
      headline="Aware, not intrusive."
      lede="Sensors give the ring context — where your hand is, whether you are wearing it, roughly how your day is going. Context is what makes the interaction good. It is not the product."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-14">
        <Reveal>
          <ul className="flex flex-col">
            {productConfig.sensors.map((sensor) => (
              <li
                key={sensor.id}
                className="grid gap-2 border-t border-[var(--line)] py-6 last:border-b sm:grid-cols-[9rem_minmax(0,1fr)] sm:gap-6"
              >
                <div className="flex flex-col gap-1">
                  <h3 className="text-paper">{sensor.name}</h3>
                  {/* Expanded, because "PPG" is not a word most people know
                      and an unexplained acronym is not a specification. */}
                  <span className="text-xs text-ti-700">{sensor.expansion}</span>
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm leading-relaxed text-ti-400">{sensor.purpose}</p>
                  <dl>
                    <Spec label="Design target" claim={sensor.claim} size="sm" />
                  </dl>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-7">
            <h3 className="text-sm font-medium text-paper">
              ZWEAQ is not a medical device
            </h3>
            <p className="text-sm leading-relaxed text-ti-500">
              It does not diagnose, treat, cure or prevent anything, and it is not
              intended to. Any measurement shown on this site — including heart rate —
              is illustrative of the interface, not a reading taken from validated
              hardware.
            </p>
            <p className="text-sm leading-relaxed text-ti-500">
              If a number on a wearable is going to influence a decision about your
              health, it should come from an instrument cleared for that purpose. This
              one is not.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
