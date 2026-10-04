import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { loadStories } from './stories';
import { prepareStory } from './prepare';

/**
 * Axe over every story, scoped to the story frame (Ladle's own chrome is not ours).
 * Serious and critical violations fail the gate; minor and moderate ones are
 * reported in the test output but don't block.
 */
const BLOCKING = new Set(['serious', 'critical']);

for (const story of loadStories()) {
  test(`a11y: ${story.id}`, async ({ page }) => {
    await prepareStory(page, story.id);
    // axe schedules its own work on timers, so let the page clock run again.
    await page.clock.resume();
    const { violations } = await new AxeBuilder({ page })
      .include('[data-ladle-frame]')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'])
      .analyze();
    const summary = violations.map((v) => ({
      rule: v.id,
      impact: v.impact,
      help: v.help,
      targets: v.nodes.slice(0, 5).map((n) => n.target.join(' ')),
    }));
    const blocking = summary.filter((v) => v.impact && BLOCKING.has(v.impact));
    const advisory = summary.filter((v) => !v.impact || !BLOCKING.has(v.impact));
    if (advisory.length) test.info().annotations.push({ type: 'a11y-advisory', description: JSON.stringify(advisory) });
    expect(blocking, `serious/critical axe violations in ${story.id}`).toEqual([]);
  });
}
