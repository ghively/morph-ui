import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, it, expect } from 'vitest';

// primitives.css is generated from ChatUIMorph app.css by copying every rule whose
// selector names a data-* attribute some morph-ui component renders. ChatUIMorph's
// own [data-checkbox]/[data-radio] are custom button controls with a different shape,
// so importing them restyled Checkbox and RadioGroup (squashed labels, phantom radio
// dot, broken horizontal layout). Those components own their attributes outright.
const OWNED_BY_COMPONENTS = ['data-checkbox', 'data-radio'];

describe('primitives.css', () => {
  const css = readFileSync(resolve(__dirname, '../src/primitives.css'), 'utf8');
  it.each(OWNED_BY_COMPONENTS)('has no rules targeting component-owned [%s]', (attr) => {
    expect(css).not.toMatch(new RegExp(`\\[${attr}\\]`));
  });
});
