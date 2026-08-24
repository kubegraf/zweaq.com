import { cn } from '@/lib/cn';

/**
 * The ZWEAQ mark, inline.
 *
 * Inlined rather than fetched from /public/brand so it paints with the first
 * byte of HTML — the nav logo is above the fold on every page and must never
 * pop in. The files in /public/brand carry the same geometry and remain the
 * canonical assets for anything outside this codebase.
 */

/** The annulus. Identical to public/brand/zweaq-mark.svg — see scripts/brand-geometry.mjs. */
const ANNULUS =
  'M14,4 H34 A10,10 0 0 1 44,14 V34 A10,10 0 0 1 34,44 H14 A10,10 0 0 1 4,34 V14 A10,10 0 0 1 14,4 Z ' +
  'M18,14 H30 A4,4 0 0 1 34,18 V30 A4,4 0 0 1 30,34 H18 A4,4 0 0 1 14,30 V18 A4,4 0 0 1 18,14 Z';

const CLIP_UPPER = 'zq-clip-upper';
const CLIP_LOWER = 'zq-clip-lower';

/**
 * The mark's 45° channel is a clip, and clip paths are referenced by document
 * id — so defining them inside every <Mark> would emit duplicate ids on any
 * page with more than one logo. They are defined once here instead, rendered
 * from the root layout, in the standard SVG-sprite arrangement.
 */
export function BrandDefs() {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      width="0"
      height="0"
      style={{ position: 'absolute' }}
    >
      <defs>
        <clipPath id={CLIP_UPPER}>
          <polygon points="-20,-20 63,-20 -20,63" />
        </clipPath>
        <clipPath id={CLIP_LOWER}>
          <polygon points="68,68 68,-15 -15,68" />
        </clipPath>
      </defs>
    </svg>
  );
}

export function Mark({ className, title }: { className?: string; title?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      className={cn('h-7 w-7', className)}
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      {[CLIP_UPPER, CLIP_LOWER].map((clip) => (
        <path
          key={clip}
          d={ANNULUS}
          fill="currentColor"
          fillRule="evenodd"
          clipPath={`url(#${clip})`}
        />
      ))}
    </svg>
  );
}

/** Mark plus wordmark. Wrapped in a link by the caller. */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn('flex items-center gap-2.5', className)}>
      <Mark className="h-6 w-6 md:h-7 md:w-7" />
      <span className="text-[0.95rem] font-semibold tracking-[0.3em] md:text-base">
        ZWEAQ
      </span>
    </span>
  );
}
