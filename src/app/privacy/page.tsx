import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { ObfuscatedEmail } from '@/components/ui/ObfuscatedEmail';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Privacy',
  description: 'What ZWEAQ collects, why, and what it does not collect.',
  alternates: { canonical: siteConfig.absolute('/privacy') },
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      updated="August 2026"
      intro={
        <p>
          This site is a marketing site for a product in development. It collects the
          minimum needed to email you about that product, and nothing else.
        </p>
      }
      sections={[
        {
          heading: 'What this website collects',
          body: (
            <>
              <p>
                If you join the early access list, we store the first name, email
                address, country and interest you give us, plus the fact that you
                consented and when.
              </p>
              <p>
                Nothing else. No advertising identifiers, no cross-site tracking, no
                fingerprinting, and no data brokers.
              </p>
            </>
          ),
        },
        {
          heading: 'Cookies',
          body: (
            <p>
              This site sets no cookies. There is no consent banner because there is
              nothing to consent to. See the{' '}
              <a href="/cookies" className="text-paper underline underline-offset-4">
                cookie page
              </a>{' '}
              for detail.
            </p>
          ),
        },
        {
          heading: 'Analytics',
          body: (
            <>
              <p>
                The site includes an analytics abstraction that is disabled unless a
                provider is explicitly configured. It has no concept of a user: no
                identifier is generated, stored, or sent, and events carry only the page
                and the interaction type.
              </p>
              <p>
                On this deployment, no analytics provider is configured and no analytics
                requests are made.
              </p>
            </>
          ),
        },
        {
          heading: 'Fonts and third parties',
          body: (
            <p>
              Typefaces are served from this site, not from a font CDN, so no third
              party sees your IP address as a side effect of reading this page. The site
              loads no third-party scripts, embeds, or trackers.
            </p>
          ),
        },
        {
          heading: 'On the device',
          body: (
            <>
              <p>
                ZWEAQ ONE is designed so that data held on the ring stays on the ring:
                vault contents are encrypted before they are written and keys are held
                in the secure element. Data that never leaves your hardware is not data
                we hold.
              </p>
              <p>
                Optional cloud services are planned under ZWEAQ Plus. They will be
                optional, and declining them is designed to cost convenience rather than
                function.
              </p>
            </>
          ),
        },
        {
          heading: 'Your rights',
          body: (
            <p>
              You can ask us for a copy of what we hold about you, ask us to correct it,
              or ask us to delete it. Every email we send has a one-click unsubscribe.
              Write to <ObfuscatedEmail {...siteConfig.contact.general} />.
            </p>
          ),
        },
        {
          heading: 'Changes',
          body: (
            <p>
              When this policy changes materially we will say so here with a new date,
              rather than quietly editing it.
            </p>
          ),
        },
      ]}
    />
  );
}
