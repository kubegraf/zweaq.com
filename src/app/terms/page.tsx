import type { Metadata } from 'next';
import { LegalPage } from '@/components/layout/LegalPage';
import { siteConfig } from '@/content/site';

export const metadata: Metadata = {
  title: 'Terms',
  description: 'Terms of use for the ZWEAQ website.',
  alternates: { canonical: siteConfig.absolute('/terms') },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      updated="August 2026"
      intro={
        <p>
          These terms cover the use of this website. They do not cover the purchase or
          use of hardware, because no hardware is for sale.
        </p>
      }
      sections={[
        {
          heading: 'Forward-looking statements',
          body: (
            <>
              <p>
                This site describes a product in development. Specifications, prices,
                dates, features and capabilities are design targets and plans. They are
                not commitments, and hardware schedules move.
              </p>
              <p>
                Where a figure has not been validated on hardware, this site labels it
                as a target. Where a capability requires certification we do not hold,
                this site says the capability is designed for rather than available.
              </p>
            </>
          ),
        },
        {
          heading: 'No offer for sale',
          body: (
            <p>
              Nothing on this site is an offer to sell. Preorders are not open, the site
              cannot take payment, and joining the early access list creates no
              obligation on either side.
            </p>
          ),
        },
        {
          heading: 'Content',
          body: (
            <p>
              Product imagery on this site is clearly labelled concept rendering. It
              depicts intended industrial design and does not represent manufactured
              hardware or validated dimensions.
            </p>
          ),
        },
        {
          heading: 'Intellectual property',
          body: (
            <p>
              The ZWEAQ name, mark and wordmark are ours. Site content is provided for
              information. Typefaces used on this site are licensed under the SIL Open
              Font License and are attributed in the repository.
            </p>
          ),
        },
        {
          heading: 'Liability',
          body: (
            <p>
              This site is provided as is. We take reasonable care that it is accurate,
              and we would rather correct an error than defend it — tell us if you find
              one.
            </p>
          ),
        },
      ]}
    />
  );
}
