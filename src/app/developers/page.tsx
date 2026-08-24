import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { Section, Reveal } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { siteConfig } from '@/content/site';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Developers',
  description:
    'The planned ZWEAQ SDK: display, gestures, haptics, sensors, AI routing and identity. Not available yet — this is the intended surface, published early so it can be argued with.',
  alternates: { canonical: siteConfig.absolute('/developers') },
};

const SURFACES = [
  {
    name: 'Display',
    intent: 'Put a short string or a glyph on the ring, and be told when it is dismissed.',
    sample: `await zweaq.display.show({\n  text: 'GATE B42',\n  ttlMs: 8000,\n});`,
  },
  {
    name: 'Gestures',
    intent: 'Subscribe to tap, double tap, hold and swipe. Claim a gesture while your app is foreground.',
    sample: `zweaq.gestures.on('doubleTap', () => {\n  advanceSlide();\n});`,
  },
  {
    name: 'Haptics',
    intent: 'Fire a named pattern. Named rather than freeform, so patterns stay learnable across apps.',
    sample: `await zweaq.haptics.play('confirm');`,
  },
  {
    name: 'Sensors',
    intent: 'Read motion and wellness context, with consent, at a sample rate the power budget allows.',
    sample: `const ctx = await zweaq.sensors.context({\n  scopes: ['motion'],\n});`,
  },
  {
    name: 'AI',
    intent: 'Receive a captured request and return a short confirmation for the ring to render.',
    sample: `zweaq.ai.onRequest(async (req) => {\n  const r = await handle(req.text);\n  return { display: r.short };\n});`,
  },
  {
    name: 'Identity',
    intent: 'Ask for a deliberate physical confirmation. The user taps; you get an assertion.',
    sample: `const proof = await zweaq.id.assert({\n  challenge,\n  reason: 'Sign in to Console',\n});`,
  },
];

export default function DevelopersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Developer platform"
        title="Build for the finger."
        lede={
          <>
            The ZWEAQ SDK does not exist yet. This is the surface we intend to build,
            published early and deliberately — an API is much cheaper to argue about
            before it ships than after.
          </>
        }
        aside={
          <div className="flex flex-col gap-4 rounded-lg border border-signal/25 bg-signal/[0.04] p-6">
            <h2 className="label-z text-signal">Status</h2>
            <p className="text-sm leading-relaxed text-ti-300">
              No SDK, no downloads, no sandbox. The developer program is planned to open
              alongside ring-form prototypes in 2027.
            </p>
          </div>
        }
      />

      <Section
        id="surface"
        index="01"
        eyebrow="Intended API"
        headline="Six surfaces."
        lede="Everything the ring can do that an application would want to reach. Signatures are illustrative and will change."
      >
        <ul className="mt-12 grid gap-4 lg:grid-cols-2">
          {SURFACES.map((surface, i) => (
            <li key={surface.name} className="min-w-0">
              <Reveal delay={i * 60}>
                <article className="flex h-full min-w-0 flex-col gap-4 rounded-lg border border-[var(--line)] bg-ink-raised p-6">
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-paper">{surface.name}</h3>
                    <span className="label-z rounded-full border border-ti-800 px-2.5 py-1 text-ti-600">
                      Planned
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-ti-500">{surface.intent}</p>
                  <pre className="overflow-x-auto rounded-md border border-[var(--line)] bg-ink-inset p-4 text-xs leading-relaxed text-ti-300">
                    <code>{surface.sample}</code>
                  </pre>
                </article>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        id="principles"
        index="02"
        eyebrow="Principles"
        headline="Constraints we intend to keep."
      >
        <Reveal>
          <ul className="mt-10 flex flex-col">
            {[
              ['An app cannot take the display without the user', 'The ring is not an ad surface, and background apps do not get to interrupt a glance.'],
              ['Sensor access is scoped and revocable', 'Ask for what you need, get it if the user agrees, lose it when they change their mind.'],
              ['Identity assertions require a physical tap', 'There is no API for authenticating because the ring happened to be nearby.'],
              ['Haptic patterns are named, not freeform', 'So that “confirm” feels the same in every app and stays learnable.'],
            ].map(([title, body]) => (
              <li
                key={title}
                className="grid gap-2 border-t border-[var(--line)] py-6 last:border-b lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10"
              >
                <h3 className="text-paper">{title}</h3>
                <p className="text-sm leading-relaxed text-ti-500">{body}</p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      <Section
        id="join"
        index="03"
        eyebrow="Developer program"
        headline="Join the developer program."
        lede="Early access to prototypes and to the SDK when there is one. Tell us what you would build — that genuinely shapes what gets built first."
      >
        <Reveal>
          <div className="mt-8 flex flex-col gap-5">
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/#waitlist" size="lg">
                Join developer program
              </ButtonLink>
              <ButtonLink href="/technology" size="lg" variant="secondary">
                Read the architecture
              </ButtonLink>
            </div>
            <p className="text-sm leading-relaxed text-ti-600">
              Choose “Developer” on the early access form, or write to{' '}
              <ObfuscatedEmail {...siteConfig.contact.developers} />.
            </p>
          </div>
        </Reveal>
      </Section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Developers', path: '/developers' },
            ]),
          ),
        }}
      />
    </>
  );
}
