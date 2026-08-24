import { NextResponse } from 'next/server';
import { handleWaitlist, FixedWindowLimiter } from '@/lib/waitlist/handler';
import { MemoryWaitlistStore } from '@/lib/waitlist/store';
import { HTTP_STATUS } from '@/lib/waitlist/types';

/**
 * POST /api/waitlist
 *
 * Thin HTTP adapter. All logic lives in @/lib/waitlist/handler so it is
 * testable without a server and portable off Next.js.
 *
 * The file is named `route.node.ts` rather than `route.ts` because the static
 * export target does not list `node.ts` as a page extension — see
 * next.config.mjs. That is what lets one codebase build both for a Node host
 * (this route live) and for GitHub Pages (no server at all).
 *
 * Before deploying to a Node host, replace MemoryWaitlistStore with a real
 * implementation of the WaitlistStore port. The in-memory store loses records
 * on every cold start.
 */

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const store = new MemoryWaitlistStore();
const limiter = new FixedWindowLimiter(5, 60_000);

/**
 * Derives an opaque rate-limit key. The IP is hashed and never stored — we only
 * need to know that two requests came from the same place, not where that is.
 */
async function callerKey(request: Request): Promise<string> {
  const forwarded = request.headers.get('x-forwarded-for') ?? '';
  const ip = forwarded.split(',')[0]?.trim() || 'unknown';
  const digest = await crypto.subtle.digest(
    'SHA-256',
    new TextEncoder().encode(`zweaq:${ip}`),
  );
  return Array.from(new Uint8Array(digest).slice(0, 8))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function POST(request: Request): Promise<NextResponse> {
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { status: 'validation_error', message: 'Expected a JSON body.' },
      { status: HTTP_STATUS.validation_error },
    );
  }

  if (typeof payload !== 'object' || payload === null) {
    return NextResponse.json(
      { status: 'validation_error', message: 'Expected a JSON object.' },
      { status: HTTP_STATUS.validation_error },
    );
  }

  const result = await handleWaitlist(payload, {
    store,
    limiter,
    callerKey: await callerKey(request),
  });

  return NextResponse.json(result, {
    status: HTTP_STATUS[result.status],
    // A signup response must never be cached by a CDN or a browser.
    headers: { 'Cache-Control': 'no-store' },
  });
}

/** Anything other than POST is not a thing this endpoint does. */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { status: 'validation_error', message: 'Use POST.' },
    { status: 405, headers: { Allow: 'POST' } },
  );
}
