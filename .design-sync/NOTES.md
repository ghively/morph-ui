# design-sync notes — @ghively/morph-ui

## Source shape and build

- The repo uses **Ladle** (`.ladle/`, `*.stories.tsx`), not Storybook, so the sync runs on the **package** shape (`"shape": "package"`). The component list comes from the `dist/` `.d.ts` exports.
- Build input is the prebuilt library: `--entry ./dist/morph-ui.js --node-modules ./node_modules`. `cssEntry` is `dist/morph-ui.css`, which bundles tokens.css, frame.css, primitives.css and all component CSS. Run `pnpm build` before re-syncing, because the converter consumes `dist/` exactly as it is on disk.
- Grouping comes from the forked `.design-sync/overrides/source-kit.mjs`, declared in `libOverrides`. It groups components by the README component table. Without it the package shape puts everything into one flat `general` group.
- Playwright 1.56.1 is staged in `.ds-sync/`. It matches the cached Chromium build.

## Provider

- **`MorphRoot` is required** (`cfg.provider = {component: "MorphRoot", props: {padding: 16}}`). Every primitive and component style is scoped under `:where(.morph-frame,[data-morph-frame])`. Without a MorphRoot ancestor, components render unstyled on a browser-default white surface.

## Previews

- The 81 authored previews in `.design-sync/previews/` are **ported from `src/components/*.stories.tsx`**. Their story compositions were adapted to import the real components via relative imports and were sanity-checked against the emitted `.d.ts`. When a Ladle story changes, the matching preview does not follow automatically.
- Native `<button>`s inside the frame render as blank light boxes. Previews must use the library `Button`.
- `AppFrame` is `height: 100dvh` by default. Previews that wrap content in it need `style={{height:'auto', minHeight:0}}`.
- `position: fixed` surfaces (ModalSurface scrim, ToastStack `[data-osd]`) have to be hosted in a transformed container (`transform: translateZ(0)`) to stay inside the card.
- BloomSheet and DropdownMenu have no `open`/`defaultOpen`, so their previews click their own trigger on mount (with a ref guard against StrictMode double effects). CommandPalette and ConfirmDialog accept `open`.
- Tooltip is shown only on hover or focus. The preview focuses the first trigger on mount and passes `content` as a node (see the collision below).
- AgentTopologyView: there is a blank-canvas race, so the preview re-passes a fresh `nodes` array after about 250ms. `maxHeight` is 540 (320 for the 4-node pipeline) because the ring radii are fixed at 80/160/240px. The paused variant runs a few animated frames before it pauses.
- ConfettiCannon renders nothing until `fire()` runs, so the preview fires staggered bursts on mount and the capture is timing-dependent.
- The capture runs about 0.5–1s after `networkidle`, so long CSS animations are caught mid-flight. TextRipple, TextWordFlip, TextFlip, TextMorphing and TextGlitch are legible in every frame and are accepted as-is.

## Checkbox / RadioGroup collision (fixed 2026-10-04)

- `src/primitives.css` used to carry ChatUIMorph's own `[data-checkbox]` / `[data-radio]` rules (custom button controls), which restyled the Checkbox and RadioGroup wrappers (labels wrapped per word, phantom radio dot, horizontal stacking). Those 18 selectors were removed; `test/primitives-collisions.test.ts` guards it. Both components are back in the sync. If primitives.css is ever regenerated, keep those selectors out.

## Library API inconsistencies found while grading (src, not fixable in previews)

- **ToggleSwitch** uses `on`, not `checked`. **Select** requires `id`.
- **Tooltip** `data-tip="<string>"` collides with the frame's `[data-tip]` rule, which paints the trigger as a light box. `[data-tipbody]` ignores `placement` (it is always on top) and has no `max-content` width.
- **ToastStack** `[data-osd]`: the frame CSS gives `top:56px; bottom:auto`, and the component CSS `bottom: var(--s6)` wins, so the drawer stretches to the viewport bottom.
- **AlertBanner** danger uses `--color-error-bg: #fde8e8`, a light-theme value that shows as a bright pink bar on the dark frame.
- **AppFrame** (non-bare) has no public slot API. Children must provide `data-dockzone` / `data-inner` > `data-pane` / `data-edgezone` themselves.
- **PaneHeader**: the default ornament renders as a near-black gear, and with no `ornament`/`onBack` it renders an empty 20px `[data-mark]`. `actions[].shortLabel` is `ReactNode` in src but `string` in the shipped d.ts.
- **FormField** expects the child input to carry `data-field`. A bare `<input>` renders white and browser-default.
- **MentionAutocomplete** does not filter candidates itself (use `rankMentionCandidates`), returns `null` for zero candidates, and is absolutely positioned against the nearest positioned ancestor.
- **ModalSurface**: the default `height` stretches the panel, so use `height="auto"` for dialogs.
- **LineFillText**: the fixed 800x200 viewBox overflows strings longer than about 12 characters. The `--app-line` stroke is nearly invisible on navy.
- **TextChromaReveal** `reveal={false}` is fully invisible, not scattered.
- **ThemeTokens**: the primary Button does not pick up an `--app-blue` override, while other components do.
- **SettingRule** renders a transparent 6px spacer, not a visible rule.
- **d.ts**: `CardDeckRevealProps.cards: ReactNode[]` and `CSSProperties` are unqualified (missing `React.`). The emitted `ButtonProps` leaves out the inherited button attributes (`onClick`, `type`).

## Known render warns

- `[RENDER_THIN] CardDeckReveal: variants render identically`: AutoAdvancing differs from Default only over time, which a static capture can't show.
- `[RENDER_THIN] ParticleImage: variants render identically`: the variants differ only in particle motion and timing. Each still frame is a legitimate render.
- `[GRID_OVERFLOW]` is resolved with `cfg.overrides` and should not re-flag. These are presentation-only, so the grades carried:
  - `cardMode: "column"`: AgentCard, CardDeckReveal (wide stories).
  - `cardMode: "single"` + `primaryStory`, for fixed/portal overlays: BloomSheet (Default), CommandPalette (Default), ModalSurface (CenterDialog), ToastStack (Interactive), ConfirmDialog (Danger). The escape flag on these was intermittent between runs because of overlay timing, so all of them are pinned to single.

## Re-sync risks

- **Previews are ported from Ladle stories** (`src/components/*.stories.tsx`) and import components by relative path (`../../src/components/X`). They drift silently when stories or props change. The grades follow the preview `.tsx`, not the story, so a renamed or removed prop shows up only as a compile failure (`! preview build failed`, which drops the card to the floor) or a broken capture.
- **Preview workarounds tied to library bugs** (Tooltip node `content`, the AgentTopologyView `nodes` re-pass, the open-on-mount clicks for BloomSheet/DropdownMenu, the transformed wrappers for fixed overlays): once the library fixes these, the workarounds may become unnecessary or start to misrender. Recheck those sheets.
- **JetBrains Mono** was removed from `--app-mono` (2026-10-04): it was an unbundled mid-stack fallback. `[FONT_MISSING]` should no longer fire; if it does, a new family was added somewhere.
- **dist/ must be rebuilt** with `pnpm build` before re-sync, because the converter consumes `dist/morph-ui.js` and `dist/morph-ui.css` exactly as they are on disk. The first sync ran against a dist/ built while the library was being edited in a separate worktree, so expect a large diff on the next run.
- **`conventions.md`** names real tokens and props. Re-validate it against each fresh build, especially the `ToggleSwitch` `on`, the required `id`s and the claim that native attributes are forwarded. The emitted `.d.ts` currently drops inherited HTML attributes.
- `source-kit.mjs` fork: diff it against the bundled `lib/source-kit.mjs` on every re-sync. Grouping follows the README component table, so a component missing from that table lands in a default group.
- **Partially verified:** 129 unscoped components were checked only by the render check (37 show the floor card). Only 79 have graded authored previews.

## Preview authoring gotchas (2026-10-04 regrade)

- Capture is viewport-only (900x700 minus padding); taller previews are silently clipped at the bottom. Cap preview size (AgentTopologyView maxHeight ~515-520, PosterCard maxWidth 680).
- FormField: `primitives.css` hides `[data-formfield]:has([aria-invalid="true"]) > [data-hint]`, so an invalid field's message must be a `[data-error]` child.
- SidePanel's `[data-leftpanel]` is absolutely positioned; the preview host must be `position: relative`.
- Interaction-only states (Button `loading` on click) never capture; render the state statically next to the interactive control.
- TextMorphing renders inline (wrap neighbours in a block); TextWordFlip needs `line-height: 1.2` on the host line.
- Before blaming a library change for a visual flaw, diff the sheet against a pre-change baseline (`cp -r ds-bundle/_screenshots .design-sync/.cache/baseline` before the change).

## Library fixes made from regrade findings (2026-10-04)

- HeroPanel.css was entirely unscoped: its `[data-mark]`, `[data-enter]`, `[data-empty]`… rules leaked into every component (black tiled brand marks in AppFrame/PaneHeader/NavigationRail, MessageComposer's offline dot stacked). Now scoped under `.hero-panel`.
- ModalSurface `placement="center"` no longer borrows the bottom sheet's `data-sheet` (square bottom) and gets padding.
- Tooltip body gets `width: max-content` (was wrapping word by word).
- `--color-success-*` / `--color-error-*` are translucent on the dark frame with light inks, matching warning/info.
- BarChart bars sit in a shared-height track, so they share the axis baseline; values ride on top of each bar.

