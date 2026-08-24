import { Section, Reveal } from '@/components/ui/Section';

const USES = [
  { name: 'Pairing', note: 'Tap a device to pair it, instead of hunting through a list' },
  { name: 'Identity', note: 'Present a credential to a reader that supports it' },
  { name: 'Access', note: 'Doors, gates and turnstiles on existing standards' },
  { name: 'Digital card', note: 'Hand over contact details with a tap' },
  { name: 'Payments', note: 'Designed for future payment integrations. Not certified.', pending: true },
];

export function NfcSection() {
  return (
    <Section
      id="nfc"
      index="08"
      eyebrow="Proximity"
      headline="Tap into the physical world."
      lede="An NFC antenna designed into the band, in both reader and card-emulation modes."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <Reveal>
          {/* Concentric fields: the ring at the centre, what it reaches around
              it. Static — a pulsing radar animation would be decoration, and
              this diagram has to be readable, not busy. */}
          <div className="relative mx-auto flex aspect-square w-full max-w-[22rem] items-center justify-center">
            {[100, 74, 48].map((size, i) => (
              <span
                key={size}
                aria-hidden="true"
                className="absolute rounded-full border border-[var(--line)]"
                style={{
                  width: `${size}%`,
                  height: `${size}%`,
                  opacity: 1 - i * 0.22,
                }}
              />
            ))}
            <span className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full border border-signal/40 bg-ink text-center">
              <span className="label-z text-signal">TAP</span>
            </span>
            {[
              { label: 'Phone', top: '4%', left: '50%' },
              { label: 'Door', top: '50%', left: '96%' },
              { label: 'Terminal', top: '96%', left: '50%' },
              { label: 'Credential', top: '50%', left: '4%' },
            ].map((node) => (
              <span
                key={node.label}
                className="label-z absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-ink px-3 py-1.5 text-ti-400"
                style={{ top: node.top, left: node.left }}
              >
                {node.label}
              </span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="flex flex-col">
            {USES.map((use) => (
              <li
                key={use.name}
                className="flex items-start justify-between gap-6 border-t border-[var(--line)] py-4 last:border-b"
              >
                <div className="flex flex-col gap-1">
                  <span className="text-paper">{use.name}</span>
                  <span className="text-sm leading-relaxed text-ti-600">{use.note}</span>
                </div>
                {use.pending ? (
                  <span className="label-z mt-1 shrink-0 rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
                    Not available
                  </span>
                ) : null}
              </li>
            ))}
          </ul>

          <p className="mt-6 text-sm leading-relaxed text-ti-600">
            Payment functionality requires certification with payment networks and
            issuers. We have not completed that work, so ZWEAQ is not a payment device
            and this site will not describe it as one until it is.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
