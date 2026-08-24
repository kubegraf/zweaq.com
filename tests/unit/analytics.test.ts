import { describe, it, expect, vi, afterEach } from 'vitest';
import { configure, track, getProvider } from '@/lib/analytics';

afterEach(() => configure(null));

describe('analytics', () => {
  it('does nothing at all when no provider is configured', () => {
    configure(null);
    expect(getProvider()).toBeNull();
    expect(() => track({ name: 'page_view', path: '/' })).not.toThrow();
  });

  it('forwards events to a configured provider', () => {
    const provider = vi.fn();
    configure(provider);
    track({ name: 'waitlist_complete', interest: 'one' });
    expect(provider).toHaveBeenCalledWith({ name: 'waitlist_complete', interest: 'one' });
  });

  /* Analytics failing must never take the page down with it. */
  it('swallows a throwing provider', () => {
    configure(() => {
      throw new Error('network down');
    });
    expect(() => track({ name: 'pricing_view' })).not.toThrow();
  });

  it('carries no identifier of any kind in an event', () => {
    const seen: unknown[] = [];
    configure((event) => seen.push(event));
    track({ name: 'page_view', path: '/product' });
    track({ name: 'faq_open', id: 'storage' });

    const serialised = JSON.stringify(seen);
    for (const forbidden of ['userId', 'sessionId', 'clientId', 'email', 'uid']) {
      expect(serialised).not.toContain(forbidden);
    }
  });
});
