# Provenance & token contract

Extracted from ChatUIMorph @ b3ca082 (2026-09-20). Files moved verbatim from
`runtime/web/src/components/` and `runtime/web/test/`.

Primitive layer added 2026-10-02: `src/primitives.css` is generated from
ChatUIMorph `src/app.css` (main) — every rule whose selector references a
`data-*` attribute a morph-ui component renders, scoped under
`:where(.morph-frame, [data-morph-frame])`. `:root`/`body`/`html` rules and
app-shell-only selectors were dropped.

## Token contract

`src/tokens.css` is the source of truth. It has five layers:

1. **App** — surfaces, ink, accents, semantic colors, type, geometry, motion.
2. **App-frame** — spacing/radii/type scale, elevation, scrim, series ramp, AI + rail accents.
3. **`--morph-*` component namespace** — aliases onto layers 1–2.
4. **Primitive-layer tokens** — what `primitives.css` reads (`--r-tile`, `--on-sec`, `--code-*`, `--el3..5`, `--loop-*`, …).
5. **Component-scoped tokens** — formerly hard-coded literals (`--morph-term-*`, `--morph-key-*`, `--morph-tooltip-*`, `--morph-handle*`).

Finally an **alias re-resolution** block redeclares every alias on
`:where(.morph-frame, [data-morph-frame])` so theming a frame (not just `:root`)
works.

Per-instance runtime knobs set inline from TSX (`--morph-fill-pct`,
`--morph-tree-depth`, `--spread-*`, `--char-index`, `--shimmer-*`, …) are not
declared; their CSS uses carry fallbacks.

Intentionally literal: named skins — keyboard colorways/finishes,
TextChromaReveal RGB layers, TextGlitch channels, LaptopFrame hardware.

## Deferred to ChatUIMorph (not extracted)

`primitives.tsx` (Avatar etc.) — depends on matrix-js-sdk and app internals
(`../matrix/rooms`, `../matrix/media`). Migrating it requires a
dependency-injection redesign of its props; do it as its own task later, if ever.
