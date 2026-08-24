import { ButtonLink } from '@/components/ui/Button';
import { DisplayChip } from '@/components/ui/DisplayChip';

export default function NotFound() {
  return (
    <div className="container-z flex min-h-[60vh] flex-col items-start justify-center gap-7 py-section">
      <DisplayChip size="lg">404</DisplayChip>
      <h1 className="max-w-xl text-[length:var(--text-display-3)] leading-[1.05] text-paper">
        Nothing on this address.
      </h1>
      <p className="max-w-md leading-relaxed text-ti-400">
        The page you asked for does not exist. It may have moved, or it may never have
        been here.
      </p>
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg">
          Back to the start
        </ButtonLink>
        <ButtonLink href="/product" size="lg" variant="secondary">
          See ZWEAQ ONE
        </ButtonLink>
      </div>
    </div>
  );
}
