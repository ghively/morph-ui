#!/usr/bin/env node
// Snap literal px sizes in component CSS onto the token scales in src/tokens.css.
// Only bare top-level px values in font-size / border-radius / padding / margin /
// gap are rewritten; values inside calc(), clamp(), var() fallbacks etc. and 1px
// hairlines are left alone. Usage: node scripts/snap-to-scale.mjs [--check] [files...]
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const TYPE = [[9, 't-2xs'], [10, 't-xs'], [10.5, 't-eyebrow'], [11, 't-num'], [11.5, 't-meta'], [12, 't-small'], [12.5, 't-ctl'],
  [13, 't-body'], [13.5, 't-title'], [14, 't-lead'], [14.5, 't-prose'], [15, 't-input'], [16, 't-h4'], [20, 't-h3'], [24, 't-h2'], [30, 't-h1'], [36, 't-hero']];
const RADIUS = [[2, 'r-2xs'], [4, 'r-xs'], [8, 'r-sm'], [12, 'r-md'], [16, 'r-lg'], [20, 'r-card'], [28, 'r-xl']];
const SPACE = [[2, 's0'], [4, 's1'], [6, 's1h'], [8, 's2'], [10, 's3'], [12, 's4'], [14, 's4h'], [16, 's5'], [20, 's6'], [24, 's7'], [32, 's8'], [40, 's9'], [48, 's10'], [64, 's11']];

// Nearest step; ties round up. Returns null when nothing is within maxDelta.
function nearest(scale, v, maxDelta) {
  let best = null;
  for (const [n, name] of scale) {
    const d = Math.abs(n - v);
    if (d > maxDelta) continue;
    if (!best || d < best.d || (d === best.d && n > best.n)) best = { n, name, d };
  }
  return best && `var(--${best.name})`;
}

function snapValue(value, scale, maxDelta, { pill } = {}) {
  // Split on top-level whitespace; leave any token containing parentheses alone.
  let depth = 0, cur = '', parts = [];
  for (const ch of value) {
    if (ch === '(') depth++;
    if (ch === ')') depth--;
    if (/\s/.test(ch) && depth === 0) { if (cur) parts.push(cur); cur = ''; parts.push(ch); continue; }
    cur += ch;
  }
  if (cur) parts.push(cur);
  let changed = false;
  const out = parts.map((t) => {
    const m = /^(-?)(\d+(?:\.\d+)?)px$/.exec(t);
    if (!m) return t;
    const v = Number(m[2]);
    if (pill && v >= 99) { changed = true; return 'var(--r-pill)'; }
    if (v <= 1 || m[1]) return t; // hairlines and negative (geometric) offsets stay literal
    const tok = nearest(scale, v, maxDelta);
    if (!tok) return t;
    changed = true;
    return tok;
  });
  return changed ? out.join('') : null;
}

const RULES = [
  { re: /(^|[;{\s])(font-size)(\s*:\s*)([^;}!]+)/g, scale: TYPE, max: 6 },
  { re: /(^|[;{\s])(border(?:-(?:top|bottom)-(?:left|right))?-radius)(\s*:\s*)([^;}!]+)/g, scale: RADIUS, max: 4, pill: true },
  { re: /(^|[;{\s])((?:padding|margin)(?:-(?:top|right|bottom|left|inline|block)(?:-(?:start|end))?)?|(?:row-|column-)?gap)(\s*:\s*)([^;}!]+)/g, scale: SPACE, max: 8 },
];

const check = process.argv.includes('--check');
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
const targets = files.length ? files : readdirSync('src/components').filter((f) => f.endsWith('.css')).map((f) => join('src/components', f));
let total = 0;
for (const f of targets) {
  const src = readFileSync(f, 'utf8');
  let n = 0, next = src;
  for (const r of RULES) {
    next = next.replace(r.re, (all, pre, prop, sep, val) => {
      const trimmed = val.replace(/\s+$/, '');
      const tail = val.slice(trimmed.length);
      const snapped = snapValue(trimmed, r.scale, r.max, { pill: r.pill });
      if (!snapped) return all;
      n++;
      return `${pre}${prop}${sep}${snapped}${tail}`;
    });
  }
  if (n) { total += n; if (!check) writeFileSync(f, next); console.log(`${f}: ${n}`); }
}
console.log(`${check ? 'would change' : 'changed'} ${total} declarations`);
if (check && total) process.exit(1);
