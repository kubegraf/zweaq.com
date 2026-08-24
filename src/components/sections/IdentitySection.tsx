import { Section, Reveal } from '@/components/ui/Section';
import { DisplayChip } from '@/components/ui/DisplayChip';

/**
 * ZWEAQ ID.
 *
 * The applications list is explicitly labelled as intended, because none of it
 * is integrated yet and a grid of logos-shaped promises is exactly the kind of
 * thing this site is built not to do.
 */

const APPLICATIONS = [
  { name: 'Laptop sign-in', note: 'Passkey-style authentication to a paired machine' },
  { name: 'Doors and access', note: 'Where a credential standard already exists' },
  { name: 'Vehicles', note: 'Digital key standards, subject to manufacturer support' },
  { name: 'Enterprise', note: 'Provisioned and revocable by an administrator' },
  { name: 'Smart glasses', note: 'A confirmation surface for a device with no keyboard' },
  { name: 'Digital credentials', note: 'Membership, ticketing, professional identity' },
];

export function IdentitySection() {
  return (
    <Section
      id="identity"
      index="07"
      eyebrow="Identity"
      headline="A key you wear."
      lede="A hardware-backed credential you cannot leave on a desk, behind a screen lock, or in another room."
    >
      <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14">
        <Reveal>
          <div className="flex flex-col gap-6 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-8">
            <p className="label-z text-ti-600">The interaction</p>
            <ol className="flex flex-col gap-5">
              <li className="flex flex-col gap-1.5">
                <span className="text-sm text-ti-500">A laptop asks:</span>
                <span className="text-lg text-paper">“Authenticate with ZWEAQ.”</span>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-sm text-ti-500">The ring asks you:</span>
                <DisplayChip size="lg" className="self-start">VERIFY?</DisplayChip>
              </li>
              <li className="flex flex-col gap-2">
                <span className="text-sm text-ti-500">You tap. Two haptic pulses:</span>
                <DisplayChip size="lg" tone="verify" className="self-start">
                  ✓ AUTHENTICATED
                </DisplayChip>
              </li>
            </ol>
            <p className="text-sm leading-relaxed text-ti-600">
              The confirmation is deliberate and physical. Nothing authenticates because
              the ring happened to be nearby.
            </p>
          </div>
        </Reveal>

        <Reveal delay={100}>
          <div className="flex flex-col gap-5">
            <div className="flex items-center justify-between gap-4">
              <h3 className="label-z text-ti-600">Intended applications</h3>
              <span className="label-z rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
                None integrated yet
              </span>
            </div>

            <ul className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2">
              {APPLICATIONS.map((app) => (
                <li key={app.name} className="flex flex-col gap-1.5 bg-ink-raised p-5">
                  <span className="text-paper">{app.name}</span>
                  <span className="text-xs leading-relaxed text-ti-600">{app.note}</span>
                </li>
              ))}
            </ul>

            <p className="text-sm leading-relaxed text-ti-600">
              ZWEAQ is designed to become a physical identity layer for compatible
              devices and services. Compatibility depends on standards and on the other
              side choosing to support it, so we will publish what actually works as it
              is validated — and claim nothing before that.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
