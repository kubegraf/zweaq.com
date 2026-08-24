'use client';

import type { WaitlistResult, WaitlistSubmission } from './types';
import { validateSubmission, looksAutomated, normaliseEmail } from './validate';

/**
 * Client-side waitlist transport.
 *
 * The form does not know or care where signups go. Three providers, resolved in
 * order:
 *
 *   1. NEXT_PUBLIC_WAITLIST_ENDPOINT — POST to a configured absolute URL. Use
 *      this on a static host such as GitHub Pages, where there is no server.
 *   2. Same-origin /api/waitlist — used when the app runs on a Node target.
 *   3. Local provider — validates properly and remembers addresses in this
 *      browser, so duplicate detection and every response state are exercisable
 *      without a backend. It is clearly surfaced in the UI as not a real signup.
 *
 * No API key is ever read here. A key belongs on a server, and provider (1)
 * expects an endpoint that holds its own credentials.
 */

export type TransportKind = 'endpoint' | 'route' | 'local';

const LOCAL_KEY = 'zweaq:waitlist:local';

export function resolveTransport(): TransportKind {
  if (process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT) return 'endpoint';
  if (process.env.NEXT_PUBLIC_HAS_API === '1') return 'route';
  return 'local';
}

/** True when signups are not reaching a real backend. The UI must say so. */
export function isLocalOnly(): boolean {
  return resolveTransport() === 'local';
}

function readLocal(): string[] {
  try {
    const raw = window.localStorage.getItem(LOCAL_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : [];
  } catch {
    return [];
  }
}

function writeLocal(list: string[]): void {
  try {
    window.localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
  } catch {
    // Private mode, storage disabled, quota. Signup still reports success.
  }
}

async function submitLocal(input: WaitlistSubmission): Promise<WaitlistResult> {
  const key = normaliseEmail(input.email);
  const seen = readLocal();

  if (seen.includes(key)) {
    return { status: 'already_registered', message: 'You are already on the list.' };
  }
  writeLocal([...seen, key]);
  return { status: 'success' };
}

async function submitHttp(url: string, input: WaitlistSubmission): Promise<WaitlistResult> {
  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
  } catch {
    return {
      status: 'server_error',
      message: 'We could not reach the server. Check your connection and try again.',
    };
  }

  try {
    const body: unknown = await response.json();
    if (body && typeof body === 'object' && 'status' in body) {
      return body as WaitlistResult;
    }
  } catch {
    // Fall through to a status-derived result.
  }

  if (response.status === 429) return { status: 'rate_limited' };
  return response.ok
    ? { status: 'success' }
    : { status: 'server_error', message: 'Something went wrong on our side.' };
}

export async function submitWaitlist(
  input: WaitlistSubmission,
): Promise<WaitlistResult> {
  // Validate before any network call so obvious mistakes never leave the page.
  const invalid = validateSubmission(input);
  if (invalid) return invalid;

  // Silently accept automated submissions without persisting them anywhere.
  if (looksAutomated(input)) return { status: 'success' };

  switch (resolveTransport()) {
    case 'endpoint':
      return submitHttp(process.env.NEXT_PUBLIC_WAITLIST_ENDPOINT as string, input);
    case 'route':
      return submitHttp(`${process.env.NEXT_PUBLIC_BASE_PATH ?? ''}/api/waitlist`, input);
    default:
      return submitLocal(input);
  }
}
