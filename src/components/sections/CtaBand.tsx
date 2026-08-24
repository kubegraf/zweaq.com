import { ButtonLink } from '@/components/ui/Button';
import { Reveal, RevealRoot } from '@/components/ui/Section';

/**
 * The closing call to action on sub-pages.
 *
 * One per page, at the end. The brief for this site says not to spam the
 * visitor with calls to action, and a floating sticky bar on a page about
 * secure hardware would undercut the argument it is making.
 */
export function CtaBand({
  headline = 'Be first to wear what’s next.',
  copy = 'Early access when prototypes go out, development updates including the ones where a date slips, and first notice when preorders open.',
}: {
  headline?: string;
  copy?: string;
}) {
  return (
    <RevealRoot className="border-t border-[var(--line)] py-section" labelledBy="cta-heading">
      <div className="container-z flex flex-col items-start gap-7">
        <Reveal>
          <h2
            id="cta-heading"
            className="max-w-2xl text-[length:var(--text-display-3)] leading-[1.04] text-paper"
          >
            {headline}
          </h2>
        </Reveal>
        <Reveal delay={70}>
          <p className="max-w-xl leading-relaxed text-ti-400">{copy}</p>
        </Reveal>
        <Reveal delay={140}>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/#waitlist" size="lg">
              Join early access
            </ButtonLink>
            <ButtonLink href="/technology" size="lg" variant="secondary">
              Read the technology
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </RevealRoot>
  );
}
