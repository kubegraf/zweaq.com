import { formatClaim, CLAIM_META, type Claim } from '@/content/claims';
import { cn } from '@/lib/cn';

/**
 * Renders a specification value.
 *
 * There is deliberately no way to render a bare number: `formatClaim` prefixes
 * anything that is not production-validated with "Target:". If you find
 * yourself wanting to bypass this, the answer is to validate the hardware, not
 * to bypass the component.
 */

export function Spec({
  label,
  claim,
  className,
  size = 'md',
}: {
  label: string;
  claim: Claim;
  className?: string;
  size?: 'sm' | 'md';
}) {
  const meta = CLAIM_META[claim.level];
  const value = formatClaim(claim);

  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <dt className="label-z text-ti-600">{label}</dt>
      <dd
        className={cn(
          'font-mono text-paper',
          size === 'md' ? 'text-lg sm:text-xl' : 'text-base',
        )}
      >
        {meta.validated ? (
          value
        ) : (
          <>
            <span className="text-ti-500">{meta.specPrefix}</span>{' '}
            <span>{claim.value}</span>
          </>
        )}
      </dd>
      {claim.note ? (
        <p className="text-[0.8125rem] leading-snug text-ti-600">{claim.note}</p>
      ) : null}
    </div>
  );
}
