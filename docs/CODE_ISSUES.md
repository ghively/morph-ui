# Code issues — morph-ui

A log of problems found while viewing the library in Claude Design, and how each was fixed.
Fixes were made **in this project's copy of the repo**; push them back (see "Files changed").

Status key: `[x]` fixed · `[~]` partly fixed / intentional · `[ ]` open

Last verified 2026-10-02: all 174 `*.stories.tsx` modules load, and every story renders without throwing. Unit tests were **not run here**; run `pnpm build && pnpm test && pnpm lint && pnpm typecheck` before merging.

---

## P0 — Components rendered unstyled outside ChatUIMorph

- [x] **Host "attribute primitives" were never extracted.**
  - Components emit `[data-btn]`, `[data-chip]`, `[data-tile]`, `[data-row]`, `[data-setrow]`, `[data-panehead]`, `[data-push]`, `[data-ell]`, `[data-hb]`, `[data-railitem]`, … but those rules lived only in ChatUIMorph `src/app.css`. TokenPills, for example, rendered as unreadable white UA buttons.
  - **Fix:** new `src/primitives.css`, generated from ChatUIMorph `src/app.css` (main, 2026-10-02).
    - It holds the 581 rules whose selectors reference a `data-*` attribute that some morph-ui component renders.
    - Every selector is scoped under `:where(.morph-frame, [data-morph-frame])`, so it's opt-in like `frame.css` and adds zero specificity.
    - `:root`, `body`, `html` and app-shell-only rules were dropped. Keyframes and `@property` rules used by the kept rules are hoisted.
    - Imported from `src/index.ts`.
  - The 88 tokens those rules need were added to `tokens.css` as the "primitive-layer tokens" block.
  - The five empty placeholder stylesheets (`DetailsPanel.css`, `GlyphIcon.css`, `PaneHeader.css`, `SettingsPanel.css`, `SidePanel.css`) are now covered by primitives.css. They're left in place as harmless import targets.

- [x] **Inline stub components shadowed the real library components.** All replaced with imports of the real ones:
  - `DirectoryBrowser.tsx`:
    - `ModalSurface`, `SegmentedControl` (was raw radios), `ToggleSwitch` (was raw checkbox), `AlertBanner`, `EmptyState`.
    - The 🔍 emoji glyph became `GlyphIcon name="search"`.
    - Added the required `label` props (`"Browse rooms"`, `"Room source"`, `"Suggested only"`) and `placement="center"`.
  - `CreateGroupDialog.tsx`: `ModalSurface` (`placement="center"`) and `ToggleSwitch`. The bare `[data-alert]` div became `AlertBanner tone="danger"`. Dropped the unused `ReactNode` import.
  - `CredentialSignInForm.tsx`:
    - `HeroPanel` now uses `maxWidth={440}`, per HeroPanel's Login guidance.
    - `FormField`: `htmlFor` became `id`. The server hint now uses FormField's own `probe` and `invalid` props instead of a nested `data-meta`/`data-probe` div.
    - `AlertBanner`: removed the duplicate manual `[data-dot]`.
  - `AttachmentPreviewPanel.tsx`: `EmptyState`, `CodeBlockCard` (which gains the Copy action), and the ✕ glyph became `GlyphIcon name="close"`.
  - `TypingIndicator.tsx`: `InitialsAvatar agent working className="typing-avatar"`.
  - `MessageTile.tsx`:
    - `InitialsAvatar` keeps `className="initials-avatar"` as the test hook.
    - `SystemAlertStub` became `AlertBanner`, with a tone map `ok→info`, `warning→warn`.
    - Removed the dead `.initials-avatar*` sizing rules from MessageTile.css. Receipts overlap now targets `[data-avatar]`.
  - `TabbedListScreen.tsx` and `ModalSurface.tsx`: local `GlyphIcon` became the real `./GlyphIcon`.
  - **Test updated:** `test/DirectoryBrowser-component.test.tsx` now queries `role="switch"`, which the real ToggleSwitch renders, instead of `checkbox`.

- [~] **Emoji in component defaults.** `MessageTile` `DEFAULT_QUICK_REACTIONS` is still emoji, but the `quickReactions` prop already overrides it. Left as is.

## P1 — Correctness

- [x] **Circular import MessageTimeline ↔ MessageTile.**
  - New `src/components/messageFormat.ts` holds `formatTimeLabel` and `formatBytes`. MessageTile and AttachmentPreviewPanel import from it.
  - MessageTimeline and AttachmentPreviewPanel re-export the same binding, so the public API and existing test imports are unchanged.
  - New `test/messageFormat.test.ts` asserts the re-exports are identical.
- [x] **Duplicate public export of `formatBytes`.** Both re-exports now resolve to the single binding in `messageFormat.ts`, so `export *` can't become ambiguous.
- [ ] **`MessageContent.tsx` has its own private `formatBytes`** (`toFixed(1)`, no PB). Left alone because changing the rounding could break `MessageContent-component.test.tsx` ("2 KB"). Consider switching it to `messageFormat` after checking that test.

## P2 — Theme contract

- [x] **Hard-coded colors moved to tokens** (new "component-scoped tokens" block in `tokens.css`):
  - TerminalEmulator → `--morph-term-case`, `-screen`, `-fg`, `-cmd`.
  - TactileKeyboardBoard base keys → `--morph-key-*`.
  - Tooltip → `--morph-tooltip-bg`, `-fg`, `-border`.
  - BeforeAfterCompare handle → `--morph-handle`, `--morph-handle-ink`.
  - PricingTierCard knob → `--knob`.
- [x] **White-on-accent text** (unreadable whenever the accent is light): MagneticButton, MorphWizard, MultimodalComposer send and retry buttons now use `var(--on-accent)`. FollowCursorLabel uses `var(--app-text)`.
- [~] **Intentionally literal**: named skins stay as they are, because the colors *are* the variant. That covers the TactileKeyboardBoard, TactileKeyboardShowcase and KeyboardShowcase colorways and finishes, the TextChromaReveal RGB layers, the TextGlitch channels, the LaptopFrame bezel and the ColorArchiveScroll media backdrop. This is documented in `docs/extraction.md`.
- [x] **Monospace font**: AuditLogViewer, CodeDiffViewer, ShortcutHelp and VariablePromptInput now use `var(--app-mono)`.
- [x] **Derived tokens didn't re-theme on a wrapper.** A new "alias re-resolution" block at the end of `tokens.css` redeclares all 53 `var()` aliases on `:where(.morph-frame, [data-morph-frame])`. Theming a frame now flows through `--morph-*`, `--cpi-gray-*`, `--bloom`, `--el*` and the rest.

## P3 — Robustness

- [x] **CSS var fallbacks**: TextShimmer (`--shimmer-color`, `--shimmer-highlight`), FanHoverStack (`--spread-x/y/rotate`) and TextRipple (`--char-index`).
- [x] **Overshoot easing on value-bearing widths**: ContextMeter fill and AgentActivityCapsule progress now use `--ease-fx`, so a meter no longer overshoots its value. Morph-feel transitions (MorphWizard, DragIntroOrb, AnimatedMediaTabs indicator, TokenPills) keep the spring on purpose.
- [x] **PerspectiveMarquee "clipping"** was a false positive. The images are already `object-fit: cover; width/height: 100%`, and the layout checker was measuring 3D-transformed boxes. No change.

## P4 — Docs / hygiene

- [x] **README**: full table of all 174 components by group, the three style layers, and theming guidance.
- [x] **`docs/extraction.md`**: rewrote the token contract (five layers plus alias re-resolution), with primitives provenance and the list of intentional literals.
- [x] **`index.ts`**: added lane headers for the previously uncommented groups and a comment on `primitives.css`.
- [~] **Unexported demo files** (`ComponentGallery.tsx`, `RagDashboardDemo.tsx`) are now documented in the README as demo surfaces. Not moved.
- [~] **Story colors**: the hard-coded slate caption color `#64748b` became `var(--app-faint)` in 10 story files. Self-contained demo scenes that set their own background (DeviceFrame, LaptopFrame, TextMorphing mock screens) are left literal.
- [x] **Stray non-ASCII character** in the `tokens.css` banner removed.

---

## Files changed (push these)

New:
- `src/primitives.css`
- `src/components/messageFormat.ts`
- `test/messageFormat.test.ts`

Modified:
- **Core:** `src/index.ts`, `src/tokens.css`
- **Docs:** `README.md`, `docs/extraction.md`, `docs/CODE_ISSUES.md`
- **Test:** `test/DirectoryBrowser-component.test.tsx`
- **TSX:** AttachmentPreviewPanel, CreateGroupDialog, CredentialSignInForm, DirectoryBrowser, MessageTile, MessageTimeline, ModalSurface, TabbedListScreen, TypingIndicator
- **CSS:**
  - AgentActivityCapsule, AuditLogViewer, BeforeAfterCompare, CodeDiffViewer, ContextMeter, FanHoverStack
  - FollowCursorLabel, MagneticButton, MessageTile, MorphWizard, MultimodalComposer, PricingTierCard
  - ShortcutHelp, TactileKeyboardBoard, TerminalEmulator, TextRipple, TextShimmer, Tooltip, VariablePromptInput
- **Stories:** AgentCard, AmbientState, ApprovalGate, ConfettiCannon, DiffStatPill, ModelSelector, StreamingMessage, TextCharSlide, TextMotion, ToolCallCard

Catalog-only (not part of the library): `Morph UI Catalog.dc.html`, `morph-runtime.js`.
