import { test, expect } from '@playwright/test';

/**
 * E2E runs against the built static export served under the same base path
 * GitHub Pages uses, so what these tests exercise is what actually ships.
 */

test.describe('homepage', () => {
  test('loads with the product proposition above the fold', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/ZWEAQ/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('you wear');
    await expect(page.getByRole('link', { name: 'Join early access' }).first()).toBeVisible();
  });

  test('renders every section of the argument', async ({ page }) => {
    await page.goto('/');
    for (const id of [
      'statement', 'demo', 'not-a-health-ring', 'phone', 'ai', 'vault', 'drive',
      'identity', 'nfc', 'display', 'gestures', 'haptics', 'sensors', 'security',
      'offline', 'ecosystem', 'technology', 'variants', 'pricing', 'comparison',
      'dock', 'roadmap', 'faq', 'waitlist',
    ]) {
      await expect(page.locator(`#${id}`), `#${id} is missing`).toHaveCount(1);
    }
  });

  test('has exactly one h1 and no skipped heading levels', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('h1')).toHaveCount(1);

    const levels = await page.$$eval('h1,h2,h3,h4,h5,h6', (nodes) =>
      nodes.map((n) => Number(n.tagName[1])),
    );
    for (let i = 1; i < levels.length; i += 1) {
      expect(levels[i]! - levels[i - 1]!, `jump at heading ${i}`).toBeLessThanOrEqual(1);
    }
  });

  test('never states an unvalidated specification as fact', async ({ page }) => {
    await page.goto('/');
    const body = (await page.locator('body').innerText()).replace(/\s+/g, ' ');

    // Every occurrence of the storage and battery figures must be qualified.
    for (const match of body.matchAll(/32 GB/g)) {
      const before = body.slice(Math.max(0, match.index! - 30), match.index!);
      expect(before, 'unqualified "32 GB"').toMatch(/Target:\s*$|target/i);
    }
    expect(body).not.toMatch(/\b7-day battery\b/i);
    expect(body).toContain('Target: up to 7 days');
  });

  test('does not claim payments are available', async ({ page }) => {
    await page.goto('/');
    const body = await page.locator('body').innerText();
    expect(body).not.toMatch(/payments supported|pay with your ring/i);
    expect(body).toMatch(/designed for future payment/i);
  });
});

test.describe('navigation', () => {
  test('reaches every primary destination', async ({ page, isMobile }) => {
    for (const [label, path] of [
      ['Product', '/product/'],
      ['Technology', '/technology/'],
      ['Security', '/security/'],
      ['Developers', '/developers/'],
    ] as const) {
      await page.goto('/');
      if (isMobile) {
        await page.getByRole('button', { name: /open menu/i }).click();
      }
      await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: label }).first().click();
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('skip link moves focus to the main content', async ({ page }) => {
    await page.goto('/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /skip to content/i });
    await expect(skip).toBeFocused();
    await skip.press('Enter');
    await expect(page).toHaveURL(/#main$/);
  });

  test('every link resolves to a real destination', async ({ page }) => {
    await page.goto('/');
    const hrefs = await page.$$eval('a[href]', (links) =>
      links.map((l) => l.getAttribute('href') ?? ''),
    );
    // A footer full of "#" links is the clearest sign of a template.
    expect(hrefs.filter((h) => h === '#' || h === '')).toHaveLength(0);
  });
});

test.describe('interactive demo', () => {
  test('switches capability with the keyboard', async ({ page }) => {
    await page.goto('/#demo');
    const tabs = page.getByRole('tab');
    await tabs.first().focus();
    await page.keyboard.press('ArrowRight');

    await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel')).toContainText('Storage that stays with you');
  });

  test('tapping the hero ring changes what it displays', async ({ page }) => {
    await page.goto('/');
    const ring = page.getByRole('button', { name: /change what the ring display shows/i });
    const before = await ring.getAttribute('aria-label').catch(() => null);
    await ring.click();
    await expect(page.locator('[aria-live="polite"]')).toContainText(/Display shows/i);
    expect(before).toBe(before);
  });
});

test.describe('waitlist', () => {
  /*
   * Every query is scoped to the form and uses an exact label. Unscoped
   * getByLabel('Email') also matches the consent checkbox, whose label begins
   * "Email me about ZWEAQ".
   */
  const form = (page: import('@playwright/test').Page) => page.locator('#waitlist');

  test.beforeEach(async ({ page }) => {
    await page.goto('/#waitlist');
    await page.evaluate(() => window.localStorage.clear());
    await page.reload();
  });

  test('rejects an empty submission and explains why', async ({ page }) => {
    await form(page).getByRole('button', { name: /join early access/i }).click();
    await expect(page.getByText('Enter your first name.')).toBeVisible();
    await expect(page.getByText('Enter your email address.')).toBeVisible();
    await expect(page.getByText('Select your country.')).toBeVisible();
  });

  test('accepts a valid signup, then reports the duplicate', async ({ page }) => {
    const fill = async (email: string) => {
      const scope = form(page);
      await scope.getByLabel('First name', { exact: true }).fill('Ada');
      await scope.getByLabel('Email', { exact: true }).fill(email);
      await scope.getByLabel('Country', { exact: true }).selectOption('GB');
      await scope.locator('input[type="checkbox"]').check();
      // The form treats a submission faster than 1.2s as automated.
      await page.waitForTimeout(1400);
      await scope.getByRole('button', { name: /join early access/i }).click();
    };

    await fill('ada@example.com');
    await expect(page.getByText('You’re on the list.')).toBeVisible();

    await page.goto('/#waitlist');
    await fill('ada@example.com');
    await expect(page.getByText('You’re already on the list.')).toBeVisible();
  });

  test('does not submit without consent', async ({ page }) => {
    const scope = form(page);
    await scope.getByLabel('First name', { exact: true }).fill('Ada');
    await scope.getByLabel('Email', { exact: true }).fill('ada@example.com');
    await scope.getByLabel('Country', { exact: true }).selectOption('GB');
    await page.waitForTimeout(1400);
    await scope.getByRole('button', { name: /join early access/i }).click();

    await expect(
      page.getByText('We need your permission before we can email you.'),
    ).toBeVisible();
    await expect(page.getByText('You’re on the list.')).toHaveCount(0);
  });
});

test.describe('reduced motion', () => {
  test('shows all content with animation disabled', async ({ page }) => {
    // Emulated explicitly rather than through `test.use`, so the assertion
    // below cannot pass because the emulation silently failed to apply.
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(
      await page.evaluate(() => matchMedia('(prefers-reduced-motion: reduce)').matches),
    ).toBe(true);

    // Reveal-on-scroll must never leave content permanently invisible.
    const hidden = await page.$$eval('[data-reveal]', (els) =>
      els
        .filter((el) => getComputedStyle(el).opacity === '0')
        .map((el) => el.textContent?.slice(0, 40) ?? ''),
    );
    expect(hidden).toEqual([]);
  });

  test('schedules no animation timers', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });

    // Patched before any application code runs — patching after load would
    // miss the very timer this is checking for.
    await page.addInitScript(() => {
      (window as unknown as { __intervals: number }).__intervals = 0;
      const original = window.setInterval;
      window.setInterval = ((...args: unknown[]) => {
        (window as unknown as { __intervals: number }).__intervals += 1;
        return (original as (...a: unknown[]) => number)(...args);
      }) as typeof window.setInterval;
    });

    await page.goto('/');
    await page.waitForTimeout(1200);

    // The hero display cycle must not be scheduled at all, not merely hidden.
    const intervals = await page.evaluate(
      () => (window as unknown as { __intervals: number }).__intervals,
    );
    expect(intervals).toBe(0);
  });

  test('does cycle the hero display when motion is allowed', async ({ page }) => {
    // The counterpart assertion: reduced motion must be the reason nothing
    // animates, not a bug that stops it animating for everyone.
    await page.emulateMedia({ reducedMotion: 'no-preference' });
    await page.goto('/');

    const ring = page.getByRole('button', { name: /change what the ring display shows/i });
    const first = await ring.innerText();
    await expect(async () => {
      expect(await ring.innerText()).not.toBe(first);
    }).toPass({ timeout: 8_000 });
  });
});
