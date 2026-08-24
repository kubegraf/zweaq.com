import { describe, it, expect, beforeEach } from 'vitest';
import { handleWaitlist, FixedWindowLimiter } from '@/lib/waitlist/handler';
import { MemoryWaitlistStore } from '@/lib/waitlist/store';
import type { WaitlistSubmission } from '@/lib/waitlist/types';

const submission: WaitlistSubmission = {
  firstName: 'Ada',
  email: 'ada@example.com',
  country: 'GB',
  interest: 'one',
  consent: true,
  elapsedMs: 4000,
};

describe('handleWaitlist', () => {
  let store: MemoryWaitlistStore;

  beforeEach(() => {
    store = new MemoryWaitlistStore();
  });

  it('accepts a valid submission and persists it', async () => {
    const result = await handleWaitlist(submission, { store });
    expect(result.status).toBe('success');
    expect(store.records.size).toBe(1);
    expect(store.records.get('ada@example.com')?.firstName).toBe('Ada');
  });

  it('reports a duplicate rather than storing it twice', async () => {
    await handleWaitlist(submission, { store });
    const second = await handleWaitlist(submission, { store });

    expect(second.status).toBe('already_registered');
    expect(store.records.size).toBe(1);
  });

  it('treats a Gmail alias as the same person', async () => {
    await handleWaitlist({ ...submission, email: 'ada@gmail.com' }, { store });
    const alias = await handleWaitlist(
      { ...submission, email: 'a.d.a+zweaq@gmail.com' },
      { store },
    );
    expect(alias.status).toBe('already_registered');
  });

  it('returns field errors for an invalid submission and stores nothing', async () => {
    const result = await handleWaitlist({ ...submission, email: 'nope' }, { store });
    expect(result.status).toBe('validation_error');
    expect(result.errors?.email).toBeDefined();
    expect(store.records.size).toBe(0);
  });

  /*
   * Spam handling is silent on purpose: an automated submission gets the same
   * response a person gets, so a bot learns nothing about which check caught it.
   */
  it('silently drops a honeypot submission but reports success', async () => {
    const result = await handleWaitlist({ ...submission, company: 'Acme' }, { store });
    expect(result.status).toBe('success');
    expect(store.records.size).toBe(0);
  });

  it('silently drops an impossibly fast submission', async () => {
    const result = await handleWaitlist({ ...submission, elapsedMs: 10 }, { store });
    expect(result.status).toBe('success');
    expect(store.records.size).toBe(0);
  });

  it('rate limits a caller past their allowance', async () => {
    const limiter = new FixedWindowLimiter(2, 60_000);
    const deps = { store, limiter, callerKey: 'abc' };

    expect((await handleWaitlist({ ...submission, email: 'a@example.com' }, deps)).status).toBe('success');
    expect((await handleWaitlist({ ...submission, email: 'b@example.com' }, deps)).status).toBe('success');

    const third = await handleWaitlist({ ...submission, email: 'c@example.com' }, deps);
    expect(third.status).toBe('rate_limited');
    expect(store.records.size).toBe(2);
  });

  it('rate limits per caller, not globally', async () => {
    const limiter = new FixedWindowLimiter(1, 60_000);
    const first = await handleWaitlist(submission, { store, limiter, callerKey: 'one' });
    const second = await handleWaitlist(
      { ...submission, email: 'other@example.com' },
      { store, limiter, callerKey: 'two' },
    );
    expect(first.status).toBe('success');
    expect(second.status).toBe('success');
  });

  it('never leaks an internal error to the caller', async () => {
    const exploding = {
      has: async () => {
        throw new Error('connection string postgres://user:hunter2@db.internal');
      },
      add: async () => undefined,
    };

    const result = await handleWaitlist(submission, { store: exploding });
    expect(result.status).toBe('server_error');
    expect(JSON.stringify(result)).not.toContain('hunter2');
    expect(JSON.stringify(result)).not.toContain('postgres');
  });
});

describe('FixedWindowLimiter', () => {
  it('lets the caller through again once the window rolls over', () => {
    const limiter = new FixedWindowLimiter(1, 20);
    expect(limiter.take('k')).toBe(true);
    expect(limiter.take('k')).toBe(false);

    return new Promise<void>((resolve) => {
      setTimeout(() => {
        expect(limiter.take('k')).toBe(true);
        resolve();
      }, 30);
    });
  });
});
