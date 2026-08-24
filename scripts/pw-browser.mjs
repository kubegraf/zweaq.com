/**
 * Resolves a Chromium executable.
 *
 * This environment ships a pre-installed browser whose build number may not
 * match the Playwright package's expectation. Pointing at it directly is both
 * faster and more reliable than downloading a second copy. In CI, where
 * `playwright install` has run, we let Playwright resolve its own.
 */
import { existsSync } from 'node:fs';

const PREINSTALLED = '/opt/pw-browsers/chromium';

export function chromiumLaunchOptions() {
  if (!process.env.CI && existsSync(PREINSTALLED)) {
    return { executablePath: PREINSTALLED };
  }
  return {};
}
