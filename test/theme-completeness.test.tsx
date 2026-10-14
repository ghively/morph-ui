import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const root = process.cwd();
const read = (file: string) => readFileSync(join(root, file), 'utf8');
const declaration = /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi;
const variable = /var\(\s*(--[a-z0-9-]+)/gi;
const directColor = (value: string) =>
  /^(transparent|currentcolor)$/i.test(value.trim()) ||
  /(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|color-mix\(|oklch\(|oklab\()/i.test(value);

function auditThemes() {
  const tokenValues = new Map<string, string[]>();
  let match: RegExpExecArray | null;
  const tokens = read('src/tokens.css').replace(/\/\*[\s\S]*?\*\//g, '');
  while ((match = declaration.exec(tokens))) {
    const name = match[1].toLowerCase();
    tokenValues.set(name, [...(tokenValues.get(name) ?? []), match[2].trim()]);
  }

  const colorTokens = new Set(
    [...tokenValues].filter(([, values]) => values.some(directColor)).map(([name]) => name),
  );
  let changed = true;
  while (changed) {
    changed = false;
    for (const [name, values] of tokenValues) {
      if (colorTokens.has(name)) continue;
      if (
        values.some((value) => {
          variable.lastIndex = 0;
          return [...value.matchAll(variable)].some((ref) => colorTokens.has(ref[1].toLowerCase()));
        })
      ) {
        colorTokens.add(name);
        changed = true;
      }
    }
  }

  const files = [
    ...readdirSync(join(root, 'src/components'))
      .filter((file) => file.endsWith('.css'))
      .map((file) => join(root, 'src/components', file)),
    join(root, 'src/primitives.css'),
    join(root, 'src/frame.css'),
  ];
  const consumed = new Set<string>();
  for (const file of files) {
    variable.lastIndex = 0;
    let use: RegExpExecArray | null;
    const css = readFileSync(file, 'utf8');
    while ((use = variable.exec(css))) consumed.add(use[1].toLowerCase());
  }

  const themes = read('src/themes.css');
  const missing: Record<string, string[]> = {};
  const blocks = /\.morph-frame\[data-theme="([^"]+)"\]\s*\{([^}]*)\}/g;
  let block: RegExpExecArray | null;
  while ((block = blocks.exec(themes))) {
    const overrides = new Set<string>();
    declaration.lastIndex = 0;
    let override: RegExpExecArray | null;
    while ((override = declaration.exec(block[2]))) overrides.add(override[1].toLowerCase());
    missing[block[1]] = [...consumed].filter((name) => colorTokens.has(name) && !overrides.has(name));
  }
  return missing;
}

describe('theme color completeness', () => {
  it('overrides every consumed color token in every built-in theme', () => {
    const missing = auditThemes();
    expect(missing, JSON.stringify(missing, null, 2)).toEqual({
      'lively-sage': [],
      'jade-citrus': [],
      'genehively-terminal': [],
    });
  });
});
