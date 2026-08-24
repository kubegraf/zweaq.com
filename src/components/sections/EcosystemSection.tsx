import { Section, Reveal } from '@/components/ui/Section';
import { Mark } from '@/components/ui/Logo';

/**
 * The ecosystem diagram.
 *
 * Positions are computed rather than hand-placed, so the layout stays correct
 * if the device list changes.
 *
 * The layout is an **ellipse, wider than tall**, not a circle. Labels are
 * horizontal, so the nodes nearest the top and bottom are the ones that
 * collide — on a circle, the two devices flanking the bottom overlap outright.
 * Stretching the horizontal radius pushes exactly those apart and leaves the
 * rest visually unchanged.
 *
 * Beneath it the same information is a plain list. The SVG is not the only way
 * to read this, and on a narrow screen the list is the better one.
 */

/** Ellipse radii, as a percentage of the container's half-size. */
const LABEL_RX = 45;
const LABEL_RY = 36;
/** The same ellipse in the SVG's 400-unit coordinate space. */
const LINE_RX = 168;
const LINE_RY = 134;

const DEVICES = [
  { name: 'iPhone', status: 'Planned' },
  { name: 'Android', status: 'Planned' },
  { name: 'Mac', status: 'Planned' },
  { name: 'Windows', status: 'Planned' },
  { name: 'AI services', status: 'Planned' },
  { name: 'Smart glasses', status: 'Exploring' },
  { name: 'Car', status: 'Exploring' },
  { name: 'Access systems', status: 'Exploring' },
  { name: 'Cloud sync', status: 'Planned' },
];

export function EcosystemSection() {
  const n = DEVICES.length;

  return (
    <Section
      id="ecosystem"
      index="15"
      eyebrow="Ecosystem"
      headline={
        <>
          One ring.
          <br />
          Your devices.
        </>
      }
      lede="ZWEAQ is designed to sit at the centre of things you already own, not to replace them."
    >
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)] lg:items-center lg:gap-14">
        <Reveal>
          <div
            className="relative mx-auto aspect-[4/3.4] w-full max-w-[34rem]"
            role="img"
            aria-label={`ZWEAQ ONE at the centre, connected to ${DEVICES.map((d) => d.name).join(', ')}`}
          >
            <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full">
              {DEVICES.map((device, i) => {
                const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
                const x = 200 + Math.cos(angle) * LINE_RX;
                const y = 200 + Math.sin(angle) * LINE_RY;
                return (
                  <line
                    key={device.name}
                    x1="200"
                    y1="200"
                    x2={x}
                    y2={y}
                    stroke="var(--line-strong)"
                    strokeWidth="1"
                  />
                );
              })}
              <ellipse cx="200" cy="200" rx={LINE_RX} ry={LINE_RY} fill="none" stroke="var(--line)" strokeWidth="1" />
              <ellipse cx="200" cy="200" rx={LINE_RX * 0.6} ry={LINE_RY * 0.6} fill="none" stroke="var(--line)" strokeWidth="1" />
            </svg>

            <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--line-strong)] bg-ink text-paper">
              <Mark className="h-8 w-8" />
            </span>

            {DEVICES.map((device, i) => {
              const angle = (i / n) * Math.PI * 2 - Math.PI / 2;
              return (
                <span
                  key={device.name}
                  aria-hidden="true"
                  className="label-z absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full border border-[var(--line-strong)] bg-ink px-2 py-1.5 text-ti-400"
                  style={{
                    left: `${50 + Math.cos(angle) * LABEL_RX}%`,
                    top: `${50 + Math.sin(angle) * LABEL_RY}%`,
                  }}
                >
                  {device.name}
                </span>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={100}>
          <ul className="flex flex-col">
            {DEVICES.map((device) => (
              <li
                key={device.name}
                className="flex items-center justify-between gap-4 border-t border-[var(--line)] py-3 last:border-b"
              >
                <span className="text-ti-300">{device.name}</span>
                <span className="label-z text-ti-700">{device.status}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm leading-relaxed text-ti-600">
            Nothing on this list is integrated today. “Planned” means it is in scope for
            the platform; “exploring” means we think it is possible and have not proved
            it. Neither means it works yet.
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
