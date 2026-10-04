import { test, expect } from '@playwright/test';
import { loadStories, NONDETERMINISTIC } from './stories';
import { prepareStory } from './prepare';

for (const story of loadStories()) {
  test(`visual: ${story.id}`, async ({ page }) => {
    const errors = await prepareStory(page, story.id);
    expect(errors, 'uncaught page errors').toEqual([]);
    if (NONDETERMINISTIC.has(story.id)) return;
    await expect(page).toHaveScreenshot(`${story.id}.png`, { fullPage: false });
  });
}
