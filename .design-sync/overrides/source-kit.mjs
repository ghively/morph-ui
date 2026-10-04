// forked from design-sync lib/source-kit.mjs - group components by the README's component table instead of a flat 'general'
// Thin wrapper: delegates discovery to the staged lib, then regroups. The README
// "## Components" table is the library's own categorization; sub-component
// exports (SettingRow, ToastProvider, ...) inherit the group of the component
// whose source file defines them.
import { readFileSync, readdirSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import * as base from '../../.ds-sync/lib/source-kit.mjs';

export * from '../../.ds-sync/lib/source-kit.mjs';

const slug = (s) => s.trim().toLowerCase().replace(/&|\+/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function readmeGroups() {
  const map = new Map();
  const md = readFileSync(resolve('README.md'), 'utf8');
  for (const line of md.split('\n')) {
    const m = /^\|\s*([^|]+?)\s*\|\s*([A-Z][^|]+?)\s*\|\s*$/.exec(line);
    if (!m || m[1] === 'Group') continue;
    for (const name of m[2].split(',').map((s) => s.trim()).filter(Boolean)) map.set(name, slug(m[1]));
  }
  return map;
}

// Sub-components defined in shared helper files, keyed by helper basename.
const SHARED_FILE_GROUP = {
  'mediaLibrary.shared': 'media-library',
  'layout.shared': 'app-shell-and-overlays',
};

const COMP_DIR = resolve('src/components');
function definingFile(name) {
  const rx = new RegExp(`export\\s+(?:function|const|class)\\s+${name}\\b`);
  return readdirSync(COMP_DIR).filter((f) => /\.tsx?$/.test(f) && !f.includes('.stories.'))
    .find((f) => rx.test(readFileSync(resolve(COMP_DIR, f), 'utf8')));
}

export async function resolvePackage(ctx) {
  const res = await base.resolvePackage(ctx);
  const groups = readmeGroups();
  const unmapped = [];
  for (const c of res.components ?? []) {
    let g = groups.get(c.name);
    const src = c.srcPath ?? definingFile(c.name);
    if (!g && src) {
      const file = basename(src).replace(/\.tsx?$/, '');
      g = groups.get(file) ?? SHARED_FILE_GROUP[file];
    }
    if (g) c.group = g; else unmapped.push(c.name);
  }
  if (unmapped.length) console.error(`  [README_GROUPS] unmapped (left as-is): ${unmapped.join(', ')}`);
  return res;
}
