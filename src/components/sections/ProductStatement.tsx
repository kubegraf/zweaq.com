import { Reveal, RevealRoot } from '@/components/ui/Section';

/**
 * The thesis, stated once, with nothing else on screen.
 *
 * Deliberately the quietest section on the page — no diagram, no product shot,
 * no call to action. It exists so the argument lands before the feature
 * sections start explaining how it works.
 */
export function ProductStatement() {
  return (
    <RevealRoot
      id="statement"
      labelledBy="statement-heading"
      className="scroll-mt-[calc(var(--nav-h)+2rem)] border-y border-[var(--line)] py-section"
    >
      <div className="container-z">
        <div className="max-w-3xl">
          <Reveal>
            <p className="label-z text-ti-600">See less. Do more.</p>
          </Reveal>

          <Reveal delay={80}>
            <h2
              id="statement-heading"
              className="mt-7 text-[length:var(--text-display-2)] leading-[1.06] tracking-[-0.04em]"
            >
              <span className="text-paper">A phone is a screen you go to.</span>{' '}
              <span className="text-ti-500">ZWEAQ is already on you.</span>
            </h2>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-ti-400 sm:text-lg">
              For the interactions that never deserved a screen in the first place. Not
              to replace the phone — to make you reach for it less.
            </p>
          </Reveal>
        </div>
      </div>
    </RevealRoot>
  );
}
