import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export interface Story { id: string; component: string; name: string }

/** Every story in the built catalog (run `pnpm catalog:build` first). */
export function loadStories(): Story[] {
  const meta = JSON.parse(readFileSync(resolve(process.cwd(), 'catalog-dist/meta.json'), 'utf8')) as {
    stories: Record<string, { name: string; levels: string[] }>;
  };
  return Object.entries(meta.stories)
    .map(([id, s]) => ({ id, component: s.levels.join('/'), name: s.name }))
    .sort((a, b) => a.id.localeCompare(b.id));
}

/**
 * Stories whose pixels are nondeterministic by design (random particles,
 * live clocks, canvas noise). They are still rendered and checked for page
 * errors and accessibility; only the pixel comparison is skipped.
 */
export const NONDETERMINISTIC = new Set<string>([]);

export const storyUrl = (id: string) => `/?story=${encodeURIComponent(id)}&mode=preview`;
