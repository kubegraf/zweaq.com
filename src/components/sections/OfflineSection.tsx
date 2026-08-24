import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { cn } from '@/lib/cn';

const CAPABILITIES = [
  { name: 'Time', offline: true },
  { name: 'Stored credentials', offline: true },
  { name: 'Vault contents already on the ring', offline: true },
  { name: 'Selected reminders', offline: true },
  { name: 'Sensor logging', offline: true },
  { name: 'New AI requests', offline: false, why: 'Needs a model, which is not on the ring' },
  { name: 'Cloud backup', offline: false, why: 'Needs somewhere to back up to' },
];

export function OfflineSection() {
  return (
    <Section
      id="offline"
      index="14"
      eyebrow="Resilience"
      headline="Still useful when the cloud isn’t."
      lede="A wearable that becomes jewellery the moment it loses signal is not a computer. The parts that live on the ring are designed to keep working."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)] lg:gap-14">
        <Reveal>
          <ul className="flex flex-col">
            {CAPABILITIES.map((cap) => (
              <li
                key={cap.name}
                className="flex items-start gap-4 border-t border-[var(--line)] py-4 last:border-b"
              >
                {/* Icon plus text, never colour alone. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs leading-none',
                    cap.offline
                      ? 'border-verify/40 text-verify'
                      : 'border-ti-800 text-ti-600',
                  )}
                >
                  {cap.offline ? '✓' : '—'}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1">
                  <span className={cap.offline ? 'text-paper' : 'text-ti-500'}>
                    {cap.name}
                  </span>
                  <span className="text-xs text-ti-700">
                    {cap.offline ? 'Works with no connection' : `Needs a connection — ${cap.why}`}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-6 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-7">
            <p className="label-z text-ti-600">When you reconnect</p>
            <DisplayChip size="lg" tone="verify" className="self-start">
              SYNC COMPLETE
            </DisplayChip>
            <p className="text-sm leading-relaxed text-ti-500">
              Sensor logs, vault changes and pending actions reconcile when a connection
              returns. Nothing is lost because you were on a plane.
            </p>
            <hr className="rule-z border-0" />
            <p className="text-sm leading-relaxed text-ti-600">
              This is a privacy property as much as a resilience one: a device that only
              works when it is talking to a server is a device that is always talking to
              a server.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
