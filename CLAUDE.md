# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@ghively/morph-ui` is a React 19 component library extracted from ChatUIMorph. The components are concept-reference designs and must not depend on ChatUIMorph app code. It ships as an ESM library plus one CSS bundle, with a Ladle story catalog.

## Commands (pnpm)

```bash
pnpm install
pnpm build          # tsc --noEmit && vite build → dist/morph-ui.js + dist/morph-ui.css
pnpm test           # vitest run (jsdom, setup in test/setup.ts)
pnpm lint           # eslint . + lint:css
pnpm lint:css       # stylelint (token colours) + scripts/snap-to-scale.mjs --check (size scales)
pnpm typecheck      # tsc --noEmit (covers src/ and test/)
pnpm catalog        # Ladle dev server for *.stories.tsx
pnpm catalog:build  # static catalog → catalog-dist/
pnpm test:visual    # catalog:build + Playwright screenshot of every story vs e2e/__screenshots__/
pnpm test:a11y      # catalog:build + axe over every story (serious/critical fail)

pnpm vitest run test/Button-component.test.tsx   # single file
pnpm vitest run -t "renders loading state"       # single test by name
pnpm exec playwright test e2e/visual.spec.ts -g "button--"   # visual subset (needs catalog-dist/)
pnpm exec playwright test e2e/visual.spec.ts -g "button--" --update-snapshots   # accept an intended change
```

Nothing lands on main unless all four gates pass: `pnpm build && pnpm test && pnpm lint && pnpm typecheck`. CI (`.github/workflows/ci.yml`) also runs the visual and a11y suites.

**Visual baselines.** `e2e/prepare.ts` makes each story deterministic: remote requests are blocked, the page clock is frozen at 2026-03-12 10:30 (timer-driven demos stay on their first frame), and fonts and images settle before capture. Comparison is pixel-exact, so any visual change to a component fails until you re-run with `--update-snapshots` and commit the new PNGs alongside the change. Baselines come from Ubuntu 24.04 + Playwright 1.56.1 Chromium; if CI renders differently, run the CI workflow manually with `update_snapshots` and commit its `visual-baselines` artifact. Stories that can't be made deterministic go in `NONDETERMINISTIC` in `e2e/stories.ts` (still checked for page errors and a11y).

## Architecture

**Components.** Every component lives in `src/components/` as `X.tsx` + `X.css` + `X.stories.tsx`. The component imports its own CSS. To publish a component, add `export * from "./components/X"` to `src/index.ts` under the matching group comment. `ComponentGallery.tsx` and `RagDashboardDemo.tsx` are demo surfaces and are not exported.

**Shared helpers per group.** Each polished group keeps its common hooks and helpers in a `*.shared.tsx` file: `agentOps`, `ragAnswer`, `forms`, `layout` and `mediaLibrary` (`mediaLibrary` also has a `.shared.css`). These files are not exported from the index. Components re-export their prop types from them, for example `export type { ButtonProps } from './forms.shared'`. The shared files also import from each other (`forms.shared` pulls from `agentOps.shared` and `ragAnswer.shared`), so check for an existing helper before you write a new one.

**CSS layers.** `src/index.ts` imports these in order, and they all end up in `dist/morph-ui.css`:
1. `tokens.css`: the source of truth for every custom property. It has five layers: app, app-frame, the `--morph-*` alias namespace, primitive-layer tokens and component-scoped tokens. It ends with an alias re-resolution block on `:where(.morph-frame, [data-morph-frame])`, which lets a single frame be themed, not just `:root`. See `docs/extraction.md`.
2. `frame.css`: the opt-in base surface and type. It only applies under `.morph-frame` / `[data-morph-frame]`.
3. `primitives.css`: the generated `[data-btn]` / `[data-chip]` / `[data-tile]` / `[data-row]` / … attribute layer, carried over from ChatUIMorph `app.css`. It is frame-scoped through `:where()`, so it adds zero specificity. A component that emits these attributes renders unstyled unless a `.morph-frame` ancestor is present.

**Component CSS conventions** (from `docs/POLISH.md`):
- Use tokens, never hard-coded colours. Each component sets a local accent `--c` and derives tints and glows from it with `color-mix()`. `stylelint.config.mjs` enforces this on colour properties (pure black/white alpha is allowed for scrims and sheens; named skins like the keyboards and media artwork are exempt).
- Sizes come from the scales in `tokens.css`: type `--t-2xs … --t-hero`, radius `--r-2xs … --r-xl` / `--r-pill`, spacing `--s0 … --s11`. `node scripts/snap-to-scale.mjs` rewrites stray px values onto them; its `--check` mode is part of `pnpm lint`. Negative offsets and 1px hairlines stay literal.
- Every `tone` prop takes the shared `Tone` from `src/tone.ts` (`neutral | info | success | warn | danger`, aliases normalized by `toTone`). Don't invent a new tone union.
- Agent state colours come from the `--state-*` tokens. Glass surfaces use `--glass-*`. Motion uses `--ease-*` tokens and must respect reduced motion.
- Stylesheets open with a `:where(.root)` reset so the host primitives for `[data-status]`, `[data-state]` and `[data-empty]` and the host `p, li` font rules don't bleed in.
- Per-instance runtime knobs set inline from TSX (`--morph-fill-pct`, `--char-index`, …) are not declared in tokens. Their CSS uses must carry fallbacks.

**API stability.** When you polish or restyle a component, keep its existing props and its `data-*` / class hooks, because tests and consumers target them. Add new props as optional and keep legacy props mapped. Record the shipped changes and their picked variant in `docs/POLISH.md`.

**Tests.** Tests live in `test/`, not next to the components. There are two kinds: `X-component.test.tsx` for a single component and `<group>-polish.test.tsx` for a polish batch. `test/setup.ts` stubs `matchMedia` and the pointer-capture APIs for jsdom. Vitest globals are enabled, but the existing files import from `vitest` explicitly.

**Catalog.** `.ladle/components.tsx` wraps every story in `.morph-frame` and uses its own `vite.ladle.config.ts`. The root config's library build would otherwise break the catalog app build.

## Repo-specific rules

- `docs/extraction-source/` holds reference-only snapshots of ChatUIMorph UI. Never import from it. Convert its components into generic ones under `src/components/`.
- External UI libraries (Wensity etc.) are reference catalogs, not dependencies. Convert the concept and never recreate the source implementation.
- One conceptual component maps to roughly one task or one focused commit series. Never bulk-import many components in a single commit.
- Every new component ships with tests, a story, provenance and green gates.
- `docs/CODE_ISSUES.md` tracks known problems and their fixes. Update it when you fix a problem listed there.
