import { describe, it, expect } from 'vitest';

/* Badge tone inks must clear WCAG AA (4.5:1) on the surfaces a badge commonly
   sits on: --app-bg, --app-panel, --app-elev, glass, and DataTable's even-row
   stripe (--app-hover) over each. Values are read from the shipped CSS so a
   token or mix change that drops a tone under AA fails here. */

type RGB = [number, number, number];
type RGBA = [number, number, number, number];

async function sources() {
  const { readFileSync } = await import('node:fs');
  return { tokens: readFileSync('src/tokens.css', 'utf8'), badge: readFileSync('src/components/Badge.css', 'utf8') };
}

function token(css: string, name: string): string {
  const m = css.match(new RegExp(`${name}:\\s*([^;]+);`));
  if (!m) throw new Error('missing token ' + name);
  const v = m[1]!.trim();
  const alias = v.match(/^var\((--[\w-]+)\)$/);
  return alias ? token(css, alias[1]!) : v;
}

function parse(v: string): RGBA {
  if (v.startsWith('#')) return [0, 2, 4].map(i => parseInt(v.slice(1 + i, 3 + i), 16)).concat(1) as RGBA;
  const m = v.match(/rgba?\(([^)]+)\)/);
  if (!m) throw new Error('unparsed colour ' + v);
  const p = m[1]!.split(',').map(Number);
  return [p[0]!, p[1]!, p[2]!, p[3] ?? 1];
}

const over = ([r, g, b, a]: RGBA, under: RGB): RGB => [r * a + under[0] * (1 - a), g * a + under[1] * (1 - a), b * a + under[2] * (1 - a)];
const mix = (a: RGB, b: RGB, p: number): RGB => [0, 1, 2].map(i => a[i]! * p + b[i]! * (1 - p)) as RGB;
const lum = (c: RGB) => {
  const [r, g, b] = c.map(v => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r! + 0.7152 * g! + 0.0722 * b!;
};
const ratio = (a: RGB, b: RGB) => { const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p); return (x! + 0.05) / (y! + 0.05); };

describe('Badge tone contrast', () => {
  it('every tone ink clears 4.5:1 on bg, panel, elev, glass and table stripes', async () => {
    const { tokens, badge } = await sources();
    const rgb = (name: string) => parse(token(tokens, name));
    const bg = rgb('--app-bg').slice(0, 3) as RGB;
    const elev = rgb('--app-elev');
    const base: Record<string, RGB> = {
      bg,
      panel: over(rgb('--app-panel'), bg),
      elev: over(elev, bg),
      glass: over([elev[0], elev[1], elev[2], elev[3] * 0.9], bg),
    };
    base['panel+elev'] = over(elev, base.panel!);
    const surfaces: Record<string, RGB> = { ...base };
    for (const [k, s] of Object.entries(base)) surfaces[k + '+stripe'] = over(rgb('--app-hover'), s);

    const ink = rgb('--morph-badge-fg').slice(0, 3) as RGB;
    const tones: Record<string, { fg: string; tint: string }> = {
      neutral: { fg: '--morph-badge-fg', tint: '--morph-badge-bg' },
      info: { fg: '--morph-info', tint: '--app-blue' },
      success: { fg: '--morph-success', tint: '--color-success' },
      warn: { fg: '--morph-warn', tint: '--color-warning' },
      danger: { fg: '--morph-danger', tint: '--color-error' },
    };
    const failures: string[] = [];
    for (const [tone, t] of Object.entries(tones)) {
      let fg = rgb(t.fg).slice(0, 3) as RGB;
      let tint = rgb(t.tint);
      if (tone !== 'neutral') {
        const rule = badge.match(new RegExp(`\\[data-tone='${tone}'\\]\\s*{([^}]+)}`))![1]!;
        const ink_pct = rule.match(/color:\s*color-mix\(in srgb, var\(--[\w-]+\) (\d+)%, var\(--morph-badge-fg\)\)/);
        expect(ink_pct, `${tone} ink should mix toward --morph-badge-fg`).toBeTruthy();
        fg = mix(fg, ink, Number(ink_pct![1]) / 100);
        const bgPct = Number(rule.match(/background:\s*color-mix\(in srgb, var\(--[\w-]+\) (\d+)%/)![1]) / 100;
        tint = [tint[0], tint[1], tint[2], bgPct];
      }
      for (const [k, s] of Object.entries(surfaces)) {
        const r = ratio(fg, over(tint, s));
        if (r < 4.5) failures.push(`${tone} on ${k}: ${r.toFixed(2)}`);
      }
    }
    expect(failures).toEqual([]);
  });
});
