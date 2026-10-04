import type { Page } from '@playwright/test';
import { storyUrl } from './stories';

const NOW = new Date('2026-03-12T10:30:00');

/**
 * Open a story in a deterministic state and return any uncaught page errors.
 *
 * - Remote requests are blocked, so remote artwork can't arrive at a random moment.
 * - The clock is installed and paused, so "now" is fixed and timer-driven
 *   demos (streaming text, typewriters, carousels) stay on their first frame.
 * - Fonts and every <img> are settled before the caller looks at the page.
 */
export async function prepareStory(page: Page, id: string): Promise<string[]> {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route(/^https?:\/\/(?!127\.0\.0\.1|localhost)/, (route) => route.abort());
  await page.clock.install({ time: NOW });
  await page.clock.pauseAt(NOW);
  await page.goto(storyUrl(id));
  // Ladle's own boot needs timers and frames, so step fake time until the story mounts.
  const frame = page.locator('[data-ladle-frame] > *').first();
  for (let i = 0; !(await frame.count()); i++) {
    if (i > 300) throw new Error(`story ${id} never mounted`);
    await page.clock.runFor(16);
    await page.waitForTimeout(10);
  }
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all(
      Array.from(document.images, (img) => (img.complete ? null : img.decode().catch(() => null))),
    );
  });
  // Two fake frames for layout effects, then real time for ResizeObservers.
  await page.clock.runFor(32);
  await page.waitForTimeout(100);
  return errors;
}
