import type { WaitlistSubmission } from './types';
import { normaliseEmail } from './validate';

/**
 * Storage port for waitlist signups.
 *
 * The handler depends on this interface, never on a concrete database. To go
 * live, implement it against your provider and pass it to `handleWaitlist`.
 * Nothing else needs to change.
 */
export interface WaitlistStore {
  /** True when this address has already signed up. */
  has(normalisedEmail: string): Promise<boolean>;
  /** Persist a signup. Called only after validation and duplicate checks pass. */
  add(record: WaitlistRecord): Promise<void>;
}

export interface WaitlistRecord {
  normalisedEmail: string;
  email: string;
  firstName: string;
  country: string;
  interest: string;
  consentedAt: string;
}

/**
 * In-memory store. Used by tests and by local development.
 *
 * NOT for production: a serverless deployment gets a fresh instance per cold
 * start, so duplicate detection would be unreliable. The handler logs a warning
 * when it sees this store outside development.
 */
export class MemoryWaitlistStore implements WaitlistStore {
  readonly records = new Map<string, WaitlistRecord>();

  async has(normalisedEmail: string): Promise<boolean> {
    return this.records.has(normalisedEmail);
  }

  async add(record: WaitlistRecord): Promise<void> {
    this.records.set(record.normalisedEmail, record);
  }
}

export function toRecord(input: WaitlistSubmission): WaitlistRecord {
  return {
    normalisedEmail: normaliseEmail(input.email),
    email: input.email.trim(),
    firstName: input.firstName.trim(),
    country: input.country.trim().toUpperCase(),
    interest: input.interest,
    consentedAt: new Date().toISOString(),
  };
}
