/**
 * Privacy-conscious analytics abstraction.
 *
 * Design rules:
 *   - No provider is bundled. `configure()` installs one at runtime; with none
 *     installed, every call is a no-op that costs one function call.
 *   - Event payloads are a closed union. There is no `track(name, anything)`
 *     escape hatch, so PII cannot be added by accident at a call site.
 *   - Nothing here reads cookies, localStorage, or any identifier. There is no
 *     user id, no session id, and no cross-page correlation.
 */

export type AnalyticsEvent =
  | { name: 'page_view'; path: string }
  | { name: 'hero_interaction'; mode: string; via: 'click' | 'keyboard' | 'auto' }
  | { name: 'product_view'; product: string }
  | { name: 'demo_mode_change'; mode: string }
  | { name: 'waitlist_start' }
  | { name: 'waitlist_complete'; interest: string }
  | { name: 'waitlist_error'; reason: string }
  | { name: 'faq_open'; id: string }
  | { name: 'pricing_view' }
  | { name: 'developer_signup' };

export type AnalyticsProvider = (event: AnalyticsEvent) => void;

let provider: AnalyticsProvider | null = null;

/**
 * Installs an analytics provider. Called once, from a client boundary, only if
 * the deployment configures one. Passing null disables tracking entirely.
 */
export function configure(next: AnalyticsProvider | null): void {
  provider = next;
}

export function track(event: AnalyticsEvent): void {
  if (!provider) return;
  try {
    provider(event);
  } catch {
    // Analytics must never break the page. Swallow and carry on.
  }
}

/** Exposed for tests. */
export function getProvider(): AnalyticsProvider | null {
  return provider;
}
