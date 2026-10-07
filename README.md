# Morph UI

Component library extracted from [ChatUIMorph](https://github.com/ghively/ChatUIMorph) — the component half of the repo, promoted to a standalone library usable by any project.

Philosophy: **available, not forced.** Components exist because they're good designs, not because a surface currently needs them. Every component ships with tests + provenance; nothing depends on ChatUIMorph app code.

## Components (204)

Grouped as in `src/index.ts`. Every component has `X.tsx`, `X.css` and `X.stories.tsx` in `src/components/`.

| Group | Components |
|---|---|
| Agent + data | AgentPresence, AgentActivityCapsule, GenerativePlaceholder, ContextSwitcher, MultimodalComposer, MetricSparkline, TokenPills, CodeDiffViewer, AgentActivityHeatmap, FluidWorkspaceBoard, AdaptiveBento, ArchiveCollection, PanelDestinationTransition |
| Agent ops | CommandPalette, ToolCallCard, StreamingMessage, ModelSelector, ContextMeter, ApprovalGate, RunTimeline, DiffStatPill, AgentCard, ApprovalInbox, PlanChecklist, CostMeter, EvalScoreCard, HandoffCard, AuditLogViewer |
| RAG answer | CitationPills, SourceCardList, RetrievalInspector, GroundingBadge, StreamingStageIndicator, ContextAttributionList, AnswerFeedback, FollowUpChips, VariablePromptInput |
| Chat | MessageTimeline, ReactionBar, MessageContent, MessageTile, CodeBlockCard, TypingIndicator, MentionAutocomplete, MessageComposer, ConversationList, ThreadList, MarkdownNoteEditor, CreateGroupDialog, DirectoryBrowser, AttachmentPreviewPanel, SandboxedContentFrame, SasVerificationPanel, CredentialSignInForm |
| App shell + overlays | MorphRoot, AppFrame, NavigationRail, SidePanel, PaneHeader, DetailsPanel, SettingsPanel, HeroPanel, StatusRowList, TabbedListScreen, ModalSurface, ToastStack, AlertBanner, EmptyState, ShortcutHelp, NotificationCenter |
| Primitives | Button, TextField, TextArea, NumberInput, OtpInput, Select, Checkbox, RadioGroup, ToggleSwitch, SegmentedControl, FormField, Badge, Card, Divider, KeyValueList, Link, Tabs, Tooltip, Accordion, ProgressBar, Spinner, Pagination, InitialsAvatar, AvatarStack, GlyphIcon, Stepper, Breadcrumbs |
| Forms + overlays | Combobox, MultiSelect, DropdownMenu, Drawer, Slider, ConfirmDialog, TreeView, FileDropzone, Popover, SearchField, FilterBar, DateRangePicker |
| Charts + dashboard | DataTable, KpiCard, BarChart, LineChart, DonutChart, GaugeChart, FunnelChart |
| Motion + effects | AmbientState, AgentTopologyView, AnimatedMediaTabs, AuroraGlowCard, ScrollPinnedSequence, BeforeAfterCompare, CanvasText, PulseOrb, ColorArchiveScroll, ConfettiCannon, BloomSheet, CoverFlowCarousel, DeviceFrame, DragIntroOrb, ExpandingCardGrid, FanHoverStack, FloatingDock, FollowCursorLabel, GlassEnvelopeCard, GlobeCard, InfiniteMarquee, InteractiveGlobe, LaptopFrame, LiquidNavMenu, LiquidRippleImage, MagneticButton, MorphWizard, MorphingBlobBackground, OrbitalCarousel, ParticleImage, PerspectiveMarquee, RefractionGlassPanel, ScrollStackCards, ScrubRevealMedia, SearchMorphInput, TerminalEmulator, TactileKeyboardShowcase, FeatureChipHopper, GradientBlindBackdrop, DimensionalBookCover, KeyboardShowcase, CardDeckReveal, PricingTierCard, PrismOrb, SkeletonWrapper, SplitFlapDisplay, SwipeDeck, TactileKeyboardBoard |
| Text effects | LineFillText, TextPath, TextRipple, TextScribble, TextShimmer, TextSpectrum, TextWordFlip, TextBlurReveal, TextCharSlide, TextChromaReveal, TextCycle, TextFlip, TextGlitch, TextHighlight, TextMorphing, TextMotion |
| Media library | MediaArtwork, PosterCard, MediaShelf, MediaHero, EpisodeList, CastStrip, MediaInfoBadges, LibraryGrid, PlayerScrubber, TrackPicker, NowPlayingBar, AlbumTrackList, CollectionTile, ActiveSessions, LibraryScanStatus, ArtworkPicker, IdentifyMatch, ProfilePicker, RequestCard, LiveTvGuide, ArrItemStatus, DownloadQueue, ReleaseCalendar, IndexerHealth |

`ComponentGallery.tsx` and `RagDashboardDemo.tsx` are demo surfaces, not exported.

## Templates

Full screens composed only from library components, in `src/templates/`. Like the demo surfaces, they are **not exported**: copy one into your app and swap in your data. Each takes its data as props (with a `demo…` default export), ships stories under `Templates/…`, and has a test in `test/`.

| Template | Shows |
|---|---|
| `SignInTemplate` | Credentials → one-time code (OtpInput) → done, with a narrow layout |
| `SettingsTemplate` | Section nav, toggle rows, NumberInput, KeyValueList, plan Popover, dirty/save flow |
| `AgentWorkspaceTemplate` | Conversations, a run log with tool calls and citations, composer, and an approval/context pane |
| `OpsDashboardTemplate` | KPIs, charts, a sorted and paginated incident table, service health and audit trail |

## Usage

```bash
npm install @ghively/morph-ui
```

```tsx
import { MorphRoot, AgentPresence } from "@ghively/morph-ui";
import "@ghively/morph-ui/styles.css";

// Wrap the app once in MorphRoot (it applies the .morph-frame layer):
<MorphRoot fill> … </MorphRoot>
```

`styles.css` carries three layers plus component rules:

- `tokens.css` — custom-property declarations (dark-frame defaults).
- `frame.css` — opt-in base surface/type, active under `.morph-frame` / `[data-morph-frame]`.
- `primitives.css` — the `[data-btn]` / `[data-chip]` / `[data-tile]` / `[data-row]` / `[data-setrow]` / `[data-panehead]` … attribute layer the components render. Also frame-scoped. Without `.morph-frame` on an ancestor, components that rely on it render unstyled.

### Theming

Override base tokens (`--app-text`, `--app-bg`, `--app-blue`, `--color-*`, `--r-*`, `--ease-*`, …) on `:root` **or on the `.morph-frame` element itself**. Alias tokens (`--morph-fg`, `--morph-card-bg`, `--bloom`, …) are re-resolved at every frame boundary, so a themed frame picks up its own base values. See `src/tokens.css` for the full list.

### Tone vocabulary

Every tone-taking prop accepts the same `Tone`: `neutral | info | success | warn | danger` (exported from the package, with `toTone()` to normalize). Older spellings (`ok`, `good`, `warning`, `bad`, `error`, `default`) still work and map onto it.

## Development

pnpm. Gates: `pnpm build && pnpm test && pnpm lint && pnpm typecheck` — all four must pass before anything lands on main.

## Provenance rules (inherited from ChatUIMorph refadapt spec)

- External UI libraries (Wensity etc.) are **reference catalogs, not dependencies**. Never recreate a source implementation; convert the concept.
- One conceptual component ≈ one task / focused commit series.
- Never `feat: import 25 components` as one commit.

## Expansion

The catalog grows on demand — new component types and designs are genuinely good to have even if no surface needs them yet. Each lands with tests, provenance, and all gates green.
