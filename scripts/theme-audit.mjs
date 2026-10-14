#!/usr/bin/env node
/* Theme completeness audit.
 *
 * Parses src/tokens.css for every color-valued custom property, parses
 * src/components/*.css (+ src/primitives.css + src/frame.css) for var(--x)
 * consumption, and lists color tokens that components consume but a given
 * theme block in src/themes.css does not override.
 *
 * Usage:
 *   node scripts/theme-audit.mjs            # audit every theme block
 *   node scripts/theme-audit.mjs lively-sage
 */

import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const SRC = path.join(root, "src");

const COLOR_RE = /(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|color-mix\(|oklch\(|oklab\(|\bvar\(--[a-z0-9-]+\))/i;

/** Split a declaration value into top-level chunks (respect nesting parens). */
function splitTop(value) {
  const parts = [];
  let depth = 0;
  let cur = "";
  for (const ch of value) {
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (ch === "," && depth === 0) {
      parts.push(cur);
      cur = "";
    } else cur += ch;
  }
  if (cur.trim()) parts.push(cur);
  return parts.map((p) => p.trim());
}

function hasDirectColor(value) {
  const v = value.trim();
  if (/^(transparent|currentcolor)$/i.test(v)) return true;
  return /(#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(|color-mix\(|oklch\(|oklab\()/i.test(v);
}

function parseDeclarations(cssText, collector) {
  // Strip comments
  const css = cssText.replace(/\/\*[\s\S]*?\*\//g, "");
  // Match `--name: value;` declarations (no nesting in our CSS files)
  const declRe = /(--[a-z0-9-]+)\s*:\s*([^;{}]+);/gi;
  let m;
  while ((m = declRe.exec(css))) collector(m[1].toLowerCase(), m[2].trim(), css, m.index);
}

function read(p) {
  return readFileSync(p, "utf8");
}

// ── 1. Token declarations ────────────────────────────────────────────────────
const tokenValues = new Map(); // name -> Set of raw values
const tokenFiles = ["tokens.css"];
for (const f of tokenFiles) {
  parseDeclarations(read(path.join(SRC, f)), (name, value) => {
    if (!tokenValues.has(name)) tokenValues.set(name, new Set());
    tokenValues.get(name).add(value);
  });
}

const colorTokens = new Map(); // name -> Set of values (color-valued only)
for (const [name, values] of tokenValues) {
  for (const v of values) {
    if (hasDirectColor(v)) {
      if (!colorTokens.has(name)) colorTokens.set(name, new Set());
      colorTokens.get(name).add(v);
    }
  }
}
// Propagate color-ness through custom-property aliases (including shadows and
// color-mix values such as --glass-bg and elevation tokens).
let changed = true;
while (changed) {
  changed = false;
  for (const [name, values] of tokenValues) {
    if (colorTokens.has(name)) continue;
    for (const v of values) {
      const refs = [...v.matchAll(/var\(\s*(--[a-z0-9-]+)/gi)].map((m) => m[1].toLowerCase());
      if (refs.some((ref) => colorTokens.has(ref))) {
        colorTokens.set(name, new Set(values));
        changed = true;
        break;
      }
    }
  }
}

// ── 2. Consumption ──────────────────────────────────────────────────────────
const consumed = new Map(); // token -> Set of files
const consumeFiles = [
  ...readdirSync(path.join(SRC, "components"))
    .filter((f) => f.endsWith(".css"))
    .map((f) => path.join(SRC, "components", f)),
  path.join(SRC, "primitives.css"),
  path.join(SRC, "frame.css"),
];
const varRe = /var\(\s*(--[a-z0-9-]+)/gi;
for (const file of consumeFiles) {
  const css = read(file);
  let m;
  while ((m = varRe.exec(css))) {
    const name = m[1].toLowerCase();
    if (!consumed.has(name)) consumed.set(name, new Set());
    consumed.get(name).add(path.relative(root, file));
  }
}

// Also count consumption inside tokens.css itself (alias re-resolution etc.)
const consumedInTokens = new Set();
{
  const css = read(path.join(SRC, "tokens.css"));
  let m;
  const re = /var\(\s*(--[a-z0-9-]+)/gi;
  while ((m = re.exec(css))) consumedInTokens.add(m[1].toLowerCase());
}

// ── 3. Theme blocks ─────────────────────────────────────────────────────────
const themesCss = read(path.join(SRC, "themes.css"));
const themeBlocks = new Map(); // theme -> Set of overridden token names
const blockRe = /\.morph-frame\[data-theme="([^"]+)"\]\s*\{([^}]*)\}/g;
let bm;
while ((bm = blockRe.exec(themesCss))) {
  const theme = bm[1];
  const overrides = new Set();
  parseDeclarations(bm[2], (name) => overrides.add(name));
  // theme blocks also re-set color-scheme which is not a custom property
  const cs = /color-scheme\s*:/i.test(bm[2]);
  themeBlocks.set(theme, { overrides, colorScheme: cs });
}

// ── 4. Report ───────────────────────────────────────────────────────────────
function isNavy(value) {
  return /rgba?\(\s*(150\s*,\s*175\s*,\s*255|34\s*,\s*46\s*,\s*112|4\s*,\s*7\s*,\s*30|6\s*,\s*8\s*,\s*32|27\s*,\s*37\s*,\s*92|108\s*,\s*156\s*,\s*240|80\s*,\s*137\s*,\s*236|2\s*,\s*4\s*,\s*20|4\s*,\s*18\s*,\s*58)\b/i.test(
    value,
  );
}

const onlyArg = process.argv[2];
const themes = onlyArg ? [onlyArg] : [...themeBlocks.keys()];

let worst = 0;
for (const theme of themes) {
  const block = themeBlocks.get(theme);
  if (!block) {
    console.error(`No theme block "${theme}" in src/themes.css`);
    process.exit(2);
  }
  const missing = [];
  for (const [token, files] of consumed) {
    if (!colorTokens.has(token)) continue; // not a color token
    if (block.overrides.has(token)) continue; // overridden in this theme
    const values = [...colorTokens.get(token)];
    missing.push({ token, files: [...files], values });
  }
  // Navy-valued tokens that ARE overridden or not consumed still matter for
  // the sweep; but the "missing" list is the actionable audit output.
  console.log(`\n=== ${theme}: ${block.overrides.size} overrides, ${missing.length} consumed color tokens not overridden ===`);
  for (const { token, values } of missing.sort((a, b) => a.token.localeCompare(b.token))) {
    console.log(`  ${token}  =  ${values.join(" | ")}`);
  }
  worst = Math.max(worst, missing.length);

  const navyLeft = [];
  for (const name of block.overrides) {
    for (const v of tokenValues.get(name) ?? []) {
      // overridden, so fine
    }
  }
}

// Navy literals remaining in tokens.css base values of missing tokens
console.log("\n=== Navy-valued base tokens among the missing (per theme) ===");
for (const theme of themes) {
  const block = themeBlocks.get(theme);
  const navyMissing = [];
  for (const [token] of consumed) {
    if (!colorTokens.has(token)) continue;
    if (block.overrides.has(token)) continue;
    for (const v of colorTokens.get(token)) if (isNavy(v)) navyMissing.push(token);
  }
  console.log(`  ${theme}: ${navyMissing.length ? navyMissing.join(", ") : "(none)"}`);
}

// ── 5. Hard-coded navy literals in component CSS ────────────────────────────
const NAVY_LITERAL_RE =
  /rgba?\(\s*150\s*,\s*175\s*,\s*255\s*,|rgba?\(\s*34\s*,\s*46\s*,\s*112\s*,|rgba?\(\s*4\s*,\s*7\s*,\s*30\s*,|rgba?\(\s*6\s*,\s*8\s*,\s*32\s*,/gi;
console.log("\n=== Hard-coded navy literals in src/components/*.css (+ primitives/frame) ===");
let literalHits = 0;
for (const file of consumeFiles) {
  const rel = path.relative(root, file);
  const css = read(file);
  const stripped = css.replace(/\/\*[\s\S]*?\*\//g, "");
  let m;
  NAVY_LITERAL_RE.lastIndex = 0;
  while ((m = NAVY_LITERAL_RE.exec(stripped))) {
    const line = stripped.slice(0, m.index).split("\n").length;
    console.log(`  ${rel}:${line}: ${m[0]}`);
    literalHits++;
  }
}
if (!literalHits) console.log("  (none)");

// Export for the test (when imported as a module)
export function audit() {
  const result = {};
  for (const [theme, block] of themeBlocks) {
    result[theme] = {
      overrideCount: block.overrides.size,
      missing: [...consumed.keys()]
        .filter((t) => colorTokens.has(t) && !block.overrides.has(t))
        .sort(),
    };
  }
  return result;
}
