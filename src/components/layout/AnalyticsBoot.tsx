'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { configure, track } from '@/lib/analytics';

/**
 * Installs an analytics provider, if one is configured, and records page views.
 *
 * With no provider configured — which is the default, and the case on the
 * public deployment — this mounts, calls `configure(null)`, and every
 * subsequent `track()` in the app is a no-op. No script is loaded, no request
 * is made, and no identifier is stored.
 */
export function AnalyticsBoot() {
  const pathname = usePathname();

  useEffect(() => {
    const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT;

    if (!endpoint) {
      configure(null);
      return;
    }

    configure((event) => {
      // `keepalive` so an event fired during navigation still leaves the page.
      void fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(event),
        keepalive: true,
        // No cookies. This abstraction has no concept of a user.
        credentials: 'omit',
      }).catch(() => {
        /* Analytics must never surface an error to the page. */
      });
    });
  }, []);

  useEffect(() => {
    track({ name: 'page_view', path: pathname });
  }, [pathname]);

  return null;
}
