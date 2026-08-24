import { describe, it, expect } from 'vitest';
import {
  CLAIM_LEVELS,
  CLAIM_META,
  formatClaim,
  target,
  prototyped,
} from '@/content/claims';
import { productConfig } from '@/content/product';

describe('claim levels', () => {
  it('prefixes every unvalidated level so a bare number cannot be printed', () => {
    for (const level of CLAIM_LEVELS) {
      const meta = CLAIM_META[level];
      if (meta.validated) continue;
      expect(meta.specPrefix, `${level} must carry a qualifying prefix`).not.toBe('');
      expect(formatClaim({ value: '32 GB', level })).not.toBe('32 GB');
    }
  });

  it('prints validated values without qualification', () => {
    expect(formatClaim({ value: '32 GB', level: 'production' })).toBe('32 GB');
    expect(formatClaim({ value: '32 GB', level: 'available' })).toBe('32 GB');
  });

  it('renders concept claims as targets', () => {
    expect(formatClaim(target('32 GB'))).toBe('Target: 32 GB');
    expect(formatClaim(prototyped('BLE 5.4'))).toBe('Target: BLE 5.4');
  });

  /*
   * The guard that matters. This is the claim the brief singles out: the site
   * must never state "32 GB" or "7-day battery" as fact for hardware that has
   * not been built.
   */
  it('leaves no headline specification claiming to be validated', () => {
    for (const [name, claim] of Object.entries(productConfig.specs)) {
      expect(
        CLAIM_META[claim.level].validated,
        `${name} claims to be validated, but no ZWEAQ hardware has been validated`,
      ).toBe(false);
      expect(formatClaim(claim)).toMatch(/^(Target|Measured on EVT):/);
    }
  });

  it('keeps storage and battery specifically qualified', () => {
    expect(formatClaim(productConfig.specs.storage)).toBe('Target: 32 GB');
    expect(formatClaim(productConfig.specs.battery)).toBe('Target: up to 7 days');
  });
});
