/**
 * Claim levels.
 *
 * ZWEAQ ONE is not validated hardware. Every capability figure on this site is
 * rendered through this system, so the page cannot state a number as fact
 * unless someone has explicitly marked it as validated in the content layer.
 *
 * There is deliberately no way to render a bare specification value. See the
 * <Spec> component and docs/PRODUCT_CLAIMS.md.
 */

export const CLAIM_LEVELS = [
  'concept',
  'prototype',
  'engineering',
  'production',
  'available',
] as const;

export type ClaimLevel = (typeof CLAIM_LEVELS)[number];

export interface ClaimLevelMeta {
  /** Short label shown in badges. */
  label: string;
  /** Sentence a visitor can read to understand exactly what the label means. */
  definition: string;
  /**
   * Prefix applied to any numeric specification at this level.
   * Empty only once hardware is production-validated.
   */
  specPrefix: string;
  /** True when a figure may be stated without qualification. */
  validated: boolean;
}

export const CLAIM_META: Record<ClaimLevel, ClaimLevelMeta> = {
  concept: {
    label: 'Concept',
    definition:
      'Defined on paper and in CAD. No hardware has been built to this specification.',
    specPrefix: 'Target:',
    validated: false,
  },
  prototype: {
    label: 'Prototype',
    definition:
      'Built and demonstrated on bench or breadboard hardware. Not in a wearable form factor.',
    specPrefix: 'Target:',
    validated: false,
  },
  engineering: {
    label: 'Engineering validated',
    definition:
      'Working in a ring-form engineering build, measured under test. Not yet validated for mass production.',
    specPrefix: 'Measured on EVT:',
    validated: false,
  },
  production: {
    label: 'Production validated',
    definition:
      'Validated on production tooling against the released specification.',
    specPrefix: '',
    validated: true,
  },
  available: {
    label: 'Available',
    definition: 'Shipping today in the product you can buy.',
    specPrefix: '',
    validated: true,
  },
};

/** A specification value paired with how much we actually know about it. */
export interface Claim {
  /** The bare value, e.g. "32 GB". Never rendered on its own. */
  value: string;
  level: ClaimLevel;
  /** Optional clarification rendered next to or beneath the value. */
  note?: string;
}

/**
 * Formats a claim for display. Unvalidated claims are always prefixed.
 *
 * formatClaim({ value: '32 GB', level: 'concept' })    → 'Target: 32 GB'
 * formatClaim({ value: '32 GB', level: 'production' }) → '32 GB'
 */
export function formatClaim(claim: Claim): string {
  const prefix = CLAIM_META[claim.level].specPrefix;
  return prefix ? `${prefix} ${claim.value}` : claim.value;
}

/** Convenience constructors so content files read cleanly. */
export const target = (value: string, note?: string): Claim => ({
  value,
  level: 'concept',
  ...(note ? { note } : {}),
});

export const prototyped = (value: string, note?: string): Claim => ({
  value,
  level: 'prototype',
  ...(note ? { note } : {}),
});
