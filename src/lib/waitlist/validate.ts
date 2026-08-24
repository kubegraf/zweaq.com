import type { WaitlistSubmission, WaitlistResult } from './types';
import { INTERESTS } from './types';

/**
 * Deliberately permissive email shape check.
 *
 * The only authoritative test of an email address is sending mail to it. A
 * stricter regex rejects real addresses — new TLDs, plus-addressing, apostrophes
 * — so this checks structure only and lets confirmation email do the rest.
 */
const EMAIL = /^[^\s@,;:<>()[\]\\]+@[^\s@.]+(\.[^\s@.]+)+$/;

/** ISO 3166-1 alpha-2, or the empty string when not yet chosen. */
const COUNTRY = /^[A-Z]{2}$/;

export const LIMITS = {
  firstName: 60,
  email: 254, // RFC 5321 maximum path length
  /** Anything faster than this was not typed by a person. */
  minElapsedMs: 1200,
} as const;

/**
 * Validates a submission. Pure, synchronous, and shared by the client (for
 * instant feedback) and the server (which never trusts the client).
 */
export function validateSubmission(
  input: Partial<WaitlistSubmission>,
): WaitlistResult | null {
  const errors: NonNullable<WaitlistResult['errors']> = {};

  const firstName = (input.firstName ?? '').trim();
  if (firstName.length === 0) {
    errors.firstName = 'Enter your first name.';
  } else if (firstName.length > LIMITS.firstName) {
    errors.firstName = `Keep this under ${LIMITS.firstName} characters.`;
  }

  const email = (input.email ?? '').trim();
  if (email.length === 0) {
    errors.email = 'Enter your email address.';
  } else if (email.length > LIMITS.email || !EMAIL.test(email)) {
    errors.email = 'That does not look like an email address.';
  }

  const country = (input.country ?? '').trim().toUpperCase();
  if (country.length === 0) {
    errors.country = 'Select your country.';
  } else if (!COUNTRY.test(country)) {
    errors.country = 'Select your country.';
  }

  const interest = input.interest;
  if (!interest || !INTERESTS.includes(interest)) {
    errors.interest = 'Choose what you are interested in.';
  }

  if (input.consent !== true) {
    errors.consent = 'We need your permission before we can email you.';
  }

  if (Object.keys(errors).length > 0) {
    return { status: 'validation_error', errors };
  }
  return null;
}

/**
 * Spam heuristics, kept separate from validation so a bot never learns which
 * check caught it — every result here is reported to the caller as generic
 * success, not as an error.
 */
export function looksAutomated(input: Partial<WaitlistSubmission>): boolean {
  // Honeypot: a hidden field only an automated form-filler would populate.
  if ((input.company ?? '').trim().length > 0) return true;

  // Timing: a real person cannot read four fields and submit in under 1.2s.
  if (typeof input.elapsedMs === 'number' && input.elapsedMs < LIMITS.minElapsedMs) {
    return true;
  }

  return false;
}

/**
 * Normalises an address for duplicate detection. Case-insensitive, and Gmail's
 * dot-and-plus aliasing is collapsed so one person cannot occupy fifty slots.
 */
export function normaliseEmail(email: string): string {
  const trimmed = email.trim().toLowerCase();
  const at = trimmed.lastIndexOf('@');
  if (at < 0) return trimmed;

  const local = trimmed.slice(0, at);
  const domain = trimmed.slice(at + 1);
  const plus = local.indexOf('+');
  const base = plus >= 0 ? local.slice(0, plus) : local;

  if (domain === 'gmail.com' || domain === 'googlemail.com') {
    return `${base.replaceAll('.', '')}@gmail.com`;
  }
  return `${base}@${domain}`;
}
