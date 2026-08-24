import { Section, Reveal } from '@/components/ui/Section';
import { FlowNode, FlowArrow } from '@/components/ui/Panel';

const PILLARS = [
  { name: 'Secure element', note: 'Keys are generated inside it and designed never to leave it.' },
  { name: 'Encrypted storage', note: 'Vault contents are encrypted before they are written.' },
  { name: 'Verified boot', note: 'The ring is designed to refuse firmware it cannot verify.' },
  { name: 'Signed updates', note: 'Every update carries a signature checked on the device.' },
  { name: 'Device identity', note: 'Each ring has its own identity, not a shared model key.' },
  { name: 'Remote revocation', note: 'A lost ring’s credentials can be revoked without it.' },
];

export function SecuritySection() {
  return (
    <Section
      id="security"
      index="13"
      eyebrow="Security"
      headline={
        <>
          Your ring.
          <br />
          Your keys.
        </>
      }
      lede="The design goal is that the interesting secrets never exist anywhere you would have to trust us about."
    >
      <div className="mt-12 flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
            <FlowNode label="Key" caption="Generated on device" className="flex-1" />
            <FlowArrow />
            <FlowNode label="Secure element" caption="Never leaves it" emphasis className="flex-1" />
            <FlowArrow />
            <FlowNode label="Device identity" caption="Unique per ring" className="flex-1" />
            <FlowArrow />
            <FlowNode label="Vault" caption="Encrypted at rest" className="flex-1" />
          </div>
        </Reveal>

        <ul className="grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((pillar, i) => (
            <li key={pillar.name} className="bg-ink-raised p-6">
              <Reveal delay={i * 50}>
                <h3 className="text-paper">{pillar.name}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ti-600">{pillar.note}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <Reveal>
          <div className="max-w-2xl border-l-2 border-signal/40 pl-6">
            <p className="text-sm leading-relaxed text-ti-400">
              Everything above is architecture, not audit. ZWEAQ holds no third-party
              security certification, because there is no production hardware to
              certify. We describe how the system is designed and will publish results
              when there are results.
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ti-600">
              Nothing is unhackable. Any company that tells you otherwise is selling
              something.
            </p>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
