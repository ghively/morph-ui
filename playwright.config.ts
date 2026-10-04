import { defineConfig, devices } from '@playwright/test';

/**
 * Visual regression + accessibility over every Ladle story.
 * `pnpm test:visual` builds the catalog, serves it, and screenshots each story
 * against the baselines in e2e/__screenshots__. Refresh baselines after an
 * intended visual change with `pnpm test:visual --update-snapshots`.
 */
const PORT = 61010;

export default defineConfig({
  testDir: 'e2e',
  snapshotPathTemplate: '{testDir}/__screenshots__/{arg}{ext}',
  fullyParallel: true,
  workers: process.env.CI ? 2 : 4,
  retries: 0,
  reporter: process.env.CI ? [['list'], ['html', { open: 'never' }]] : 'list',
  expect: {
    toHaveScreenshot: { maxDiffPixels: 0, animations: 'disabled', caret: 'hide', scale: 'css' },
  },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    viewport: { width: 1000, height: 760 },
    deviceScaleFactor: 1,
    contextOptions: { reducedMotion: 'reduce' },
    colorScheme: 'dark',
    ...(process.env.PLAYWRIGHT_CHROMIUM_PATH ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROMIUM_PATH } } : {}),
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], viewport: { width: 1000, height: 760 }, deviceScaleFactor: 1 } }],
  webServer: {
    command: `pnpm exec ladle preview --host 127.0.0.1 --port ${PORT}`,
    url: `http://127.0.0.1:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
