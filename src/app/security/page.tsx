import type { Metadata } from 'next';
import { PageHeader } from '@/components/layout/PageHeader';
import { CtaBand } from '@/components/sections/CtaBand';
import { Section, Reveal } from '@/components/ui/Section';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { siteConfig } from '@/content/site';
import { breadcrumbSchema } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Security',
  description:
    'How ZWEAQ ONE is designed: device identity, secure element, encryption, verified boot, signed updates, revocation and the data architecture — described honestly, without certification claims we do not hold.',
  alternates: { canonical: siteConfig.absolute('/security') },
};

const TOPICS = [
  {
    id: 'device-identity',
    title: 'Device identity',
    body: 'Every ring is provisioned with its own key pair, generated inside the secure element during manufacture. There is no shared model key: compromising one ring does not tell you anything useful about another. The private half is designed never to leave the element, which means it is not in a backup, not in our systems, and not something we could hand over if asked.',
  },
  {
    id: 'secure-element',
    title: 'Secure element',
    body: 'A separate certified part rather than a software enclave on the application processor. That is a deliberately more expensive choice: it costs board area and bill of materials in a product where both are scarce, and it is the difference between a key that is hard to extract and a key that is merely hidden.',
  },
  {
    id: 'encryption',
    title: 'Encryption',
    body: 'Vault contents are encrypted before they are written, so the flash never holds plaintext. Keys are derived inside the secure element. In transit, transfers are encrypted end to end between the ring and the paired device — Bluetooth LE link-layer security is not treated as sufficient on its own.',
  },
  {
    id: 'secure-boot',
    title: 'Verified boot',
    body: 'Each boot stage verifies the signature of the next before handing control to it. A ring that cannot verify its own firmware is designed to refuse to run it, and to say so rather than failing quietly into a degraded state.',
  },
  {
    id: 'ota',
    title: 'Signed updates',
    body: 'Updates are signed, delivered through the companion app, and applied atomically with a rollback path. A failed update should cost you the update, not the ring. Rollback protection prevents an attacker downgrading a device to firmware with a known flaw.',
  },
  {
    id: 'revocation',
    title: 'Revocation',
    body: 'A lost ring is a credential in someone else’s hand. Credentials can be revoked from a paired device without the ring being present, and revocation is designed to propagate to relying parties rather than depending on the ring ever coming back online.',
  },
  {
    id: 'privacy',
    title: 'Privacy',
    body: 'The privacy properties follow from the architecture rather than from a policy: data that stays on the ring is not data we hold. Offline-first operation is a privacy feature — a device that only works while talking to a server is a device that is always talking to a server.',
  },
  {
    id: 'data-architecture',
    title: 'Data architecture',
    body: 'The ring is the primary replica of your vault, not a cache of a cloud copy. Cloud backup is planned as an optional service under ZWEAQ Plus, encrypted with keys derived on your devices. Choosing not to use it should cost you convenience, never core functionality.',
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHeader
        eyebrow="Security"
        title="What we can actually claim."
        lede={
          <>
            This page describes how ZWEAQ ONE is designed. It is not an audit report,
            because there is no production hardware to audit. Where a claim would need
            certification we do not hold, it is not made.
          </>
        }
      />

      <Section
        id="not-claiming"
        index="00"
        eyebrow="Boundaries"
        headline="What this page does not say."
      >
        <Reveal>
          <ul className="mt-10 grid gap-px overflow-hidden rounded-lg border border-[var(--line)] sm:grid-cols-3">
            {[
              { claim: 'Not “unhackable”', why: 'No device is. Any company that says otherwise is selling something.' },
              { claim: 'Not certified', why: 'We hold no third-party security certification. There is nothing built to certify yet.' },
              { claim: 'Not audited', why: 'No independent security audit has been performed. When one is, we will publish it.' },
            ].map((item) => (
              <li key={item.claim} className="flex flex-col gap-2 bg-ink-raised p-6">
                <span className="text-paper">{item.claim}</span>
                <span className="text-sm leading-relaxed text-ti-600">{item.why}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </Section>

      {TOPICS.map((topic, i) => (
        <Section
          key={topic.id}
          id={topic.id}
          index={String(i + 1).padStart(2, '0')}
          eyebrow={topic.title}
          className="!py-14"
        >
          <Reveal>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ti-300 sm:text-lg">
              {topic.body}
            </p>
          </Reveal>
        </Section>
      ))}

      <Section
        id="disclosure"
        index="09"
        eyebrow="Disclosure"
        headline="Found something?"
        lede="If you believe you have found a security issue in anything we publish, tell us before you tell anyone else and we will work with you."
      >
        <Reveal>
          <div className="mt-8 flex flex-col gap-4 rounded-lg border border-[var(--line)] bg-ink-raised p-6 sm:p-7">
            <p className="text-sm leading-relaxed text-ti-400">
              Reports go to{' '}
              <ObfuscatedEmail {...siteConfig.contact.security} />. We will acknowledge
              receipt, keep you updated, and credit you if you want to be credited.
            </p>
            <p className="text-sm leading-relaxed text-ti-600">
              We do not currently run a paid bug bounty. We will say so plainly rather
              than implying one exists.
            </p>
          </div>
        </Reveal>
      </Section>

      <CtaBand
        headline="Security updates, as they happen."
        copy="Including audit results when there are audit results, and design changes when the design changes."
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', path: '/' },
              { name: 'Security', path: '/security' },
            ]),
          ),
        }}
      />
    </>
  );
}
