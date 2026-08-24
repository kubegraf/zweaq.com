import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Cookies',
  description: 'This site sets no cookies. Here is exactly what it does store.',
  alternates: { canonical: siteConfig.absolute('/cookies') },
};

export default function CookiesPage() {
  return (
    <LegalPage
      title="Cookies"
      updated="August 2026"
      needsCounsel={false}
      intro={
        <p>
          This site sets no cookies. That is why there is no consent banner — there is
          nothing to consent to.
        </p>
      }
      sections={[
        {
          heading: 'What is not here',
          body: (
            <p>
              No analytics cookies, no advertising cookies, no session cookies, no
              third-party embeds that set their own, and no local storage used for
              tracking or identification.
            </p>
          ),
        },
        {
          heading: 'The one thing that may be stored',
          body: (
            <>
              <p>
                When a signup backend is not configured — which is the case on this
                deployment — the early access form records the addresses submitted from
                this browser in local storage. It exists so that submitting the same
                address twice correctly reports that you are already on the list.
              </p>
              <p>
                It never leaves your browser, is not a cookie, is not sent with any
                request, and is not readable by us. Clearing site data removes it.
              </p>
            </>
          ),
        },
        {
          heading: 'If that changes',
          body: (
            <p>
              If this site ever needs cookies, this page will list each one, what it is
              for, and how long it lasts — before it is set, not after.
            </p>
          ),
        },
      ]}
    />
  );
}
