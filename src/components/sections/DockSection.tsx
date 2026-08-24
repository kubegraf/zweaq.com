import { Section, Reveal } from '@/components/ui/Section';

const DOCK_FUNCTIONS = [
  { name: 'Charges', note: 'Wireless, with no port on the ring to fail or let water in' },
  { name: 'Syncs', note: 'Reconciles the vault with your paired devices' },
  { name: 'Transfers', note: 'The high-speed path Bluetooth LE cannot provide' },
  { name: 'Updates', note: 'Firmware, verified before it is applied' },
  { name: 'Diagnoses', note: 'Battery health, sensor calibration, radio checks' },
];

export function DockSection() {
  return (
    <Section
      id="dock"
      index="20"
      eyebrow="Accessory"
      headline="Meet the ZWEAQ Dock."
      lede="Where the ring goes when it is not on you — and the only place bulk data moves quickly."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1fr)] lg:items-center lg:gap-14">
        <Reveal>
          {/* The dock, drawn rather than photographed. There is no dock to
              photograph, and a stock image of somebody else's charger would be
              worse than an honest diagram. */}
          <div className="mx-auto w-full max-w-[22rem]">
            <svg viewBox="0 0 320 220" className="w-full" role="img" aria-label="ZWEAQ Dock concept: a shallow cradle with the ring resting in a recessed well">
              <defs>
                <linearGradient id="dock-body" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#1a1e24" />
                  <stop offset="1" stopColor="#0b0d11" />
                </linearGradient>
                <linearGradient id="dock-ring" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#4a4f56" />
                  <stop offset="0.3" stopColor="#a7adb6" />
                  <stop offset="0.62" stopColor="#6b7179" />
                  <stop offset="1" stopColor="#33373d" />
                </linearGradient>
              </defs>
              <ellipse cx="160" cy="196" rx="118" ry="12" fill="#000" opacity="0.5" />
              <path
                d="M52 128 Q52 96 160 96 Q268 96 268 128 L268 158 Q268 190 160 190 Q52 190 52 158 Z"
                fill="url(#dock-body)"
                stroke="var(--line-strong)"
              />
              <ellipse cx="160" cy="128" rx="108" ry="30" fill="#05070a" stroke="var(--line-strong)" />
              <ellipse cx="160" cy="126" rx="62" ry="17" fill="none" stroke="url(#dock-ring)" strokeWidth="13" />
              <ellipse cx="160" cy="126" rx="62" ry="17" fill="none" stroke="#05070a" strokeOpacity="0.5" strokeWidth="1" />
              <circle cx="160" cy="176" r="2.5" fill="var(--color-signal)" />
            </svg>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-6">
            <span className="label-z self-start rounded-full border border-signal/40 px-3 py-1.5 text-signal">
              Coming later
            </span>

            <ul className="flex flex-col">
              {DOCK_FUNCTIONS.map((fn) => (
                <li
                  key={fn.name}
                  className="flex flex-col gap-1 border-t border-[var(--line)] py-4 last:border-b sm:flex-row sm:gap-6"
                >
                  <span className="w-28 shrink-0 text-paper">{fn.name}</span>
                  <span className="text-sm leading-relaxed text-ti-600">{fn.note}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed text-ti-600">
              The dock is a concept. It is not production validated, it is not on the
              2028 launch scope, and it is not something you will be able to order with
              the ring.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
