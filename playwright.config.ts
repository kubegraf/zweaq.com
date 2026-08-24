import { defineConfig, devices } from '@playwright/test';
import { existsSync } from 'node:fs';

/**
 * This environment ships a pre-installed Chromium whose build number may not
 * match the Playwright package's. Pointing at it directly beats downloading a
 * second copy; in CI, `playwright install` has run, so Playwright resolves its
 * own and this is skipped.
 */
const PREINSTALLED = '/opt/pw-browsers/chromium';
const launchOptions =
  !process.env.CI && existsSync(PREINSTALLED) ? { executablePath: PREINSTALLED } : {};

/**
 * E2E runs against the real static export — the same bytes GitHub Pages serves
 * — rather than a dev server, so what CI verifies is what ships.
 */
const PORT = 4321;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: `http://127.0.0.1:${PORT}/zweaq.com`,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 }, launchOptions },
    },
    { name: 'mobile', use: { ...devices['Pixel 7'], launchOptions } },
  ],

  webServer: {
    command: `node scripts/serve-static.mjs ${PORT}`,
    url: `http://127.0.0.1:${PORT}/zweaq.com/`,
    reuseExistingServer: !process.env.CI,
    timeout: 90_000,
  },
});
