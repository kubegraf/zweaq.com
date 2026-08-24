import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';
import { ClaimBadge } from '@/components/ui/ClaimBadge';

/**
 * ZWEAQ Drive.
 *
 * The interesting constraint here is honesty about throughput. Bluetooth LE
 * moves documents, not gigabytes, and a website that implies otherwise is
 * writing a support ticket for two years' time.
 */
export function DriveSection() {
  return (
    <Section
      id="drive"
      index="06"
      eyebrow="Transfer"
      headline="Your ring can carry your data."
      lede="Drag a file onto the ring from a paired machine. It arrives encrypted, and it leaves with you."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-14">
        <Reveal>
          <div className="flex flex-col gap-5">
            {[
              { at: 'MacBook', what: 'Proposal.pdf', state: 'Dragged onto ZWEAQ ONE' },
              { at: 'ZWEAQ ONE', what: 'TRANSFER 42%', state: 'Encrypted, in flight', chip: true },
              { at: 'ZWEAQ ONE', what: '✓', state: 'Written to the vault', chip: true, verify: true },
              { at: 'Phone', what: 'Vault › Documents › Proposal.pdf', state: 'Visible on any paired device' },
            ].map((row, i) => (
              <div
                key={row.state}
                className="flex items-center gap-4 border-b border-[var(--line)] pb-5 last:border-0"
              >
                <span className="label-z w-6 shrink-0 text-ti-800">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="flex min-w-0 flex-1 flex-col gap-1.5">
                  <span className="label-z text-ti-600">{row.at}</span>
                  {row.chip ? (
                    <DisplayChip tone={row.verify ? 'verify' : 'default'} className="self-start">
                      {row.what}
                    </DisplayChip>
                  ) : (
                    <span className="truncate font-mono text-sm text-paper">{row.what}</span>
                  )}
                  <span className="text-xs text-ti-700">{row.state}</span>
                </div>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3 rounded-lg border border-[var(--line)] bg-ink-raised p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-paper">About transfer speed</h3>
                <ClaimBadge level="concept" />
              </div>
              <p className="text-sm leading-relaxed text-ti-500">
                Everyday transfers happen over Bluetooth LE, which is the right radio for
                documents, notes, credentials and keys — and the wrong one for moving
                gigabytes. We are not going to promise high-speed bulk transfer over a
                link that cannot deliver it.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[var(--line)] p-6">
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-sm font-medium text-paper">
                  Bulk transfer is a dock function
                </h3>
                <span className="label-z shrink-0 rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
                  Later
                </span>
              </div>
              <p className="text-sm leading-relaxed text-ti-500">
                A high-speed transport belongs on the planned ZWEAQ Dock, over a wired
                or short-range link. That accessory is a concept and is not production
                validated.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
