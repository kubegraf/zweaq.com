import { describe, it, expect } from 'vitest';
import {
  validateSubmission,
  looksAutomated,
  normaliseEmail,
  LIMITS,
} from '@/lib/waitlist/validate';
import type { WaitlistSubmission } from '@/lib/waitlist/types';

const valid: WaitlistSubmission = {
  firstName: 'Ada',
  email: 'ada@example.com',
  country: 'GB',
  interest: 'one',
  consent: true,
  elapsedMs: 5000,
};

describe('validateSubmission', () => {
  it('accepts a complete submission', () => {
    expect(validateSubmission(valid)).toBeNull();
  });

  it('requires every field, and reports them all at once', () => {
    const result = validateSubmission({});
    expect(result?.status).toBe('validation_error');
    expect(Object.keys(result?.errors ?? {}).sort()).toEqual([
      'consent',
      'country',
      'email',
      'firstName',
      'interest',
    ]);
  });

  it('requires explicit consent rather than treating absence as agreement', () => {
    expect(validateSubmission({ ...valid, consent: false })?.errors?.consent).toBeDefined();
    const { consent: _consent, ...withoutConsent } = valid;
    expect(validateSubmission(withoutConsent)?.errors?.consent).toBeDefined();
  });

  it.each([
    'not-an-email',
    'no@tld',
    'two@@at.com',
    'spaces in@example.com',
    '@example.com',
    'trailing@example.',
  ])('rejects %s', (email) => {
    expect(validateSubmission({ ...valid, email })?.errors?.email).toBeDefined();
  });

  /*
   * Over-strict email validation rejects real people. These are all valid
   * addresses that a naive regex commonly refuses.
   */
  it.each([
    'ada+zweaq@example.com',
    "o'hara@example.com",
    'ada.lovelace@sub.example.co.uk',
    'a@b.io',
    'user_name@example-domain.com',
  ])('accepts the real address %s', (email) => {
    expect(validateSubmission({ ...valid, email })).toBeNull();
  });

  it('rejects an address past the RFC 5321 length limit', () => {
    const email = `${'a'.repeat(LIMITS.email)}@example.com`;
    expect(validateSubmission({ ...valid, email })?.errors?.email).toBeDefined();
  });

  it('requires a country code, not free text', () => {
    expect(validateSubmission({ ...valid, country: 'United Kingdom' })?.errors?.country).toBeDefined();
    expect(validateSubmission({ ...valid, country: 'gb' })).toBeNull();
  });

  it('rejects an interest outside the allowed set', () => {
    const result = validateSubmission({
      ...valid,
      interest: 'hacker' as WaitlistSubmission['interest'],
    });
    expect(result?.errors?.interest).toBeDefined();
  });

  it('trims whitespace rather than accepting a space as a name', () => {
    expect(validateSubmission({ ...valid, firstName: '   ' })?.errors?.firstName).toBeDefined();
  });
});

describe('looksAutomated', () => {
  it('catches a filled honeypot', () => {
    expect(looksAutomated({ ...valid, company: 'Acme' })).toBe(true);
  });

  it('ignores an empty or whitespace honeypot', () => {
    expect(looksAutomated({ ...valid, company: '' })).toBe(false);
    expect(looksAutomated({ ...valid, company: '  ' })).toBe(false);
  });

  it('catches a submission faster than a person can read the form', () => {
    expect(looksAutomated({ ...valid, elapsedMs: 40 })).toBe(true);
    expect(looksAutomated({ ...valid, elapsedMs: LIMITS.minElapsedMs - 1 })).toBe(true);
    expect(looksAutomated({ ...valid, elapsedMs: LIMITS.minElapsedMs })).toBe(false);
  });

  it('does not penalise a submission with no timing information', () => {
    const { elapsedMs: _elapsed, ...noTiming } = valid;
    expect(looksAutomated(noTiming)).toBe(false);
  });
});

describe('normaliseEmail', () => {
  it('lowercases and trims', () => {
    expect(normaliseEmail('  Ada@Example.COM ')).toBe('ada@example.com');
  });

  it('collapses Gmail dots and plus-aliases onto one identity', () => {
    expect(normaliseEmail('a.d.a+zweaq@gmail.com')).toBe('ada@gmail.com');
    expect(normaliseEmail('ada@googlemail.com')).toBe('ada@gmail.com');
  });

  it('strips plus-aliases but keeps dots on other providers', () => {
    // Dots are significant outside Gmail — stripping them would merge two people.
    expect(normaliseEmail('ada.lovelace+x@example.com')).toBe('ada.lovelace@example.com');
  });
});
