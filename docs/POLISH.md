# AGENT_DATA polish log

Shared rules extracted so far (in `src/tokens.css`, "agent state + glass surface layer"):

- `--state-*`: one token per agent meaning (ready, live, think, tool, delegate, wait, ok, warn, error, idle). Every agent surface colours a state the same way.
- `--glass-bg / --glass-blur / --glass-edge / --glass-shadow`: the glass panel recipe used by the capsule and the switcher.
- Every component sets its accent through a local `--c` and derives tints from it with `color-mix()`. The glow is `0 0 Npx color-mix(--c …)`, never a hard-coded rgba.
- Motion uses the theme ease tokens (`--ease-emph`, `--ease-morph`, `--ease-fx`). Open/close is `grid-template-rows: 0fr → 1fr`. Each component honours reduced motion.
- Components must guard against host `p, li` font rules (the DS sets `li { font-size }`), e.g. `.agent-activity li { font-size: inherit }`.

## Batch 1 (shipped)

| Component | Picked | API changes |
|---|---|---|
| AgentPresence | 1b · Ring dial | + `showLabel`, `AGENT_PRESENCE_LABEL`, `data-state` |
| AgentActivityCapsule | 1e · Ring card | + `status`, `expanded`/`defaultExpanded`/`onExpandedChange`, `steps` ({label,status,meta}), `elapsed`, `onApprove/onInspect/onCancel`; progress 0–1. Legacy `state`/`details` still mapped. |
| GenerativePlaceholder | 1i · Construct | all 7 variants implemented; + `label` |
| ContextSwitcher | 1j · Glass dropdown | options accept `{value,label,description,meta}`; + `label`; keyboard nav |

Files to push: `src/tokens.css`, `src/components/{AgentPresence,AgentActivityCapsule,GenerativePlaceholder,ContextSwitcher}.{tsx,css,stories.tsx}`, `test/agent-data-polish.test.tsx`.

The candidate options live in `explore/agent-data/` (not part of the package).

## Batch 2 (shipped)

| Component | Picked | API changes |
|---|---|---|
| MultimodalComposer | 2a · Glass capsule | + `defaultAttachments`, `defaultVoiceMode`; attachment chips with type tiles; voice mode uses AgentPresence |
| MetricSparkline | 2e · Inline row | + `invert`, `period`; computed delta; hover scrub. Single-point path is now a flat line at the padded width (test updated). |
| TokenPills | 2g · Glass chips | options + `count`, `disabled`; roving tab stop on first selected; dropped `data-chip`/`data-solid` (kept `data-on`) |
| CodeDiffViewer | 2k · Split view | + `view` (default **split**), `hideViewToggle`, `className`; hunk context text; +/− stats. Legacy `cdv-row-*`, `cdv-line-num`, `cdv-error` hooks kept (tests updated to pass `view="unified"`). |

Files to push: `src/components/{MultimodalComposer,MetricSparkline,TokenPills,CodeDiffViewer}.{tsx,css,stories.tsx}`, `test/CodeDiffViewer-component.test.tsx`, `test/MetricSparkline-component.test.tsx`, `test/agent-data-polish-batch2.test.tsx`.

Shared rules added: dark scrollbars (`scrollbar-width: thin; scrollbar-color: color-mix(--app-text 20%) transparent`) on every scroll area; numeric text uses `tabular-nums`.

## Batch 1 compatibility fix (2026-10-03)
Checked against the repo's existing tests and restored their contracts: AgentPresence aria-label is `label ?? "Agent is {state}"`; capsule tool count renders as plain `"{n} tools"` text.

## Batch 3 (shipped) — AGENT_DATA complete

| Component | Picked | Changes |
|---|---|---|
| AgentActivityHeatmap | 3b · Dot matrix | + `title`; true weekday-aligned calendar (gaps respected), headline follows hover, weekly-total bars, Enter selects, ←/→ jump a week. Cell/aria/button contract unchanged. |
| FluidWorkspaceBoard | 3e · Accent tiles | Styling. **Bug fix:** drag no longer teleports inside transformed/scrolled hosts (fixed-position origin corrected) and keeps its width. |
| AdaptiveBento | 3h · Hero aurora + 3g hover | Styling; every tile lifts with an edge-light + accent glow on hover. |
| ArchiveCollection | 3j · Timeline | + `selectedId`, `className`; per-month counts. data-archive-* hooks + order unchanged. |
| PanelDestinationTransition | 3o · Wireframe trace | + `className`; default duration d3. **Bug fix:** ghost positioned inside the slot (was position:fixed), so it lands correctly in transformed/scrolled hosts. |

Files to push: `src/components/{AgentActivityHeatmap,FluidWorkspaceBoard,AdaptiveBento,ArchiveCollection,PanelDestinationTransition}.{tsx,css}` (+ Heatmap/Archive/Panel stories), `test/agent-data-polish-batch3.test.tsx`.

## AGENT_OPS (shipped, one batch of 15)

Shared logic for all 15 lives in `src/components/agentOps.shared.tsx` (hooks + helpers, not exported from the index). Every component keeps its original props and `data-*` hooks, and re-exports its prop types. Each stylesheet opens with a small `:where(.root)` reset so the host primitives for `[data-status]`, `[data-state]` and `[data-empty]` don't bleed in.

| Component | Picked | Changes |
|---|---|---|
| CommandPalette | 1a · Glass spotlight | + `className`; match highlighting, wrap-around ↑↓, combobox aria, focus with preventScroll |
| ToolCallCard | 2a · Glass status | + `expanded`/`onExpandedChange`, `className`; human durations, tinted JSON, aria-expanded |
| StreamingMessage | 3b · Document | + `label`, `className`. **Fix:** caret trails the last line; open fences render as code mid-stream |
| ModelSelector | 4b · Spec sheet | + `defaultOpen`, `className`; arrows skip disabled + wrap, Tab closes, list scroll doesn't move the page |
| ContextMeter | 5a · Glow bar | + `breakdown`, `className`; thresholds unchanged |
| ApprovalGate | 6a · Glass gate | + `className`. **Fix:** resolved outcome is shown |
| RunTimeline | 7a · Glow rail | + `now`, `title`, `className`; per-step + total durations |
| DiffStatPill | 8a · Glass pill | + `className`; dir/basename split |
| AgentCard | 9a · Glass card | + `className`; initials fallback avatar |
| ApprovalInbox | 10b · Dense table | + `title`, `className`; exit animation before callbacks; risk counts |
| PlanChecklist | 11b · Segmented | segmented progress header, state tags |
| CostMeter | 12b · Readout | + `warnAt` (default 0.8) |
| EvalScoreCard | 13b · Delta table | target met/missed, ±delta, verdict |
| HandoffCard | 14a · Glass handoff | + `from` |
| AuditLogViewer | 15a · Glass timeline | level chips, styled empty state |

Files to push: `src/components/agentOps.shared.tsx`, `src/components/{CommandPalette,ToolCallCard,StreamingMessage,ModelSelector,ContextMeter,ApprovalGate,RunTimeline,DiffStatPill,AgentCard,ApprovalInbox,PlanChecklist,CostMeter,EvalScoreCard,HandoffCard,AuditLogViewer}.{tsx,css}`, `test/agent-ops-polish.test.tsx`. Candidates stay in `explore/agent-ops/`.

## RAG_ANSWER (shipped, lane B across the board)

Shared logic lives in `src/components/ragAnswer.shared.tsx` (hooks + helpers, not exported from the index). Same rules as AGENT_OPS: original props and `data-*` hooks kept, prop types re-exported, `:where(.root)` host-primitive reset in every stylesheet. All nine use the structured lane: rules, rows and tables instead of cards, with mono/terminal accents only.

| Component | Picked | Changes |
|---|---|---|
| CitationPills | 1b · Bracket refs | + `Citation.title` (tooltip + aria-label); arrow-key roving |
| SourceCardList | 2b · Ruled index | **Fix:** Open link no longer nested in the row button; url host shown; arrow-key roving |
| RetrievalInspector | 3b · Ranked table | + `title`, `defaultExpanded`; buttons with aria-expanded replace `<details>`; threshold cut line; dept column hides in narrow hosts |
| GroundingBadge | 4b · Tag + ticks | + `cited` / `total` (detail derived when omitted) |
| StreamingStageIndicator | 5b · Ruled stepper | + `doneLabel` (settled receipt; omit to keep render-nothing); aria-live polite |
| ContextAttributionList | 6b · Ledger table | + `title`; rows sorted by tokens, share %, warn ≥80% / danger ≥95% of budget |
| AnswerFeedback | 7b · Ruled form | + `prompt`; re-click clears rating; reason count on send; receipt echoes submission |
| FollowUpChips | 8b · Prompt rows | arrow / Home / End roving |
| VariablePromptInput | 9b · Ruled form | Run disabled until all slots filled; filled vs missing marks in preview |

Files to push: `src/components/ragAnswer.shared.tsx`, `src/components/{CitationPills,SourceCardList,RetrievalInspector,GroundingBadge,StreamingStageIndicator,ContextAttributionList,AnswerFeedback,FollowUpChips,VariablePromptInput}.{tsx,css}`, `src/components/{GroundingBadge,StreamingStageIndicator}.stories.tsx`, `test/rag-answer-polish.test.tsx`. Candidates stay in `explore/rag-answer/`.

## MEDIA_LIBRARY (shipped, lane A / glass across the board)

Shared primitives live in `src/components/mediaLibrary.shared.tsx` + `mediaLibrary.shared.css` (not exported from the index directly — helpers are re-exported via the individual components). CSS pattern: every component roots under `.ml` which resets the theme vars, sets `--c` as the local accent, and derives tints with `color-mix()`. `:where()` primitives keep specificity at zero so hosts can override freely.

**Rules kept from HANDOFF spec:**
- `item` accepts `MediaItem`; adapters (`fromJellyfin`) produce it from raw server responses. `<Art>` is used for all artwork with fallback chains.
- Accent resolution order: `item.accent → blurhash average → CSS custom property cascade`.
- `MediaTheme` wraps the player shell; theme audio is muted by default.
- No `data-status` / `data-state` / `data-empty` on component elements (only on sub-elements like queue rows). No `scrollIntoView`, no emoji.

### Browse group (8 components)

| Component | Notes |
|---|---|
| MediaArtwork | `<Art>` wrapper with blurhash placeholder + accent extraction via `useAccent` |
| PosterCard | `onPlayedChange(v, item)` + `onFavoriteChange(v, item)`; poster → landscape shape toggle |
| MediaShelf | Horizontal scroll shelf with keyboard roving; shows `<PosterCard>` grid |
| MediaHero | Full-bleed hero with accent-derived gradient overlay |
| EpisodeList | Season tabs with `{ id, name, episodes }` shape; nextUp auto-derived from first unplayed ep |
| CastStrip | Horizontal scroll strip of cast members |
| MediaInfoBadges | Resolution / HDR / audio codec badges |
| LibraryGrid | Virtualised grid; alpha-index strip shown automatically when `sort === 'title'` |

### Playback group (4 components)

| Component | Notes |
|---|---|
| PlayerScrubber | Chapter markers, skip-segment callback, `jellyfinTrickplay` helper exported |
| TrackPicker | Audio / subtitle / quality tabs; `tracksFromItem(item)` helper exported; `TrackSelection` is index-based |
| NowPlayingBar | Mini-player bar with progress |
| AlbumTrackList | Disc-grouped track list with play state |

### Server group (8 components)

| Component | Notes |
|---|---|
| CollectionTile | Library tile with item count badge |
| ActiveSessions | Live session list with transcoding/direct-play chips; `Session` type exported |
| LibraryScanStatus | Scan progress with per-library status chips |
| ArtworkPicker | Image picker with drag-and-drop upload |
| IdentifyMatch | Search + match flow for metadata identification |
| ProfilePicker | User/profile switcher grid |
| RequestCard | Media request card with status badge; `ReqStatus` / `MediaRequest` types exported |
| LiveTvGuide | Time-grid EPG; `Channel` / `Program` types exported |

### Acquire group (4 components)

| Component | Notes |
|---|---|
| ArrItemStatus | Sonarr/Radarr item status with season/episode breakdown; `ArrSeason` / `EpState` / `MovieState` types exported |
| DownloadQueue | Download queue with per-row `data-queue-state` (not `data-state`); `fmtB` / `QueueItem` / `QState` exported |
| ReleaseCalendar | Monthly calendar of upcoming releases; `CalItem` / `CalState` exported |
| IndexerHealth | Indexer health dashboard with RSS/search/interactive test chips; `Service` / `Health` exported |

Files shipped: `src/components/mediaLibrary.shared.{tsx,css}`, `src/components/__fixtures__/mediaLibrary.ts`, `src/components/{MediaArtwork,PosterCard,MediaShelf,MediaHero,EpisodeList,CastStrip,MediaInfoBadges,LibraryGrid,PlayerScrubber,TrackPicker,NowPlayingBar,AlbumTrackList,CollectionTile,ActiveSessions,LibraryScanStatus,ArtworkPicker,IdentifyMatch,ProfilePicker,RequestCard,LiveTvGuide,ArrItemStatus,DownloadQueue,ReleaseCalendar,IndexerHealth}.{tsx,css,stories.tsx}`, `test/media-library.test.tsx`. Reference files deleted from `media-library/`.

## Accessibility pass (axe, 2026-10-04)

`pnpm test:a11y` runs axe (WCAG 2.1 A/AA + best-practice) on every story; serious and critical violations fail. The first run failed 114 of 397 stories. All of them now pass.

- **Contrast (92 stories).** Unstyled form controls in `frame.css` were light-on-light. `--color-success`/`--color-error` were lifted to `#27c07a`/`#f27373`. `--on-accent` is now the frame ground (dark ink on bright fills). Accent-coloured small text mixes 60/40 toward ink. "Past" states desaturate instead of dropping opacity.
- **ARIA structure.**
  - AgentActivityHeatmap gridcells are grouped into week rows (`display: contents`).
  - LiveTvGuide rows sit in a `table`.
  - ArtworkPicker's listbox holds only options.
  - StatusRowList rows are `listitem` only inside a labelled list.
  - Tabs set `aria-controls` only when a panel exists.
  - FileDropzone's file input is no longer nested in its `role="button"`.
  - RetrievalInspector's threshold marker is a real list item.
- **Names.**
  - TextFlip, TextMorphing and TextBlurReveal take `role="img"` when rendered as a span or div (headings keep their role).
  - ApprovalInbox risk flags and ThreadList dots are `role="img"`.
  - The TactileKeyboardShowcase space bar is named "Space".
- **Scrollable regions** (BloomSheet, ColorArchiveScroll, OrbitalCarousel fallback, PerspectiveMarquee rows) are keyboard-focusable.

## Catalog review pass (2026-10-04)

Every story screenshot was reviewed with realistic data, and the fixes are now locked in by the visual baselines. These were the systemic findings:

- **Missing primitives layer.** The Ladle catalog never loaded `primitives.css`, so every component built on primitives rendered unstyled in the catalog. The catalog now loads it, as `styles.css` does.
- **Primitive name collisions.** `[data-tip]` (Tooltip) and `[data-slider]` (Slider) are wrapper hooks here, but the primitives layer styles those names as the bubble and the range input. Each is now reset in its own component stylesheet.
- **Missing shared CSS import.** IndexerHealth, DownloadQueue and LibraryScanStatus used `.ml-*` classes without importing `mediaLibrary.shared`.
- **Global CSS leak.** Six Features stylesheets shipped a global reduced-motion `*` rule. It has been removed, since `frame.css` already scopes reduced motion.

There were about 60 component-level fixes. They are grouped below; see the commit log for details.

- **Text effects**
  - LineFillText fits its viewBox to the text.
  - SplitFlapDisplay halves now split a single glyph.
  - TextPath gains an optional `fit` prop.
  - TextChromaReveal, TextRipple and TextWordFlip now inherit type and sit on the baseline.
- **Data views**
  - AgentTopologyView paints immediately and fits its rings to the canvas.
  - LineChart dots stay round.
  - Stepper connectors are fixed, and the DonutChart legend sits beside its chart.
  - The ToolCallCard `+N` chip is visible.
  - `initials()` ignores parenthetical text.
- **Media**
  - ParticleImage draws a static frame under reduced motion.
  - The backdrop components isolate their parent.
  - SwipeDeck and CardDeckReveal stack their cards correctly.
  - KeyboardShowcase has a correct ISO layout.
  - LiveTvGuide uses one channel-width value throughout.
  - LibraryGrid's select is styled.
- **Features and forms**
  - AttachmentPreviewPanel infers the MIME type and shows an image-error state.
  - SandboxedContentFrame has a visible surface.
  - SasVerificationPanel layout is fixed.
  - StatusRowList link titles render as links.
  - New optional props: MorphWizard `validationMessage`, PricingTierCard `toggleLabel`, and MarkdownNoteEditor `listEmptyTitle` / `listEmptyHint`.
- **Stories.** Stories that showed nothing, or contradicted themselves, now demonstrate their component: MentionAutocomplete, MessageTimeline, SkeletonWrapper, Button loading, Select error, NavigationRail, RunTimeline and CodeDiffViewer.
