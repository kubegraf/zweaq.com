import type { WaitlistResult, WaitlistSubmission } from './types';
import { looksAutomated, validateSubmission } from './validate';
import { normaliseEmail, LIMITS } from './validate';
import { type WaitlistStore, toRecord } from './store';

/**
 * Framework-agnostic waitlist handler.
 *
 * Kept free of Next.js imports on purpose: the same function backs the Next
 * route handler, the unit tests, and whatever runtime this eventually deploys
 * to. See src/app/api/waitlist/route.node.ts for the HTTP adapter.
 */

export interface RateLimiter {
  /** False when the caller has exceeded their allowance. */
  take(key: string): boolean;
}

/** Fixed-window limiter. Sufficient for a signup form; not a general-purpose one. */
export class FixedWindowLimiter implements RateLimiter {
  private hits = new Map<string, { count: number; resetAt: number }>();

  constructor(
    private readonly max = 5,
    private readonly windowMs = 60_000,
  ) {}

  take(key: string): boolean {
    const now = Date.now();
    const entry = this.hits.get(key);

    if (!entry || now > entry.resetAt) {
      this.hits.set(key, { count: 1, resetAt: now + this.windowMs });
      return true;
    }
    if (entry.count >= this.max) return false;

    entry.count += 1;
    return true;
  }
}

export interface HandlerDeps {
  store: WaitlistStore;
  limiter?: RateLimiter;
  /** Opaque caller key for rate limiting — a hashed IP, never stored. */
  callerKey?: string;
}

export async function handleWaitlist(
  input: Partial<WaitlistSubmission>,
  deps: HandlerDeps,
): Promise<WaitlistResult> {
  try {
    if (deps.limiter && deps.callerKey && !deps.limiter.take(deps.callerKey)) {
      return {
        status: 'rate_limited',
        message: 'Too many attempts. Try again in a minute.',
      };
    }

    const invalid = validateSubmission(input);
    if (invalid) return invalid;

    // Past this point the submission is structurally valid.
    const submission = input as WaitlistSubmission;

    /*
     * Automated submissions get a success response and are silently dropped.
     * Telling a bot which check caught it just helps the next attempt, and a
     * false positive on a real person is better handled by them never getting
     * a confirmation email than by an accusatory error message.
     */
    if (looksAutomated(submission)) {
      return { status: 'success' };
    }

    const key = normaliseEmail(submission.email);
    if (await deps.store.has(key)) {
      return {
        status: 'already_registered',
        message: 'You are already on the list.',
      };
    }

    await deps.store.add(toRecord(submission));
    return { status: 'success' };
  } catch {
    // Never leak an internal error message or stack to the caller.
    return { status: 'server_error', message: 'Something went wrong on our side.' };
  }
}

export { LIMITS };
